# Respuesta a incidentes de seguridad

## Capacidad actual — evaluación honesta

| Capacidad | Estado |
| --- | --- |
| Detección automática | ❌ Sin telemetría, sin alertas, sin captura de errores |
| Registro de accesos en el frontend | ❌ Ninguno |
| Correlación con el backend | ❌ Sin identificador de petición |
| Identificación del usuario en un incidente | ⚠️ Solo desde los registros del backend |
| Revocación de sesión desde el frontend | ❌ No existe endpoint de logout |
| Reversión rápida del artefacto | ✅ **Sí**: `dist/` versionado |
| Despliegue de una corrección | ⚠️ Manual, sin CI |

**La detección depende íntegramente de que alguien lo note.** Es la mayor limitación de la respuesta a incidentes de este frontend.

## Clasificación

| Nivel | Definición | Ejemplo |
| --- | --- | --- |
| **P1** | Exposición de credenciales o datos personales; acceso no autorizado | [SEC-01](frontend-security.md#sec-01) |
| **P2** | Vulnerabilidad explotable sin exposición confirmada | XSS, CSP ausente con CDN comprometido |
| **P3** | Debilidad sin explotación conocida | Falta de SRI, sesión sin caducidad |
| **P4** | Hallazgo informativo | Datos residuales en `localStorage` |

## Procedimiento general

### 1. Contener

| Situación | Acción inmediata |
| --- | --- |
| Credencial expuesta | **Rotarla en el backend.** No esperar al despliegue del código |
| Código malicioso publicado | Revertir el artefacto: `git checkout <commit-bueno> -- dist/` y `npx wrangler versions upload`. Ver [runbook R-12](../operations/runbooks/index.md#r-12) |
| Recurso externo comprometido (CDN) | Retirar el `<link>` de `index.html`, reconstruir y publicar. Los iconos desaparecen; la aplicación sigue usable |
| Abuso del preset de Cloudinary | Deshabilitar o rotar el preset **en el panel de Cloudinary** |
| Sesión concreta comprometida | Solo el backend puede invalidarla; el frontend no tiene mecanismo |

### 2. Evaluar el alcance

Preguntas que hay que poder responder, y con qué:

| Pregunta | Fuente disponible hoy |
| --- | --- |
| ¿Desde cuándo está expuesto? | `git log` del archivo afectado |
| ¿Llegó al artefacto publicado? | `grep -rl "<patrón>" dist/` |
| ¿Está en el historial? | `git log -S "<patrón>"` — **relevante porque `dist/` está versionado** |
| ¿Quién accedió? | ❌ Solo registros del backend |
| ¿Qué datos se vieron afectados? | ❌ Inferencia a partir de los permisos del usuario |

### 3. Erradicar

1. Corregir el código.
2. Reconstruir y republicar.
3. Verificar que el patrón ya no aparece **ni en `src/` ni en `dist/`**.
4. Evaluar si hace falta purgar el historial de git (para secretos, normalmente sí).

### 4. Recuperar

Ejecutar el smoke manual de [../operations/deployment.md](../operations/deployment.md).

### 5. Aprender

Registrar el incidente, actualizar el [modelo de amenazas](threat-model.md) y añadir la comprobación correspondiente a los scripts de validación.

## Procedimientos específicos

### Credenciales o secretos en el código

Es el caso **materializado** hoy ([SEC-01](frontend-security.md#sec-01)).

```bash
# 1. Confirmar el alcance
grep -rn "<patrón>" src/
grep -rl "<patrón>" dist/
git log -S "<patrón>" --oneline

# 2. Rotar el secreto en el sistema de origen (backend, Cloudinary…) — PRIMERO
# 3. Corregir el código
# 4. Reconstruir y publicar
# 5. Verificar
grep -r "<patrón>" src/ dist/    # debe devolver 0
```

> **Punto crítico de este proyecto:** como `dist/` está versionado, **el secreto queda en el historial de git aunque se corrija el código**. Corregir el presente no borra el pasado. Ver [ADR-0009](../adr/ADR-0009-dist-versionado.md).

### Sospecha de compromiso del CDN

```bash
curl -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css | shasum -a 384
```

Comparar con el hash oficial de FontAwesome. Si no coincide, retirar el `<link>` de inmediato.

**Este procedimiento sería innecesario si el recurso llevara SRI**: el navegador lo bloquearía solo.

### Abuso del preset de Cloudinary

Revisar el uso en el panel de Cloudinary. Si hay subidas anómalas: deshabilitar el preset, crear uno nuevo con restricciones (formatos, tamaño, carpeta obligatoria, moderación), actualizar `VITE_CLOUDINARY_UPLOAD_PRESET`, **recompilar y republicar** — recuerda que la variable se fija en tiempo de build.

## Contactos y escalamiento

| Ámbito | Responsable |
| --- | --- |
| Código del frontend | Equipo de frontend |
| Sesiones, permisos, datos | Equipo de backend |
| Alojamiento y dominio | Administrador de Cloudflare |
| Almacenamiento de archivos | Administrador de Cloudinary |

> El proyecto **no declara personas ni equipos concretos**. Ver [../governance/ownership.md](../governance/ownership.md).

## Carencias que limitan la respuesta

| # | Carencia | Efecto en un incidente |
| --- | --- | --- |
| 1 | Sin captura remota de errores | No se detecta un fallo masivo hasta que alguien lo reporta |
| 2 | Sin identificador de correlación | No se puede unir un error del navegador con su petición en el backend |
| 3 | Sin endpoint de logout | No se puede forzar el cierre de sesión desde el frontend |
| 4 | Sin CI | La corrección se despliega a mano, sin verificación previa |
| 5 | Sin versión de release en el artefacto | No se sabe qué versión está viendo el usuario afectado |
| 6 | `dist/` en el historial | Lo expuesto permanece aunque se corrija |
