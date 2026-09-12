# Privacidad y datos personales

## Categorías de datos personales que maneja el frontend

Derivadas de `resourceDefinitions.ts`. El frontend **muestra y captura** estos datos; no los almacena de forma duradera salvo en borradores.

| Categoría | Campos | Recurso | Sensibilidad |
| --- | --- | --- | --- |
| **Menores de edad** | `nombres`, `apellidos`, `fecha_nacimiento`, `telefono`, `email`, `id_unidad_educativa`, `nivel_actual`, `curso_actual`, `turno_actual` | `personas/estudiante` | 🔴 **Máxima** |
| Familiares | `nombres`, `apellidos`, `telefono`, `email`, `fecha_nacimiento`, `es_embajador` | `personas/padre` | 🔴 Alta |
| Personal docente | `nombres`, `apellidos`, `fecha_nacimiento`, `telefono`, `email`, `pago_por_hora`, `nivel_experiencia` | `personas/tutor` | 🔴 Alta (incluye retribución) |
| Cuentas de usuario | `nombres`, `apellidos`, `email`, `nombre_usuario`, **`password`**, `tipo_usuario`, `es_super_usuario` | `personas/usuario` | 🔴 **Máxima** |
| Empleados | `fecha_ingreso`, `fecha_salida`, `tipo_contrato`, `jornada`, `email_corporativo`, `telefono_corporativo` | `administracion/empleado` | 🟠 Alta |
| Retribución | `sueldo_mensual`, `pago_por_hora`, `porcentaje_comision`, `comision_fija` | `administracion/empleado-posicion-pago` | 🔴 Alta |
| Pagos a personal | `haber_basico_pagado`, `comisiones_totales_pagadas`, `aguinaldos_totales_pagados`, `indemnizacion_total_pagada` | `administracion/empleado-registro-pago` | 🔴 Alta |
| Asistencia | `hora_marcacion`, `estado_asistencia`, `observaciones` | `servicios_educativos/asistencia-clase-curso` | 🟠 Media |
| Geolocalización | `latitud`, `longitud` | `unidad-educativa`, `edificio`, `sucursal` | 🟡 Media (de instalaciones, no de personas) |
| Titularidad societaria | `id_persona`, `es_beneficial_owner` | `societario/titular` | 🟠 Alta |

**El frontend trata datos de menores de edad.** Eso eleva el estándar exigible a la protección de esta aplicación.

## Dónde persisten datos personales en el navegador

| Ubicación | Contenido | Duración | Se borra al cerrar sesión |
| --- | --- | --- | --- |
| `cpa.session` → `rawUser` | **Objeto completo del usuario** tal como lo devuelve el backend, sin filtrar | Indefinida | ✅ |
| `cpa.session` → `email`, `nombreCompleto`, `nombreUsuario` | Identidad del usuario | Indefinida | ✅ |
| `cpa.userEmail`, `cpa_user_email` | Correo | Indefinida | ✅ |
| **Borradores** (`localDraftStore`) | El payload del formulario **saneado**: incluye nombres, fechas de nacimiento, teléfonos y correos; **excluye** contraseñas y tokens | **7 días** (TTL) | ❌ **NO** |

### Lo que `localDraftStore` hace bien

Verificado en `src/shared/services/localDraftStore.ts`:

| Protección | Implementación |
| --- | --- |
| **Saneado de campos sensibles** | `sanitizeDraftPayload()` elimina **recursivamente** toda clave que coincida con `/password/i`, `/contrasena/i`, `/contraseña/i`, `/token/i`, `/secret/i`, `/hash/i`, `/session/i` |
| **Caducidad** | `DEFAULT_TTL_MS = 7 días`. Cada borrador guarda `savedAt` y `expiresAt` |
| **Limpieza en lectura** | `readLocalDraft()` borra el borrador si `expiresAt` ya pasó, o si el JSON está corrupto |
| **Versionado** | `DRAFT_VERSION = 1` en cada borrador |
| **Espacio de nombres** | Prefijo `cpa.localDraft:` y clave por recurso + operación (`buildResourceDraftKey`) |

**Es el módulo de almacenamiento mejor diseñado del proyecto en términos de privacidad**, y el único con caducidad automática. La preocupación por contraseñas en borradores queda **descartada**: nunca llegan a `localStorage`.

### El hallazgo de privacidad restante

`clearStoredSession()` (`session.ts:98-100`) borra únicamente las 5 claves de sesión. **Los borradores permanecen.**

Escenario real en un centro educativo con equipos compartidos:

