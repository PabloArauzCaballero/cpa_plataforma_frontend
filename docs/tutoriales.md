# Motor de tutoriales interactivos

Guía técnica del sistema de tutoriales de CPA Plataforma: cómo está construido, cómo se
crea un tutorial nuevo y cómo se diagnostica cuando algo falla.

- **Código:** [`src/features/tutorials/`](../src/features/tutorials)
- **Pruebas:** [`src/__tests__/tutorials/`](../src/__tests__/tutorials)
- **Pantalla:** `/tutoriales` (Centro de Tutoriales)

---

## 1. Situación de partida y decisiones

La aplicación ya tenía un `src/features/onboarding/` mínimo: un envoltorio de `runTour()`
sobre **driver.js** y arreglos de pasos codificados a mano. Funcionaba para explicar, pero
no tenía progreso, ni filtrado por rol, ni navegación entre rutas, ni validación de
configuración. Ese módulo se **sustituyó** (no se duplicó) por el motor descrito aquí.

| Decisión | Motivo |
|---|---|
| Reutilizar **driver.js 1.8** ya instalado, sólo como capa de pintado | Resuelve bien el recorte del overlay, el posicionamiento del globo y el reposicionamiento ante scroll/resize. No se añade ninguna dependencia nueva. |
| El **núcleo es TypeScript puro** (sin React) | Permite probar el 100 % de la lógica en `jsdom` con ficheros `.test.ts`, sin incorporar `@testing-library` al proyecto. La capa React queda reducida a composición. |
| **Un paso cada vez** con `driver.highlight()` | El control del recorrido (validaciones, rutas, reintentos, confirmación de salida) lo conserva `TutorialEngine`; la librería no decide nada. |
| Objetivos por `data-tutorial-id`, nunca por clase CSS | Un contrato explícito entre UI y catálogo. Una prueba comprueba que ningún tutorial use selectores de clase. |
| Backend como fuente de verdad **con degradación automática** a `localStorage` | La API de progreso todavía no existe; el cliente está listo y el sistema funciona igual mientras tanto. Ver §7. |

### Riesgos detectados y cómo se tratan

| Riesgo | Tratamiento |
|---|---|
| Un objetivo que no existe (permisos, rediseño, carga lenta) bloquearía el recorrido | Espera con `MutationObserver` + error controlado con *Reintentar / Saltar paso / Cerrar*. Los pasos `optional` se saltan en silencio. |
| Un tutorial mal escrito llegaría a producción | `validateTutorialCatalog()` corre en la suite de pruebas (falla la build) y en consola en desarrollo. |
| El progreso de un usuario visible para otro en un equipo compartido | La clave de `localStorage` incluye la identidad de la sesión. |
| Un tutorial usado para saltarse permisos | El acceso sólo decide **qué se ofrece**. Ninguna pantalla cambia sus validaciones. |

---

## 2. Arquitectura

```
src/features/tutorials/
├── domain/                       # Contratos y reglas puras (sin DOM, sin React)
│   ├── TutorialDefinition.ts     # TutorialDefinition, TutorialStep, acciones, accesos
│   ├── TutorialProgress.ts       # Estados, política de versiones, cálculo de avance
│   ├── tutorialAccess.ts         # Filtrado por rol/permiso (TutorialViewer)
│   ├── tutorialAnchors.ts        # Catálogo de anclas `data-tutorial-id`
│   ├── tutorialRoutes.ts         # Rutas reales de la app + validación
│   └── tutorialValidation.ts     # Validador del catálogo
├── registry/
│   └── TutorialRegistry.ts       # Índice: alta, búsqueda, filtrado, contextual
├── engine/                       # Ejecución
│   ├── TutorialEngine.ts         # Máquina de estados del recorrido
│   ├── TutorialRenderer.ts       # Puerto de presentación
│   ├── DriverTutorialRenderer.ts # Adaptador driver.js
│   ├── targetResolver.ts         # Localización de elementos (incl. asíncronos)
│   └── stepActionWatcher.ts      # Observación de la acción exigida al usuario
├── services/                     # Persistencia y telemetría
│   ├── TutorialProgressService.ts
│   ├── LocalTutorialProgressStorage.ts     # Puerto + adaptador local
│   ├── ResilientTutorialProgressStorage.ts # Estrategia backend + respaldo
│   ├── tutorialProgressStorage.ts          # Raíz de composición
│   ├── tutorialProgressApi.ts              # Contrato HTTP
│   ├── tutorialPreferences.ts
│   └── tutorialAnalytics.ts
├── react/                        # Sólo composición
│   ├── TutorialProvider.tsx      # Cablea motor + persistencia + react-router
│   ├── TutorialContext.ts        # useTutorials()
│   ├── TutorialLauncher.tsx      # Botón de ayuda contextual
│   └── TutorialCard.tsx
├── catalog/                      # Contenido (aquí se añaden tutoriales)
│   ├── platformTutorials.ts
│   ├── operationTutorials.ts
│   ├── moduleTutorials.ts
│   ├── roleTutorials.ts
│   └── index.ts
├── pages/TutorialCenterPage.tsx  # Pestaña "Tutoriales"
└── styles/tutorialOverlay.css    # Tema del globo (variables de theme.css)
```

