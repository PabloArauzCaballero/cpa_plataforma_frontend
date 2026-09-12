# Política de cero regresiones

## Alcance

Aplica a **todo cambio en archivos ejecutables**: `src/`, `dist/`, `package.json`, `yarn.lock`, `tsconfig*`, `vite.config.ts`, `jest.config.cjs`, `Dockerfile`, `docker/`, `wrangler.jsonc`.

**No aplica** a cambios exclusivamente documentales bajo `docs/`, `structurizr/` y `scripts/` de validación no destructivos.

## Antes de modificar

1. **Registrar el estado de Git**: `git status --porcelain`, `git log --oneline -1`. Identificar cambios preexistentes que **no son tuyos** — en este repositorio pueden trabajar varias personas o agentes a la vez.
2. **Enumerar los archivos exactos** que se pretende tocar.
3. **Instalación reproducible**: `yarn install --frozen-lockfile`. Verificar que el lockfile no cambia.
4. **Ejecutar la batería completa** y anotar los resultados:

```bash
yarn typecheck                                                  # esperado: 0 errores
yarn test                                                       # esperado: 12 suites, 156 pruebas
npx tsc -b && npx vite build --outDir /tmp/base --emptyOutDir   # esperado: 173 módulos
```

5. **Registrar el tamaño del bundle**: `node scripts/check-bundle-budget.mjs`.
6. **Anotar rutas y flujos críticos que funcionan** antes del cambio.
7. **Definir cómo revertir exclusivamente tu cambio.**

> **Nota sobre el build:** dirígelo a un `outDir` temporal. `dist/` está versionado y sobrescribirlo ensucia el árbol y puede colisionar con el trabajo de otras personas.

## Después de modificar

1. **Repetir la misma batería, en el mismo orden.**
2. **Comparar contra la línea base:**

| Métrica | Referencia (`618e5c3`) | Criterio |
| --- | --- | --- |
| Errores de tipos | 0 | Debe seguir en 0 |
| Suites / pruebas | 12 / 156 | **Igual o más**, nunca menos |
| Pruebas fallidas | 0 | Debe seguir en 0 |
| Build | correcto, 173 módulos | Debe compilar |
| JS inicial (gzip) | 148 469 B | ≤ 155 000 B |
| CSS inicial (gzip) | 5 670 B | ≤ 7 000 B |

3. **Ejecutar pruebas de regresión sobre los flujos afectados** (manualmente, si no hay E2E).
4. **Revisar diferencias visuales**, intencionadas y no intencionadas. No hay regresión visual automatizada: la revisión es manual.
5. **Verificar el contrato** si se tocaron servicios: `node scripts/check-api-contract-drift.mjs`.
6. **Si aparece una regresión:** detener la expansión del cambio, aislar la causa y **restaurar únicamente lo propio**.

## Prohibiciones

| Prohibido | Motivo |
| --- | --- |
| Declarar «sin impacto» sin evidencia comparable antes/después | La afirmación no es verificable |
| Reescribir una prueba para que pase | Oculta el defecto en lugar de corregirlo |
| Actualizar snapshots en bloque sin inspección | Ídem (hoy no hay snapshots) |
| Modificar el lockfile sin necesidad demostrada | Rompe la reproducibilidad |
| Cambiar rutas, contratos, permisos, estilos o nombres públicos «para que coincidan con la documentación» | La documentación describe el producto, no al revés |
| Sobrescribir cambios preexistentes de otras personas | — |
| Publicar sin haber pasado `yarn quality` | Nada lo impide técnicamente; es una regla de proceso |

## Cuando la documentación y el código difieren

**Describir primero el comportamiento real y registrar la brecha.** Nunca «corregir» el producto en silencio para que encaje con lo documentado.

Ejemplos reales de esta auditoría, tratados así:

| Discrepancia | Cómo se trató |
| --- | --- |
| `/api/infraestructura/aula` no corresponde a ningún recurso | Documentado como drift D-02; **no se tocó el código** |
| Los endpoints de batch no están declarados | Documentado como D-01; pendiente de verificar con backend |
| `ResourceListContent` llama a un hook tras dos `return` | Documentado como G-09, con la dependencia oculta explicada; **no se reordenó** |
| Credenciales embebidas | Documentado como SEC-01 con propuesta completa; **no se modificó** |

## Evidencia de cero regresiones de este trabajo documental

| Comprobación | Resultado |
| --- | --- |
| Archivos de `src/` modificados | **0** |
| Archivos de `dist/` modificados | **0** (el build se dirigió a `/tmp`) |
| `package.json` / `yarn.lock` modificados | **0** |
| Configuración de build o pruebas modificada | **0** |
| Comandos `git commit` / `stash` / `checkout` ejecutados | **0** |

Detalle y comprobación final en [../reports/regression-validation.md](../reports/regression-validation.md).

## Reversión del trabajo documental

Todos los artefactos producidos son **archivos nuevos** en rutas conocidas. Procedimiento completo en [../reports/baseline.md](../reports/baseline.md) §8.
