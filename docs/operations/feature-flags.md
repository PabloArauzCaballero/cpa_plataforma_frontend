# Feature flags

## Estado: no existen

Sin variables de activación, sin servicio (LaunchDarkly, Unleash, Flagsmith), sin mecanismo propio. Verificado por grep sobre `src/` y `package.json`.

## Consecuencias

| Carencia | Efecto |
| --- | --- |
| Sin despliegue progresivo | Un cambio se publica para **todos a la vez** |
| Sin activación por usuario o rol | No se puede probar con un grupo reducido |
| Sin interruptor de emergencia | Ante un fallo, la única salida es revertir el artefacto ([rollback](rollback.md)) |
| Sin pruebas A/B | — |
| Sin desacoplar despliegue de activación | Publicar es activar |

## La restricción estructural

**El frontend no tiene configuración en tiempo de ejecución.** Todas las variables `VITE_*` se sustituyen literalmente durante el build ([configuration.md](configuration.md)).

Consecuencia: un flag implementado como variable `VITE_*` **exigiría recompilar y republicar para cambiarlo**, es decir, **no sería un flag**: sería exactamente lo mismo que un despliegue.

Cualquier sistema de flags real tendría que **servirse desde el backend** o desde un servicio externo consultado en tiempo de ejecución.

## Lo más parecido que existe hoy

| Mecanismo | Qué hace | ¿Es un flag? |
| --- | --- | --- |
| `hideFromNavigation` en las definiciones de recurso | Oculta un recurso de la barra lateral sin retirarlo. **Sigue accesible por URL** | ❌ Es configuración de datos, y está compilada |
| `composite` | Sustituye el CRUD genérico por una pantalla propia | ❌ Ídem |
| `permissions` + `userHasAnyPermission` | Oculta acciones según permisos del backend | ⚠️ **Se acerca**: los permisos vienen en tiempo de ejecución desde el backend |
| `AUTOSTART_KEY` en `localStorage` | Desactiva el autoarranque de tutoriales | ⚠️ Preferencia de usuario, no flag de despliegue |

**El sistema de permisos es la infraestructura más cercana a un flag** que ya existe y funciona en tiempo de ejecución: llega del backend en el login y el frontend lo consulta antes de mostrar cada acción.

## Propuesta, si se necesitaran

> No implementada. Requiere trabajo conjunto con backend.

### Opción A — Reutilizar la sesión (mínimo coste)

El backend incluye un objeto `features` en la respuesta de login, junto a `roles` y `permisos`. El frontend lo persiste en `cpa.session` y expone un helper análogo a `userHasAnyPermission`:

```ts
// Propuesta
export function isFeatureEnabled(key: string): boolean { … }
```

| Ventaja | Inconveniente |
| --- | --- |
| Reutiliza el mecanismo existente, ya probado en producción | Los flags solo cambian al volver a iniciar sesión |
| Sin dependencias nuevas | Sin segmentación fina |
| Coherente con el modelo actual | — |

### Opción B — Endpoint dedicado

`GET /api/config/features` consultado al arrancar la aplicación.

| Ventaja | Inconveniente |
| --- | --- |
| Los flags cambian sin reautenticar | Una petición más en el arranque |
| Permite segmentación por usuario | Hay que decidir qué pasa si falla |

### Opción C — Servicio externo

Descartada de entrada para este proyecto: añadiría una dependencia externa y un tercero que recibiría datos de uso, en un sistema que hoy **no envía ningún dato fuera**. Ver [../security/privacy.md](../security/privacy.md).

## Recomendación

**No introducir flags ahora.** Con 14 de 15 journeys sin ninguna prueba automatizada, un sistema de flags aumentaría la combinatoria de estados posibles sin que nada verifique ninguno.

Orden razonable:

1. Cubrir con pruebas los módulos de riesgo alto ([../testing/strategy.md](../testing/strategy.md)).
2. Establecer CI.
3. Crear un entorno de preproducción — hoy **no existe**, y es la carencia que los flags intentarían compensar.
4. Solo entonces, evaluar la opción A.

Si lo que se busca es reducir el riesgo de una publicación, la reversión por artefacto ya es rápida y fiable: [rollback.md](rollback.md).