**Regla de dependencias:** `domain` no importa nada de `engine`, `react` ni `services`.
`engine` no importa `react`. `catalog` sólo importa `domain`. La única pieza que conoce
React y react-router es `TutorialProvider`.

---

## 3. Flujo de ejecución

```
Usuario pulsa "Comenzar"
        │
        ▼
TutorialProvider.start(id)
        │  registry.resolve(id, viewer)   ← filtra pasos por rol y renumera
        │  progressService.markStarted()  ← estado "en_progreso"
        ▼
TutorialEngine.start(tutorial, índice)
        │
        ├─ ¿el paso vive en otra ruta?  → navigate(step.route)
        ├─ ¿tiene objetivo?             → waitForTarget()  (MutationObserver + límite)
        │       ├─ encontrado           → autoAction (reveal / focus / scroll)
        │       ├─ ausente y `optional` → salta al siguiente en silencio
        │       └─ ausente              → estado `target-missing` (reintentar / saltar / cerrar)
        ├─ ¿exige una acción?           → watchStepAction() en fase de captura
        ▼
renderer.render(view, handlers)   ← driver.js pinta overlay + globo
        │
        ├─ Siguiente / Anterior / Saltar / Omitir / Cerrar / Escape / ← →
        └─ acción cumplida por el usuario → avance automático
        ▼
Al terminar: onFinish → progressService.markFinished() → foco restaurado
```

Puntos que conviene conocer:

- **Cancelación:** cada `goToStep` incrementa un *token*; una resolución asíncrona que
  llega tarde se descarta. Evita que un objetivo lento pinte encima del paso siguiente.
- **Escape y teclado** los gobierna el motor (`allowClose: false`, `allowKeyboardControl: false`
  en driver.js) para poder pedir confirmación antes de abandonar.
- **`Enter` y las flechas** se ignoran cuando el foco está en un `input`, `textarea`,
  `select` o contenido editable: en un paso que pide escribir, la tecla es del campo.

---

## 4. Estructura de un tutorial

```ts
interface TutorialDefinition {
  id: string;                    // único en todo el catálogo
  version: string;               // mayor.menor.parche — ver §7
  title: string;
  description: string;
  category: 'introduccion' | 'navegacion' | 'cuenta' | 'modulo' | 'operacion' | 'rol';
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  route?: string;                // ruta donde arranca
  moduleKey?: string;            // clave de `resourceModules`
  access?: TutorialAccess;       // roles / permisos
  estimatedMinutes: number;
  mandatory?: boolean;
  recommended?: boolean;
  prerequisites?: string[];      // ids de otros tutoriales
  nextTutorialId?: string;       // encadenado
  tags?: string[];
  steps: TutorialStep[];
}

interface TutorialStep {
  id: string;
  order: number;                 // 1..n, sin repetir
  title: string;
  description: string;
  target?: string;               // anchorTarget(TUTORIAL_ANCHORS.x) — nunca una clase CSS
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  align?: 'start' | 'center' | 'end';
  route?: string;                // si no coincide con la actual, el motor navega
  expectedAction?: TutorialExpectedAction;
  hint?: string;                 // ayuda mientras la acción está pendiente
  autoAction?: 'reveal' | 'focus' | 'scroll';
  waitForTargetMs?: number;      // por defecto 6000
  optional?: boolean;            // si falta el objetivo, se salta en silencio
  allowInteraction?: boolean;    // por defecto true si hay acción esperada
  access?: TutorialAccess;
}
```

