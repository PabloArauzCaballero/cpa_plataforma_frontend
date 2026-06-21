# Arquitectura frontend

## Decisión principal

El proyecto se implementa como frontend React + TypeScript + Vite con arquitectura modular por features.

## Insumos revisados

- `prompt/index.md`: tenía referencias backend; se ajustó a frontend.
- `prompt/programacionFrontend.md`: reglas específicas de React, arquitectura modular, separación por capas y uso de paleta.
- `docs/endpoints/endpoints.md`: fuente oficial de contratos HTTP.
- `docs/theme/cpa-palette.json`: fuente oficial de colores, gradientes, radios, sombras y tipografía.
- `docs/template/*.html`: guía visual estructural para login, header, footer, home, body general, batch y perfil.
- `docs/systemInfo/*.puml`: referencia del dominio, casos de uso, flujo principal y estados.

## Capas

```txt
src/app
  router y protección de rutas

src/config
  lectura centralizada de variables de entorno

src/shared
  API client, estilos, layout y componentes reutilizables

src/features/auth
  login, DTOs, mapper, servicio y ViewModel

src/features/dashboard
  home administrativo

src/features/resources
  recurso CRUD genérico derivado de endpoints.md

src/features/profile
  perfil local de sesión
```

## Consumo de API

Los componentes no llaman `fetch` directamente. Todo consumo HTTP pasa por:

```txt
src/shared/api/httpClient.ts
```

Los servicios de feature usan ese cliente. El token se envía en:

```http
X-Session-Token: <sessionToken>
```

## Supuestos documentados

`endpoints.md` documenta rutas, método, tabla y PK, pero no documenta los bodies exactos de creación/actualización. Por eso:

- Se crearon campos sugeridos para las entidades principales usando `classDiagram.puml`.
- Cuando no hay contrato claro, se ofrece editor JSON controlado.
- La acción inhabilitar solo aparece de forma segura si el registro expone `estado*` o `activo`.
