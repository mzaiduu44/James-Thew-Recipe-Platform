import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

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

const allSrcFiles = getAllFiles(SRC_DIR);
console.log(`Auditing ${allSrcFiles.length} files under src/...`);

const suspiciousPatterns = [
  { name: 'MSW import', regex: /from\s+['"]msw/i },
  { name: 'setupWorker call', regex: /setupWorker/i },
  { name: 'mockDb reference', regex: /mockDb/i },
  { name: 'seedData reference', regex: /seedData/i },
  { name: 'enableMocking call', regex: /enableMocking/i },
  { name: 'prepareApp call', regex: /prepareApp/i },
  { name: 'RoleSwitcher component', regex: /RoleSwitcher/i },
  { name: 'Synthetic delay / sleep promise', regex: /new\s+Promise\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>\s*setTimeout/i },
  { name: 'Explicit setTimeout delay in api/store', regex: /setTimeout\s*\(/i, filter: (f) => f.includes('src/api/') || f.includes('src/store/') || f.includes('src/services/') },
  { name: 'Dummy/Mock data array literal', regex: /(?:const|let|var)\s+(?:mock|dummy|fake|sample|stub)[a-zA-Z0-9_$]*\s*=\s*\[/i },
  { name: 'Hardcoded credentials or fake token generator', regex: /fake-jwt-token|mock-token/i },
  { name: 'Localstorage fake db', regex: /localStorage\.setItem\(['"](?:recipes|tips|contests|users)['"]/i },
];

const findings = [];

for (const file of allSrcFiles) {
  const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  for (const pattern of suspiciousPatterns) {
    if (pattern.filter && !pattern.filter(relPath)) {
      continue;
    }

    lines.forEach((line, idx) => {
      if (pattern.regex.test(line)) {
        findings.push({
          file: relPath,
          lineNum: idx + 1,
          lineContent: line.trim(),
          issue: pattern.name,
        });
      }
    });
  }
}

console.log(`\n=== ADVERSARIAL AUDIT RESULTS ===`);
console.log(`Total findings: ${findings.length}`);
if (findings.length === 0) {
  console.log(`✓ Zero suspicious mock remnants, synthetic delays, fake latencies, or demo role switchers found across all ${allSrcFiles.length} files in src/!`);
} else {
  console.log(`Found ${findings.length} potential issues:`);
  findings.forEach((f, idx) => {
    console.log(`[${idx + 1}] ${f.file}:${f.lineNum} (${f.issue}) -> ${f.lineContent}`);
  });
}