1. Una persona empieza a dar de alta a un estudiante y guarda el borrador.
2. Cierra sesión.
3. Otra persona inicia sesión en el mismo equipo, **dentro de los 7 días siguientes**.
4. Los datos personales del menor (nombres, fecha de nacimiento, teléfono, correo) **siguen en `localStorage`** y son recuperables desde la interfaz de borradores o desde DevTools.

La ventana está acotada por el TTL de 7 días y las contraseñas están excluidas, lo que reduce el alcance. Aun así, el dato de un menor sigue siendo accesible para otro usuario del mismo equipo.

Clasificado **MEDIUM**. Registrado como SEC-14 en [frontend-security.md](frontend-security.md#sec-14).

Corrección propuesta (no ejecutada): que `clearStoredSession()` borre también las claves con prefijo `cpa.localDraft:`.

## Consentimiento y trazabilidad

| Aspecto | Estado |
| --- | --- |
| Banner de cookies | ❌ No aplica: **no se usan cookies** |
| Gestión de consentimiento | ❌ No existe |
| Aviso de privacidad en la aplicación | ❌ No existe |
| Términos de uso | ❌ No existe |
| Analítica de terceros | ✅ **Ninguna**: no se envía nada fuera |
| Píxeles de seguimiento | ✅ Ninguno |
| Registro de acceso a datos | ❌ Ninguno en el frontend |

**Punto fuerte real:** al no haber ninguna analítica, ningún dato personal sale hacia terceros desde el frontend. Los únicos destinos externos son el backend propio y Cloudinary (archivos que el usuario sube deliberadamente).

## Datos en registros y telemetría

| Fuente | Qué registra | Contiene datos personales |
| --- | --- | --- |
| `ErrorBoundary` | `console.error` con el error y el `componentStack` de React | ⚠️ Posible: si el error incluye datos del registro que se estaba renderizando |
| `tutorialAnalytics` | `tutorialId`, `version`, `stepId`, `detail` | ✅ **No** |
| `LocalTutorialProgressStorage` | Aviso de fallo al guardar | ✅ No |
| `catalog/index.ts` | Problemas de validación del catálogo | ✅ No |

Todo permanece en la consola del navegador; **nada se envía a ningún servicio**. Ver [../observability/logging.md](../observability/logging.md).

## Datos en la URL

Las URLs contienen `:module` y `:resource` (identificadores de tabla), **nunca identificadores de persona**. Los ids de registro viajan en el cuerpo de la petición o en la ruta del endpoint, no en la URL del navegador.

Consecuencia positiva: el historial del navegador y el `Referer` no filtran identificadores de personas.

## Archivos subidos

Los archivos van a Cloudinary con **URL pública**. Un comprobante con datos personales queda accesible por su URL a cualquiera que la conozca.

No hay entrega firmada ni control de acceso. Ver [../integrations/file-storage.md](../integrations/file-storage.md) y T-13 en [threat-model.md](threat-model.md).

## Minimización de datos

| Práctica | Estado |
| --- | --- |
| Se piden solo los campos necesarios | ⚠️ Parcial: la tabla muestra hasta 14 columnas del registro completo devuelto por el backend |
| Enmascarado de datos sensibles en la tabla | ❌ Ninguno |
| Campos de contraseña excluidos de filtros | ✅ `shouldShowFilter` excluye `password`, `contrasena`, `hash`, `token` |
| Campos de contraseña excluidos de exportación | ❌ **No verificado**: `exportRecords` exporta las columnas visibles |
| `rawUser` filtrado | ❌ Se persiste íntegro |

## Recomendaciones (no ejecutadas)

| # | Recomendación | Prioridad |
| --- | --- | --- |
| 1 | Verificar si las contraseñas llegan a los borradores y, si es así, excluirlas | **Alta** |
| 2 | Borrar borradores al cerrar sesión | **Alta** |
| 3 | Filtrar `rawUser` a los campos que la interfaz usa | Media |
| 4 | Verificar que la exportación no incluya columnas sensibles | Media |
| 5 | Entrega firmada en Cloudinary para documentos con datos personales | Media |
| 6 | Definir política de retención de borradores (por ejemplo, caducidad a 7 días) | Media |
| 7 | Publicar aviso de privacidad accesible desde la aplicación | Baja (organizativa) |

Todas las de código modifican `src/` y requieren autorización.

## Marco normativo

El proyecto **no declara** un marco de referencia (RGPD, ley boliviana de protección de datos u otro). Sin ese marco no es posible evaluar cumplimiento formal, solo buenas prácticas.

Definirlo es una decisión organizativa, previa a cualquier declaración de conformidad. Registrado como brecha en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).
