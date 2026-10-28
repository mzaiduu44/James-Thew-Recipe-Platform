import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Lock, Eye, Tag, Carrot } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useRecipes,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  useCategories,
} from '@/hooks/useRecipes';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/api/categories';
import {
  useIngredients,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from '@/api/ingredients';
import { recipeIngredientsApi } from '@/api/recipeIngredients';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { Button } from '@/components/ui/Button';
import { Badge, FreeAccessBadge, MembersOnlyBadge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { ImageUploadDropzone } from '@/components/shared/ImageUploadDropzone';
import { useUiStore } from '@/store/uiStore';
import { Recipe } from '@/types/entities';
import { CategoryDto, IngredientDto } from '@/types/api';

export const AdminRecipesPage: React.FC = () => {
  const { data: recipesData, isLoading } = useRecipes({ pageSize: 100 });
  const { data: categories = [] } = useCategories();
  const { data: ingredientsCatalog = [] } = useIngredients();

  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();

  const createCatMutation = useCreateCategory();
  const updateCatMutation = useUpdateCategory();
  const deleteCatMutation = useDeleteCategory();

  const createIngMutation = useCreateIngredient();
  const updateIngMutation = useUpdateIngredient();
  const deleteIngMutation = useDeleteIngredient();

  const { addToast } = useUiStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [ingredientsText, setIngredientsText] = useState('');
  const [procedureText, setProcedureText] = useState('');

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Ingredient Catalog Modal State
  const [isIngModalOpen, setIsIngModalOpen] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngQuantity, setNewIngQuantity] = useState('100g');
  const [newIngImage, setNewIngImage] = useState('');

  const recipes = recipesData?.data || [];

  const openDrawer = (recipe?: Recipe) => {
    if (recipe) {
      setEditingRecipe(recipe);
      setTitle(recipe.title);
      setDescription(recipe.description);
      setCategoryId(recipe.categoryId);
      setIsFree(recipe.isFree);
      setImagePath(recipe.imagePath);
      setPrepTimeMinutes(recipe.prepTimeMinutes);
      setCookTimeMinutes(recipe.cookTimeMinutes);
      setServings(recipe.servings);
      setDifficulty(recipe.difficulty);
      setIngredientsText(Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '');
      setProcedureText(Array.isArray(recipe.procedure) ? recipe.procedure.join('\n') : '');
    } else {
      setEditingRecipe(null);
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?.id || '1');
      setIsFree(true);
      setImagePath('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
      setPrepTimeMinutes(20);
      setCookTimeMinutes(30);
      setServings(4);
      setDifficulty('Intermediate');
      setIngredientsText('');
      setProcedureText('');
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = ingredientsText.split('\n').filter(Boolean);
    const procedure = procedureText.split('\n').filter(Boolean);

    try {
      if (editingRecipe) {
        await updateRecipeMutation.mutateAsync({
          id: editingRecipe.id,
          dto: {
            title,
            description,
            categoryId,
            isFree,
            imagePath,
            prepTimeMinutes,
            cookTimeMinutes,
            servings,
            difficulty,
            ingredients,
            procedure,
          },
        });

        // Link recipe ingredients to backend catalog if present
        if (ingredients.length > 0) {
          try {
            await recipeIngredientsApi.create({
              recipeName: title,
              recipeitem: ingredients.map((ing) => ({
                ingredientName: ing,
                quantity: 'As needed',
                profileImage: '',
              })),
            });
          } catch {
            // RecipeIngredient is supplementary
          }
        }
      } else {
        await createRecipeMutation.mutateAsync({
          title,
          description,
          categoryId,
          isFree,
          imagePath,
          prepTimeMinutes,
          cookTimeMinutes,
          servings,
          difficulty,
          ingredients,
          procedure,
        });

        // Link recipe ingredients to backend catalog
        if (ingredients.length > 0) {
          try {
            await recipeIngredientsApi.create({
              recipeName: title,
              recipeitem: ingredients.map((ing) => ({
                ingredientName: ing,
                quantity: 'As needed',
                profileImage: '',
              })),
            });
          } catch {
            // RecipeIngredient is supplementary
          }
        }
      }
      setIsDrawerOpen(false);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.message || 'Could not save recipe.',
      });
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await createCatMutation.mutateAsync({
        categoryName: newCatName.trim(),
        profileImage: newCatImage.trim() || undefined,
      });
      addToast({ type: 'success', title: 'Category Created', message: `Category "${newCatName}" added.` });
      setNewCatName('');
      setNewCatImage('');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed', message: err?.message || 'Could not create category.' });
    }
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;
    try {
      await createIngMutation.mutateAsync({
        name: newIngName.trim(),
        profileImage: newIngImage.trim() || undefined,
      });
      addToast({ type: 'success', title: 'Ingredient Added', message: `Ingredient "${newIngName}" cataloged.` });
      setNewIngName('');
      setNewIngQuantity('100g');
      setNewIngImage('');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed', message: err?.message || 'Could not add ingredient.' });
    }
  };

  const columns: Column<Recipe>[] = [
    {
      key: 'image',
      header: 'Visual',
      render: (r) => (
        <img
          src={r.imagePath}
          alt={r.title}
          className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border)] shrink-0"
        />
      ),
      className: 'w-16',
    },
    {
      key: 'title',
      header: 'Recipe Title',
      sortable: true,
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-serif font-bold text-sm text-[var(--color-text)]">{r.title}</span>
          <span className="text-[10px] font-mono text-[var(--color-text-subtle)] line-clamp-1">{r.description}</span>
        </div>
      ),
    },
    {
      key: 'categoryName',
      header: 'Category',
      sortable: true,
      render: (r) => (
        <Badge variant="neutral" size="xs">
          {r.categoryName || 'Culinary'}
        </Badge>
      ),
    },
    {
      key: 'isFree',
      header: 'Tier Access',
      sortable: true,
      render: (r) => (r.isFree ? <FreeAccessBadge size="xs" /> : <MembersOnlyBadge size="xs" />),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      sortable: true,
      render: (r) => (
        <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
          {r.difficulty}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1 font-mono text-xs text-[var(--color-accent)]">
          <span>★</span>
          <span>{r.averageRating?.toFixed(1) || '5.0'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <div>
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[var(--color-text)]">
            Recipe Formulations & Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Curate recipes, manage master categories (/api/Category), and organize ingredient catalogs (/api/Ingredient).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCatModalOpen(true)}
            leftIcon={<Tag className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Categories ({categories.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsIngModalOpen(true)}
            leftIcon={<Carrot className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Ingredients ({ingredientsCatalog.length})
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openDrawer()}
            leftIcon={<Plus className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Add Recipe
          </Button>
        </div>
      </div>

      {/* Table */}
      <AdminDataTable
        columns={columns}
        data={recipes}
        isLoading={isLoading}
        searchPlaceholder="Search recipes by title or ingredient..."
        searchFields={['title', 'description']}
        itemsPerPage={8}
        renderActions={(recipe) => (
          <div className="flex items-center gap-1.5">
            <Link to={`/recipes/${recipe.id}`} target="_blank">
              <Button variant="ghost" size="xs" title="Preview Public Recipe">
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="xs"
              onClick={() => openDrawer(recipe)}
              title="Edit Recipe"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeletingRecipe(recipe)}
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              title="Delete Recipe"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Recipe Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingRecipe ? 'Edit Masterclass Formulation' : 'Publish New Formulation'}
        description="Configure culinary ratios, ingredients, and subscription gate rules."
      >
        <form onSubmit={handleSave} className="flex flex-col gap-5 p-6 text-left">
          {/* Access Tier Switcher */}
          <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-2 font-bold">
              Access Gate Policy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsFree(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isFree
                    ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Free Access (Public)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  !isFree
                    ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] shadow-warm-xs'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Members Only ($100/mo)</span>
              </button>
            </div>
          </div>

          <Input
            label="Recipe Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Roman Cacio e Pepe with Tellicherry Peppercorns"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1 font-bold">
                Category
              </label>
              <Select
                options={(Array.isArray(categories) ? categories : []).map((c) => ({ value: String(c.id), label: c.name || (c as any).categoryName }))}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1 font-bold">
                Difficulty
              </label>
              <Select
                options={[
                  { value: 'Easy', label: 'Easy' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced Masterclass' },
                ]}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              />
            </div>
          </div>

          <Textarea
            label="Recipe Description & Tasting Notes"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the dish history, aroma, and mouthfeel..."
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Prep (Mins)"
              type="number"
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
            />
            <Input
              label="Cook (Mins)"
              type="number"
              value={cookTimeMinutes}
              onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
            />
            <Input
              label="Servings"
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </div>

          <ImageUploadDropzone value={imagePath} onChange={setImagePath} />

          <Textarea
            label="Ingredients (One ingredient per line)"
            required
            rows={4}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="400g bronze-die Tonnarelli&#10;200g Pecorino Romano DOP&#10;2 tbsp Tellicherry peppercorns"
          />

          <Textarea
            label="Procedure Steps (One step per line)"
            required
            rows={5}
            value={procedureText}
            onChange={(e) => setProcedureText(e.target.value)}
            placeholder="1. Toast crushed peppercorns&#10;2. Whisk pecorino paste with pasta water&#10;3. Emulsify off direct heat"
          />

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-[var(--color-surface)] py-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={createRecipeMutation.isPending || updateRecipeMutation.isPending}
            >
              {editingRecipe ? 'Update Recipe' : 'Publish to Catalog'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Categories Management Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Recipe Categories Management (/api/Category)"
        description="Add and manage master culinary recipe classifications."
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-left">
          <form onSubmit={handleCreateCategory} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="New category name (e.g. French Classic, Vegan Gastronomy)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" variant="primary" size="sm" isLoading={createCatMutation.isPending}>
                Add Category
              </Button>
            </div>
            <Input
              placeholder="Cover image URL (Optional)"
              value={newCatImage}
              onChange={(e) => setNewCatImage(e.target.value)}
            />
          </form>

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pt-2 border-t border-[var(--color-border)]">
            {categories.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-bold text-xs text-[var(--color-text)]">{c.name || c.categoryName}</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">(ID: {c.id})</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Delete category "${c.name || c.categoryName}"?`)) {
                      await deleteCatMutation.mutateAsync(c.id);
                      addToast({ type: 'info', title: 'Category Deleted', message: 'Category removed.' });
                    }
                  }}
                  className="p-1 rounded text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCatModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ingredients Catalog Modal */}
      <Modal
        isOpen={isIngModalOpen}
        onClose={() => setIsIngModalOpen(false)}
        title="Master Ingredients Catalog (/api/Ingredient)"
        description="Maintain global ingredients inventory for recipe formulation linking."
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-left">
          <form onSubmit={handleCreateIngredient} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Ingredient name (e.g. Truffle Butter)"
                value={newIngName}
                onChange={(e) => setNewIngName(e.target.value)}
                required
              />
              <Input
                placeholder="Default quantity (e.g. 50g)"
                value={newIngQuantity}
                onChange={(e) => setNewIngQuantity(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Image URL (Optional)"
                value={newIngImage}
                onChange={(e) => setNewIngImage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="primary" size="sm" isLoading={createIngMutation.isPending}>
                Add Ingredient
              </Button>
            </div>
          </form>

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pt-2 border-t border-[var(--color-border)]">
            {ingredientsCatalog.map((ing: IngredientDto) => (
              <div
                key={ing.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-2">
                  <Carrot className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="font-bold text-xs text-[var(--color-text)]">{ing.name || (ing as any).ingredientName}</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">(ID: {ing.id})</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Delete ingredient "${ing.name || (ing as any).ingredientName}"?`)) {
                      await deleteIngMutation.mutateAsync(ing.id);
                      addToast({ type: 'info', title: 'Ingredient Deleted', message: 'Ingredient removed.' });
                    }
                  }}
                  className="p-1 rounded text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 cursor-pointer"
                  title="Delete Ingredient"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsIngModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingRecipe}
        onClose={() => setDeletingRecipe(null)}
        onConfirm={() => {
          if (deletingRecipe) {
            deleteRecipeMutation.mutate(deletingRecipe.id);
            setDeletingRecipe(null);
          }
        }}
        itemName={deletingRecipe?.title}
        isLoading={deleteRecipeMutation.isPending}
      />
    </div>
  );
};