### Ejemplo completo y funcional

```ts
import type { TutorialDefinition } from '@/features/tutorials/domain/TutorialDefinition';
import { TUTORIAL_ANCHORS, anchorTarget } from '@/features/tutorials/domain/tutorialAnchors';

export const registrarDeudaTutorial: TutorialDefinition = {
  id: 'registrar-deuda',
  version: '1.0.0',
  title: 'Registrar una deuda',
  description: 'Cómo dejar registrado un compromiso de pago y su saldo pendiente.',
  category: 'operacion',
  difficulty: 'basico',
  route: '/modulos/deuda/deuda',
  moduleKey: 'deuda',
  estimatedMinutes: 3,
  recommended: true,
  prerequisites: ['navegacion-principal'],
  nextTutorialId: 'modulo-deuda',
  access: { roles: ['COBRANZA'], permissions: ['DEUDA.DEUDA.CREATE'] }, // basta con una
  tags: ['deuda', 'cobranza'],
  steps: [
    {
      id: 'contexto',
      order: 1,
      title: 'La tabla de Deuda',
      description: 'Aquí viven los compromisos de pago con su saldo pendiente.',
      target: anchorTarget(TUTORIAL_ANCHORS.resourceHeader),
      placement: 'bottom',
      route: '/modulos/deuda/deuda',
    },
    {
      id: 'crear',
      order: 2,
      title: 'Abre el formulario',
      description: 'Pulsa "Crear registro". Todavía no se guarda nada.',
      target: anchorTarget(TUTORIAL_ANCHORS.resourceCreate),
      placement: 'left',
      expectedAction: { type: 'click' },      // no avanza hasta que el usuario pulsa
      hint: 'Pulsa "Crear registro" para continuar.',
      optional: true,                          // por si el usuario no tiene permiso de alta
    },
    {
      id: 'guardar',
      order: 3,
      title: 'Guarda cuando esté listo',
      description: 'Revisa los importes antes de guardar. El tutorial no guarda por ti.',
      target: anchorTarget(TUTORIAL_ANCHORS.resourceFormSubmit),
      placement: 'top',
      waitForTargetMs: 8000,                   // el modal tarda en montarse
      optional: true,
    },
  ],
};
```

---

## 5. Cómo se hacen las cosas

### Crear un tutorial nuevo

1. Escribe la definición en el archivo del catálogo que le corresponda
   (`platformTutorials`, `operationTutorials`, `moduleTutorials`, `roleTutorials`), o crea
   uno nuevo.
2. Si creaste un archivo, añádelo al *spread* de `catalog/index.ts`.
3. `yarn test` — el validador comprueba ids, órdenes, rutas, prerrequisitos y anclas.

**No hay que tocar el motor.** Ese es el criterio de aceptación del diseño.

### Asociar un elemento de la interfaz

1. Declara el ancla en `domain/tutorialAnchors.ts`:
   ```ts
   export const TUTORIAL_ANCHORS = { /* ... */ misBotones: 'mi-boton' } as const;
   ```
2. Aplícala en el componente:
   ```tsx
   <button {...tutorialAnchor(TUTORIAL_ANCHORS.misBotones)}>Acción</button>
   ```
3. Apúntala desde el paso: `target: anchorTarget(TUTORIAL_ANCHORS.misBotones)`.

Para elementos repetidos (tarjetas, filas, módulos) usa la variante con clave:

```tsx
<article {...tutorialAnchorFor(TUTORIAL_ANCHORS.moduleResourceCard, resource.key)}>
// y en el paso:
target: anchorTargetFor(TUTORIAL_ANCHORS.moduleResourceCard, 'estudiante')
```

### Validar una acción del usuario

