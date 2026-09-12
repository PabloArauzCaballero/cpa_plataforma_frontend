#!/usr/bin/env node
/**
 * Extrae el inventario de componentes compartidos y de feature, con su
 * reutilización real (número de importaciones) y sus props declaradas.
 *
 * NO DESTRUCTIVO: solo lee. Con --json emite el inventario en JSON.
 *
 * Uso: node scripts/generate-component-inventory.mjs [--json]
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (['.ts', '.tsx'].includes(extname(full))) out.push(full);
  }
  return out;
}

const allFiles = walk(SRC);
const sources = new Map(allFiles.map((f) => [f, readFileSync(f, 'utf8')]));

/**
 * Cuenta importaciones del componente desde otros archivos.
 * Excluye su propio archivo y las pruebas, pero SÍ cuenta a sus vecinos de carpeta:
 * `SearchableSelect` solo lo usa `FormField`, que vive en el mismo directorio, y
 * excluir la carpeta entera lo marcaba como huérfano por error.
 */
function countUsages(componentName, ownFile) {
  let count = 0;
  for (const [file, content] of sources) {
    if (file === ownFile || file.includes('__tests__')) continue;
    const re = new RegExp(`import[^;]*\\b${componentName}\\b[^;]*from`, 'g');
    if (re.test(content)) count++;
  }
  return count;
}

/** Extrae los nombres de prop de la primera interfaz `<Nombre>Props`. */
function extractProps(content, componentName) {
  const re = new RegExp(`interface\\s+${componentName}Props[^{]*\\{([\\s\\S]*?)\\n\\}`, 'm');
  const m = content.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/^\s*(?:\/\*[\s\S]*?\*\/\s*)?(\w+)(\??):/gm)]
    .map((p) => ({ name: p[1], optional: p[2] === '?' }));
}

function inventory(baseDir, kind) {
  const result = [];
  if (!existsSync(baseDir)) return result;
  for (const entry of readdirSync(baseDir)) {
    const dir = join(baseDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.tsx')) continue;
      const name = basename(file, '.tsx');
      const full = join(dir, file);
      const content = sources.get(full) ?? readFileSync(full, 'utf8');
      result.push({
        kind,
        name,
        path: full.replace(ROOT + '/', ''),
        lines: content.split('\n').length,
        props: extractProps(content, name),
        usages: countUsages(name, full),
      });
    }
  }
  return result;
}

const shared = inventory(join(SRC, 'shared/components'), 'shared');
const layouts = inventory(join(SRC, 'shared/layouts'), 'layout');

const featureComponents = [];
const featuresDir = join(SRC, 'features');
for (const feature of readdirSync(featuresDir)) {
  const dir = join(featuresDir, feature, 'components');
  if (!existsSync(dir)) continue;
  for (const file of walk(dir)) {
    if (!file.endsWith('.tsx')) continue;
    const name = basename(file, '.tsx');
    const content = sources.get(file) ?? readFileSync(file, 'utf8');
    featureComponents.push({
      kind: 'feature', feature, name,
      path: file.replace(ROOT + '/', ''),
      lines: content.split('\n').length,
      props: extractProps(content, name),
      usages: countUsages(name, file),
    });
  }
}

const data = { shared, layouts, featureComponents };

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

function print(title, list) {
  console.log(`\n${title} (${list.length})`);
  console.log('  ' + 'Componente'.padEnd(26) + 'Líneas'.padStart(7) + 'Props'.padStart(7) + 'Usos'.padStart(6));
  for (const c of list.sort((a, b) => b.usages - a.usages)) {
    console.log(`  ${c.name.padEnd(26)}${String(c.lines).padStart(7)}${String(c.props.length).padStart(7)}${String(c.usages).padStart(6)}`);
  }
}

print('Componentes compartidos', shared);
print('Layouts', layouts);
print('Componentes de feature', featureComponents);

const orphans = [...shared, ...layouts, ...featureComponents].filter((c) => c.usages === 0);
if (orphans.length) {
  console.log(`\nPosibles huérfanos (0 importaciones desde otros archivos):`);
  for (const c of orphans) console.log(`  ${c.path}`);
}
