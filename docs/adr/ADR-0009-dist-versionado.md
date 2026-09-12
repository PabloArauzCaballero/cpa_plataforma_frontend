# ADR-0009: `dist/` versionado en el repositorio

## Estado
**Aceptado**, con una consecuencia de seguridad grave documentada.

## Contexto
El despliegue en Cloudflare Workers declara `assets.directory: "./dist"` (`wrangler.jsonc`). No hay CI/CD en el repositorio: `npx wrangler versions upload` publica **el contenido del `dist/` del árbol de trabajo**.

## Fuerzas y restricciones
- Sin pipeline de CI que construya el artefacto.
- Se necesita reversión rápida y fiable.
- `wrangler` necesita un directorio de assets presente para publicar.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Versionar `dist/`** | Reversión trivial; trazabilidad exacta código↔artefacto; sin CI | Ruido en el árbol; conflictos; **el historial guarda todo lo compilado** |
| B. Construir en CI y publicar el artefacto | Árbol limpio; artefacto reproducible | Requiere infraestructura de CI |
| C. Construir en local y publicar sin versionar | Árbol limpio | **Sin trazabilidad**: nadie sabe qué se publicó |

## Decisión
**Opción A**, declarada explícitamente en `.gitignore`:

```
# Artefactos de build locales
# OJO: dist/ NO se ignora a proposito. Cloudflare sirve el contenido
# versionado de dist/ tal cual, asi que el build publicado va al repo.
```

30 archivos de `dist/` bajo control de versiones.

## Consecuencias positivas
- **Reversión inmediata y exacta**: `git checkout <commit> -- dist/` recupera el artefacto que estuvo publicado, sin reconstruir. Es la mayor fortaleza operativa del proyecto. Ver [runbook R-12](../operations/runbooks/index.md#r-12).
- Trazabilidad total: cada publicación tiene su commit.
- No hace falta infraestructura de CI para desplegar.
- Se puede auditar qué se publicó exactamente en cualquier fecha.

## Consecuencias negativas
- Cada `yarn build` ensucia el árbol con archivos de hash nuevo y borra los anteriores.
- Conflictos de merge frecuentes en `dist/` cuando trabajan varias personas.
- El repositorio crece con cada publicación.
- Al desarrollar hay que evitar `yarn build` y usar `--outDir` temporal.
- **Nada garantiza que el `dist/` commiteado corresponda al `src/` commiteado.**

## Riesgos

| Riesgo | Severidad | Estado |
| --- | --- | --- |
| **Todo lo que se compila queda publicado y en el historial, incluidos secretos** | 🔴 **Materializado** | Las credenciales de [SEC-01](../security/frontend-security.md#sec-01) están en `dist/assets/LoginPage-*.js` **y en el historial de git**. Corregir el código fuente **no las elimina del historial** |
| `dist/` y `src/` desincronizados | 🟠 Alto | Sin verificación automática |
| Publicación de código que no pasa `yarn quality` | 🟠 Alto | Nada lo impide |

> **Esta decisión, combinada con SEC-01, es la que convierte un descuido de desarrollo en una exposición pública permanente.** Sin `dist/` versionado, las credenciales seguirían siendo un problema, pero limitado al bundle publicado en un momento dado; con él, quedan en el historial del repositorio.

## Evidencia
`.gitignore`, `wrangler.jsonc`, `git ls-files dist | wc -l` → 30, `grep -rl "PabloAdmin2026" dist/`.

## Plan de revisión
Reconsiderar **en cuanto exista CI**. Con un pipeline que construya y publique, la opción B ofrece las mismas ventajas de trazabilidad sin ninguno de los inconvenientes, siempre que el pipeline registre qué commit produjo qué artefacto.

Mientras tanto, la mitigación obligatoria es: **nunca compilar un secreto**, porque su exposición sería permanente.
