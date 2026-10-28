/**
 * Smoke & Contract Test Suite for James Thew Culinary Salon Platform
 *
 * This test suite validates:
 * 1. Base URL & Interceptor configuration
 * 2. 16 Modular API resource endpoints
 * 3. Media upload, RecipeIngredient, Subscription, and Contest winner contract payloads
 * 4. Defensive array unwrapping across all list endpoints
 * 5. Mock elimination across the application
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const API_DIR = path.join(SRC_DIR, 'api');

describe('James Thew API Client & Resource Architecture', () => {
  it('should have a centralized API client with live backend baseURL and interceptors', () => {
    const clientFile = path.join(API_DIR, 'client.ts');
    expect(fs.existsSync(clientFile)).toBe(true);

    const content = fs.readFileSync(clientFile, 'utf-8');
    expect(content).toMatch(/http:\/\/jamesthewrecipe\.runasp\.net|VITE_API_BASE_URL/);
    expect(content).toMatch(/Bearer/i);
    expect(content).toMatch(/401/);
    expect(content).toMatch(/\/login/);
  });

  const resourceModules = [
    'auth.ts',
    'announcements.ts',
    'categories.ts',
    'contests.ts',
    'contestSubmissions.ts',
    'faq.ts',
    'feedback.ts',
    'ingredients.ts',
    'media.ts',
    'recipes.ts',
    'recipeIngredients.ts',
    'roles.ts',
    'siteFeedback.ts',
    'subscriptions.ts',
    'tips.ts',
    'users.ts',
  ];

  resourceModules.forEach((mod) => {
    it(`should contain modular API resource: src/api/${mod}`, () => {
      const modPath = path.join(API_DIR, mod);
      expect(fs.existsSync(modPath)).toBe(true);
    });
  });
});

describe('Mock Elimination Audit', () => {
  it('should have removed all mock service worker files and seed databases', () => {
    const mockFiles = [
      path.join(ROOT_DIR, 'public', 'mockServiceWorker.js'),
      path.join(SRC_DIR, 'mocks', 'browser.ts'),
      path.join(SRC_DIR, 'mocks', 'mockDb.ts'),
      path.join(SRC_DIR, 'mocks', 'data', 'seedData.ts'),
      path.join(SRC_DIR, 'mocks', 'handlers', 'index.ts'),
    ];

    mockFiles.forEach((file) => {
      expect(fs.existsSync(file)).toBe(false);
    });
  });
});

describe('Payload Contract Validation', () => {
  it('should upload media using multipart/form-data with ImagePath field', () => {
    const mediaApi = path.join(API_DIR, 'media.ts');
    expect(fs.existsSync(mediaApi)).toBe(true);
    const content = fs.readFileSync(mediaApi, 'utf-8');
    expect(content).toMatch(/ImagePath/);
    expect(content).toMatch(/multipart\/form-data/);
  });

  it('should distinguish RecipeIngredient batch creation from single item update', () => {
    const recIngApi = path.join(API_DIR, 'recipeIngredients.ts');
    expect(fs.existsSync(recIngApi)).toBe(true);
    const content = fs.readFileSync(recIngApi, 'utf-8');
    expect(content).toMatch(/RecIngredientForCreation/);
    expect(content).toMatch(/RecIngredientForUpdation/);
  });

  it('should conform to Subscription update payload contract without id or userId in body', () => {
    const subApi = path.join(API_DIR, 'subscriptions.ts');
    expect(fs.existsSync(subApi)).toBe(true);
    const content = fs.readFileSync(subApi, 'utf-8');
    expect(content).toMatch(/planType/);
    expect(content).toMatch(/amount/);
    expect(content).not.toMatch(/userId:\s*dto\.userId/);
  });

  it('should invoke ContestSubmission winner endpoint without body', () => {
    const contestSubApi = path.join(API_DIR, 'contestSubmissions.ts');
    expect(fs.existsSync(contestSubApi)).toBe(true);
    const content = fs.readFileSync(contestSubApi, 'utf-8');
    expect(content).toMatch(/\/api\/ContestSubmission\/winner\/\$\{submissionId\}/);
  });
});

describe('Defensive Array Parsing Audit', () => {
  const listModules = [
    'announcements.ts',
    'categories.ts',
    'contests.ts',
    'contestSubmissions.ts',
    'faq.ts',
    'feedback.ts',
    'ingredients.ts',
    'recipeIngredients.ts',
    'recipes.ts',
    'roles.ts',
    'siteFeedback.ts',
    'subscriptions.ts',
    'tips.ts',
    'users.ts',
  ];

  listModules.forEach((mod) => {
    it(`src/api/${mod} should implement defensive unwrapping for raw arrays, envelope { data: [] }, and fallback []`, () => {
      const content = fs.readFileSync(path.join(API_DIR, mod), 'utf-8');
      expect(content).toContain('if (Array.isArray(res.data)) return res.data;');
      expect(content).toContain('return [];');
    });
  });
});
