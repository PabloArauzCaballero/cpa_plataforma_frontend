# Informe final de documentación del frontend

> Commit auditado: **`618e5c3`** · Fecha de evidencia: **2026-08-04**

## 1. Resumen ejecutivo

Se documentó el frontend de **CPA Plataforma**: una SPA de React 19 que sirve **59 recursos de negocio en 9 módulos** a personal administrativo de un centro educativo, mediante un motor CRUD genérico dirigido por datos.

El trabajo produjo **~130 documentos**, un modelo C4, 12 ADR, 12 runbooks y 6 scripts de validación, **sin modificar un solo archivo ejecutable**.

**Hallazgo principal:** el sistema está bien construido, pero la inversión en verificación no sigue al riesgo. El 76 % de las pruebas cubre el subsistema de tutoriales, mientras que los cinco módulos que sostienen el negocio —el view model de listados, la validación de formularios, la sesión, el cliente HTTP y los mappers— suman **3 casos de prueba**. Sobre eso, una credencial de administrador quedó embebida en el código y publicada.

**Veredicto: NO APTO PARA PRODUCCIÓN**, por un requisito bloqueante corregible en dos líneas.

## 2. Alcance y política de cero regresiones

| Tipo de trabajo | Ejecutado |
| --- | --- |
| `DOCUMENTAL` | ✅ Todo el contenido |
| `INSTRUMENTACIÓN SEGURA` | ✅ 6 scripts de solo lectura |
| `CAMBIO DE PRODUCTO` | ❌ **Ninguno** |

Cero archivos de `src/`, `dist/`, `package.json`, `yarn.lock` o configuración modificados. Cero dependencias añadidas. Evidencia en [regression-validation.md](regression-validation.md).

**Contexto de concurrencia:** había **otros dos agentes trabajando** sobre el repositorio. Sus cambios están registrados y diferenciados; la documentación está anclada a un commit verificable.

## 3. Estado inicial

| Comando | Resultado | Duración |
| --- | --- | --- |
| `yarn install --frozen-lockfile` | ✅ lockfile intacto | 0,42 s |
| `yarn typecheck` | ✅ 0 errores | 5,65 s |
| `yarn test` | ✅ 12 suites / 156 casos | 2,43 s |
| `tsc -b && vite build` | ✅ 173 módulos | ~2 s |
| Lint | ⛔ **No existe linter** | — |
| E2E | ⛔ **No existe** | — |

Detalle en [baseline.md](baseline.md).

## 4. Hallazgos de Graphify

988 nodos · 2 522 aristas · 32 comunidades · 99 % `EXTRACTED`.

| Hallazgo | Detalle |
| --- | --- |
| **17 de 32 comunidades son de tutoriales** | El subsistema más grande del frontend no es el de negocio |
| 7 de los 10 nodos más conectados son de tutoriales | La centralidad del grafo no coincide con la del valor |
| Sin ciclos a nivel de archivo | ✅ |
| 2 ciclos a nivel de feature | `dashboard ↔ tutorials`, `resources ↔ tutorials` |
| 1 huérfano confirmado | `QualityGatePage` |
| `shared/` importa de `features/` | 12 importaciones |

9 verificaciones cruzadas contra el repositorio: **ninguna afirmación del grafo resultó falsa**. Detalle en [graphify-audit.md](graphify-audit.md).

## 5. Inventario de rutas y journeys

| Elemento | Cantidad |
| --- | ---: |
| Rutas registradas | 10 (100 % documentadas) |
| Journeys | 12 (100 % documentados) |
| Módulos | 9 |
| Recursos CRUD | 59 |
| Pantallas sin ruta propia | 2 compuestas + 1 huérfana |
| Componentes compartidos | 11 |
| Servicios HTTP | 16 |
| Endpoints invocados | 131 |

## 6. Arquitectura documentada

SPA CSR pura · react-router-dom 7 · sin store global · sin caché de servidor · CSS Modules · `localStorage` como única persistencia.

11 documentos de arquitectura, modelo C4 en `structurizr/workspace.dsl` y diagramas Mermaid embebidos. 12 ADR registran las decisiones estructurales.

