# v16 - Perfil real sin mock

Se eliminó la vista de perfil simulada.

Cambios:

- Se agregó `profileApi` con consumo real de `GET /api/auth/privateAuth/me`.
- Se agregó mapper tolerante para respuestas tipo `data.user`, `data.usuario`, `data.persona` o estructuras equivalentes.
- La pantalla ya no usa `localStorage` para inventar nombres, teléfono, documento, roles, preferencias o actividad.
- Se removió guardado local de mockup.
- La UI muestra información solo lectura porque no hay endpoint de actualización de perfil documentado.
- Se agregaron estados de carga, error y reintento.

Regla mantenida: no se exponen token, endpoints ni rutas técnicas en la UI.
