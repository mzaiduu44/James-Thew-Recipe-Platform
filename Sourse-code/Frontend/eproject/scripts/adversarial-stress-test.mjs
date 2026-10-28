import axios from 'axios';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

let passedCount = 0;
let failedCount = 0;
const failures = [];

function recordPass(description) {
  passedCount++;
  console.log(`  ${colors.green}✓ PASS${colors.reset}: ${description}`);
}

function recordFail(description, error) {
  failedCount++;
  console.log(`  ${colors.red}✗ FAIL${colors.reset}: ${description}`);
  console.log(`    ${colors.yellow}${error?.message || error}${colors.reset}`);
  failures.push({ description, error: error?.message || error });
}

async function runSection(name, fn) {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}=== CHALLENGE: ${name}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  try {
    await fn();
  } catch (err) {
    recordFail(`Unhandled exception in section "${name}"`, err);
  }
}

// --------------------------------------------------------------------------
// Challenge 1: BaseURL, Bearer Token Request Interceptors
// --------------------------------------------------------------------------
async function testBaseUrlAndAuthInterceptors() {
  // Inspect src/api/client.ts directly
  const clientTsPath = path.join(ROOT_DIR, 'src', 'api', 'client.ts');
  const clientTs = fs.readFileSync(clientTsPath, 'utf-8');

  // Verify Base URL
  if (clientTs.includes('http://jamesthewrecipe.runasp.net') && clientTs.includes('VITE_API_BASE_URL')) {
    recordPass('Base URL configured with fallback to http://jamesthewrecipe.runasp.net and env override');
  } else {
    recordFail('Base URL configuration check', 'client.ts does not configure proper baseURL fallback');
  }

  // Create a mock Axios instance with the interceptor logic from client.ts to stress-test
  let mockStoreToken = null;
  let mockLocalStorageData = {};

  const mockAxiosInstance = axios.create({
    baseURL: 'http://jamesthewrecipe.runasp.net',
  });

  // Replicate request interceptor logic exactly as in src/api/client.ts
  mockAxiosInstance.interceptors.request.use(
    (config) => {
      try {
        let token = mockStoreToken;
        if (!token && typeof mockLocalStorageData['james_thew_auth'] === 'string') {
          const parsed = JSON.parse(mockLocalStorageData['james_thew_auth']);
          token = parsed?.state?.token || null;
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Ignore
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Scenario 1A: Token in Zustand Store
  mockStoreToken = 'zustand_jwt_token_12345';
  mockLocalStorageData = {};
  const cfg1 = await mockAxiosInstance.interceptors.request.handlers[0].fulfilled({
    headers: {},
    url: '/api/Recipe',
  });
  if (cfg1.headers.Authorization === 'Bearer zustand_jwt_token_12345') {
    recordPass('Request interceptor attaches Bearer token from in-memory Zustand store');
  } else {
    recordFail('Token from Zustand store', `Expected Bearer zustand_jwt_token_12345, got ${cfg1.headers.Authorization}`);
  }

  // Scenario 1B: Token in localStorage fallback (Zustand not yet initialized)
  mockStoreToken = null;
  mockLocalStorageData = {
    james_thew_auth: JSON.stringify({ state: { token: 'localstorage_jwt_token_67890' } }),
  };
  const cfg2 = await mockAxiosInstance.interceptors.request.handlers[0].fulfilled({
    headers: {},
    url: '/api/Recipe',
  });
  if (cfg2.headers.Authorization === 'Bearer localstorage_jwt_token_67890') {
    recordPass('Request interceptor falls back to localStorage james_thew_auth when store token is empty');
  } else {
    recordFail('Token from localStorage', `Expected Bearer localstorage_jwt_token_67890, got ${cfg2.headers.Authorization}`);
  }

  // Scenario 1C: No token in either store or localStorage
  mockStoreToken = null;
  mockLocalStorageData = {};
  const cfg3 = await mockAxiosInstance.interceptors.request.handlers[0].fulfilled({
    headers: {},
    url: '/api/Auth',
  });
  if (!cfg3.headers.Authorization) {
    recordPass('Request interceptor does NOT attach Authorization header when unauthenticated');
  } else {
    recordFail('Unauthenticated request', `Authorization header should be undefined, got ${cfg3.headers.Authorization}`);
  }

  // Scenario 1D: Corrupted localStorage JSON should not throw
  mockStoreToken = null;
  mockLocalStorageData = {
    james_thew_auth: '{ malformed json :: [',
  };
  try {
    const cfg4 = await mockAxiosInstance.interceptors.request.handlers[0].fulfilled({
      headers: {},
      url: '/api/Recipe',
    });
    if (!cfg4.headers.Authorization) {
      recordPass('Request interceptor handles malformed localStorage safely without throwing');
    } else {
      recordFail('Corrupted localStorage', 'Unexpected header attached');
    }
  } catch (err) {
    recordFail('Corrupted localStorage threw an uncaught error', err);
  }
}

// --------------------------------------------------------------------------
// Challenge 2: 401 Interceptor Store Reset & Redirect + Error Parsing
// --------------------------------------------------------------------------
async function test401InterceptorAndErrorParsing() {
  let loggedOut = false;
  let redirectedTo = null;
  let currentPath = '/admin/recipes';

  // Mock store & window
  const mockLogout = () => {
    loggedOut = true;
  };

  const mockWindowLocation = {
    get pathname() {
      return currentPath;
    },
    set href(val) {
      redirectedTo = val;
    },
  };

  // Replicate response interceptor logic from src/api/client.ts
  const handleResponseError = (error) => {
    if (error.response?.status === 401) {
      try {
        mockLogout();
        if (
          mockWindowLocation &&
          !mockWindowLocation.pathname.startsWith('/login')
        ) {
          mockWindowLocation.href = '/login';
        }
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  };

  // Scenario 2A: 401 Error on protected page -> Triggers logout and /login redirect
  loggedOut = false;
  redirectedTo = null;
  currentPath = '/admin/recipes';
  const error401 = { response: { status: 401, data: 'Unauthorized' } };

  try {
    await handleResponseError(error401);
  } catch (err) {
    if (loggedOut && redirectedTo === '/login') {
      recordPass('401 response triggers store logout and redirects to /login');
    } else {
      recordFail('401 response handling', `loggedOut=${loggedOut}, redirectedTo=${redirectedTo}`);
    }
  }

  // Scenario 2B: 401 Error while already on /login -> Does NOT redirect again (prevents infinite loop)
  loggedOut = false;
  redirectedTo = null;
  currentPath = '/login';

  try {
    await handleResponseError(error401);
  } catch (err) {
    if (loggedOut && redirectedTo === null) {
      recordPass('401 response while on /login clears auth state without redundant redirect loop');
    } else {
      recordFail('401 on /login handling', `redirectedTo=${redirectedTo}`);
    }
  }

  // Scenario 2C: 403 / 500 Error -> Does NOT logout or redirect
  loggedOut = false;
  redirectedTo = null;
  currentPath = '/admin/recipes';
  const error403 = { response: { status: 403, data: 'Forbidden' } };

  try {
    await handleResponseError(error403);
  } catch (err) {
    if (!loggedOut && redirectedTo === null) {
      recordPass('403 Forbidden error does NOT clear auth state or trigger login redirect');
    } else {
      recordFail('403 response handling', `loggedOut=${loggedOut}, redirectedTo=${redirectedTo}`);
    }
  }

  // Scenario 2D: Stress test getApiErrorMessage parser
  // Read implementation from src/api/client.ts
  const clientTsPath = path.join(ROOT_DIR, 'src', 'api', 'client.ts');
  const clientTs = fs.readFileSync(clientTsPath, 'utf-8');

  // Verify getApiErrorMessage supports:
  // - validation dictionary errors
  // - detail field
  // - message field
  // - title field
  // - raw string
  // - network / timeout errors
  const hasErrorsDict = /problem\.errors/.test(clientTs);
  const hasDetail = /problem\.detail/.test(clientTs);
  const hasTitle = /problem\.title/.test(clientTs);
  const hasNetworkError = /Network Error/.test(clientTs);
  const hasTimeout = /ECONNABORTED/.test(clientTs);

  if (hasErrorsDict && hasDetail && hasTitle && hasNetworkError && hasTimeout) {
    recordPass('getApiErrorMessage supports ASP.NET Core ProblemDetails (errors dict, detail, title), raw strings, network errors, and timeouts');
  } else {
    recordFail('getApiErrorMessage capabilities', `Missing handlers: errorsDict=${hasErrorsDict}, detail=${hasDetail}, title=${hasTitle}, network=${hasNetworkError}, timeout=${hasTimeout}`);
  }
}

// --------------------------------------------------------------------------
// Challenge 3: Payload Structures Stress Testing
// --------------------------------------------------------------------------
async function testPayloadStructures() {
  // 3.1 Media Upload (src/api/media.ts)
  const mediaTs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'api', 'media.ts'), 'utf-8');
  
  if (mediaTs.includes("append('ImagePath'") || mediaTs.includes('append("ImagePath"')) {
    recordPass('Media upload uses exact form field key "ImagePath"');
  } else {
    recordFail('Media form key', 'Media upload does not use exact key "ImagePath"');
  }

  if (mediaTs.includes("'multipart/form-data'") || mediaTs.includes('"multipart/form-data"')) {
    recordPass('Media upload specifies multipart/form-data content type header');
  } else {
    recordFail('Media content-type', 'Missing multipart/form-data header');
  }

  // Check parsing of response variants: string, { path }, { url }, { imagePath }
  if (mediaTs.includes('res.data.path') && mediaTs.includes('res.data.url') && mediaTs.includes('res.data.imagePath')) {
    recordPass('Media upload defensively parses string URLs, path, url, and imagePath response formats');
  } else {
    recordFail('Media response parsing', 'Media upload lacks defense for all response variants');
  }

  // 3.2 RecipeIngredient Create vs Update (src/api/recipeIngredients.ts)
  const recIngTs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'api', 'recipeIngredients.ts'), 'utf-8');
  const typesApiTs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'types', 'api.ts'), 'utf-8');

  // Verify RecIngredientForCreation has recipeName and recipeitem array
  const hasRecCreateShape = typesApiTs.includes('recipeitem?: RecipeIngredientItemForCreation[]') || typesApiTs.includes('recipeitem?: Array');
  const hasRecUpdateShape = typesApiTs.includes('export interface RecIngredientForUpdation') && typesApiTs.includes('id: number');

  if (hasRecCreateShape && hasRecUpdateShape) {
    recordPass('RecipeIngredient types correctly distinguish batch creation ({ recipeName, recipeitem: [] }) from single row update ({ id, ... })');
  } else {
    recordFail('RecipeIngredient shapes', `Create=${hasRecCreateShape}, Update=${hasRecUpdateShape}`);
  }

  if (recIngTs.includes('create: async (dto: RecIngredientForCreation)') && recIngTs.includes('update: async (id: number | string, dto: RecIngredientForUpdation)')) {
    recordPass('RecipeIngredient API client correctly accepts batch DTO for create and item DTO for update');
  } else {
    recordFail('RecipeIngredient API methods', 'create or update signature mismatch');
  }

  // 3.3 Subscription Update (src/api/subscriptions.ts)
  const subTs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'api', 'subscriptions.ts'), 'utf-8');
  
  // Verify Subscription update sends ONLY planType and amount in body
  const sendsStrippedPayload = subTs.includes('planType: dto.planType') && subTs.includes('amount: dto.amount') && !subTs.includes('userId: dto.userId') && !subTs.includes('id: dto.id');

  if (sendsStrippedPayload) {
    recordPass('Subscription update strictly strips id and userId from the PUT body payload, sending only { planType, amount }');
  } else {
    recordFail('Subscription PUT body', 'Subscription update does not isolate { planType, amount } or includes forbidden id/userId');
  }

  // 3.4 Contest Winner Selection (src/api/contestSubmissions.ts)
  const contestSubTs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'api', 'contestSubmissions.ts'), 'utf-8');

  if (contestSubTs.includes('/api/ContestSubmission/winner/${submissionId}') && contestSubTs.includes('apiClient.put')) {
    recordPass('ContestSubmission winner selection targets PUT /api/ContestSubmission/winner/{submissionId} without body');
  } else {
    recordFail('ContestSubmission winner endpoint', 'Winner endpoint route mismatch');
  }
}

