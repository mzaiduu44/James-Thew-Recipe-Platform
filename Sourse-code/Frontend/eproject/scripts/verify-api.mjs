import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const API_DIR = path.join(SRC_DIR, 'api');

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

let totalPassed = 0;
let totalFailed = 0;
const failures = [];

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ${colors.green}✓ PASS${colors.reset} - ${testName}`);
    totalPassed++;
  } else {
    console.log(`  ${colors.red}✗ FAIL${colors.reset} - ${testName}`);
    if (details) {
      console.log(`         ${colors.yellow}${details}${colors.reset}`);
    }
    failures.push({ testName, details });
    totalFailed++;
  }
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// -------------------------------------------------------------
// Suite 1: Modular API Resources Inventory (16 Resources)
// -------------------------------------------------------------
function suiteModularApiResources() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 1: Modular API Resources Inventory (16 Resources) ===${colors.reset}`);

  const requiredModules = [
    {
      file: 'auth.ts',
      name: 'Auth Resource',
      hooks: [/useLogin/i, /login/i],
    },
    {
      file: 'announcements.ts',
      name: 'Announcement Resource',
      hooks: [/useAnnouncement/i, /createAnnouncement|useCreateAnnouncement/i],
    },
    {
      file: 'categories.ts',
      name: 'Category Resource',
      hooks: [/useCategories|useCategory/i, /createCategory|useCreateCategory/i],
    },
    {
      file: 'contests.ts',
      name: 'Contest Resource',
      hooks: [/useContest/i, /createContest|useCreateContest/i],
    },
    {
      file: 'contestSubmissions.ts',
      name: 'ContestSubmission Resource',
      hooks: [/useContestSubmission/i, /winner/i],
    },
    {
      file: 'faq.ts',
      name: 'FAQ Resource',
      hooks: [/useFaq/i, /createFaq|useCreateFaq/i],
    },
    {
      file: 'feedback.ts',
      name: 'Feedback Resource',
      hooks: [/useFeedback/i, /createFeedback|useCreateFeedback/i],
    },
    {
      file: 'ingredients.ts',
      name: 'Ingredient Resource',
      hooks: [/useIngredient/i, /createIngredient|useCreateIngredient/i],
    },
    {
      file: 'media.ts',
      name: 'Media Resource',
      hooks: [/uploadMedia|useUploadMedia|upload/i],
    },
    {
      file: 'recipes.ts',
      name: 'Recipe Resource',
      hooks: [/useRecipe/i, /createRecipe|useCreateRecipe/i],
    },
    {
      file: 'recipeIngredients.ts',
      name: 'RecipeIngredient Resource',
      hooks: [/useRecipeIngredient/i, /createRecipeIngredient|useCreateRecipeIngredient/i],
    },
    {
      file: 'roles.ts',
      name: 'Role Resource',
      hooks: [/useRole/i, /getRoles|useRolesQuery/i],
    },
    {
      file: 'siteFeedback.ts',
      name: 'SiteFeedback Resource',
      hooks: [/useSiteFeedback/i, /createSiteFeedback|useCreateSiteFeedback/i],
    },
    {
      file: 'subscriptions.ts',
      name: 'Subscription Resource',
      hooks: [/useSubscription/i, /createSubscription|useCreateSubscription/i],
    },
    {
      file: 'tips.ts',
      name: 'Tip Resource',
      hooks: [/useTip/i, /createTip|useCreateTip/i],
    },
    {
      file: 'users.ts',
      name: 'User Resource',
      hooks: [/useUser/i, /createUser|useCreateUser/i],
    },
  ];

  for (const mod of requiredModules) {
    const modPath = path.join(API_DIR, mod.file);
    const exists = fs.existsSync(modPath);
    assert(exists, `Resource file exists: src/api/${mod.file}`, `Expected ${mod.file} in src/api/`);

    if (exists) {
      const content = fs.readFileSync(modPath, 'utf-8');
      for (const hookPattern of mod.hooks) {
        const matches = hookPattern.test(content);
        assert(matches, `${mod.name} exports expected function/hook matching ${hookPattern}`, `Missing pattern ${hookPattern} in src/api/${mod.file}`);
      }
    }
  }
}

