# v36 - Validación frente al contrato ultra detallado del sistema

Se validó el frontend contra `FRONTEND_CONTRATO_CPA_ULTRA_DETALLADO.md` y se ajustaron los puntos que todavía podían causar incompatibilidad operativa.

## Checklist validado

- Login usa `POST /api/auth/publicAuth/login`.
- El campo visual de login acepta usuario o correo; ya no bloquea `pablo.admin` por validación HTML de email.
- Credenciales seed visibles: `pablo.admin` / `PabloAdmin2026!`.
- El token se guarda y se lee en `cpa.sessionToken` y `cpa_session_token`.
- Todas las requests privadas envían `X-Session-Token`.
- Logout limpia ambas llaves de sesión.
- Aulas usan `GET /api/infraestructura/aula`.
- Select de aula usa `id_espacio` como value y envía `id_aula` en venta-clase.
- Parte de clases usa `POST /api/contabilidad/venta-clase/registrar-batch`.
- Parte de clases no crea transacciones ni movimientos contables manuales.
- Materia, tema y subtema salen desde `GET /api/servicios_educativos/materia-tree`.
- Producto educativo sale desde `GET /api/servicios_educativos/producto-educativo`.
- Estudiantes salen desde `GET /api/personas/estudiante`.
- Tutores salen desde `GET /api/personas/tutor`.
- Cuentas operativas usan `GET/POST/PATCH /api/contabilidad/configuracion-cuenta-operativa`.
- Selector de cuentas operativas usa `GET /api/contabilidad/cuenta`.
- No se envían IDs de cuentas para efectivo, QR, CxC ni paquete en venta-clase.
- CxC o paquete exige estudiante seleccionado.
- No se envían filas vacías.
- No se permiten montos negativos.
- `paquete` se maneja como número.
- `situacion_base` queda alineado con `CLASE_PASADA`.
- Se conserva `ignoreDeprecations: 6.0` porque TypeScript 6 lo exige para `baseUrl`; el build queda válido.

## Resultado

Build validado con `npm run build`.
