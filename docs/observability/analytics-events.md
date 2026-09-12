# Catálogo de eventos analíticos

## Estado: no hay analítica de producto

**No existe telemetría de producto.** Verificado: sin Google Analytics, Plausible, Mixpanel, PostHog ni endpoint propio de eventos.

No se registra: inicio de sesión, navegación, uso de recursos, altas, ediciones, inhabilitaciones, exportaciones, importaciones, subidas de archivos, búsquedas, filtros ni errores.

**Consecuencia:** no hay forma de saber qué se usa. Con 59 recursos y 12 journeys, no se puede responder «¿qué pantallas importan?» ni «¿qué se puede retirar?».

## El único subsistema instrumentado: tutoriales

`src/features/tutorials/services/tutorialAnalytics.ts` define un puerto de telemetría con implementación local.

### Catálogo de eventos

| Evento | Disparador | Propósito |
| --- | --- | --- |
| `tutorial-started` | El usuario inicia un tutorial | Adopción |
| `tutorial-completed` | Llega al último paso | Finalización |
| `tutorial-closed` | Cierra el recorrido | Abandono |
| `tutorial-skipped` | Omite el tutorial completo | Rechazo |
| `tutorial-restarted` | Lo reinicia | Reintento |
| `step-skipped` | Omite un paso | Fricción en un paso concreto |
| `action-completed` | Realiza la acción que pedía el paso | Éxito del paso |
| `target-missing` | **El paso apunta a un elemento que no existe** | **Defecto del catálogo** |
| `progress-sync-failed` | **Falla la sincronización del progreso** | **Defecto de integración** |

### Propiedades

```ts
interface TutorialAnalyticsEvent {
  type: TutorialAnalyticsEventType;
  tutorialId: string;
  version: string;
  stepIndex?: number;
  stepId?: string;
  detail?: string;
}
```

| Aspecto | Valor |
| --- | --- |
| Datos personales | ✅ **Ninguno.** No hay identificador de usuario, correo ni sesión |
| Consentimiento requerido | ❌ No aplica: nada sale del navegador |
| Destino | Memoria (últimos 50 eventos) y consola |
| Propietario | Feature de tutoriales |
| Prueba | Indirecta, a través de las 118 pruebas del subsistema |

### Política de registro

```ts
// Los fallos se registran siempre (también en producción): un tutorial que apunta
// a un elemento inexistente es un defecto que hay que poder ver, no silenciar.
if (PROBLEM_EVENTS.has(event.type)) { console.warn(…); return; }
if (options.debug) { console.info(…); }
```

| Evento | En producción |
| --- | --- |
| `target-missing`, `progress-sync-failed` | ✅ `console.warn` **siempre** |
| Los otros 7 | Solo con `debug: true` |

**Es el criterio correcto**, y está bien argumentado en el propio código. El problema es que no se aplica al resto del frontend, donde hay cinco `catch` que silencian fallos reales. Ver [error-reporting.md](error-reporting.md).

### Historial en memoria

`history()` devuelve los últimos 50 eventos. Permite diagnosticar un recorrido roto desde la consola del navegador:

```js
// En la consola, si el adaptador es accesible desde el contexto de tutoriales
```

Es una decisión pragmática y útil para depurar, documentada como tal en el código (`NOOP_TUTORIAL_ANALYTICS` existe además como implementación nula para pruebas).

## Si se quisiera añadir analítica de producto

Decisiones previas, **antes** de escribir código:

| Decisión | Por qué importa aquí |
| --- | --- |
| ¿Qué se mide? | Con 59 recursos, medirlo todo genera ruido. Empezar por: journeys completados, errores por pantalla, uso por recurso |
| ¿Se identifica al usuario? | La aplicación trata datos de menores. Un identificador de usuario en un servicio de terceros es tratamiento de datos personales |
| ¿Qué NO se envía nunca? | Valores de formulario, identificadores de persona, correos, token de sesión |
| ¿Hace falta consentimiento? | Depende del marco normativo, **que el proyecto no declara**. Ver [../security/privacy.md](../security/privacy.md) |
| ¿Dónde vive el destino? | Un servicio externo cruza la frontera de confianza; un endpoint propio, no |

**Punto fuerte a preservar:** hoy **ningún dato personal sale del frontend hacia terceros**. Cualquier propuesta de analítica debe justificar por qué merece la pena perder esa propiedad.

## Propuesta mínima (no ejecutada)

Si se quiere visibilidad con el mínimo compromiso de privacidad:

1. Reutilizar el **puerto** `TutorialAnalyticsAdapter`, que ya está bien diseñado, generalizándolo a la aplicación.
2. Emitir un conjunto reducido de eventos: `journey-completed`, `screen-error`, `resource-viewed`.
3. Enviarlos a un **endpoint propio del backend**, no a un tercero.
4. Sin identificador de usuario: solo rol y pantalla.

Requiere autorización: añade envío de datos donde hoy no lo hay.
