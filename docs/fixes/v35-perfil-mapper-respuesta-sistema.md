# v35 - Perfil de usuario con mapeo robusto de sesión

## Problema

La vista de perfil estaba conectada al sistema, pero el mapeador asumía una respuesta muy específica: `data.user` y `data.persona` separados.

Cuando el sistema devolvía campos como `idPersona`, `nombres`, `apellidos`, `nombre_usuario`, `tipo_usuario` o `es_super_usuario` dentro del mismo objeto de usuario, la UI terminaba mostrando varios campos como "No disponible".

## Solución

Se ajustó `src/features/profile/services/profileMapper.ts` para leer datos desde más variantes reales del sistema:

- `data.user`
- `data.usuario`
- `data.persona_usuario`
- `data.session.user`
- `root.user`
- campos mezclados en `data`

También se agregaron alias para:

- `idPersona`
- `id_persona`
- `nombre_usuario`
- `usuario`
- `tipo_usuario`
- `tipoUsuario`
- `es_super_usuario`
- `esSuperUsuario`
- `nombres`
- `apellidos`
- `nombre_completo`

## Resultado

La vista de perfil sigue sin usar mock, pero ahora muestra correctamente la información disponible aunque el sistema la devuelva en formato plano o anidado.
