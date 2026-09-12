# Dependencias y cadena de suministro

## Superficie total

**7 dependencias de producción y 10 de desarrollo.** Es una superficie deliberadamente pequeña y es una de las fortalezas del proyecto.

### Producción

| Paquete | Versión | Rango | Función | Riesgo |
| --- | --- | --- | --- | --- |
| `react` | ^19.2.7 | flexible | UI | Bajo |
| `react-dom` | 19.2.7 | **fija** | UI | Bajo |
| `react-router-dom` | 7.18.0 | **fija** | Enrutado | Bajo |
| `driver.js` | 1.8.0 | **fija** | Recorridos guiados | **Medio**: manipula DOM y foco durante los tutoriales |
| `@fortawesome/fontawesome-svg-core` | ^7.2.0 | flexible | Iconos | Bajo |
| `@fortawesome/free-solid-svg-icons` | ^7.2.0 | flexible | Iconos | Bajo |
| `@fortawesome/react-fontawesome` | ^3.3.1 | flexible | Iconos | Bajo |

### Desarrollo

`typescript` 6.0.3, `vite` ^8.0.0, `@vitejs/plugin-react` 6.0.2, `jest` ^30.4.2, `ts-jest` ^29.4.11, `jest-environment-jsdom` ^30.4.1, `@types/*`.

Ninguna llega al bundle de producción.

## Política de versiones observada

Cuatro paquetes están **fijados sin `^`**: `react-dom`, `react-router-dom`, `driver.js`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`.

Fijar `driver.js` es una decisión acertada: es la librería que toma el control de la interacción durante un tutorial, y un cambio menor podría alterar su comportamiento de foco.

**No hay una política escrita** que explique por qué unos se fijan y otros no. Queda registrado.

## Reproducibilidad

| Mecanismo | Estado |
| --- | --- |
| `yarn.lock` versionado | ✅ 127 KB |
| `--frozen-lockfile` en el script de CI | ✅ `install:ci` |
| `--frozen-lockfile` en el `Dockerfile` | ✅ |
| Gestor fijado (`packageManager`) | ✅ `yarn@1.22.22` |
| Registro público explícito | ✅ `.npmrc`, `.yarnrc` |
| Verificación automática de que nadie usa otro gestor | ❌ |

Instalación verificada: **0,42 s, `success Already up-to-date`, lockfile intacto**.

## Auditoría de vulnerabilidades

> ⚠️ **No se ejecutó `yarn audit`** durante esta auditoría, para evitar tráfico de red y contención con los otros agentes que trabajaban en paralelo sobre el mismo repositorio.
>
> **Esta línea base no incluye inventario de CVE.** Limitación L-03 de [../reports/baseline.md](../reports/baseline.md).

Comando pendiente:

```bash
yarn audit --level moderate
```

No hay `npm audit`, Dependabot, Renovate ni Snyk configurados. **Nada vigila las vulnerabilidades de dependencias.**

## El riesgo real: no está en npm

La cadena de suministro de este proyecto tiene un eslabón **fuera de npm**:

```html
<!-- index.html:14 -->
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
```

| Problema | Detalle |
| --- | --- |
| **Sin `integrity` (SRI)** | El navegador aplica lo que llegue, sin verificar |
| **Sin `crossorigin`** | Complemento necesario de SRI |
| **Sin CSP** | No hay segunda barrera si el recurso se compromete |
| **Redundante** | Los paquetes npm de FontAwesome ya están instalados |
| **Punto único de fallo** | Bloqueado el CDN, desaparecen la mayoría de los iconos |

CSS malicioso puede exfiltrar datos sin JavaScript, mediante selectores de atributo con `background-image`. Sobre un formulario de login o de datos personales, eso es filtración real.

**Es la vía de compromiso más plausible del frontend**, por encima de cualquier dependencia npm.

### Correcciones posibles

| Opción | Coste | Efecto |
| --- | --- | --- |
| **A. Eliminar el CDN y usar solo los paquetes npm** | Sustituir todos los `<i className="fa-...">` por `<FontAwesomeIcon>` | Elimina el riesgo y una petición externa |
| **B. Eliminar los paquetes npm y quedarse con el CDN + SRI** | Sustituir 5 usos de `FontAwesomeIcon`; añadir `integrity` | Reduce el bundle; mantiene dependencia externa |
| C. Mantener ambos y añadir SRI | Una línea | Mitiga, pero conserva la redundancia |

La opción A es la más limpia; la C es la de aplicación inmediata.

> Ninguna ejecutada: modifican `src/` o `index.html`.

## Versiones muy recientes

React 19.2.7, Vite 8, TypeScript 6, Jest 30 y react-router-dom 7 son versiones recientes. Ventaja: parches de seguridad al día. Inconveniente: menor rodaje comunitario.

`node:24-alpine` en el `Dockerfile` es coherente con el Node 24.18.0 usado en desarrollo.

## Recomendaciones (no ejecutadas)

| # | Recomendación | Prioridad |
| --- | --- | --- |
| 1 | Ejecutar `yarn audit` y registrar el resultado en la línea base | **Alta** |
| 2 | Resolver la doble vía de FontAwesome (opción A o C) | **Alta** |
| 3 | Añadir CSP, que acota el daño de cualquier recurso externo | Alta |
| 4 | Configurar Dependabot o Renovate | Media |
| 5 | Documentar la política de fijado de versiones | Baja |
| 6 | Verificar en CI que el lockfile no cambia | Media |
