# ADR-0003: Renderizado 100 % en cliente (SPA)

## Estado
**Aceptado.**

## Contexto
Toda la aplicación se sirve como archivos estáticos y se renderiza en el navegador. `index.html` entrega un `<div id="root">` vacío.

## Fuerzas y restricciones
- Audiencia: personal interno **tras autenticación**. No hay usuarios anónimos ni contenido indexable.
- Se despliega en Cloudflare Workers como assets estáticos: **no hay proceso Node en producción**.
- El backend es un servicio aparte con su propio ciclo de vida.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. CSR puro** | Sin servidor; despliegue trivial; reversión por artefacto | Pantalla vacía hasta ejecutar el JS |
| B. SSR (Next.js/Remix) | Primera pintura más rápida; SEO | Requiere servidor Node; complejidad operativa injustificada sin SEO |
| C. SSG | HTML pregenerado | El contenido es dinámico y depende de permisos: no prerenderizable |

## Decisión
**Opción A.** `ReactDOM.createRoot(...).render(<App />)` en `main.tsx`, con `React.StrictMode`.

## Consecuencias positivas
- Despliegue como archivos estáticos: **reversión trivial** con `git checkout -- dist/`.
- Sin superficie de servidor que asegurar ni escalar.
- El frontend y el backend evolucionan por separado.
- Sin errores de hidratación: esa clase de fallo **no puede ocurrir**.

## Consecuencias negativas
- **148 KiB gzip antes de ver nada.** El chunk inicial incluye React, el router, FontAwesome, `driver.js` y todo el subsistema de tutoriales.
- La aplicación **no funciona sin JavaScript**, y `index.html` no ofrece `<noscript>`.
- LCP previsiblemente mediocre (no medido, ver [../performance/budgets.md](../performance/budgets.md)).
- Toda URL profunda exige reescritura a `index.html` en el servidor.

## Riesgos
| Riesgo | Estado |
| --- | --- |
| Si falla la reescritura de SPA, las recargas devuelven 404 | 🟡 Cubierto en `nginx.conf`; ver [runbook R-02](../operations/runbooks/index.md#r-02) |
| El chunk inicial crece sin control | 🟠 Ya está alto; presupuesto definido |
| `StrictMode` duplica los efectos en desarrollo: cada listado hace dos peticiones | 🟢 Solo en desarrollo, esperado |

## Evidencia
`src/main.tsx`, `index.html`, `wrangler.jsonc`, `docker/nginx.conf`, [análisis de bundle](../performance/bundle-analysis.md).

## Plan de revisión
Revisar si aparece un requisito de acceso público indexable, o si el LCP medido resulta inaceptable y la división de código no basta.
