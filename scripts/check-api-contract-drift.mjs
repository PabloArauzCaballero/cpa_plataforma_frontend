#!/usr/bin/env node
/**
 * Compara los endpoints que el código realmente invoca con los documentados
 * en docs/integrations/backend-api.md y docs/architecture/integration-map.md.
 *
 * NO DESTRUCTIVO: solo lee. Devuelve 1 si hay endpoints sin documentar.
 *
 * Limitación declarada: no hay OpenAPI del backend en este repositorio, así que
 * NO se puede verificar el contrato real del servidor. Esto solo detecta drift
 * entre el código y la documentación.
 *
 * Uso: node scripts/check-api-contract-drift.mjs [--list]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, exts, out);
    else if (exts.includes(extname(full))) out.push(full);
  }
  return out;
}

/** Normaliza una ruta: los segmentos dinámicos pasan a `{id}`. */
function normalize(path) {
  return path
    .replace(/\$\{[^}]*\}/g, '{id}')
    .replace(/\?.*$/, '')
    .replace(/\/+$/, '');
}

// ---------- Endpoints en el código ----------
const codeFiles = walk(join(ROOT, 'src'), ['.ts', '.tsx']);
const found = new Map(); // ruta normalizada -> Set(archivos)

for (const file of codeFiles) {
  if (file.includes('__tests__')) continue;
  const content = readFileSync(file, 'utf8');
  for (const m of content.matchAll(/['"`](\/api\/[^'"`]*)['"`]/g)) {
    const path = normalize(m[1]);
    if (!found.has(path)) found.set(path, new Set());
    found.get(path).add(file.replace(ROOT + '/', ''));
  }
}

// ---------- Endpoints documentados ----------
const docFiles = [
  join(ROOT, 'docs/integrations/backend-api.md'),
  join(ROOT, 'docs/architecture/integration-map.md'),
  join(ROOT, 'docs/reports/frontend-inventory.md'),
];
let docText = '';
for (const f of docFiles) {
  try { docText += readFileSync(f, 'utf8'); } catch { /* documento opcional */ }
}

/** Un endpoint se considera documentado si su ruta, o su patrón de módulo/recurso, aparece. */
function isDocumented(path) {
  if (docText.includes(path)) return true;
  // Los 59 recursos CRUD se documentan por patrón: /api/{modulo}/{recurso}
  const crud = path.match(/^\/api\/([a-z_]+)\/([a-z-]+)/);
  if (crud && docText.includes(`/api/{modulo}/{recurso}`) && docText.includes(crud[2])) return true;
  // Rutas con {id}: basta con que la base esté documentada
  const base = path.replace(/\/\{id\}.*$/, '');
  return base !== path && docText.includes(base);
}

const undocumented = [...found.keys()].filter((p) => !isDocumented(p)).sort();

// ---------- Salida ----------
console.log(`check-api-contract-drift: ${found.size} endpoints distintos en el código`);
console.log('  Limitación: sin OpenAPI del backend, NO se verifica el contrato real del servidor.');

if (process.argv.includes('--list')) {
  for (const [path, files] of [...found.entries()].sort()) {
    console.log(`  ${path}`);
    for (const f of files) console.log(`      ${f}`);
  }
}

if (undocumented.length === 0) {
  console.log('OK: todos los endpoints invocados están documentados.');
  process.exit(0);
}

console.error(`\nFALLO: ${undocumented.length} endpoint(s) sin documentar:\n`);
for (const p of undocumented) {
  console.error(`  ${p}`);
  for (const f of found.get(p)) console.error(`      usado en ${f}`);
}
console.error('\nDocumenta estos endpoints en docs/integrations/backend-api.md.');
process.exit(1);
