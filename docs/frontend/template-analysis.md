# Análisis del template

La carpeta `docs/template` se usó como guía estructural, no como fuente de implementación final ni de colores.

## Archivos revisados

- `login.html`: base de distribución para pantalla de acceso con copy institucional y formulario.
- `generalHeader.html`: guía para header administrativo, usuario activo y cierre de sesión.
- `generalFooter.html`: guía para footer interno.
- `homePage.html`: guía para pantalla principal con resumen de módulos.
- `generalBody.html`: guía para listados con búsqueda, filtros, tabla y acción crear.
- `generalBodyBatch.html`: guía visual inicial para batch; se corrigió la implementación final para que el batch sea importación de Excel/CSV, no carga manual de JSON.
- `userProfileBody.html`: guía para perfil.

## Decisiones aplicadas

- Se migró la intención visual a componentes React fraccionados.
- No se copiaron estilos crudos del template.
- Los colores finales salen de `docs/theme/cpa-palette.json`.
- La UI queda preparada para datos reales del sistema mediante servicios y ViewModels.
- Se incorporó el patrón del componente compartido `GeneralFormAndTableBody` como referencia de tabla/formulario/modal, pero la implementación final está normalizada en React + TypeScript.
- `contabilidad/transaccion` deja de comportarse como CRUD plano y usa formulario compuesto con movimientos de cuenta fusionados.

## Ajuste aplicado en v3

- `UserProfilePage` fue reconstruido tomando como referencia directa `docs/template/userProfileBody.html`.
- El modal de formularios fue ampliado para evitar scroll horizontal innecesario en pantallas de escritorio.
- `TransactionForm` ahora tiene padding interno, separación entre campos, grilla responsive para movimientos y labels humanizados como `Referencia Origen`.
- El botón `Cerrar` del modal ya no queda con apariencia deshabilitada sobre fondo blanco.
