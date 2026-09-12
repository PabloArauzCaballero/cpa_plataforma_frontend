# Regresión visual

## Estado: no existe

Sin Playwright, Percy, Chromatic, BackstopJS ni ninguna herramienta de comparación de capturas. **No hay imágenes de referencia en el repositorio.**

## Consecuencia inmediata

Cualquier cambio de CSS —7 007 líneas repartidas en 30 archivos `.module.css`— **se despliega sin verificación visual automática**. La única comprobación posible es abrir la aplicación y mirar.

Ejemplo concreto vivido durante esta misma auditoría: mientras se escribía la documentación, otro agente modificaba `theme.css`, `global.css`, `Button.module.css`, `Card.module.css`, `DataTable.module.css`, `Modal.module.css`, `PageState.module.css`, `SearchFilterBar.module.css` y `AppShell.module.css`. **Nada en el proyecto podía decir si esos cambios rompían alguna pantalla.**

## Qué habría que cubrir

Superficie visual real del producto:

| Superficie | Variantes a capturar |
| --- | ---: |
| Login | normal, con error, enviando | 3 |
| Inicio | — | 1 |
| Tablero de módulo | con resultados, sin coincidencias | 2 |
| Listado de recurso | cargando, con datos, vacío, error, con coloreado horario | 5 |
| Modal de formulario | alta, edición, con errores, cargando | 4 |
| Modal de transacción | — | 1 |
| Confirmación | normal, procesando | 2 |
| Modal de exportación | — | 1 |
| Guía de ayuda | — | 1 |
| Importación por lote | inicial, validado, procesado, error | 4 |
| Catálogos operativos | cada pestaña | 3 |
| Biblioteca de archivos | con archivos, vacío, subiendo | 3 |
| Centro de tutoriales | con filtros, sin coincidencias | 2 |
| Perfil | cargando, con datos, error | 3 |
| No encontrado | — | 1 |
| **Por cada una** | escritorio y móvil (≤ 560 px) | ×2 |

Aproximadamente **72 capturas**. Es asumible, pero requiere infraestructura.

## Requisitos previos, en orden

1. **Datos deterministas.** Con datos reales, cada captura cambiaría y todas las comparaciones fallarían. Haría falta un backend simulado o un conjunto fijo.
2. **Sesión reproducible.** El acceso está protegido por `ProtectedRoute`; hay que inyectar una sesión en `localStorage` antes de cada captura.
3. **Fuentes estables.** ✅ Ventaja del proyecto: **no se descarga ninguna fuente web**, así que no hay variación por carga de tipografía. Sí la hay entre sistemas operativos: `Inter, system-ui, sans-serif` se resuelve distinto en macOS, Windows y Linux. **Las capturas deben generarse siempre en el mismo entorno**, idealmente un contenedor.
4. **Animaciones desactivadas.** Existe `--transition-base` y varias transiciones; hay que forzar `prefers-reduced-motion` o deshabilitarlas en la captura.
5. **CDN accesible.** Los iconos vienen de `cdnjs`: si falla, las capturas divergen. Otro argumento para retirar esa dependencia.

## Propuesta mínima

> **No implementada.** Requiere infraestructura nueva y autorización.

Playwright cubriría a la vez regresión visual, E2E y accesibilidad automatizada:

```
1. Levantar la aplicación con un backend simulado
2. Inyectar sesión en localStorage
3. Recorrer las rutas y capturar
4. Comparar con las referencias
5. Publicar las diferencias como artefacto del pipeline
```

**Recomendación de secuencia:** la regresión visual **no debería ser lo primero**. Con 14 de 15 journeys sin ninguna prueba, la prioridad son las pruebas de lógica pura (que no requieren nada) y después las de componente. La regresión visual tiene sentido cuando ya exista Playwright para E2E.

## Mientras tanto: verificación manual

Lista mínima tras un cambio de CSS, y en dos anchos (escritorio y ≤ 560 px):

- [ ] Login: campos, botón, mensaje de error
- [ ] Barra lateral: módulos desplegables, enlaces, cajón móvil
- [ ] Listado: tabla, badges de estado, paginación, barra de filtros
- [ ] Modal de formulario: rejilla de campos, errores, botones
- [ ] `ConfirmDialog`: se dibuja **por encima** de otras capas
- [ ] `PageState`: los cuatro usos (cargando, vacío, error, no encontrado)
- [ ] Coloreado horario en `clase-por-hora`
- [ ] Biblioteca de archivos: rejilla de archivos
- [ ] Perfil: tarjetas y avatar

Prestar especial atención a **`Modal` y `ConfirmDialog`**: ambos usan `createPortal` al `body` precisamente porque cualquier ancestro con `transform`, `filter` o `backdrop-filter` rompe su `position: fixed`. Un cambio de CSS que introduzca uno de esos valores en un contenedor podría desplazarlos o recortarlos.
