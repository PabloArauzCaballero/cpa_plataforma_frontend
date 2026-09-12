# ADR-0001: React 19 + Vite 8 + TypeScript estricto

## Estado
**Aceptado.**

## Contexto
Panel administrativo interno para el Centro de Preparación Académica: 59 recursos CRUD, uso diario por personal administrativo, sin necesidad de SEO ni de usuarios anónimos.

## Fuerzas y restricciones
- Interfaz densa en formularios y tablas: conviene un ecosistema de componentes maduro.
- Equipo pequeño: la velocidad de iteración importa.
- Sin requisitos de renderizado en servidor.
- Datos de negocio complejos (contabilidad, personas): el tipado estático reduce errores.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. React + Vite** | Ecosistema amplio; arranque y HMR muy rápidos | Hay que ensamblar routing, estado y formularios |
| B. Next.js | Todo integrado; SSR disponible | SSR innecesario; requiere servidor Node en producción |
| C. Vue + Vite | Curva suave | Menor ecosistema en el contexto del equipo |
| D. Angular | Todo integrado y opinado | Peso y ceremonia excesivos para el tamaño del equipo |

## Decisión
**Opción A.** React 19.2.7, Vite 8, TypeScript 6 con `strict: true`, `target: ES2020`, `moduleResolution: Bundler`, `jsx: react-jsx`, alias `@/` → `src/`.

## Consecuencias positivas
- Build de producción en **186 ms** para 173 módulos.
- `strict: true` activo: sin `any` implícitos ni comprobaciones de nulos relajadas.
- Despliegue como archivos estáticos: sin servidor Node en producción.
- `skipLibCheck: true` acelera el type-check sin afectar al código propio.

## Consecuencias negativas
- Hay que elegir e integrar routing, estado, formularios y validación por separado (ver ADR-0006).
- `strict: true` no compensa que el dominio se apoye en `CrudRecord = Record<string, unknown>` (ver ADR-0004): el rigor del compilador se pierde justo donde están los datos de negocio.
- **`tsconfig.json` excluye `src/__tests__` y `*.test.*`**: `yarn typecheck` no verifica las pruebas, que usan `tsconfig.jest.json`.

## Riesgos
| Riesgo | Estado |
| --- | --- |
| El alias `@/` está declarado en tres archivos (`vite.config.ts`, `tsconfig.json`, `jest.config.cjs`) y deben mantenerse sincronizados | 🟡 Real |
| Sin `browserslist` ni `build.target` explícito: la compatibilidad de navegadores no está declarada | 🟡 Real |
| React 19 y Vite 8 son versiones recientes: menor rodaje | 🟢 Bajo |

## Evidencia
`package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.jest.json`, [línea base](../reports/baseline.md) §2 y §3.

## Plan de revisión
Revisar ante una versión mayor de React o Vite, o si aparece un requisito real de SEO o de renderizado en servidor.
