# v37 - Cierre para frontend 10/10

Esta versión sube el frontend de MVP avanzado a una base más cercana a producción.

## Cambios principales

1. **Sesión robusta**
   - Se guarda sesión completa en `cpa.session`.
   - Se conserva compatibilidad con `cpa.sessionToken` y `cpa_session_token`.
   - Logout limpia todas las llaves.
   - 401 limpia sesión local para evitar estados falsos.

2. **Permisos reales de UI**
   - El frontend lee roles/permisos si el sistema los devuelve.
   - Si `es_super_usuario=true`, permite operar todo.
   - Si el sistema no devuelve matriz de permisos, no inventa bloqueos falsos; el sistema sigue siendo autoridad.
   - Cuando hay permisos, oculta acciones no autorizadas.

3. **Error Boundary global**
   - Evita pantalla blanca si una vista falla.
   - Permite recargar o volver al inicio.

4. **Calidad operativa**
   - Nueva pantalla `/calidad`.
   - Checklist visible de contrato sistema, sesión, permisos, UX, resiliencia y producción.

5. **Optimización de carga**
   - Rutas principales con `React.lazy` y `Suspense`.
   - Build queda dividido en chunks más pequeños.
   - Se elimina el warning de chunk principal mayor a 500 KB.

6. **Comandos de validación**
   - `npm run quality` ejecuta typecheck + build.
   - `npm run ci:frontend` apunta al mismo flujo para CI.

## Validación realizada

```bash
npm run quality
```

Resultado: exitoso.