| `expectedAction` | Se cumple cuando |
|---|---|
| `{ type: 'click', target? }` | El usuario hace clic en el objetivo (por defecto, el del paso). |
| `{ type: 'input', target?, minLength? }` | Escribe al menos `minLength` caracteres (1 por defecto). |
| `{ type: 'change', target? }` | Cambia el valor de un `select`, `checkbox` o `radio`. |
| `{ type: 'navigate', route }` | Llega a esa ruta por su propio pie. |
| `{ type: 'appear', target }` | Aparece un elemento (típico tras una petición al backend). |

Mientras esté pendiente, *Siguiente* queda deshabilitado y se muestra `hint`. **Siempre**
queda disponible *Saltar paso*: el usuario nunca se queda encerrado.

La observación es pasiva (escucha en fase de captura y no cancela nada), así que la
aplicación se comporta igual con el tutorial abierto que sin él. El motor **no** ejecuta
envíos de formulario, borrados, pagos ni ninguna operación sensible: `autoAction` se
limita a desplegar (`reveal`), enfocar (`focus`) y hacer scroll (`scroll`).

### Rutas y modales

- **Rutas:** pon `route` en el paso. Si la ruta actual no coincide, el motor navega antes
  de buscar el objetivo. Sólo se aceptan rutas que existen de verdad (`tutorialRoutes.ts`
  valida además que el módulo y el recurso existan en el catálogo CRUD).
- **Modales:** apunta al elemento dentro del modal y sube `waitForTargetMs`. El
  `MutationObserver` lo detecta en cuanto se monta; no hace falta ningún temporizador.
  Ejemplo: `[data-tutorial-id="modal"] [data-tutorial-id="resource-form-submit"]`.
- **Menús desplegables:** usa `autoAction: 'reveal'`, que abre los `<details>` contenedores.

### Restringir por rol

```ts
access: {
  roles: ['CONTADOR'],                            // roles de la sesión (normalizados)
  permissions: ['CONTABILIDAD.CUENTA.CREATE'],    // tokens reales de resource.permissions
  match: 'any',                                   // 'any' (por defecto) | 'all'
  superUserOnly: false,
}
```

- `match: 'any'` (por defecto): basta con cumplir roles **o** permisos. Es lo correcto
  cuando ambos identifican al mismo perfil y el backend puede enviar sólo uno de los dos.
- `match: 'all'`: hay que cumplir los dos.
- Un super usuario ve todo. `superUserOnly: true` restringe sólo a super usuarios.
- El mismo bloque funciona a nivel de **paso**: los pasos ocultos se eliminan y el
  indicador de progreso se renumera, de modo que el usuario ve “Paso 1 de 2” y no huecos.
- Un tutorial cuyos pasos quedan todos filtrados no aparece en el listado.

---

## 6. Persistencia

`TutorialProgressService` mantiene el mapa de avance y lo escribe mediante el puerto
`TutorialProgressStorage`. Se registra por tutorial:

| Campo | Significado |
|---|---|
| `status` | `pendiente` · `en_progreso` · `completado` · `omitido` |
| `version` | Versión con la que se generó el avance |
| `currentStepId` / `currentStepIndex` | Dónde quedó (el id manda: sobrevive a reordenaciones) |
| `startedAt` / `completedAt` / `lastInteractionAt` | Fechas ISO-8601 |
| `repetitions` | Veces completado |

### Estrategia efectiva

`ResilientTutorialProgressStorage` compone backend + local:

- `load()` → intenta el backend; si responde, **espeja** en local y devuelve eso. Si falla,
  devuelve lo local y marca el backend como no disponible para el resto de la sesión.
- `save()` → escribe **siempre** en local primero (respuesta inmediata, tolerante a
  desconexión) y después sincroniza. Un fallo de red nunca pierde el avance.

La clave local incluye el correo de la sesión, para que en un equipo compartido el avance
de una persona no aparezca a la siguiente.

### Versionado

`requiresRetakeAfterVersionChange(anterior, actual)`:

- Cambia **mayor** o **menor** → el contenido cambió de forma sustantiva: el tutorial
  vuelve a `pendiente` y la tarjeta muestra *“se actualizó desde que lo completaste”*.
- Cambia sólo el **parche** (correcciones de redacción) → conserva el “completado”.

