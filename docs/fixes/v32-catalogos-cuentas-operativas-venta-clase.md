# v32 - Diseño de catálogos y cuentas operativas para venta-clase

## Motivo

El contrato `FRONTEND_CONTRATO_CPA_VENTA_CLASE_CATALOGOS_CUENTAS.md` no solo pedía corregir el formulario de parte de clases pasadas. También pedía diseñar las pantallas y servicios para operar los catálogos académicos, productos educativos y configuración contable operativa.

## Cambios implementados

### Nueva pantalla

Se agregó la pantalla:

```txt
/contabilidad/catalogos-cuentas-operativas
```

Nombre visual:

```txt
Catálogos y cuentas operativas
```

### Accesos

- Sidebar > Contabilidad > Catálogos y cuentas operativas.
- Botón desde Parte de clases pasadas: Configurar catálogos y cuentas.

### Cuentas operativas

La pantalla permite revisar y configurar:

- CANAL_COBRO_EFECTIVO
- CANAL_COBRO_QR
- IVA_DEBITO_FISCAL
- INGRESO_CLASE_POR_HORA

Cada configuración usa selector buscable de cuenta contable.

Endpoints usados:

- GET /api/contabilidad/configuracion-cuenta-operativa
- POST /api/contabilidad/configuracion-cuenta-operativa
- PATCH /api/contabilidad/configuracion-cuenta-operativa/:id_configuracion_cuenta
- GET /api/contabilidad/cuenta

### Catálogos académicos

La pantalla muestra el árbol de:

- Materia
- Tema
- Subtema

Fuente:

- GET /api/servicios_educativos/materia-tree

También enlaza a la tabla CRUD de Materia Tree.

### Productos educativos

La pantalla lista productos educativos para validar clases, cursos y paquetes.

Fuente:

- GET /api/servicios_educativos/producto-educativo

También enlaza a la tabla CRUD de Producto Educativo.

### Unidades educativas

La pantalla lista unidades educativas para validar el registro de estudiantes.

Fuente:

- GET /api/personas/unidad-educativa

También enlaza a la tabla CRUD de Unidad Educativa.

### Flujo operativo

Se agregó una pestaña de flujo recomendado:

1. Plan de cuentas.
2. Catálogos académicos.
3. Productos educativos.
4. Personas.
5. Parte de clases.
6. Motor contable.

## Regla importante

El frontend no arma la contabilidad manualmente. Captura datos y configuración, y el sistema resuelve cuentas, venta, detalle, clase, transacción y movimientos.
