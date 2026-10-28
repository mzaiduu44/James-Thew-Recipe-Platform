## 2026-08-23T10:33:09Z

You are the E2E & Smoke Test Suite Engineer for the James Thew recipe platform frontend refactoring.
Working directory for your metadata: c:/Users/akela/Downloads/eproject/.agents/test_track_1/
Project root: c:/Users/akela/Downloads/eproject

Your task:
1. Read `ORIGINAL_REQUEST.md`, `API_CONTRACT.md`, and the survey reports in `.agents/spec_miner_1/api_spec_report.md`.
2. Create `TEST_INFRA.md` at project root summarizing the testing strategy, feature inventory, and verification thresholds.
3. Implement an automated smoke/verification test script (e.g. `scripts/verify-api.ts` or `tests/smoke.test.ts` or npm test runner) that:
   - Verifies all 16 modular API resources exist under `src/api/` with typed query/mutation hooks.
   - Verifies the centralized API client `src/api/client.ts` is configured with baseURL `http://jamesthewrecipe.runasp.net`, Bearer token interceptor, and 401 redirect to `/login`.
   - Verifies zero remaining MSW / mock files / synthetic delays across `src/`.
   - Verifies exact backend payload shapes (2-step media upload, RecipeIngredient payload structures, Subscription PUT body without id/userId).
   - Verifies build cleanliness (`npm run build` compiles with 0 TypeScript errors).
4. Create `TEST_READY.md` at project root once test infrastructure is in place.
5. Write your handoff report to `c:/Users/akela/Downloads/eproject/.agents/test_track_1/handoff.md` and send a message when complete.