Al editar un tutorial existente: sube el parche si sólo corriges texto; sube la menor si
añades, quitas o reordenas pasos.

---

## 7. Contrato con el backend

> **Estado real:** la API de CPA **todavía no expone** estos servicios. El cliente está
> implementado y tipado en `services/tutorialProgressApi.ts`, y el sistema detecta en
> caliente su ausencia (404 / 405 / 501 o red caída) y degrada a almacenamiento local sin
> romper nada ni reintentar en bucle. Cuando el backend publique estas rutas, la
> persistencia pasa a ser remota **sin cambios en el frontend**.

Todos los servicios se autentican con la cabecera `X-Session-Token` que ya usa
`httpClient`. El backend **deduce el usuario del token** y nunca acepta un identificador
de usuario por parámetro: así ningún usuario puede leer ni modificar el progreso de otro.

| Método | Ruta | Cuerpo | Respuesta | Idempotente |
|---|---|---|---|---|
| `GET` | `/api/onboarding/tutoriales/progreso` | — | `{ data: TutorialProgressDto[] }` | sí |
| `PUT` | `/api/onboarding/tutoriales/progreso/:tutorialId` | `TutorialProgressDto` | `{ data: TutorialProgressDto }` | sí (upsert) |
| `DELETE` | `/api/onboarding/tutoriales/progreso/:tutorialId` | — | `204` | sí |
| `DELETE` | `/api/onboarding/tutoriales/progreso` | — | `204` | sí |

```ts
interface TutorialProgressDto {
  tutorial_id: string;
  version: string;
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'omitido';
  paso_actual_id?: string | null;
  paso_actual_indice?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  fecha_ultima_interaccion?: string | null;
  repeticiones?: number | null;
}
```

**Validación esperada en el servidor:** `tutorial_id` y `version` no vacíos, `estado`
dentro del enum, `paso_actual_indice` y `repeticiones` enteros ≥ 0, fechas ISO-8601. Un
`estado` desconocido debe rechazarse con `400`.

**El listado de tutoriales no se pide al backend**: el catálogo es contenido versionado
con el frontend, de modo que texto y anclas viajan siempre sincronizados con la interfaz
que describen.

---

## 8. Accesibilidad

- Globo con `role="dialog"`, `aria-live="polite"`, `aria-labelledby` y `aria-describedby`.
- Progreso con `role="progressbar"` y `aria-valuenow` / `aria-valuemax` / `aria-valuetext`.
- Teclado: `←` / `→` navegan, `Enter` avanza, `Escape` cierra (con confirmación si el
  recorrido está a medias). Las teclas se ceden a los campos cuando el foco está en uno.
- El foco entra en el globo al mostrarse y **vuelve al elemento de origen** al terminar.
- El estado nunca se comunica sólo con color: icono + texto en las etiquetas de estado y
  en los avisos (`⚠` / `ⓘ`), y borde lateral en las tarjetas.
- `prefers-reduced-motion` desactiva animaciones, el scroll suave y el desvanecido.
- El overlay no bloquea el elemento activo cuando el paso exige interactuar con él.

---

## 9. Pruebas

```bash
yarn test                          # toda la suite
yarn jest src/__tests__/tutorials  # sólo tutoriales
yarn typecheck                     # tipos
yarn quality                       # typecheck + test + build
```

| Archivo | Cubre |
|---|---|
| `tutorialEngine.test.ts` | Inicio, avance/retroceso, reanudación, cierre con y sin confirmación, omitir, objetivos asíncronos, objetivos dentro de modales, objetivos inexistentes, pasos opcionales, navegación entre rutas, acciones exigidas, teclado y restauración del foco. |
| `tutorialRegistry.test.ts` | Alta, prevención de duplicados, orden de pasos, filtrado por rol y permiso, tutorial contextual, búsqueda sin acentos. |
| `tutorialValidation.test.ts` | Ids duplicados, tutoriales vacíos, versiones inválidas, órdenes repetidos, rutas inexistentes, acciones sin objetivo, prerrequisitos rotos y circulares, incompatibilidad de roles. |
| `tutorialProgress.test.ts` | Política de versiones, cálculo de avance, prerrequisitos, servicio de progreso, adaptador local. |
| `tutorialCatalog.test.ts` | El catálogo **real** contra la aplicación real: rutas y recursos existentes, anclas declaradas, cobertura por módulo y por rol, ausencia de selectores CSS. |
| `tutorialRenderer.test.ts` | Contrato accesible del globo y cableado de los controles (driver.js real). |
| `targetResolver.test.ts` | Espera con `MutationObserver`, límite de espera, cancelación, selectores inválidos, elementos ocultos, `reveal`. |
| `tutorialFlow.integration.test.ts` | Motor + registro + persistencia juntos: reanudación, recorrido recortado por rol, repeticiones, cambio de versión y degradación del almacenamiento. |

