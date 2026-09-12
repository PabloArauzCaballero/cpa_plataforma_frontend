#!/usr/bin/env node
/**
 * Verifica el tamaño del bundle contra el presupuesto de docs/performance/budgets.md.
 *
 * NO DESTRUCTIVO: solo lee. Devuelve 1 si se supera algún presupuesto bloqueante.
 *
 * Por defecto mide `dist/`. Como dist/ está versionado en este repositorio, para
 * medir un build nuevo sin ensuciarlo:
 *   npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
 *   node scripts/check-bundle-budget.mjs /tmp/dist-check
 *
 * Uso: node scripts/check-bundle-budget.mjs [directorio]
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(process.argv[2] ?? join(ROOT, 'dist'));

// Presupuestos — deben coincidir con docs/performance/budgets.md
const BUDGET = {
  initialJsGzip:   { limit: 155_000, blocking: true,  label: 'JS inicial (gzip)' },
  initialJsRaw:    { limit: 500_000, blocking: false, label: 'JS inicial (sin comprimir)' },
  initialCssGzip:  { limit:   7_000, blocking: true,  label: 'CSS inicial (gzip)' },
  totalJs:         { limit: 920_000, blocking: false, label: 'JS total' },
  totalCss:        { limit: 135_000, blocking: false, label: 'CSS total' },
  largestRouteJsGzip: { limit: 40_000, blocking: false, label: 'Chunk de ruta más pesado (gzip)' },
  chunkCount:      { limit:      20, blocking: false, label: 'Número de chunks JS' },
};

if (!existsSync(DIST)) {
  console.error(`No existe el directorio: ${DIST}`);
  console.error('Construye primero:  npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir');
  process.exit(1);
}

const assetsDir = join(DIST, 'assets');
if (!existsSync(assetsDir)) {
  console.error(`No existe ${assetsDir}. ¿Es un directorio de build de Vite?`);
  process.exit(1);
}

const files = readdirSync(assetsDir)
  .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
  .map((f) => {
    const full = join(assetsDir, f);
    const raw = readFileSync(full);
    return { name: f, raw: statSync(full).size, gzip: gzipSync(raw).length, isJs: f.endsWith('.js') };
  });

const js = files.filter((f) => f.isJs);
const css = files.filter((f) => !f.isJs);

const initialJs = js.find((f) => basename(f.name).startsWith('index-'));
const initialCss = css.find((f) => basename(f.name).startsWith('index-'));
const routeJs = js.filter((f) => f !== initialJs).sort((a, b) => b.gzip - a.gzip);

const measured = {
  initialJsGzip: initialJs?.gzip ?? 0,
  initialJsRaw: initialJs?.raw ?? 0,
  initialCssGzip: initialCss?.gzip ?? 0,
  totalJs: js.reduce((s, f) => s + f.raw, 0),
  totalCss: css.reduce((s, f) => s + f.raw, 0),
  largestRouteJsGzip: routeJs[0]?.gzip ?? 0,
  chunkCount: js.length,
};

console.log(`check-bundle-budget: ${DIST}`);
console.log('');

let failed = 0;
let warned = 0;

for (const [key, budget] of Object.entries(BUDGET)) {
  const value = measured[key];
  const over = value > budget.limit;
  const pct = budget.limit ? Math.round((value / budget.limit) * 100) : 0;
  const mark = over ? (budget.blocking ? 'FALLO ' : 'AVISO ') : 'OK    ';
  if (over && budget.blocking) failed++;
  if (over && !budget.blocking) warned++;
  console.log(`  ${mark} ${budget.label.padEnd(34)} ${String(value).padStart(9)} / ${String(budget.limit).padStart(9)}  (${pct} %)`);
}

console.log('');
console.log(`  Chunk de ruta más pesado: ${routeJs[0]?.name ?? '—'}`);
console.log(`  Referencia de la línea base (618e5c3): JS inicial 148469 B gzip`);

if (failed > 0) {
  console.error(`\nFALLO: ${failed} presupuesto(s) bloqueante(s) superado(s).`);
  console.error('Si el aumento está justificado, actualiza docs/performance/budgets.md');
  console.error('en el MISMO pull request, con la medición antes/después y el motivo.');
  process.exit(1);
}

console.log(warned > 0 ? `\nOK con ${warned} aviso(s) no bloqueante(s).` : '\nOK: dentro de presupuesto.');
process.exit(0);
