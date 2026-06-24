# profile

Vista de perfil conectada al backend.

- Consume `GET /api/auth/privateAuth/me` usando el `httpClient` centralizado.
- Usa `X-Session-Token` desde `localStorage`, igual que el resto del frontend.
- No usa datos mock ni preferencias simuladas.
- No edita perfil porque no existe endpoint de actualización de perfil documentado en los insumos actuales.