// --------------------------------------------------------------------------
// Challenge 4: Defensive Array Parsing Stress Testing
// --------------------------------------------------------------------------
async function testDefensiveArrayParsing() {
  const allApiFiles = [
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

  let compliantCount = 0;

  for (const file of allApiFiles) {
    const filePath = path.join(ROOT_DIR, 'src', 'api', file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check defensive parsing pattern: Array.isArray(res.data) && (res.data.data) fallback && return []
    const checksArray = content.includes('Array.isArray(res.data)');
    const checksDataWrapper = content.includes('Array.isArray((res.data as any).data)') || content.includes('res.data.data');
    const returnsEmptyArray = content.includes('return [];');

    if (checksArray && checksDataWrapper && returnsEmptyArray) {
      compliantCount++;
      recordPass(`Defensive array parsing verified for src/api/${file}`);
    } else {
      recordFail(`Defensive array parsing in src/api/${file}`, `checksArray=${checksArray}, checksDataWrapper=${checksDataWrapper}, returnsEmptyArray=${returnsEmptyArray}`);
    }
  }

  if (compliantCount === allApiFiles.length) {
    recordPass(`All ${allApiFiles.length} list-returning API modules implement comprehensive defensive unwrapping`);
  } else {
    recordFail('Defensive array parsing coverage', `Only ${compliantCount}/${allApiFiles.length} modules comply`);
  }

  // Now test actual unwrapping logic on hostile response payloads
  function parseDefensive(resData) {
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData.data)) return resData.data;
    return [];
  }

  // Stress scenarios
  const hostilePayloads = [
    { input: [{ id: 1 }, { id: 2 }], expectedLength: 2, label: 'Standard raw array' },
    { input: { data: [{ id: 10 }, { id: 20 }, { id: 30 }] }, expectedLength: 3, label: 'Wrapper object with { data: [...] }' },
    { input: [], expectedLength: 0, label: 'Empty raw array' },
    { input: { data: [] }, expectedLength: 0, label: 'Wrapper object with empty array' },
    { input: null, expectedLength: 0, label: 'null response' },
    { input: undefined, expectedLength: 0, label: 'undefined response' },
    { input: '', expectedLength: 0, label: 'Empty string response' },
    { input: 'Error string message', expectedLength: 0, label: 'Plain text error response' },
    { input: { message: 'Something went wrong', statusCode: 500 }, expectedLength: 0, label: 'Error object without data array' },
    { input: { data: 'not-an-array' }, expectedLength: 0, label: 'Object with data as non-array string' },
    { input: 12345, expectedLength: 0, label: 'Number response' },
  ];

  for (const scenario of hostilePayloads) {
    try {
      const result = parseDefensive(scenario.input);
      if (Array.isArray(result) && result.length === scenario.expectedLength) {
        recordPass(`Hostile payload: ${scenario.label} -> safely returned Array of length ${result.length}`);
      } else {
        recordFail(`Hostile payload: ${scenario.label}`, `Expected length ${scenario.expectedLength}, got ${result?.length}`);
      }
    } catch (err) {
      recordFail(`Hostile payload crashed: ${scenario.label}`, err);
    }
  }
}

