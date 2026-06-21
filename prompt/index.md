# Instrucciones generales de generación del frontend

## 0. Modo de trabajo

Este proyecto debe trabajarse con precisión y sin inventar contratos críticos. La fuente específica de frontend es:

```txt
./programacionFrontend.md
```

También deben revisarse los lineamientos generales de:

```txt
./programacionGeneral.md
```

> Nota: este repositorio corresponde al frontend. No debe aplicarse `programacionBackend.md` como prompt principal para esta entrega.

## 1. Insumos obligatorios

Antes de generar o modificar código frontend, revisar:

```txt
docs/theme/cpa-palette.json
docs/template/
docs/endpoints/endpoints.md
docs/systemInfo/
prompt/programacionFrontend.md
prompt/programacionGeneral.md
```

## 2. Stack esperado

```txt
React
TypeScript
Vite
React Router
Fetch encapsulado
CSS Modules
Variables CSS derivadas de docs/theme/cpa-palette.json
```

## 3. Reglas de arquitectura

- Las páginas deben estar fraccionadas en componentes.
- Los componentes reutilizables van en `src/shared`.
- La API nunca se consume directamente desde JSX.
- La URL base viene de `VITE_API_BASE_URL`.
- Los endpoints relativos salen de `docs/endpoints/endpoints.md`.
- La lógica de estado vive en hooks ViewModel.
- Los colores salen únicamente de la paleta oficial del proyecto.
- Toda pantalla con datos debe contemplar loading, error, vacío y datos.

## 4. Entregables

El ZIP final debe incluir:

- Código fuente React.
- Configuración Vite y TypeScript.
- `.env.example`.
- Documentación de arquitectura frontend.
- Mapa de endpoints usados.
- Análisis de templates.
- Carpeta `docs` y carpeta `prompt` actualizadas.

## 5. Validación final

Antes de entregar, verificar:

- Existe `src/shared/api/httpClient.ts`.
- Existe `src/config/env.ts`.
- Existe router centralizado.
- Existe login con `X-Session-Token`.
- Existe layout administrativo.
- Los módulos CRUD se derivan de endpoints documentados.
- La paleta oficial fue convertida a tokens CSS.
- No hay colores de template copiados como fuente final.
