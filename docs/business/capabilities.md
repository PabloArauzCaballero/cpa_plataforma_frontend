# Capacidades del producto

Lo que el usuario **puede hacer realmente hoy**, verificado en el código. No incluye nada planificado.

## Capacidades transversales (los 59 recursos)

| Capacidad | Estado | Dónde |
| --- | --- | --- |
| Listar registros con paginación | ✅ | `ResourceListPage` |
| Elegir 10/20/50/100 filas por página | ✅ | Selector de paginación |
| Buscar por texto en cualquier campo | ✅ | Debounce de 900 ms |
| Filtrar por columna | ✅ | Filtros dinámicos, debounce de 800 ms |
| Filtrar por estado (Activo/Inactivo/Eliminado) | ✅ | Filtro añadido automáticamente |
| Crear un registro | ✅ | Modal con formulario generado |
| Editar un registro | ✅ | Ídem |
| Inhabilitar (borrado lógico) | ✅ | Con confirmación que identifica el registro |
| **Borrar físicamente** | ❌ | **No existe en ninguna parte** |
| Exportar con filtros | ✅ | `ResourceExportModal` |
| Consultar ayuda operativa de la tabla | ✅ | `HelpGuideModal` |
| Guardar un borrador del formulario | ✅ | Local (7 días) y remoto |
| Importar desde archivo | ⚠️ | Pantalla existe; **endpoints no verificados** |
| Ordenar pulsando la cabecera | ❌ | El view model lo soporta; **la tabla no ofrece el control** |
| Selección múltiple de filas | ❌ | — |
| Acciones en lote sobre la selección | ❌ | — |
| Ver el detalle en página propia | ❌ | Todo ocurre en modales |
| Historial de cambios de un registro | ❌ | — |
| Deshacer una operación | ❌ | — |

## Capacidades de formulario

| Capacidad | Estado |
| --- | --- |
| Campos condicionales (`visibleWhen`) | ✅ |
| Obligatoriedad condicional (`requiredWhen`) | ✅ |
| Opciones dependientes de otro campo | ✅ `conditionalOptions` |
| Campos mutuamente excluyentes | ✅ `exclusiveGroup` |
| Selector con búsqueda para listas largas | ✅ Automático con más de 12 opciones |
| Búsqueda sin acentos y por términos en cualquier orden | ✅ Probado (7 casos) |
| Alta rápida de una opción desde el selector | ✅ `quickCreate` en `SearchableSelect` |
| Botón «Ahora» para fecha y hora | ✅ En hora local, no UTC |
| Ayuda contextual por campo | ✅ `InfoHint` |
| Campos de solo lectura | ✅ Se muestran, no se envían |
| Validación de reglas contables | ✅ 7 recursos con reglas propias |
| Subida de archivos desde el formulario | ✅ `CloudinaryUploadField` |
| Autoguardado | ❌ El borrador es manual |
| Validación mientras se escribe | ❌ Solo al enviar |

## Capacidades por pantalla especializada

| Pantalla | Capacidad |
| --- | --- |
| **Parte de clases pasadas** | Registro en bloque con desglose de cobro (efectivo, QR, CxC, paquete) |
| **Planilla de asistencia** | Marcar asistencia de un curso completo a partir de sus matrículas activas |
| **Catálogos y cuentas operativas** | Asignar cuenta contable a cada concepto operativo; consultar catálogos académicos |
| **Biblioteca de archivos** | Subir, buscar, organizar en carpetas, copiar URL, asociar a transacción |
| **Centro de tutoriales** | Recorridos guiados sobre la interfaz real, con progreso por usuario |
| **Perfil** | Consultar identidad, rol principal, roles y permisos activos |

## Capacidades de navegación y presentación

| Capacidad | Estado |
| --- | --- |
| Barra lateral filtrada por permisos | ✅ |
| Buscador de tablas dentro de un módulo | ✅ |
| Menú lateral adaptado a móvil, con bloqueo de scroll | ✅ |
| Coloreado por bloque horario | ✅ (3 recursos) — ⚠️ solo por color |
| Badges de estado con texto | ✅ |
| Recorte inteligente a 14 columnas por prioridad | ✅ |
| Etiquetas humanizadas de campo | ✅ `humanize.ts` |
| Tema claro / oscuro conmutable | ❌ Siempre oscuro |
| Idioma configurable | ❌ Solo español |
| Enlaces compartibles con filtros | ❌ El estado no vive en la URL |

## Capacidades ausentes que suelen esperarse

Declaradas para evitar suposiciones:

| Capacidad | Estado |
| --- | --- |
| Informes y cuadros de mando | ❌ Ningún gráfico en la aplicación |
| Notificaciones o alertas al usuario | ❌ |
| Trabajo sin conexión | ❌ |
| Colaboración en tiempo real | ❌ Sin WebSockets ni polling |
| Auditoría visible de cambios | ❌ |
| Búsqueda global entre recursos | ❌ La búsqueda es por recurso |
| Impresión o generación de PDF | ❌ |
| Mapas | ❌ Hay `latitud`/`longitud` pero ningún componente de mapa |
| Recuperación de contraseña | ❌ El pie del login remite a administración |
| Edición del propio perfil | ❌ Solo lectura |
| Cierre de sesión en el servidor | ❌ Solo local |

## Madurez por capacidad

| Capacidad | Implementada | Probada | Accesible | Documentada |
| --- | :---: | :---: | :---: | :---: |
| CRUD genérico | ✅ | ❌ | ⚠️ | ✅ |
| Formularios y validación | ✅ | ⚠️ parcial | ❌ | ✅ |
| Búsqueda y filtros | ✅ | ❌ | ⚠️ | ✅ |
| Exportación | ✅ | ❌ | ⚠️ | ✅ |
| Importación | ⚠️ sin verificar | ❌ | ⚠️ | ✅ |
| Parte de clases | ✅ | ❌ | ⚠️ | ✅ |
| Asistencia masiva | ✅ | ❌ | ⚠️ | ✅ |
| Archivos | ✅ | ❌ | ⚠️ | ✅ |
| Tutoriales | ✅ | ✅ | ⚠️ | ✅ |
| Autenticación | ✅ | ❌ | ✅ | ✅ |

**Todo está documentado; casi nada está probado; la accesibilidad está comprometida de forma transversal por dos defectos en `Modal` y `FormField`.**
