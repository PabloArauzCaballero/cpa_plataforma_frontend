#!/usr/bin/env node
/**
 * Extrae el inventario de rutas desde src/app/router.tsx y los recursos desde
 * resourceDefinitions.ts, por análisis de texto (sin ejecutar el código).
 *
 * NO DESTRUCTIVO: solo lee. Imprime el inventario; con --json lo emite en JSON.
 *
 * Uso: node scripts/generate-route-inventory.mjs [--json]
 */
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROUTER = join(ROOT, 'src/app/router.tsx');
const DEFS = join(ROOT, 'src/features/resources/domain/resourceDefinitions.ts');

const routerSource = readFileSync(ROUTER, 'utf8');

// Rutas: { path: '...' } y { index: true }
const routes = [];
for (const m of routerSource.matchAll(/\{\s*(?:path:\s*'([^']+)'|index:\s*true)[^}]*element:\s*([^\n]+)/g)) {
  const path = m[1] ?? '(index)';
  const element = m[2].trim().replace(/,\s*$/, '');
  const lazy = /withSuspense\(/.test(element);
  const component = element.match(/<([A-Za-z]+)\s*\/?>/)?.[1] ?? element.slice(0, 60);
  routes.push({ path, component, lazy });
}

// Páginas cargadas de forma diferida
const lazyPages = [...routerSource.matchAll(/const\s+(\w+)\s*=\s*lazy\(/g)].map((m) => m[1]);

// Recursos
const defsSource = readFileSync(DEFS, 'utf8');
const resources = [];
for (const m of defsSource.matchAll(
  /key:\s*"([^"]+)",\s*module:\s*"([^"]+)",\s*moduleLabel:\s*"([^"]+)",\s*label:\s*"([^"]+)"/g,
)) {
  resources.push({ key: m[1], module: m[2], moduleLabel: m[3], label: m[4] });
}
const hidden = (defsSource.match(/hideFromNavigation:\s*true/g) ?? []).length;
const composites = [...defsSource.matchAll(/composite:\s*'([^']+)'/g)].map((m) => m[1]);

const modules = [...new Set(resources.map((r) => r.module))].sort();

const inventory = {
  generatedFrom: { router: 'src/app/router.tsx', definitions: 'src/features/resources/domain/resourceDefinitions.ts' },
  routes,
  lazyPages,
  modules: modules.map((key) => ({
    key,
    label: resources.find((r) => r.module === key)?.moduleLabel ?? key,
    resourceCount: resources.filter((r) => r.module === key).length,
  })),
  resources,
  hiddenFromNavigation: hidden,
  composites,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(inventory, null, 2));
  process.exit(0);
}

console.log(`Rutas registradas: ${routes.length}`);
for (const r of routes) {
  console.log(`  ${r.path.padEnd(45)} ${r.component.padEnd(28)} ${r.lazy ? 'lazy' : 'inline'}`);
}
console.log(`\nPáginas con carga diferida: ${lazyPages.length}`);
console.log(`\nMódulos: ${modules.length}`);
for (const m of inventory.modules) {
  console.log(`  ${m.key.padEnd(24)} ${String(m.resourceCount).padStart(3)} recursos   ${m.label}`);
}
console.log(`\nRecursos totales: ${resources.length}`);
console.log(`Ocultos de navegación: ${hidden}`);
console.log(`Compuestos: ${composites.length} (${composites.join(', ')})`);
