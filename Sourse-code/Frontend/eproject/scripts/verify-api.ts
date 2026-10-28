import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const API_DIR = path.join(SRC_DIR, 'api');

interface VerificationResult {
  passed: boolean;
  name: string;
  details?: string;
}

const results: VerificationResult[] = [];

function check(condition: boolean, name: string, details?: string): void {
  results.push({ passed: condition, name, details });
  if (condition) {
    console.log(`  ✓ PASS - ${name}`);
  } else {
    console.log(`  ✗ FAIL - ${name}${details ? ` (${details})` : ''}`);
  }
}

export function runVerification(): { passed: number; failed: number; total: number } {
  console.log('Running James Thew Verification Suite...');

  const resources = [
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

  resources.forEach((file) => {
    const exists = fs.existsSync(path.join(API_DIR, file));
    check(exists, `API Resource: src/api/${file}`);
  });

  const clientPath = path.join(API_DIR, 'client.ts');
  const clientExists = fs.existsSync(clientPath);
  check(clientExists, 'Client exists: src/api/client.ts');
  if (clientExists) {
    const content = fs.readFileSync(clientPath, 'utf-8');
    check(content.includes('http://jamesthewrecipe.runasp.net') || content.includes('VITE_API_BASE_URL'), 'Client baseURL configured');
    check(/Bearer/i.test(content), 'Client Bearer token interceptor');
    check(/401/.test(content), 'Client 401 redirect interceptor');
  }

  const mockDbPath = path.join(SRC_DIR, 'mocks', 'mockDb.ts');
  const mswWorkerPath = path.join(ROOT_DIR, 'public', 'mockServiceWorker.js');
  check(!fs.existsSync(mockDbPath), 'mockDb.ts removed');
  check(!fs.existsSync(mswWorkerPath), 'mockServiceWorker.js removed');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return { passed, failed, total: results.length };
}

if (require.main === module) {
  const summary = runVerification();
  process.exit(summary.failed > 0 ? 1 : 0);
}