## 7. Componentes y sistema de diseño

11 componentes compartidos catalogados con props, variantes, estados y accesibilidad. 45 tokens en un único `theme.css`.

Carencias: sin tokens semánticos de estado, 9 puntos de ruptura distintos, `Card` infrautilizado, 5 patrones reimplementados por falta de componente compartido.

## 8. Datos, estado y formularios

22 `useState` en el view model principal. Estado de servidor sin caché, sin reintentos, sin cancelación. **Filtros y paginación no viven en la URL.**

`formValidation.ts` implementa 15 reglas genéricas y reglas contables de 7 recursos, **sin ninguna prueba**.

`localDraftStore` es el módulo mejor diseñado del proyecto: saneado recursivo de campos sensibles, TTL de 7 días, recuperación ante corrupción.

## 9. Contratos e integraciones

131 endpoints trazados. Tolerancia deliberada al contrato: cada mapper acepta múltiples formas y cada petición envía el mismo parámetro con varios nombres.

**Riesgo estructural:** una respuesta con forma desconocida se convierte en lista vacía, no en error. Un cambio de contrato del backend puede pasar inadvertido.

6 divergencias registradas (D-01 a D-06). **Sin OpenAPI del backend, el contrato real no es verificable.**

## 10. Accesibilidad

**No cumple WCAG 2.2 AA.** 12 hallazgos: 2 críticos, 4 altos, 5 medios, 1 bajo.

Los dos críticos se concentran en **dos archivos** (`useModalLayer.ts` y `FormField.tsx`) y afectan a los formularios de los 59 recursos. Corregirlos es la intervención de mayor retorno de todo el informe.

Punto fuerte: `LoginForm`, `SearchableSelect`, `ConfirmDialog` e `InfoHint` están notablemente bien resueltos. El patrón correcto **ya existe en el código**; falta generalizarlo.

## 11. Rendimiento

| Métrica | Valor | Presupuesto |
| --- | ---: | --- |
| JS inicial (gzip) | 148 693 B | ≤ 155 000 B ✅ |
| CSS inicial (gzip) | 5 663 B | ≤ 7 000 B ✅ |
| JS total | 865 255 B | ≤ 920 000 B ✅ |
| Chunks JS | 17 | ≤ 20 ✅ |

Sin medición de Core Web Vitals: no hay telemetría. Riesgo identificado: **filtrar descarga hasta 50 000 registros y los procesa en el hilo principal**.

Punto fuerte: **cero fuentes web**, lo que protege el CLS.

## 12. Seguridad y privacidad

**1 BLOCKER, 6 CRITICAL/HIGH, 4 MEDIUM.** Modelo STRIDE con 21 amenazas.

El sistema trata **datos de menores de edad**, lo que eleva el estándar exigible.

Puntos fuertes verificados: sin `dangerouslySetInnerHTML`, sin `eval`, sin cookies (CSRF clásico no aplica), sin source maps en producción, saneado de mensajes de error, y **ningún dato personal sale hacia terceros**.

## 13. Observabilidad y analítica

**Ningún error sale del navegador.** Cinco `console.*` en 23 475 líneas. Cinco `catch` silencian fallos reales presentando estado normal.

Único subsistema instrumentado: tutoriales, con 9 tipos de evento **sin destino remoto**.

## 14. Pruebas y CI/CD

| Área | Casos | % |
| --- | ---: | ---: |
| Tutoriales | 118 | 76 % |
| Núcleo de negocio | 38 | 24 % |

**1 de 12 journeys tiene cobertura.** Ningún componente React se renderiza en ninguna prueba (`testMatch` excluye `.tsx`).

**No hay CI.** Se entrega una plantilla de pipeline en `docs/ci/pipeline-propuesto.yml`, **deliberadamente no activa**.

## 15. Operación y despliegue

Despliegue manual a Cloudflare Workers sirviendo `dist/` versionado. Sin entorno de preproducción.

**Fortaleza:** reversión trivial por artefacto (`git checkout <commit> -- dist/`).
**Contrapartida:** todo lo compilado queda en el historial — por eso SEC-01 es permanente.