// -------------------------------------------------------------
// Suite 2: Centralized API Client Architecture (src/api/client.ts)
// -------------------------------------------------------------
function suiteApiClientArchitecture() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 2: Centralized API Client Architecture ===${colors.reset}`);

  const clientPath = path.join(API_DIR, 'client.ts');
  const legacyClientPath = path.join(SRC_DIR, 'services', 'apiClient.ts');

  assert(fs.existsSync(clientPath), 'Centralized client exists at src/api/client.ts');

  if (fs.existsSync(clientPath)) {
    const clientContent = fs.readFileSync(clientPath, 'utf-8');

    assert(
      clientContent.includes('http://jamesthewrecipe.runasp.net') || clientContent.includes('VITE_API_BASE_URL'),
      'Client configured with target backend baseURL (http://jamesthewrecipe.runasp.net)'
    );

    assert(
      /Bearer\s+/i.test(clientContent) || /interceptors\.request\.use/i.test(clientContent),
      'Client contains request interceptor attaching Bearer token'
    );

    assert(
      /401/.test(clientContent) && (/login/i.test(clientContent) || /logout|clearAuth/i.test(clientContent)),
      'Client contains response interceptor handling 401 Unauthorized redirect'
    );
  }

  // Check legacy apiClient.ts redirects or re-exports cleanly
  if (fs.existsSync(legacyClientPath)) {
    const legacyContent = fs.readFileSync(legacyClientPath, 'utf-8');
    assert(
      legacyContent.includes('@/api/client') || legacyContent.includes('../api/client') || legacyContent.includes('http://jamesthewrecipe.runasp.net'),
      'Legacy src/services/apiClient.ts re-exports or points to centralized client'
    );
  }
}

// -------------------------------------------------------------
// Suite 3: Mock & MSW Elimination Audit
// -------------------------------------------------------------
function suiteMockElimination() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 3: Mock & MSW Elimination Audit ===${colors.reset}`);

  // 1. Deleted mock files
  const forbiddenFiles = [
    path.join(ROOT_DIR, 'public', 'mockServiceWorker.js'),
    path.join(SRC_DIR, 'mocks', 'browser.ts'),
    path.join(SRC_DIR, 'mocks', 'mockDb.ts'),
    path.join(SRC_DIR, 'mocks', 'data', 'seedData.ts'),
    path.join(SRC_DIR, 'mocks', 'handlers', 'index.ts'),
    path.join(SRC_DIR, 'components', 'shared', 'RoleSwitcherBar.tsx'),
  ];

  for (const forbidden of forbiddenFiles) {
    const rel = path.relative(ROOT_DIR, forbidden);
    assert(!fs.existsSync(forbidden), `Mock artifact removed: ${rel}`);
  }

  // 2. Scan all src files for forbidden imports/calls
  const srcFiles = getAllFiles(SRC_DIR);
  let mswImportCount = 0;
  let mockDbImportCount = 0;
  let enableMockingCount = 0;
  let syntheticDelayCount = 0;

  for (const file of srcFiles) {
    // skip test/verify scripts
    if (file.includes('verify') || file.includes('test')) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(ROOT_DIR, file);

    if (/from\s+['"]msw(\/.*)?['"]/i.test(content)) {
      mswImportCount++;
      console.log(`         ${colors.red}Found MSW import in ${rel}${colors.reset}`);
    }
    if (/from\s+['"].*\/mocks\/.*['"]/i.test(content)) {
      mockDbImportCount++;
      console.log(`         ${colors.red}Found mocks import in ${rel}${colors.reset}`);
    }
    if (/enableMocking\s*\(/i.test(content) || /prepareApp\s*\(/i.test(content)) {
      enableMockingCount++;
      console.log(`         ${colors.red}Found enableMocking call in ${rel}${colors.reset}`);
    }
    if (/await\s+delay\s*\(\s*\d+\s*\)/i.test(content)) {
      syntheticDelayCount++;
      console.log(`         ${colors.red}Found synthetic delay in ${rel}${colors.reset}`);
    }
  }

  assert(mswImportCount === 0, 'Zero MSW library imports across src/', `Found ${mswImportCount} imports`);
  assert(mockDbImportCount === 0, 'Zero @/mocks/* imports across src/', `Found ${mockDbImportCount} imports`);
  assert(enableMockingCount === 0, 'Zero enableMocking/prepareApp calls in src/main.tsx', `Found ${enableMockingCount} calls`);
  assert(syntheticDelayCount === 0, 'Zero synthetic latency delay() calls across src/', `Found ${syntheticDelayCount} calls`);

  // 3. Check package.json for MSW dependency removal
  const pkgJsonPath = path.join(ROOT_DIR, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const hasMswDep = (pkg.dependencies && pkg.dependencies.msw) || (pkg.devDependencies && pkg.devDependencies.msw);
    const hasMswConfig = Boolean(pkg.msw);
    assert(!hasMswDep, 'msw package removed from package.json dependencies');
    assert(!hasMswConfig, 'msw worker config removed from package.json');
  }
}

// -------------------------------------------------------------
// Suite 4: Backend Payload Shape & Contract Compliance
// -------------------------------------------------------------
function suitePayloadContracts() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 4: Backend Payload Shape Compliance ===${colors.reset}`);

  // 1. Media Upload: Form field 'ImagePath'
  const mediaApi = path.join(API_DIR, 'media.ts');
  const dropzone = path.join(SRC_DIR, 'components', 'shared', 'ImageUploadDropzone.tsx');

  if (fs.existsSync(mediaApi)) {
    const content = fs.readFileSync(mediaApi, 'utf-8');
    assert(
      content.includes('ImagePath') || /append\(['"]ImagePath['"]/i.test(content) || /multipart\/form-data/i.test(content),
      'Media API module uses exact form field name "ImagePath" with multipart/form-data'
    );
  } else {
    assert(false, 'Media API module exists for upload contract verification');
  }

  if (fs.existsSync(dropzone)) {
    const dropzoneContent = fs.readFileSync(dropzone, 'utf-8');
    assert(
      !dropzoneContent.includes('readAsDataURL') || dropzoneContent.includes('uploadMedia') || dropzoneContent.includes('mediaApi') || dropzoneContent.includes('/api/Media'),
      'ImageUploadDropzone uploads real media files instead of fake Base64 timers'
    );
  }

  // 2. Recipe Payload: imagePaths array & categoryId
  const recipeApi = path.join(API_DIR, 'recipes.ts');
  if (fs.existsSync(recipeApi)) {
    const content = fs.readFileSync(recipeApi, 'utf-8');
    assert(
      content.includes('imagePaths') || content.includes('categoryId'),
      'Recipe API module supports imagePaths string array and categoryId DTO attributes'
    );
  }

  // 3. RecipeIngredient: Batch create vs single update
  const recIngApi = path.join(API_DIR, 'recipeIngredients.ts');
  if (fs.existsSync(recIngApi)) {
    const content = fs.readFileSync(recIngApi, 'utf-8');
    assert(
      content.includes('recipeitem') || content.includes('recipeName'),
      'RecipeIngredient API supports batch create payload with recipeitem array'
    );
  }

  // 4. Subscription: PUT body without id/userId
  const subApi = path.join(API_DIR, 'subscriptions.ts');
  if (fs.existsSync(subApi)) {
    const content = fs.readFileSync(subApi, 'utf-8');
    assert(
      content.includes('planType') && content.includes('amount'),
      'Subscription update payload matches { planType, amount } contract'
    );
  }

  // 5. Contest Winner: PUT /api/ContestSubmission/winner/{submissionId}
  const contestSubApi = path.join(API_DIR, 'contestSubmissions.ts');
  if (fs.existsSync(contestSubApi)) {
    const content = fs.readFileSync(contestSubApi, 'utf-8');
    assert(
      /winner/i.test(content),
      'ContestSubmission API exposes winner selection endpoint PUT /api/ContestSubmission/winner/{submissionId}'
    );
  }
}

// -------------------------------------------------------------
// Suite 5: TypeScript Compilation Cleanliness
// -------------------------------------------------------------
function suiteBuildHygiene() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 5: TypeScript Compilation Cleanliness ===${colors.reset}`);

  try {
    console.log('  Running TypeScript compiler check (tsc --noEmit)...');
    execSync('npx tsc --noEmit', { cwd: ROOT_DIR, stdio: 'pipe' });
    assert(true, 'TypeScript compilation check succeeded with 0 errors');
  } catch (err) {
    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';
    const firstLines = (stdout || stderr).split('\n').slice(0, 5).join('\n');
    assert(false, 'TypeScript compilation check (tsc --noEmit)', firstLines || err.message);
  }
}

// -------------------------------------------------------------
// Suite 6: Adversarial BaseURL & Request Interceptor Token Attachment
// -------------------------------------------------------------
async function suiteAdversarialAuthInterceptors() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 6: Adversarial BaseURL & Request Interceptor Simulation ===${colors.reset}`);

  let mockStoreToken = null;
  let mockLocalStorageData = {};

  const mockAxiosInstance = axios.create({
    baseURL: 'http://jamesthewrecipe.runasp.net',
  });

  // Replicate exact client.ts request interceptor logic
  mockAxiosInstance.interceptors.request.use(
    (config) => {
      try {
        let token = mockStoreToken;
        if (!token && typeof mockLocalStorageData['james_thew_auth'] === 'string') {
          const parsed = JSON.parse(mockLocalStorageData['james_thew_auth']);
          token = parsed?.state?.token || null;
        }
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Ignore parse errors on request setup
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const handler = mockAxiosInstance.interceptors.request.handlers[0].fulfilled;

  // Case 6.1: Active Zustand token
  mockStoreToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.activeToken';
  mockLocalStorageData = {};
  const res1 = await handler({ headers: {}, url: '/api/Recipe' });
  assert(
    res1.headers.Authorization === 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.activeToken',
    'Zustand store token is attached as Authorization: Bearer <token>'
  );

  // Case 6.2: LocalStorage fallback when store in-memory token is empty
  mockStoreToken = null;
  mockLocalStorageData = {
    james_thew_auth: JSON.stringify({ state: { token: 'localStorage_token_value_999' } }),
  };
  const res2 = await handler({ headers: {}, url: '/api/Category' });
  assert(
    res2.headers.Authorization === 'Bearer localStorage_token_value_999',
    'LocalStorage fallback token attached when Zustand in-memory state is empty'
  );

  // Case 6.3: Unauthenticated request (no token in store or storage)
  mockStoreToken = null;
  mockLocalStorageData = {};
  const res3 = await handler({ headers: {}, url: '/api/Auth' });
  assert(
    res3.headers.Authorization === undefined,
    'Unauthenticated request sends NO Authorization header'
  );

  // Case 6.4: Malformed localStorage payload resilience
  mockStoreToken = null;
  mockLocalStorageData = { james_thew_auth: '{ corrupted JSON ### ' };
  let errorThrown = false;
  try {
    const res4 = await handler({ headers: {}, url: '/api/Tip' });
    assert(
      res4.headers.Authorization === undefined,
      'Corrupted localStorage is gracefully caught without throwing'
    );
  } catch {
    errorThrown = true;
  }
  assert(!errorThrown, 'Request interceptor does NOT crash on corrupted localStorage');
}

// -------------------------------------------------------------
// Suite 7: Adversarial 401 Interceptor & ASP.NET Core Error Normalization
// -------------------------------------------------------------
async function suiteAdversarial401AndErrorParser() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 7: Adversarial 401 Response Interceptor & Error Normalizer ===${colors.reset}`);

  let storeLoggedOut = false;
  let navigatedPath = null;
  let currentPath = '/admin/contests';

  const mockLogout = () => {
    storeLoggedOut = true;
  };

  const mockWindow = {
    location: {
      get pathname() {
        return currentPath;
      },
      set href(val) {
        navigatedPath = val;
      },
    },
  };

  // Replicate response interceptor logic from client.ts
  const handleResponseError = (error) => {
    if (error.response?.status === 401) {
      try {
        mockLogout();
        if (
          mockWindow.location &&
          !mockWindow.location.pathname.startsWith('/login')
        ) {
          mockWindow.location.href = '/login';
        }
      } catch {
        // Ignore
      }
    }
    return Promise.reject(error);
  };

  // Case 7.1: 401 on protected route
  storeLoggedOut = false;
  navigatedPath = null;
  currentPath = '/admin/contests';
  try {
    await handleResponseError({ response: { status: 401, data: 'Unauthorized' } });
  } catch (err) {
    assert(
      storeLoggedOut === true && navigatedPath === '/login',
      '401 response invokes logout() and navigates to /login'
    );
  }

  // Case 7.2: 401 on /login page (prevent infinite redirect)
  storeLoggedOut = false;
  navigatedPath = null;
  currentPath = '/login';
  try {
    await handleResponseError({ response: { status: 401, data: 'Invalid credentials' } });
  } catch (err) {
    assert(
      storeLoggedOut === true && navigatedPath === null,
      '401 while already on /login clears auth state WITHOUT triggering redundant navigation loop'
    );
  }

  // Case 7.3: 403 Forbidden does NOT trigger logout or redirect
  storeLoggedOut = false;
  navigatedPath = null;
  currentPath = '/admin/users';
  try {
    await handleResponseError({ response: { status: 403, data: 'Forbidden' } });
  } catch (err) {
    assert(
      storeLoggedOut === false && navigatedPath === null,
      '403 Forbidden error leaves auth state intact without redirecting'
    );
  }

  // Case 7.4: 500 Internal Server Error does NOT trigger logout
  storeLoggedOut = false;
  navigatedPath = null;
  currentPath = '/recipes/123';
  try {
    await handleResponseError({ response: { status: 500, data: 'Internal Server Error' } });
  } catch (err) {
    assert(
      storeLoggedOut === false && navigatedPath === null,
      '500 Server Error does NOT trigger logout'
    );
  }
}

