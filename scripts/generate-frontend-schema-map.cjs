const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bankingPath = path.join(root, 'src/services/bankingService.ts');
const authPath = path.join(root, 'src/services/authService.ts');
const typesPath = path.join(root, 'src/types/banking.ts');
const outPath = path.join(root, 'FRONTEND_SCHEMA_ENDPOINT_MASTER.md');

const banking = fs.readFileSync(bankingPath, 'utf8');
const auth = fs.readFileSync(authPath, 'utf8');
const types = fs.readFileSync(typesPath, 'utf8');

function extract(fileText, fileLabel) {
  const rows = [];
  const lines = fileText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    let m = line.match(/(?:primitiveRequest|request)<([^>]+)>\(\s*['"`](GET|POST|PATCH|DELETE)['"`]\s*,\s*([`'"])(.+?)\3/);
    if (m) {
      rows.push({
        file: fileLabel,
        line: i + 1,
        method: m[2],
        endpointPath: m[4],
        schema: m[1].trim(),
      });
      continue;
    }
    m = line.match(/(?:primitiveRequest|request)\(\s*['"`](GET|POST|PATCH|DELETE)['"`]\s*,\s*([`'"])(.+?)\2/);
    if (m) {
      rows.push({
        file: fileLabel,
        line: i + 1,
        method: m[1],
        endpointPath: m[3],
        schema: '(implicit/none)',
      });
    }
  }
  return rows;
}

const endpointRows = [
  ...extract(banking, 'bankingService.ts'),
  ...extract(auth, 'authService.ts'),
];

const authTypeBlock = auth.split('const generateRequestId')[0].trim();

const lines = [];
lines.push('# Frontend Schemas + Endpoint Mapping (Complete)');
lines.push('');
lines.push('This document is generated from frontend source code to provide an exhaustive backend mapping contract.');
lines.push('');
lines.push('## 1) Endpoint Inventory Used By Frontend Services');
lines.push('');
lines.push('| Service File | Line | Method | Endpoint Path (as used in frontend) | Request/Response Generic Schema |');
lines.push('|---|---:|---|---|---|');

for (const row of endpointRows) {
  const endpointPath = row.endpointPath.replace(/\|/g, '\\|');
  const schema = row.schema.replace(/\|/g, '\\|');
  lines.push(`| ${row.file} | ${row.line} | ${row.method} | \`${endpointPath}\` | \`${schema}\` |`);
}

lines.push('');
lines.push('## 2) Frontend Schema Source Of Truth (Banking Domain)');
lines.push('');
lines.push('Verbatim schema definitions from `src/types/banking.ts`:');
lines.push('');
lines.push('```ts');
lines.push(types);
lines.push('```');
lines.push('');
lines.push('## 3) Frontend Schema Source Of Truth (Auth Domain)');
lines.push('');
lines.push('Verbatim auth request/response schema definitions from `src/services/authService.ts` (type block):');
lines.push('');
lines.push('```ts');
lines.push(authTypeBlock);
lines.push('```');
lines.push('');
lines.push('## 4) Backend Mapping Notes');
lines.push('');
lines.push('- Base banking path used by frontend runtime: `/api/v1/banking` (see `bankingService.ts`).');
lines.push('- Auth base path is role-normalized by frontend (`/admin/auth`, `/enterprise/auth`, `/verifier/auth`, `/user/auth`) from `authService.ts`.');
lines.push('- For endpoints with template paths (for example `/cases/${caseId}`), backend must support path params exactly as called.');
lines.push('- For rows marked `implicit/none`, request/response typing is inferred in code or not generic-annotated; backend should still return envelope-compatible responses.');

fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Generated ${outPath} with ${endpointRows.length} endpoint rows.`);