12 runbooks disponibles.

## 16. Validación de regresiones

**Cero regresiones atribuibles a este trabajo.** Ver [regression-validation.md](regression-validation.md).

## 17. Métricas finales

| Métrica | Objetivo | Real | |
| --- | ---: | ---: | --- |
| Rutas documentadas | 100 % | 100 % | ✅ |
| Journeys documentados | 100 % | 100 % | ✅ |
| Componentes catalogados | 100 % | 100 % | ✅ |
| Integraciones trazadas | 100 % | 100 % | ✅ |
| Enlaces internos válidos | 100 % | 100 % | ✅ |
| Marcadores TODO/TBD | 0 | 0 | ✅ |
| Runbooks críticos | 100 % | 100 % | ✅ |
| Regresiones nuevas | 0 | 0 | ✅ |
| Flujos críticos con prueba | 100 % | 8 % | 🔴 |
| Críticos de accesibilidad abiertos | 0 | 2 | 🔴 |
| Críticos de seguridad abiertos | 0 | 1 BLOCKER + 6 | 🔴 |

## 18. Evidencias de comandos

```
yarn install --frozen-lockfile   → success Already up-to-date (0,42 s)
yarn typecheck                   → 0 errores (5,65 s)
yarn test                        → 12 suites, 156 casos, 0 fallos (2,43 s)
tsc -b && vite build             → 173 módulos (186 ms)
graphify (AST sobre src/)        → 988 nodos, 2 522 aristas, 32 comunidades
check-doc-links.mjs              → enlaces internos verificados
check-doc-coverage.mjs           → 10/10 rutas, componentes, 0 marcadores
check-api-contract-drift.mjs     → 131 endpoints, todos documentados
check-bundle-budget.mjs          → 7/7 presupuestos dentro de límite
generate-route-inventory.mjs     → 10 rutas, 9 módulos, 59 recursos
generate-component-inventory.mjs → inventario generado
```

## 19. Riesgos residuales

| # | Riesgo | Severidad |
| --- | --- | --- |
| 1 | **Credencial de administrador publicada** | 🔴 BLOCKER |
| 2 | El supuesto de que el backend autoriza **no ha sido verificado** | 🔴 Crítico |
| 3 | Endpoints de importación posiblemente inexistentes | 🔴 Crítico |
| 4 | 14 de 15 journeys sin prueba | 🟠 Alto |
| 5 | Los 5 módulos de negocio sin cobertura | 🟠 Alto |
| 6 | 2 hallazgos críticos de accesibilidad | 🟠 Alto |
| 7 | Ninguna detección de errores en producción | 🟠 Alto |
| 8 | Sin CI: se puede publicar sin verificar | 🟠 Alto |
| 9 | Filtrar tablas grandes puede congelar la pestaña | 🟠 Alto |
| 10 | Sin CSP y con recurso externo sin SRI | 🟡 Medio |
| 11 | Contrato del backend no verificable | 🟡 Medio |
| 12 | Sin entorno de preproducción | 🟡 Medio |

## 20. Declaración de preparación para producción

# 🔴 NO APTO PARA PRODUCCIÓN

**Requisito bloqueante:** SEC-01 — credenciales de administrador embebidas en el código, compiladas al bundle publicado y presentes en el historial de git.

**Acción inmediata, independiente del despliegue:** rotar la contraseña de `pablo.admin` en el backend.

Corregido el bloqueante y verificados los seis puntos críticos de [production-readiness.md](production-readiness.md), el sistema podría declararse apto **con riesgos residuales altos documentados y aceptados formalmente**.

---

### Nota sobre el alcance de este veredicto

Este informe evalúa **el frontend**. No evalúa el backend, cuya corrección se asume en todo el modelo de amenazas y **no ha sido verificada**. Si alguna operación del backend confía en comprobaciones del frontend, varios riesgos calificados como bajos pasarían a críticos.

Verificar ese supuesto con el equipo de backend es **requisito previo** a cualquier declaración de aptitud, incluso después de cerrar SEC-01.
