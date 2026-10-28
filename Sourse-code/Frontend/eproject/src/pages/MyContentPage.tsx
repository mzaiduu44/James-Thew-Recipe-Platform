import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Lightbulb, ChefHat, Eye, Crown, ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecipes, useCreateRecipe, useUpdateRecipe, useDeleteRecipe, useCategories } from '@/hooks/useRecipes';
import { useTips, useCreateTip, useUpdateTip, useDeleteTip } from '@/hooks/useTips';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUploadDropzone } from '@/components/shared/ImageUploadDropzone';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { Tabs } from '@/components/ui/Tabs';
import { UpgradeMembershipModal } from '@/components/shared/UpgradeMembershipModal';
import { Recipe, Tip } from '@/types/entities';

export const MyContentPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addToast } = useUiStore();
  const [activeTab, setActiveTab] = useState<'recipes' | 'tips'>('recipes');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // All authenticated users (User, Member, Admin) can publish recipes and tips
  const isFreeUser = false;

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<{ id: string; title: string; type: 'recipe' | 'tip' } | null>(null);

  // Recipes queries & mutations
  const { data: recipesData } = useRecipes({
    createdById: user?.id,
  });
  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const { data: categories = [] } = useCategories();

  // Tips queries & mutations
  const { data: tipsData } = useTips({
    createdById: user?.id,
  });
  const createTipMutation = useCreateTip();
  const updateTipMutation = useUpdateTip();
  const deleteTipMutation = useDeleteTip();

  // Modal States
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [recipeCategory, setRecipeCategory] = useState(categories[0]?.id || 'cat-italian');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeProcedure, setRecipeProcedure] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [recipePrep, setRecipePrep] = useState(20);
  const [recipeCook, setRecipeCook] = useState(30);

  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [tipTitle, setTipTitle] = useState('');
  const [tipDesc, setTipDesc] = useState('');
  const [tipTags, setTipTags] = useState('HomeCooking, Technique');

  const myRecipes = recipesData?.data || [];
  const myTips = tipsData?.data || [];

  const tabItems = [
    { id: 'recipes', label: 'My Formulations', badge: myRecipes.length },
    { id: 'tips', label: 'My Kitchen Secrets', badge: myTips.length },
  ];

  // Open recipe create/edit modal
  const openRecipeModal = (recipe?: Recipe) => {
    if (isFreeUser && !recipe) {
      addToast({
        type: 'warning',
        title: '🔒 Publishing Locked for Free Tier',
        message: 'Publishing recipes is reserved for VIP Members. Upgrade your membership to contribute formulations!',
      });
      setIsUpgradeModalOpen(true);
      return;
    }

    if (recipe) {
      setEditingRecipe(recipe);
      setRecipeTitle(recipe.title);
      setRecipeDesc(recipe.description);
      setRecipeCategory(recipe.categoryId);
      setRecipeIngredients(recipe.ingredients.join('\n'));
      setRecipeProcedure(recipe.procedure.join('\n'));
      setRecipeImage(recipe.imagePath);
      setRecipePrep(recipe.prepTimeMinutes);
      setRecipeCook(recipe.cookTimeMinutes);
    } else {
      setEditingRecipe(null);
      setRecipeTitle('');
      setRecipeDesc('');
      setRecipeCategory(categories[0]?.id || 'cat-veg');
      setRecipeIngredients('');
      setRecipeProcedure('');
      setRecipeImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
      setRecipePrep(20);
      setRecipeCook(30);
    }
    setIsRecipeModalOpen(true);
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArr = recipeIngredients.split('\n').filter(Boolean);
    const procedureArr = recipeProcedure.split('\n').filter(Boolean);

    if (editingRecipe) {
      updateRecipeMutation.mutate({
        id: editingRecipe.id,
        dto: {
          title: recipeTitle,
          description: recipeDesc,
          categoryId: recipeCategory,
          ingredients: ingredientsArr,
          procedure: procedureArr,
          imagePath: recipeImage,
          prepTimeMinutes: recipePrep,
          cookTimeMinutes: recipeCook,
        },
      });
    } else {
      createRecipeMutation.mutate({
        title: recipeTitle,
        description: recipeDesc,
        categoryId: recipeCategory,
        ingredients: ingredientsArr,
        procedure: procedureArr,
        imagePath: recipeImage,
        prepTimeMinutes: recipePrep,
        cookTimeMinutes: recipeCook,
        servings: 4,
        difficulty: 'Intermediate',
        isFree: false,
      });
    }
    setIsRecipeModalOpen(false);
  };

  const openTipModal = (tip?: Tip) => {
    if (isFreeUser && !tip) {
      addToast({
        type: 'warning',
        title: '🔒 Publishing Locked for Free Tier',
        message: 'Publishing tips is reserved for VIP Members. Upgrade your membership to contribute techniques!',
      });
      setIsUpgradeModalOpen(true);
      return;
    }

    if (tip) {
      setEditingTip(tip);
      setTipTitle(tip.title);
      setTipDesc(tip.description);
      setTipTags(tip.tags ? tip.tags.join(', ') : '');
    } else {
      setEditingTip(null);
      setTipTitle('');
      setTipDesc('');
      setTipTags('HomeCooking, Technique');
    }
    setIsTipModalOpen(true);
  };

  const handleSaveTip = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = tipTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingTip) {
      updateTipMutation.mutate({
        id: editingTip.id,
        dto: {
          title: tipTitle,
          description: tipDesc,
          tags: tagsArr,
        },
      });
    } else {
      createTipMutation.mutate({
        title: tipTitle,
        description: tipDesc,
        tags: tagsArr,
        isFree: true,
      });
    }
    setIsTipModalOpen(false);
  };

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Member Publishing Desk"
        tagIcon={<Layers className="w-3.5 h-3.5" />}
        tagVariant="primary"
        title="My Recipes & Culinary Secrets"
        description="Manage your personal recipe submissions, update cooking procedures, or contribute new formulations to the James Thew culinary conservatory."
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 w-full">
          <Tabs items={tabItems} activeId={activeTab} onChange={(id) => setActiveTab(id as any)} variant="pill" />

          {isFreeUser ? (
            <Button
              variant="gold"
              size="md"
              onClick={() => {
                addToast({
                  type: 'warning',
                  title: '🔒 Publishing Locked for Free Tier',
                  message: 'Publishing formulations is reserved for VIP Members. Upgrade your plan to contribute!',
                });
                setIsUpgradeModalOpen(true);
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<Crown className="w-4 h-4" />}
              className="shadow-warm"
            >
              VIP Locked: Upgrade to Publish
            </Button>
          ) : activeTab === 'recipes' ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => openRecipeModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Publish Recipe
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => openTipModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Publish Tip
            </Button>
          )}
        </div>
      </PageHero>

      {/* Free User Restriction Notice Banner */}
      {isFreeUser && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[var(--color-surface-2)] border border-[var(--color-accent)]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-warm-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm sm:text-base text-[var(--color-text)] block">
                Free Explorer Mode — Publishing Restricted
              </span>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Publishing custom formulations and kitchen secrets to the James Thew catalog is reserved for VIP Members.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={() => {
              addToast({
                type: 'warning',
                title: '🔒 VIP Membership Required',
                message: 'Upgrade to VIP Member to unlock all culinary features.',
              });
              setIsUpgradeModalOpen(true);
            }}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 w-full sm:w-auto"
          >
            Upgrade to VIP Pass ($100/mo)
          </Button>
        </div>
      )}

      {/* Content Area */}
      {activeTab === 'recipes' ? (
        myRecipes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
            <ChefHat className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold mb-2 text-[var(--color-text)]">No Submitted Recipes Yet</h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-6">
              Share your favorite culinary dish with Chef James Thew and fellow club members.
            </p>
            {isFreeUser ? (
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  addToast({
                    type: 'warning',
                    title: '🔒 VIP Membership Required',
                    message: 'Upgrade to VIP Member to create and publish recipe formulations.',
                  });
                  setIsUpgradeModalOpen(true);
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={<Crown className="w-4 h-4" />}
              >
                Upgrade to Submit Recipe
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => openRecipeModal()}>
                Submit Your First Recipe
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
            {myRecipes.map((r) => (
              <div
                key={r.id}
                className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col justify-between gap-4 card-hover-lift"
              >
                <div>
                  <img
                    src={r.imagePath}
                    alt={r.title}
                    className="w-full aspect-video rounded-xl sm:rounded-2xl object-cover mb-3"
                  />
                  <Badge variant="neutral" size="xs" className="mb-2">
                    {r.categoryName || 'Culinary'}
                  </Badge>
                  <h4 className="font-serif text-lg font-bold text-[var(--color-text)] mb-1 line-clamp-1">
                    {r.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                    {r.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                  <Link
                    to={`/recipes/${r.id}`}
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Recipe</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openRecipeModal(r)}
                      className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] cursor-pointer"
                      title="Edit Recipe"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingItem({ id: r.id, title: r.title, type: 'recipe' })}
                      className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] cursor-pointer"
                      title="Delete Recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : myTips.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
          <Lightbulb className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl font-bold mb-2 text-[var(--color-text)]">No Culinary Tips Shared Yet</h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-6">
            Help the kitchen guild by posting quick equipment, knife, or cooking secrets.
          </p>
          {isFreeUser ? (
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                addToast({
                  type: 'warning',
                  title: '🔒 VIP Membership Required',
                  message: 'Upgrade to VIP Member to share kitchen techniques and secrets.',
                });
                setIsUpgradeModalOpen(true);
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<Crown className="w-4 h-4" />}
            >
              Upgrade to Submit Tip
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => openTipModal()}>
              Submit Your First Tip
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
          {myTips.map((t) => (
            <div
              key={t.id}
              className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col justify-between gap-4 card-hover-lift"
            >
              <div>
                <h4 className="font-serif text-lg font-bold text-[var(--color-text)] mb-2">
                  {t.title}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                  {t.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                <Link
                  to={`/tips/${t.id}`}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Tip</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openTipModal(t)}
                    className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] cursor-pointer"
                    title="Edit Tip"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem({ id: t.id, title: t.title, type: 'tip' })}
                    className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] cursor-pointer"
                    title="Delete Tip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Modal */}
      <Modal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        title={editingRecipe ? 'Edit Masterclass Formulation' : 'Publish Member Recipe'}
        description="Share your culinary formulation with James Thew salon apprentices."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveRecipe} className="flex flex-col gap-3.5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Recipe Title"
              required
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              placeholder="e.g. Hand-Rolled Truffle Tagliolini"
            />

            <Select
              label="Recipe Category"
              options={(Array.isArray(categories) ? categories : []).map((c) => ({ value: c.id, label: c.name }))}
              value={recipeCategory}
              onChange={(e) => setRecipeCategory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prep Time (Minutes)"
              type="number"
              required
              value={recipePrep}
              onChange={(e) => setRecipePrep(Number(e.target.value))}
            />
            <Input
              label="Cook Time (Minutes)"
              type="number"
              required
              value={recipeCook}
              onChange={(e) => setRecipeCook(Number(e.target.value))}
            />
          </div>

          <ImageUploadDropzone
            label="Recipe Cover Photography"
            value={recipeImage}
            onChange={setRecipeImage}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Textarea
              label="Ingredients (One per line)"
              required
              rows={3}
              value={recipeIngredients}
              onChange={(e) => setRecipeIngredients(e.target.value)}
              placeholder="400g 00 Flour&#10;4 Egg Yolks&#10;50g Fresh Black Truffle"
            />

            <Textarea
              label="Method & Procedure (One per line)"
              required
              rows={3}
              value={recipeProcedure}
              onChange={(e) => setRecipeProcedure(e.target.value)}
              placeholder="Knead dough until elastic.&#10;Roll paper thin on wooden board.&#10;Toss in brown butter and sage."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecipeModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createRecipeMutation.isPending || updateRecipeMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              {editingRecipe ? 'Update Recipe' : 'Publish Recipe'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tip Modal */}
      <Modal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        title={editingTip ? 'Edit Kitchen Secret' : 'Share Culinary Tip'}
        description="Provide a focused piece of culinary wisdom or technique advice."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTip} className="flex flex-col gap-3.5 text-left">
          <Input
            label="Tip Title"
            required
            value={tipTitle}
            onChange={(e) => setTipTitle(e.target.value)}
            placeholder="e.g. Salting Pasta Water Temperature Physics"
          />

          <Textarea
            label="Secret Instruction & Technique"
            required
            rows={3}
            value={tipDesc}
            onChange={(e) => setTipDesc(e.target.value)}
            placeholder="Explain why this technique works and what mistakes to avoid..."
          />

          <Input
            label="Tags (Comma separated)"
            value={tipTags}
            onChange={(e) => setTipTags(e.target.value)}
            placeholder="Pasta, Emulsion, KnifeSkills"
          />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTipModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createTipMutation.isPending || updateTipMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              {editingTip ? 'Update Tip' : 'Publish Secret'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) {
            if (deletingItem.type === 'recipe') {
              deleteRecipeMutation.mutate(deletingItem.id);
            } else {
              deleteTipMutation.mutate(deletingItem.id);
            }
            setDeletingItem(null);
          }
        }}
        itemName={deletingItem?.title}
        isLoading={deleteRecipeMutation.isPending || deleteTipMutation.isPending}
      />

      {/* Upgrade Membership Modal */}
      <UpgradeMembershipModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerTitle="Upgrade to VIP Membership to publish custom culinary recipes & secrets"
      />
    </PageContainer>
  );
};

export default MyContentPage;
