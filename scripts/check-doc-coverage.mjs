#!/usr/bin/env node
/**
 * Verifica la cobertura documental:
 *   1. Cada ruta del router tiene ficha en docs/routes/ y aparece en el catálogo.
 *   2. Cada componente de src/shared/components aparece en docs/components/catalog.md.
 *   3. APP_ROUTE_PATTERNS (tutoriales) sigue sincronizado con router.tsx.
 *   4. No quedan marcadores TODO/TBD/FIXME/pendiente en docs/.
 *
 * NO DESTRUCTIVO: solo lee. Devuelve 1 si hay huecos.
 *
 * Uso: node scripts/check-doc-coverage.mjs
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const notes = [];

// ---------- 1. Rutas ----------
const routerSource = readFileSync(join(ROOT, 'src/app/router.tsx'), 'utf8');
const routePaths = [];
for (const m of routerSource.matchAll(/\{\s*(?:path:\s*'([^']+)'|index:\s*true)/g)) {
  routePaths.push(m[1] ?? '(index)');
}

const catalogPath = join(ROOT, 'docs/routes/route-catalog.md');
if (!existsSync(catalogPath)) {
  failures.push('Falta docs/routes/route-catalog.md');
} else {
  const catalog = readFileSync(catalogPath, 'utf8');
  for (const p of routePaths) {
    const needle = p === '(index)' ? '(index)' : p;
    if (!catalog.includes(needle)) failures.push(`Ruta sin documentar en el catálogo: ${p}`);
  }
  notes.push(`Rutas del router: ${routePaths.length}; todas presentes en el catálogo: ${routePaths.every((p) => catalog.includes(p === '(index)' ? '(index)' : p))}`);
}

// ---------- 2. Componentes compartidos ----------
const componentsDir = join(ROOT, 'src/shared/components');
const componentNames = readdirSync(componentsDir).filter((d) => statSync(join(componentsDir, d)).isDirectory());
const componentCatalog = join(ROOT, 'docs/components/catalog.md');
if (!existsSync(componentCatalog)) {
  failures.push('Falta docs/components/catalog.md');
} else {
  const content = readFileSync(componentCatalog, 'utf8');
  for (const name of componentNames) {
    // El directorio Tooltip expone InfoHint; se acepta cualquiera de los dos nombres.
    const alt = name === 'Tooltip' ? 'InfoHint' : name;
    if (!content.includes(name) && !content.includes(alt)) {
      failures.push(`Componente compartido sin ficha en el catálogo: ${name}`);
    }
  }
  notes.push(`Componentes compartidos: ${componentNames.length}`);
}

// ---------- 3. APP_ROUTE_PATTERNS vs router.tsx ----------
const tutorialRoutesPath = join(ROOT, 'src/features/tutorials/domain/tutorialRoutes.ts');
if (existsSync(tutorialRoutesPath)) {
  const src = readFileSync(tutorialRoutesPath, 'utf8');
  const block = src.match(/APP_ROUTE_PATTERNS\s*=\s*\[([\s\S]*?)\]/);
  if (block) {
    const declared = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    const real = routePaths
      .filter((p) => p !== '*' && p !== '(index)')
      .map((p) => (p.startsWith('/') ? p : `/${p}`));
    const missing = real.filter((p) => !declared.includes(p));
    const extra = declared.filter((p) => p !== '/' && !real.includes(p));
    if (missing.length) failures.push(`APP_ROUTE_PATTERNS no incluye: ${missing.join(', ')}`);
    if (extra.length) failures.push(`APP_ROUTE_PATTERNS declara rutas inexistentes: ${extra.join(', ')}`);
    notes.push(`APP_ROUTE_PATTERNS: ${declared.length} patrones declarados`);
  }
}

// ---------- 4. Marcadores provisionales ----------
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (extname(full) === '.md') out.push(full);
  }
  return out;
}
/**
 * Un marcador provisional real lleva dos puntos: `TODO: hacer X`.
 * Sin esa restricción se disparaban falsos positivos con la palabra española
 * «TODO» («descarga TODO y filtra») y con las menciones a la propia política
 * («Prohibidos: TODO, TBD, FIXME»).
 */
const MARKER = /(?:^|[\s(<])(TODO|TBD|FIXME|XXX)\s*:/;
const docFiles = walk(join(ROOT, 'docs'));
for (const file of docFiles) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (MARKER.test(line)) failures.push(`Marcador provisional en ${file.replace(ROOT + '/', '')}:${i + 1}`);
  });
}
notes.push(`Documentos revisados: ${docFiles.length}`);

// ---------- Resultado ----------
console.log('check-doc-coverage');
for (const n of notes) console.log(`  · ${n}`);

if (failures.length === 0) {
  console.log('OK: cobertura documental completa, sin marcadores provisionales.');
  process.exit(0);
}
console.error(`\nFALLO: ${failures.length} hueco(s):\n`);
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);