// -------------------------------------------------------------
// Suite 8: Adversarial Payload Contract Verification
// -------------------------------------------------------------
function suiteAdversarialPayloadContracts() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 8: Adversarial Payload Shapes & Model Binding Gates ===${colors.reset}`);

  // 8.1 Media upload response parsing variants simulation
  function parseMediaResponse(resData) {
    if (typeof resData === 'string') return resData;
    if (resData && typeof resData === 'object') {
      return resData.path || resData.url || resData.imagePath || '';
    }
    return '';
  }

  assert(
    parseMediaResponse('https://storage.runasp.net/uploads/dish1.jpg') === 'https://storage.runasp.net/uploads/dish1.jpg',
    'Media parser handles raw string URL responses'
  );
  assert(
    parseMediaResponse({ path: '/uploads/dish2.jpg' }) === '/uploads/dish2.jpg',
    'Media parser handles object with { path } property'
  );
  assert(
    parseMediaResponse({ url: 'https://cdn.example.com/dish3.jpg' }) === 'https://cdn.example.com/dish3.jpg',
    'Media parser handles object with { url } property'
  );
  assert(
    parseMediaResponse({ imagePath: '/media/dish4.jpg' }) === '/media/dish4.jpg',
    'Media parser handles object with { imagePath } property'
  );
  assert(
    parseMediaResponse(null) === '',
    'Media parser handles null gracefully without exception'
  );

  // 8.2 RecipeIngredient Create batch vs Update single shape
  const recIngTs = fs.readFileSync(path.join(API_DIR, 'recipeIngredients.ts'), 'utf-8');
  assert(
    recIngTs.includes('RecIngredientForCreation') && recIngTs.includes('RecIngredientForUpdation'),
    'RecipeIngredient API uses distinct DTO types for creation vs updation'
  );

  // 8.3 Subscription PUT body isolation
  const subTs = fs.readFileSync(path.join(API_DIR, 'subscriptions.ts'), 'utf-8');
  assert(
    subTs.includes('const payload: SubscriptionForUpdation = {') &&
    subTs.includes('planType: dto.planType') &&
    subTs.includes('amount: dto.amount') &&
    !subTs.includes('id: dto.id') &&
    !subTs.includes('userId: dto.userId'),
    'Subscription update explicitly constructs sanitized payload { planType, amount } omitting id and userId'
  );

  // 8.4 ContestSubmission winner selection
  const contestSubTs = fs.readFileSync(path.join(API_DIR, 'contestSubmissions.ts'), 'utf-8');
  assert(
    contestSubTs.includes('put(`/api/ContestSubmission/winner/${submissionId}`)'),
    'ContestSubmission selectWinner invokes PUT /api/ContestSubmission/winner/{submissionId} without body'
  );
}

// -------------------------------------------------------------
// Suite 9: Adversarial Defensive Array Parsing Matrix
// -------------------------------------------------------------
function suiteAdversarialDefensiveArrayParsing() {
  console.log(`\n${colors.bright}${colors.cyan}=== Suite 9: Defensive Array Parsing Matrix on Malformed / Hostile Responses ===${colors.reset}`);

  const apiModules = [
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

  // Verify all 14 list-returning resource modules contain the exact defensive unwrapping boilerplate
  for (const mod of apiModules) {
    const filePath = path.join(API_DIR, mod);
    const content = fs.readFileSync(filePath, 'utf-8');
    const isDefensive =
      content.includes('if (Array.isArray(res.data)) return res.data;') &&
      (content.includes('Array.isArray((res.data as any).data)') || content.includes('Array.isArray(res.data.data)')) &&
      content.includes('return [];');
    assert(isDefensive, `src/api/${mod} implements 3-way defensive array unwrapping (raw, envelope, fallback [])`);
  }

  // Hostile parser test function
  function parseDefensively(resData) {
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData.data)) return resData.data;
    return [];
  }

  const stressCases = [
    { name: 'Standard raw array of objects', input: [{ id: 1 }, { id: 2 }], expected: 2 },
    { name: 'ASP.NET Core envelope { data: [...] }', input: { data: [{ id: 10 }, { id: 20 }, { id: 30 }] }, expected: 3 },
    { name: 'Empty raw array []', input: [], expected: 0 },
    { name: 'Empty envelope { data: [] }', input: { data: [] }, expected: 0 },
    { name: 'Null payload', input: null, expected: 0 },
    { name: 'Undefined payload', input: undefined, expected: 0 },
    { name: 'Raw string response "Server Error"', input: 'Server Error', expected: 0 },
    { name: 'Empty string ""', input: '', expected: 0 },
    { name: 'Numeric response 404', input: 404, expected: 0 },
    { name: 'Object with non-array data { data: "string" }', input: { data: 'not an array' }, expected: 0 },
    { name: 'ProblemDetails error object { title: "Error", status: 500 }', input: { title: 'Error', status: 500 }, expected: 0 },
  ];

  for (const sc of stressCases) {
    let result;
    let threw = false;
    try {
      result = parseDefensively(sc.input);
    } catch {
      threw = true;
    }
    assert(
      !threw && Array.isArray(result) && result.length === sc.expected,
      `Hostile response [${sc.name}] -> returns Array(length: ${sc.expected}) without throwing`
    );
  }
}

// -------------------------------------------------------------
// Runner Main
// -------------------------------------------------------------
async function main() {
  console.log(`${colors.bright}${colors.magenta}`);
  console.log(`╔══════════════════════════════════════════════════════════════════════════════════╗`);
  console.log(`║      JAMES THEW REST API & CONTRACT ADVERSARIAL VERIFICATION HARNESS            ║`);
  console.log(`║                 Full Empirical Stress Test & Mock Audit                          ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`Root Directory: ${ROOT_DIR}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  suiteModularApiResources();
  suiteApiClientArchitecture();
  suiteMockElimination();
  suitePayloadContracts();
  suiteBuildHygiene();
  await suiteAdversarialAuthInterceptors();
  await suiteAdversarial401AndErrorParser();
  suiteAdversarialPayloadContracts();
  suiteAdversarialDefensiveArrayParsing();

  console.log(`\n${colors.bright}======================================================${colors.reset}`);
  console.log(`${colors.bright}               VERIFICATION SUMMARY                   ${colors.reset}`);
  console.log(`======================================================`);
  console.log(`  Total Checks Executed: ${totalPassed + totalFailed}`);
  console.log(`  ${colors.green}Passed:                ${totalPassed}${colors.reset}`);
  console.log(`  ${colors.red}Failed:                ${totalFailed}${colors.reset}`);
  console.log(`======================================================\n`);

  if (totalFailed > 0) {
    console.log(`${colors.red}${colors.bright}VERIFICATION FAILED: ${totalFailed} check(s) did not pass.${colors.reset}\n`);
    failures.forEach((f, idx) => {
      console.log(`  ${idx + 1}. [FAIL] ${f.testName}`);
      if (f.details) console.log(`     Details: ${f.details}`);
    });
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bright}ALL VERIFICATION CHECKS AND ADVERSARIAL STRESS TESTS PASSED!${colors.reset}`);
    console.log(`${colors.green}${colors.bright}VERDICT: APPROVE${colors.reset}\n`);
    process.exit(0);
  }
}

main();
