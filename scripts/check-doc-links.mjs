#!/usr/bin/env node
/**
 * Verifica que todos los enlaces internos de docs/ apunten a archivos y anclas reales.
 *
 * NO DESTRUCTIVO: solo lee. Devuelve 1 si encuentra enlaces rotos.
 *
 * Uso: node scripts/check-doc-links.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (extname(full) === '.md') out.push(full);
  }
  return out;
}

/**
 * Convierte un encabezado markdown en su ancla siguiendo el algoritmo de GitHub:
 * minúsculas, se eliminan los signos de puntuación, los espacios pasan a guiones
 * y **se conservan los acentos** (por eso no se normaliza a NFD).
 * Respeta un ancla explícita `{#mi-ancla}`.
 */
function headingToAnchor(heading) {
  const explicit = heading.match(/\{#([^}]+)\}\s*$/);
  if (explicit) return explicit[1];
  return heading
    .replace(/\{#[^}]+\}\s*$/, '')
    .replace(/`/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    // Un guion por espacio, NO por grupo de espacios: al eliminar la puntuación
    // («Nivel 2 — Errores») quedan dos espacios seguidos y GitHub genera dos
    // guiones. Colapsarlos con \s+ producía anclas que no existen.
    .replace(/ /g, '-');
}

function collectAnchors(file) {
  const anchors = new Set();
  const content = readFileSync(file, 'utf8');
  let inFence = false;
  for (const line of content.split('\n')) {
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = line.match(/^#{1,6}\s+(.*)$/);
    if (m) anchors.add(headingToAnchor(m[1]));
  }
  return anchors;
}

const files = walk(DOCS);
const anchorsByFile = new Map(files.map((f) => [f, collectAnchors(f)]));

const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const broken = [];
let checked = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let inFence = false;

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;

    for (const match of line.matchAll(LINK_RE)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target)) {
        // Ancla en el mismo documento
        if (target.startsWith('#')) {
          checked++;
          const anchor = decodeURIComponent(target.slice(1));
          if (!anchorsByFile.get(file).has(anchor)) {
            broken.push({ file, line: index + 1, target, reason: 'ancla inexistente en este documento' });
          }
        }
        continue;
      }

      checked++;
      const [pathPart, anchorPart] = target.split('#');
      const resolved = resolve(dirname(file), decodeURIComponent(pathPart));

      if (!existsSync(resolved)) {
        broken.push({ file, line: index + 1, target, reason: 'archivo inexistente' });
        continue;
      }
      if (anchorPart && extname(resolved) === '.md') {
        const anchors = anchorsByFile.get(resolved) ?? collectAnchors(resolved);
        if (!anchors.has(decodeURIComponent(anchorPart))) {
          broken.push({ file, line: index + 1, target, reason: 'ancla inexistente en el destino' });
        }
      }
    }
  });
}

console.log(`check-doc-links: ${files.length} documentos, ${checked} enlaces verificados`);

if (broken.length === 0) {
  console.log('OK: 100 % de los enlaces internos resuelven.');
  process.exit(0);
}

console.error(`\nFALLO: ${broken.length} enlace(s) roto(s):\n`);
for (const b of broken) {
  console.error(`  ${relative(ROOT, b.file)}:${b.line}  ->  ${b.target}   (${b.reason})`);
}
process.exit(1);
