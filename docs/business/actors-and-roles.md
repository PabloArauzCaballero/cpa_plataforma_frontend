# Actores y roles

## Un solo actor en la interfaz

**Personal administrativo del CPA**, autenticado. No hay portal para estudiantes, padres ni tutores: existen como **datos**, no como usuarios.

Verificable: la única ruta pública es `/login`; todo lo demás cuelga de `ProtectedRoute`.

## Roles: qué sabe el frontend

El frontend **no define roles**. Los recibe del backend en la respuesta de login y los normaliza:

```ts
// session.ts — normalizeToken
'Super Admin' → 'SUPER_ADMIN'
```

`StoredUserSession` guarda `roles: string[]`, `permisos: string[]`, `tipoUsuario` y `esSuperUsuario`.

### Tipos de usuario que menciona el propio código

El `helpText` del campo `tipo_usuario` del recurso `usuario` documenta los valores esperados:

> «Rol funcional del usuario (por ejemplo, USUARIO_INTERNO, OPERADOR, ADMIN). Por defecto: USUARIO_INTERNO.»

Y sobre el superusuario:

> «Otorga acceso total. Solo un superusuario puede crear otros superusuarios.»

**Esa última regla la aplica el backend**, no el frontend.

## Perfiles funcionales inferidos

No están declarados en ningún sitio; se deducen de los permisos que exige cada recurso y de las pantallas especializadas.

| Perfil | Pantallas que usa | Permisos característicos |
| --- | --- | --- |
| **Operación general** | Personas, servicios educativos | `PERSONAS.*`, `SERVICIOS_EDUCATIVOS.*` |
| **Contabilidad** | Contabilidad, catálogos operativos, biblioteca de archivos, parte de clases | `CONTABILIDAD.*` |
| **Servicios educativos** | Clases, matrículas, planilla de asistencia | `SERVICIOS_EDUCATIVOS.*` |
| **Administración** | Empleados, posiciones, pagos, KPI | `ADMINISTRACION.*` |
| **Superusuario** | Todo, incluido el módulo de seguridad | `esSuperUsuario: true` |

## Modelo de permisos

### Formato

Cada recurso declara una cadena:

```
"create=PERSONAS.PERSONA_ESTUDIANTE.CREATE"
```

`parsePermissionString` separa por `;` y `,`, y de cada trozo con `=` toma la parte derecha.

### Derivación por acción

`ResourceListPage` deriva los permisos de edición, borrado y exportación **por sustitución de texto** sobre el de creación:

| Acción | Resultado |
| --- | --- |
| crear | `PERSONAS.PERSONA_ESTUDIANTE.CREATE` |
| editar | `PERSONAS.PERSONA_ESTUDIANTE.UPDATE` |
| inhabilitar | `PERSONAS.PERSONA_ESTUDIANTE.DELETE` |

**Presupone que el backend nombra los permisos exactamente con ese patrón.** No está verificado.

### Evaluación: modo permisivo

`userHasAnyPermission` devuelve `true` por cuatro vías:

1. No se requiere ningún permiso.
2. El usuario es superusuario.
3. La lista de permisos requeridos queda vacía tras parsear.
4. **El usuario no tiene ningún permiso cargado.**

La cuarta está comentada en el código:

> «Modo seguro práctico: si el sistema todavía no envía matriz de permisos, el frontend no inventa bloqueos. Cuando sí llegan permisos, se respetan.»

**Consecuencia:** si el backend no devuelve permisos en el login, **todos los botones se muestran a todos**. Es una decisión consciente, pero significa que la interfaz no es una barrera de seguridad.

## Dónde se aplican los permisos

| Lugar | Aplica |
| --- | --- |
| Barra lateral de `AppShell` | ✅ Oculta recursos y módulos completos |
| `ResourceListPage`: crear, editar, inhabilitar, exportar | ✅ |
| `ModuleResourcePickerPage` | ❌ Muestra todos los recursos |
| `ResourceBatchPage` | ❌ |
| `CatalogosOperativosPage` | ❌ |
| `FileLibraryPage` | ❌ |
| `ProtectedRoute` | ❌ Solo comprueba que exista token |

**Inconsistencia real:** un recurso oculto en la barra lateral por falta de permiso **sí aparece** en el tablero del módulo. Registrada como G-32.

## El caso del módulo de seguridad

Los 5 recursos de `seguridad` (`permiso`, `rol`, `rol-permiso`, `usuario-permiso`, `usuario-rol`) declaran `permissions: ""`.

Combinado con la vía 1 de `userHasAnyPermission`, **la administración de roles y permisos nunca se oculta en el frontend**. La única barrera es el backend.

Registrado como D-06 y modelado como T-21 en [../security/threat-model.md](../security/threat-model.md).

## Roles en los tutoriales

Es el único subsistema que usa los roles para algo más que ocultar botones: `tutorialAccess.ts` filtra el catálogo de tutoriales según el rol de la sesión, y existe una categoría `roleTutorials`.

## Resumen para quien opere el sistema

| Pregunta | Respuesta |
| --- | --- |
| ¿Puedo confiar en que el frontend bloquea lo que no me corresponde? | **No.** Oculta botones; no impide peticiones |
| ¿Qué determina realmente lo que puedo hacer? | El backend, en cada petición |
| ¿Por qué veo opciones que no puedo usar? | Probablemente el backend no envió tu matriz de permisos, y el frontend no inventa bloqueos |
| ¿Dónde veo mis permisos? | En `/perfil`, tal como los devuelve `/me` |