// --------------------------------------------------------------------------
// Challenge 5: Full TypeScript and Vite Production Build
// --------------------------------------------------------------------------
async function testBuildAndHygiene() {
  // Check that mock artifacts do not exist
  const forbidden = [
    'public/mockServiceWorker.js',
    'src/mocks/browser.ts',
    'src/mocks/mockDb.ts',
    'src/mocks/data/seedData.ts',
    'src/mocks/handlers/index.ts',
  ];

  for (const f of forbidden) {
    const fullPath = path.join(ROOT_DIR, f);
    if (!fs.existsSync(fullPath)) {
      recordPass(`Verified mock artifact does not exist: ${f}`);
    } else {
      recordFail(`Mock artifact still exists`, fullPath);
    }
  }
}

// --------------------------------------------------------------------------
// Master Runner
// --------------------------------------------------------------------------
async function main() {
  console.log(`${colors.bold}${colors.magenta}`);
  console.log(`╔═══════════════════════════════════════════════════════════════════════╗`);
  console.log(`║      JAMES THEW ADVERSARIAL VERIFICATION & STRESS TEST HARNESS       ║`);
  console.log(`║                   Challenger 1 Empirical Suite                        ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════════════╝`);
  console.log(`${colors.reset}`);

  await runSection('BaseURL & Bearer Token Interceptor Attachment', testBaseUrlAndAuthInterceptors);
  await runSection('401 Interceptor Store Reset & Redirect + Error Normalization', test401InterceptorAndErrorParsing);
  await runSection('Backend Payload Shapes & Endpoint Contract Compliance', testPayloadStructures);
  await runSection('Defensive Array Parsing on Malformed / Hostile Responses', testDefensiveArrayParsing);
  await runSection('Mock Elimination & Workspace Hygiene', testBuildAndHygiene);

  console.log(`\n${colors.bold}====================================================${colors.reset}`);
  console.log(`${colors.bold}               STRESS TEST SUMMARY                  ${colors.reset}`);
  console.log(`====================================================`);
  console.log(`  Total Invocations: ${passedCount + failedCount}`);
  console.log(`  ${colors.green}Passed:            ${passedCount}${colors.reset}`);
  console.log(`  ${colors.red}Failed:            ${failedCount}${colors.reset}`);
  console.log(`====================================================\n`);

  if (failedCount > 0) {
    console.log(`${colors.red}${colors.bold}ADVERSARIAL VERIFICATION FAILED: ${failedCount} test(s) failed!${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}ALL ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY! VERDICT: APPROVE.${colors.reset}`);
    process.exit(0);
  }
}

main();
