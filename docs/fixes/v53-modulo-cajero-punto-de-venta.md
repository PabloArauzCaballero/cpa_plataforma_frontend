# v53 — Módulo de cajero / punto de venta

## Qué se pidió

Un usuario cajero que entre directo al registro de venta: elegir productos de un
grid con imágenes alojadas en Cloudinary, indicar con qué se pagó y confirmar.
Fullstack, sin romper lo existente.

## Qué ya existía

- Rol `CAJERO` en `seguridad.rol` desde la migración `003`.
- Toda la contabilidad de la venta: `transaccion`, `transaccion_detalle_venta`,
  `transaccion_venta`, `transaccion_movimiento_cuenta`, con triggers de asiento
  balanceado y bloqueo de periodo cerrado.
- Cloudinary con upload preset unsigned (`cloudinaryUpload.ts`,
  `CloudinaryUploadField.tsx`).
- `inventario.bien.es_producto_tienda`, `precio_referencia`, `metodo_valuacion`
  y las tres cuentas contables por bien.
- `ContabilidadAccountingService.registrarVentaClase`, que sirvió de patrón.

## Qué faltaba

- Columna de imagen en `inventario.bien`.
- Cualquier capa de existencias: no había vista de stock ni kardex.
- Cuentas de ingreso y costo de venta de mercadería en el plan de cuentas.
- Permisos: `CAJERO` sólo tenía el vocabulario legacy `CAJA.*`, que ningún
  endpoint NestJS evalúa.
- `ck_transaccion_venta_referencia` impedía un carrito multi-producto.

## Cambios en el frontend

### Feature nueva `src/features/caja/`

Sigue el MVVM de `.claude/rules/10-frontend-architecture.md`:

```
domain/CajaVenta.ts              reglas puras: total, cambio, tope de stock
services/cajaApi.ts              transporte vía httpClient
services/cajaMapper.ts           DTO <-> dominio
services/dto/CajaDto.ts          contrato con el backend
hooks/useCajaVentaViewModel.ts   carrito, pago y confirmación
components/ProductoGrid.tsx      grid con imagen, precio y stock
components/CarritoPanel.tsx      líneas y total
components/PagoPanel.tsx         efectivo / QR / cambio
pages/CajaVentaPage.tsx          composición
```

### Sesión y navegación

- `session.ts` gana `userHasAnyRole()` e `isCashierOnlyUser()`. Los roles ya
  llegaban del backend en `data.roles`; no hacía falta tocar el login.
- `ProtectedRoute` manda al cajero puro a `/caja/venta`. Sólo se le permiten
  además las rutas de perfil. Un super usuario o alguien con un rol adicional
  conserva la navegación completa.
- `AppShell` oculta el árbol de módulos para el cajero puro y muestra
  "Punto de venta" a quien tenga `CONTABILIDAD.VENTA_PRODUCTO.REGISTRAR`.

### Imagen de producto

`ResourceForm` tenía el uploader de Cloudinary cableado a un único recurso
(`isCloudinaryArchivoTransaccionField`). Ahora existe además un registro
`CLOUDINARY_IMAGE_FIELDS` por nombre de campo, de modo que cualquier recurso con
`imagen_url` hereda el uploader sin tocar el componente. `inventario/bien` suma
`precio_referencia`, `es_producto_tienda` e `imagen_url` a su formulario.

## Decisiones que conviene recordar

**El cambio no entra al asiento.** Si el cliente paga 50 por una venta de 40, a
caja entran 40 y 10 vuelven como cambio. El backend calcula el *efectivo
aplicado* (`total − QR`) y es eso lo que va al Debe y a
`transaccion_venta.monto_efectivo`. Cargar los 50 dejaría el asiento
descuadrado.

**El QR no admite exceso.** Un cobro electrónico de más no se devuelve por caja,
así que el backend lo rechaza en vez de generar un cambio imposible.

**Validación en los dos lados.** La pantalla impide superar el stock y confirmar
sin cubrir el total, pero el backend vuelve a validarlo todo: la UI es
comodidad, no control de acceso.

## Verificación

- Frontend: `yarn typecheck`, `yarn test` (29 pruebas, 8 nuevas de caja),
  `yarn build`.
- Backend: `tsc --noEmit`, `check:source-size`, `eslint`,
  `test/venta-producto.spec.ts` (15 pruebas: normalización, PEPS/UEPS/PROM,
  stock insuficiente y balance del asiento).

## Configuración necesaria antes de usarlo

1. Rellenar `VITE_CLOUDINARY_CLOUD_NAME` y `VITE_CLOUDINARY_UPLOAD_PRESET` en
   `.env` (preset **unsigned**). Sin ellas el grid muestra el placeholder y la
   subida de imágenes falla.
2. Aplicar las migraciones `025_punto_venta_tienda.sql` y `026_permisos_cajero_punto_venta.sql`.
3. Marcar los productos con `es_producto_tienda`, ponerles `precio_referencia`
   y subirles imagen desde Inventario > Bien.
