# CPA Plataforma Frontend

Frontend React + TypeScript + Vite para la plataforma interna del Centro de Preparación Académica CPA.

## Qué incluye

- Login privado usando `POST /api/auth/publicAuth/login`.
- Layout administrativo con header, sidebar, footer y perfil básico.
- Home con resumen de módulos.
- Navegación por todos los recursos CRUD documentados en `docs/endpoints/endpoints.md`.
- Listados genéricos con buscar, filtro, crear registro, editar e inhabilitar cuando el registro expone un campo de estado.
- Formulario especial para `contabilidad/transaccion`: la transacción y sus movimientos de cuenta se cargan juntos en un solo flujo balanceado.
- Pantalla de importación batch por recurso pensada para subir Excel/CSV con muchos registros, validar y procesar el lote.
- Consumo de API centralizado mediante `src/shared/api/httpClient.ts`.
- `X-Session-Token` agregado automáticamente cuando existe sesión local.
- Tokens visuales generados desde `docs/theme/cpa-palette.json`.

## Instalación con Yarn

Este proyecto usa Yarn Classic como gestor único de dependencias. No mezclar con `npm install`.

```bash
yarn install --frozen-lockfile
cp .env.example .env
yarn dev
```

## Calidad

```bash
yarn typecheck
yarn test
yarn build
yarn quality
```

## Variable de entorno

```env
VITE_API_BASE_URL=http://localhost:3000
```

El sistema documenta rutas con prefijo `/api`, por lo que la URL base no debe repetir `/api`.

## Credenciales demo documentadas

El archivo `docs/endpoints/endpoints.md` documenta estas credenciales de seed:

```txt
pablo.admin
PabloAdmin2026!
```

## Nota técnica

El `prompt/index.md` original estaba orientado a sistema. En esta entrega se corrigió para frontend y se aplicó `prompt/programacionFrontend.md` como prompt específico del proyecto.


## Corrección aplicada al batch

La pantalla `/batch/:module/:resource` ya no usa un arreglo JSON manual. Ahora funciona como importador de Excel/CSV:

1. Selección de archivo `.xlsx`, `.xls` o `.csv`.
2. Modo de importación: crear, actualizar o crear/actualizar.
3. Validación por `POST {endpoint}/batch/validate` usando `multipart/form-data`.
4. Procesamiento por `POST {endpoint}/batch/process` usando `multipart/form-data`.
5. Resumen de filas válidas, observadas y con error.

## Transacciones contables

`contabilidad/transaccion` se trata como caso compuesto. El modal de creación/edición contiene el encabezado de la transacción y una tabla interna de movimientos Debe/Haber. El frontend exige al menos dos movimientos y balancea Debe contra Haber antes de enviar el payload.