Ninguna prueba depende de esperas arbitrarias: se usan condiciones explícitas
(`MutationObserver`, promesas) y, donde hace falta comprobar un vencimiento, temporizadores
falsos de Jest.

> Nota: `jest.config.cjs` recoge sólo `**/__tests__/**/*.test.ts`. El núcleo está escrito
> sin React precisamente para poder probarlo entero bajo esa configuración.

---

## 10. Diagnóstico

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| “No encontramos este elemento…” | El ancla no está en la pantalla, o el usuario no tiene permiso para verla | Comprueba en el inspector que exista `[data-tutorial-id="…"]`. Si depende del rol, marca el paso `optional: true`. |
| El paso aparece antes de que cargue la tabla | `waitForTargetMs` corto | Sube el valor (por defecto 6000 ms). |
| El botón *Siguiente* está deshabilitado | Hay una `expectedAction` sin cumplir | Es intencional. El texto de ayuda dice qué falta; *Saltar paso* siempre está disponible. |
| El tutorial no aparece en el Centro | Filtrado por `access`, o todos sus pasos lo están | Revisa roles/permisos de la sesión en `/perfil`. |
| Un tutorial completado vuelve a “pendiente” | Subió su versión mayor o menor | Es la política de versionado (§6). |
| El progreso no se conserva entre dispositivos | El backend de progreso aún no existe | Esperado hoy. El Centro lo indica en “Preferencias de aprendizaje”. |
| La configuración parece rota | Un tutorial no valida | `yarn test` da el mensaje exacto; en desarrollo también sale por consola al cargar. |

Los eventos de telemetría (`services/tutorialAnalytics.ts`) guardan los últimos 50 sucesos
en memoria; los fallos (`target-missing`, `progress-sync-failed`) se registran en consola
**también en producción**: un tutorial que apunta a un elemento inexistente es un defecto
que hay que poder ver, no silenciar.

---

## 11. Limitaciones conocidas

1. **La persistencia remota está pendiente del backend.** Contrato y cliente listos;
   mientras tanto el progreso es por dispositivo. Es la única funcionalidad que depende de
   trabajo externo a este repositorio.
2. **No hay pruebas end-to-end de navegador.** El proyecto no tiene ningún *runner* E2E
   (Playwright/Cypress) y añadir uno excedía el alcance de este trabajo. La cobertura
   equivalente se logró en `jsdom` con el renderizador real de driver.js y con la prueba de
   integración del recorrido; lo que no se cubre así es el posicionamiento visual real del
   globo, que es responsabilidad de driver.js.
3. **Sin pruebas de componentes React.** `jest.config.cjs` sólo recoge `*.test.ts` y el
   proyecto no incluye `@testing-library`. Se compensó dejando la capa React reducida a
   composición: toda la lógica comprobable vive fuera de los componentes.
4. **Tema oscuro.** La aplicación no tiene alternador de tema; el globo respeta
   `prefers-color-scheme` del sistema, pero no hay un modo oscuro propio que seguir.
5. **Los tutoriales por rol se apoyan en nombres de rol convencionales**
   (`CONTADOR`, `ADMINISTRATIVO`, `SEGURIDAD`…) además de en permisos reales, porque el
   backend no publica un catálogo de roles. Si se estandarizan, basta con ajustar `access`.
6. **El progreso local no se migra al backend** cuando éste aparezca por primera vez: el
   `load()` remoto tiene prioridad y sobrescribe el espejo. Si esa migración se considera
   necesaria, es un cambio acotado a `ResilientTutorialProgressStorage.load()`.
