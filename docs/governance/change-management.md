# Gestión de cambios

## Principio

**Un cambio que altera algo documentado debe actualizar su documentación en el mismo pull request.** La documentación se versiona junto al código, no después.

## Disparadores: qué cambio obliga a actualizar qué documento

| Si cambias… | Actualiza |
| --- | --- |
| `src/app/router.tsx` (rutas) | [routes/route-catalog.md](../routes/route-catalog.md), la ficha de la ruta, y **`APP_ROUTE_PATTERNS` en `tutorialRoutes.ts`** |
| `resourceDefinitions.ts` (recursos, campos, permisos, endpoints) | [reports/frontend-inventory.md](../reports/frontend-inventory.md), [integrations/backend-api.md](../integrations/backend-api.md) |
| Props públicas de un componente compartido | [components/catalog.md](../components/catalog.md) |
| `shared/styles/theme.css` | [design-system/tokens.md](../design-system/tokens.md) |
| Un endpoint o un mapper | [integrations/backend-api.md](../integrations/backend-api.md), [architecture/integration-map.md](../architecture/integration-map.md) |
| `shared/auth/session.ts` | [integrations/authentication.md](../integrations/authentication.md), [security/session-and-tokens.md](../security/session-and-tokens.md) |
| Claves de `localStorage` | [data-and-state/persistence.md](../data-and-state/persistence.md), [security/browser-storage.md](../security/browser-storage.md) |
| Variables `VITE_*` | [getting-started/environment-variables.md](../getting-started/environment-variables.md), [operations/configuration.md](../operations/configuration.md) |
| Eventos de telemetría | [observability/analytics-events.md](../observability/analytics-events.md) |
| Dependencias o lockfile | [security/dependencies.md](../security/dependencies.md), y ADR si es de producción |
| Configuración de build o despliegue | [operations/build.md](../operations/build.md), [operations/deployment.md](../operations/deployment.md) |
| Framework, estado, estilos, pruebas, autenticación | **ADR nuevo** — ver [adr/index.md](../adr/index.md) |

## Clasificación obligatoria de todo cambio

| Tipo | Definición | Requiere |
| --- | --- | --- |
| `DOCUMENTAL` | No altera ejecución ni comportamiento | Revisión de contenido |
| `INSTRUMENTACIÓN SEGURA` | Añade validación o generación documental sin afectar al producto | Verificar que es no destructiva |
| `CAMBIO DE PRODUCTO` | Modifica comportamiento, interfaz, contrato, dependencia o arquitectura | **Autorización explícita** + línea base antes/después |

Todo cambio de producto debe seguir la [política de cero regresiones](zero-regression-policy.md).

## Detección de rupturas

| Tipo de ruptura | Cómo se detecta hoy | Propuesta |
| --- | --- | --- |
| Ruta eliminada o renombrada | ⚠️ `scripts/check-doc-coverage.mjs` compara router y catálogo | ✅ Cubierto |
| `APP_ROUTE_PATTERNS` desincronizado | ⚠️ Mismo script | ✅ Cubierto |
| Endpoint nuevo sin documentar | ⚠️ `scripts/check-api-contract-drift.mjs` | ✅ Cubierto |
| Prop pública eliminada | ❌ **Nada lo detecta** | Pruebas de componente |
| Contrato del backend cambiado | ❌ **Nada lo detecta**: los mappers lo absorben | OpenAPI + tipos generados |
| Permiso renombrado | ❌ Nada lo detecta | Pruebas de `session.ts` |
| Regresión de tamaño de bundle | ⚠️ `scripts/check-bundle-budget.mjs` | ✅ Cubierto |
| Enlace documental roto | ⚠️ `scripts/check-doc-links.mjs` | ✅ Cubierto |

## Lista de comprobación para un pull request

```markdown
## Tipo de cambio
- [ ] DOCUMENTAL
- [ ] INSTRUMENTACIÓN SEGURA
- [ ] CAMBIO DE PRODUCTO (requiere autorización explícita)

## Verificación
- [ ] `yarn install --frozen-lockfile` sin modificar el lockfile
- [ ] `yarn quality` en verde (tipos + 156 pruebas + build)
- [ ] `node scripts/check-doc-links.mjs`
- [ ] `node scripts/check-doc-coverage.mjs`
- [ ] `node scripts/check-api-contract-drift.mjs` (si tocas servicios o endpoints)
- [ ] `node scripts/check-bundle-budget.mjs` (si tocas dependencias o carga de módulos)

## Documentación
- [ ] He revisado la tabla de disparadores y actualizado lo que corresponde
- [ ] Si es una decisión estructural, he añadido un ADR
- [ ] No he dejado TODO, TBD ni secciones vacías

## Si es CAMBIO DE PRODUCTO
- [ ] Línea base registrada antes del cambio
- [ ] Misma batería ejecutada después, con resultados comparados
- [ ] Diferencias visuales revisadas y autorizadas
- [ ] Plan de reversión descrito
- [ ] `dist/` reconstruido si va a publicarse
```

## Proceso de revisión

| Aspecto | Estado actual |
| --- | --- |
| Revisión obligatoria por pares | ❌ No hay regla declarada; el historial muestra commits directos a `main` |
| `CODEOWNERS` | ❌ No existe |
| Ramas de trabajo | ✅ Se usan (`pablo/...`) y se integran con merge |
| Protección de rama | ❌ Sin evidencia |
| CI que bloquee | ❌ No hay CI |

**Nada impide hoy publicar código que no pase `yarn quality`.** Es la brecha de gobierno más importante, registrada como G-17.

### Qué revisar con especial atención

Por concentración de riesgo, según esta auditoría:

1. `useResourceListViewModel.ts` — 774 líneas, 22 estados, 0 pruebas, sirve 59 recursos.
2. `shared/validation/formValidation.ts` — reglas contables reales, 0 pruebas.
3. `shared/auth/session.ts` — sesión y permisos, 0 pruebas.
4. `shared/components/FormField.tsx` y `Modal.tsx` — cualquier cambio afecta a los 59 recursos.
5. `resourceDefinitions.ts` — un error aquí rompe una pantalla entera.
6. Cualquier valor literal que parezca una credencial — ver [SEC-01](../security/frontend-security.md#sec-01).

## Estrategia de adopción de nuevas puertas de calidad

Si se incorpora linter, cobertura o CI:

1. **No hacer fallar el build por deuda preexistente.** El proyecto no tiene linter; activarlo en modo estricto bloquearía todo el trabajo.
2. Empezar en modo informe.
3. Aplicar la regla solo a **archivos modificados**.
4. Acordar un plan de reducción de la deuda antes de convertirlo en obligatorio.

El objetivo es **impedir regresiones nuevas**, no castigar el estado heredado.
