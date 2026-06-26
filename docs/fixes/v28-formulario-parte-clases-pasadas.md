# v28 - Formulario Parte de Clases Pasadas

Se agregó una pantalla operativa para registrar en lote la parte física de clases pasadas.

## Acceso

- Módulo: Contabilidad
- Opción: Parte Clases Pasadas
- Ruta frontend: `/modulos/contabilidad/venta-clase`

## Endpoint usado

```http
POST /api/contabilidad/venta-clase/registrar-batch
```

## Columnas del formulario

- Fecha
- Hora ingreso
- Hora salida
- Nombre completo estudiante
- Tutor
- Motivo clase
- Materia / Producto
- Tema
- Subtema
- Efectivo
- QR
- CxC
- Paq.
- Sit. Base

## Comportamiento

- La pantalla funciona como una tabla editable.
- Permite añadir filas, duplicar la última fila y limpiar todo el formulario.
- Las filas vacías no se envían.
- Valida fecha, hora de ingreso, hora de salida, estudiante, tutor y materia/producto.
- Calcula resumen de filas a enviar, total efectivo, total QR y total CxC.
- Muestra vista previa del payload antes de enviar.
- Muestra la respuesta del backend después del envío.

## Payload enviado

```json
{
  "registros": [
    {
      "fecha": "2026-06-25",
      "hora_ingreso": "15:00",
      "hora_salida": "16:00",
      "nombre_completo_estudiante": "Nombre Estudiante",
      "tutor": "Nombre Tutor",
      "motivo_clase": "CLASE",
      "materia_producto": "Matemáticas",
      "tema": "Álgebra",
      "subtema": "Ecuaciones",
      "efectivo": 50,
      "qr": 0,
      "cxc": 0,
      "paquete": "",
      "situacion_base": "PENDIENTE"
    }
  ]
}
```

> Nota: el archivo entregado por el usuario solo definía columnas y endpoint. Si el backend exige otra llave distinta a `registros`, se debe ajustar únicamente `src/features/resources/services/ventaClaseApi.ts`.
