# Reversión (rollback)

## La mayor fortaleza operativa del proyecto

`dist/` **está versionado en git** (30 archivos rastreados). Eso significa que **el artefacto exacto de cada publicación es recuperable sin reconstruir nada**.

Es una consecuencia poco habitual de una decisión ([ADR-0009](../adr/ADR-0009-dist-versionado.md)) que también tiene costes serios — pero en reversión es una ventaja real.

## Procedimiento

```bash
# 1. Identificar el commit bueno anterior
git log --oneline -- dist/

# 2. Restaurar EXCLUSIVAMENTE el artefacto publicado
git checkout <commit-bueno> -- dist/

# 3. Verificar coherencia interna antes de publicar
grep -o 'assets/index-[^"]*' dist/index.html
ls dist/assets/ | head

# 4. Publicar
npx wrangler versions upload

# 5. Comprobar
curl -sI https://<dominio> | head -3
curl -s https://<dominio> | grep -o 'assets/index-[^"]*'
```

**Tiempo estimado: minutos.** No hay build, ni pipeline, ni espera.

## Alternativa: revertir desde Cloudflare

Cloudflare Workers conserva versiones anteriores y permite revertir desde el panel.

| Ventaja | Inconveniente |
| --- | --- |
| Más rápido aún | Deja **el repositorio y lo publicado desincronizados** |
| No toca el repositorio | La siguiente publicación desde git volvería a subir la versión mala |

**Si se usa, hay que alinear el repositorio inmediatamente después.**

## Qué NO revierte una reversión del frontend

| Elemento | Por qué |
| --- | --- |
| Datos ya modificados | Los cambios de datos los hizo el backend |
| Sesiones activas | Siguen siendo válidas |
| Archivos subidos a Cloudinary | Permanecen |
| **Datos en `localStorage`** | Borradores, carpetas y progreso **sobreviven**. Si la versión mala escribió un formato incompatible, la versión anterior podría no leerlo |
| Cambios en el backend | Ámbito distinto |

> **Riesgo poco evidente:** una versión que cambie el formato de una clave de `localStorage` puede dejar datos que la versión anterior no entiende. `localDraftStore` lo mitiga con su campo `version` y con la limpieza ante JSON corrupto; las claves de sesión y de carpetas **no tienen esa protección**.

## Comprobaciones tras revertir

- [ ] La aplicación carga
- [ ] Se puede iniciar sesión
- [ ] Un listado muestra datos
- [ ] Un formulario abre y valida
- [ ] El fallo que motivó la reversión ha desaparecido
- [ ] `dist/index.html` referencia chunks que existen
- [ ] El repositorio y lo publicado coinciden

Si la reversión **no** resuelve el problema, probablemente estaba en el backend ([runbook R-04](runbooks/index.md#r-04)), no en el frontend.

## Reversión de un cambio de configuración

Como las variables `VITE_*` se fijan **en tiempo de build**, revertir un cambio de configuración es exactamente lo mismo que revertir un despliegue: hay que restaurar el artefacto que se compiló con la configuración anterior.

Cambiar la variable en el panel de Cloudflare **no tiene efecto**. Ver [configuration.md](configuration.md).

## Reversión del trabajo documental

Todo lo producido por la auditoría documental son **archivos nuevos**; nada en `src/` ni en `dist/` fue modificado. Procedimiento completo en [../reports/baseline.md](../reports/baseline.md) §8.

## Límites conocidos del proceso actual

| Límite | Consecuencia |
| --- | --- |
| Sin CI | La reversión es manual, sin verificación previa automatizada |
| Sin smoke automatizado | Hay que comprobar a mano |
| Sin registro de publicaciones | No se sabe quién publicó qué ni cuándo, salvo por el historial de git |
| Sin entorno de preproducción | No se puede ensayar la reversión antes de aplicarla |
| Sin telemetría | No se detecta automáticamente que la reversión funcionó |

Ninguno impide revertir; todos alargan el tiempo hasta confirmar que el sistema está sano.

## Feature flags como alternativa

No existen. Con flags, un cambio problemático se desactivaría sin revertir el despliegue.

La limitación estructural es que **el frontend no tiene configuración en tiempo de ejecución**: un flag por variable `VITE_*` exigiría recompilar, es decir, no sería un flag. Tendrían que servirse desde el backend. Ver [feature-flags.md](feature-flags.md).
