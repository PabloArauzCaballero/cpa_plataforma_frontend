# Caché e invalidación

## Caché de datos: no existe

**No hay ninguna capa de caché de datos de servidor.** Sin React Query, SWR, Apollo ni almacén propio.

Y no solo falta: el diseño la haría poco útil tal como está. `AppShell.tsx:167` renderiza el contenido con `key={location.pathname}`, lo que **desmonta y vuelve a montar el subárbol en cada navegación**, descartando cualquier estado en memoria.

| Escenario | Comportamiento |
| --- | --- |
| Ir a un listado, entrar a otro, volver | Se piden todos los datos de nuevo |
| Dos componentes necesitan el mismo catálogo | Dos peticiones |
| Recargar la página | Todo desde cero |
| Volver atrás con el navegador | Recarga completa |

## Invalidación

Es **manual y local**. Tras una mutación, el propio view model vuelve a cargar:

| Acción | Invalidación |
| --- | --- |
| Crear un registro | El hook cierra el modal y llama a `load()` |
| Editar un registro | Ídem |
| Inhabilitar un registro | Ídem |
| Guardar una configuración de catálogo | `loadData()` completo |
| Subir un archivo | `loadFiles()` |
| Avanzar en un tutorial | El servicio de progreso actualiza su estado |

**No hay invalidación cruzada.** Ejemplo real: configurar una cuenta operativa afecta al parte de clases pasadas, pero si ambas pantallas estuvieran abiertas, la segunda no se enteraría. En la práctica el remontaje por ruta lo resuelve por la fuerza bruta.

## Actualizaciones optimistas

**Ninguna.** La interfaz siempre espera la respuesta del servidor antes de reflejar el cambio.

Es coherente con el dominio: son datos contables y de matrícula, donde mostrar un cambio que luego falla sería peor que esperar. Como no hay optimismo, **tampoco hay rollback de mutación que documentar**.

## Caché HTTP del navegador

| Origen | Política |
| --- | --- |
| `fetch` de `httpClient` | Sin cabeceras de caché propias: se aplica la del backend |
| Peticiones a Cloudinary | Las de Cloudinary |

El frontend **no fuerza** `cache: 'no-store'` ni ningún modo concreto.

## Caché de assets estáticos

Aquí sí hay política, y es correcta.

### nginx (`docker/nginx.conf`)

| Recurso | Cabecera | Justificación |
| --- | --- | --- |
| `/assets/*` | `expires 1y; Cache-Control: public, immutable` | Los nombres llevan hash de contenido: un cambio produce un nombre nuevo |
| `/index.html` | `no-cache, no-store, must-revalidate` | Debe reflejar el despliegue nuevo de inmediato |
| Resto | `try_files` a `index.html` | Reescritura de SPA |

Es la combinación estándar y está bien resuelta.

### Cloudflare Workers

Usa la política **por defecto** del manejador de assets estáticos. No hay configuración explícita en `wrangler.jsonc`.

**Implicación:** la política de caché documentada arriba es la de nginx, que **no está en uso** en producción. Convendría verificar que el comportamiento de Cloudflare es equivalente, en particular que `index.html` no se cachea. Registrado en [../operations/cache-and-cdn.md](../operations/cache-and-cdn.md).

## El caso de los chunks desactualizados

La combinación «hash en el nombre + `index.html` sin caché» tiene un efecto conocido: una pestaña abierta desde antes de una publicación conserva el `index.html` antiguo y pedirá chunks que ya no existen.

Síntoma: `Failed to fetch dynamically imported module`. Procedimiento en [runbook R-03](../operations/runbooks/index.md#r-03).

**No hay manejo específico en el código**: no se captura el fallo de `import()` para ofrecer «hay una versión nueva, recarga».

## ¿Convendría añadir caché de datos?

| A favor | En contra |
| --- | --- |
| Volver a un listado sería instantáneo | Habría que revisar `key={location.pathname}`, del que depende de forma no declarada la corrección de `ResourceListPage` |
| Se evitarían peticiones duplicadas de catálogos | Riesgo de mostrar datos obsoletos en un dominio contable |
| Deduplicación, reintentos y cancelación vendrían de serie | Dependencia nueva y modelo mental adicional |

**Recomendación:** no es la prioridad. El coste de rendimiento real de este frontend no está en la ausencia de caché, sino en el fallback de filtrado local ([../performance/rendering.md](../performance/rendering.md)). Resolver eso primero.
