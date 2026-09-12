# Informe de preparación para producción

> Commit auditado: `618e5c3` · Fecha: 2026-08-04

## Veredicto

# 🔴 NO APTO PARA PRODUCCIÓN

**Requisito bloqueante abierto: 1.**

| ID | Requisito bloqueante | Documento |
| --- | --- | --- |
| **SEC-01** | Credenciales de administrador (`pablo.admin`) embebidas en el código fuente, compiladas en `dist/assets/LoginPage-*.js`, versionadas en git y servidas públicamente desde Cloudflare | [security/frontend-security.md](../security/frontend-security.md#sec-01) |

Un sistema que trata **datos de menores de edad, retribuciones de personal y contabilidad completa** expone una credencial administrativa válida a cualquiera que abra el código fuente de la aplicación. No hay evaluación de otros criterios que compense eso.

### Acción inmediata, independiente del código

**Rotar la contraseña del usuario `pablo.admin` en el backend.** La credencial ya está publicada; corregir el código no la revoca, y como `dist/` está versionado, permanece además en el historial de git.

---

## Checklist obligatorio del plan maestro

### Protección del repositorio

| Criterio | Estado |
| --- | --- |
| Se registró el estado inicial del repositorio | ✅ [baseline.md](baseline.md) §1 |
| Se preservaron cambios preexistentes | ✅ Cero archivos ajenos sobrescritos |
| No se modificó comportamiento sin autorización | ✅ Cero archivos de `src/` o `dist/` tocados |
| Build, tipos y pruebas iguales o mejores que la línea base | ✅ 0 errores · 12 suites · 156 casos |
| Toda diferencia visual revisada y autorizada | ✅ No aplica: cero cambios visuales propios |
| No se actualizaron dependencias ni lockfiles | ✅ |
| Existe evidencia de rollback del trabajo propio | ✅ [baseline.md](baseline.md) §8 |

### Graphify y arquitectura

| Criterio | Estado |
| --- | --- |
| Se consultaron artefactos relevantes | ✅ Grafo construido: 988 nodos, 2 522 aristas, 32 comunidades |
| Rutas, componentes y dependencias inventariados | ✅ [graphify-audit.md](graphify-audit.md) §3 |
| Ciclos, huérfanos y alta centralidad revisados | ✅ Sin ciclos de archivo; 2 ciclos de feature; 1 huérfano; 10 god nodes |
| Diagramas y código coherentes | ✅ 9 verificaciones cruzadas, ninguna afirmación del grafo resultó falsa |

### Producto y rutas

| Criterio | Estado |
| --- | --- |
| 100 % de rutas registradas documentado | ✅ **10/10** |
| Journeys críticos documentados | ✅ **12/12** |
| Roles, permisos y redirecciones descritos | ✅ |
| Estados de carga, vacío, error y éxito cubiertos | ✅ |

### Componentes y diseño

| Criterio | Estado |
| --- | --- |
| Componentes compartidos críticos catalogados | ✅ **11/11** |
| Props, eventos, variantes y estados documentados | ✅ |
| Tokens y reglas responsivas documentados | ✅ 45 tokens · 9 puntos de ruptura |
| Componentes legados u obsoletos identificados | ✅ 1 huérfano, 3 duplicaciones |

### Integraciones y estado

| Criterio | Estado |
| --- | --- |
| APIs consumidas trazadas | ✅ 131 endpoints |
| Drift contractual verificado | ⚠️ **Parcialmente**: 6 divergencias detectadas, pero **sin OpenAPI del backend no se puede verificar el contrato real** |
| Stores, providers, caché e invalidación documentados | ✅ |
| Datos sensibles en storage identificados | ✅ |

### Calidad

| Criterio | Estado |
| --- | --- |
| Pruebas críticas pasan | ⚠️ Las 156 existentes pasan, pero **no cubren los flujos críticos** |
| Accesibilidad auditada | ✅ Auditada — 🔴 **2 hallazgos críticos abiertos** |
| Rendimiento con línea base y presupuesto | ✅ Presupuestos definidos y verificados |
| Regresión visual revisada | ❌ **No existe esa capa** |
| Sin enlaces documentales rotos | ✅ Verificado por script |
| Sin páginas vacías ni TODO/TBD | ✅ Verificado por script |

### Seguridad y operación

| Criterio | Estado |
| --- | --- |
| Modelo de amenazas completado | ✅ STRIDE, 21 amenazas |
| Tokens, almacenamiento, CSP y privacidad documentados | ✅ — 🔴 **CSP no existe** |
| Despliegue, caché y rollback documentados | ✅ |
| Runbooks críticos disponibles | ✅ **12/12** |
| Observabilidad y correlación con backend documentadas | ✅ — ⚠️ **No existe telemetría** |

---

## Métricas de calidad frente a los objetivos del plan

| Métrica | Objetivo | Real | |
| --- | ---: | ---: | --- |
| Rutas registradas documentadas | 100 % | **100 %** | ✅ |
| Journeys críticos documentados | 100 % | **100 %** | ✅ |
| Pantallas críticas con estados documentados | 100 % | **100 %** | ✅ |
| Componentes compartidos catalogados | 100 % | **100 %** | ✅ |
| Integraciones críticas trazadas | 100 % | **100 %** | ✅ |
| Stores/providers críticos documentados | 100 % | **100 %** | ✅ |
| **Flujos críticos con prueba** | 100 % o excepción formal | **8 %** (1/12) | 🔴 |
| **Incumplimientos críticos de accesibilidad abiertos** | 0 | **2** | 🔴 |
| **Riesgos críticos de seguridad abiertos** | 0 | **1 BLOCKER + 6 CRITICAL** | 🔴 |
| Regresiones nuevas de build, tipos, lint o pruebas | 0 | **0** | ✅ |
| Regresiones visuales no aprobadas | 0 | **0** | ✅ |
| Drift contractual crítico sin registrar | 0 | **0** (6 registrados) | ✅ |
| Enlaces internos válidos | 100 % | **100 %** | ✅ |
| Errores de compilación documental | 0 | **0** | ✅ |
| Marcadores TODO/TBD | 0 | **0** | ✅ |
| Runbooks críticos disponibles | 100 % | **100 %** | ✅ |

**11 de 16 métricas cumplen. Las 5 que no son de producto, no de documentación.**

---

## Requisitos para alcanzar «APTO PARA PRODUCCIÓN»

### Bloqueante — obligatorio

| # | Requisito | Esfuerzo |
| --- | --- | --- |
| 1 | **Rotar la contraseña de `pablo.admin`** y vaciar los valores iniciales de `useLoginViewModel.ts:8-9`. Reconstruir, republicar y evaluar la purga del historial | 2 líneas de código + acción administrativa |

### Críticos — obligatorios para una declaración responsable

| # | Requisito | Por qué |
| --- | --- | --- |
| 2 | **Confirmar con el backend que valida y autoriza cada operación** de forma independiente | Todo el modelo de amenazas descansa en ese supuesto, **hoy no verificado**. Si falla, cuatro riesgos pasan de bajos a críticos |
| 3 | **Verificar si existen** `{list}/batch/validate` y `/process` | La ruta `/batch/...` puede estar rota por completo |
| 4 | **Corregir los dos hallazgos críticos de accesibilidad** (`useModalLayer` y `FormField`) | Afectan a los 59 recursos; son **dos archivos** |
| 5 | **Endurecer el preset de Cloudinary** en su panel | Única mitigación posible de SEC-04 |
| 6 | **Escribir pruebas de `session.ts`, `formValidation.ts` y `resourceApi.ts`** | ~85 casos sobre funciones puras **ya exportadas**, sin tocar configuración |

### Altos — recomendados antes de crecer

7. Añadir CSP y cabeceras de seguridad.
8. Resolver la doble vía de FontAwesome (y con ella la falta de SRI).
9. Añadir `console.warn` a los cinco `catch` silenciosos.
10. Ejecutar `yarn audit` y registrar el resultado.
11. Establecer CI que impida publicar sin `yarn quality`.
12. Corregir el fallback de filtrado local (conjunto con backend).

---

## Riesgos residuales tras corregir el bloqueante

Aunque se cierre SEC-01, permanecen:

| Riesgo | Severidad |
| --- | --- |
| 14 de 15 journeys sin ninguna prueba automatizada | 🟠 Alto |
| Los 5 módulos que sostienen el negocio sin cobertura | 🟠 Alto |
| Ninguna detección de errores en producción | 🟠 Alto |
| Sin CI: se puede publicar código que no compila | 🟠 Alto |
| Filtrar tablas grandes puede congelar la pestaña | 🟠 Alto |
| Accesibilidad no conforme con WCAG 2.2 AA | 🟠 Alto |
| Sin CSP y con un recurso externo sin SRI | 🟡 Medio |
| Sin entorno de preproducción | 🟡 Medio |
| Contrato del backend no verificable | 🟡 Medio |

---

## Lo que este frontend hace bien

Registrado con el mismo rigor que los defectos, porque un informe que solo enumera problemas no describe el sistema:

| Fortaleza | Evidencia |
| --- | --- |
| **Arquitectura coherente y deliberada** | El CRUD dirigido por datos sirve 59 recursos con un solo motor |
| **Mensajes de error excelentes** | En español, sin jerga, accionables, y saneados para no filtrar topología interna |
| **Superficie de dependencias mínima** | 7 dependencias de producción |
| **Reversión trivial** | `dist/` versionado permite recuperar el artefacto exacto de cualquier publicación |
| **Tolerancia real al backend** | El frontend sobrevive a cambios de forma en las respuestas |
| **`localDraftStore` bien diseñado** | Saneado recursivo de campos sensibles, TTL de 7 días, recuperación ante corrupción |
| **Cero fuentes web** | Elimina la causa más común de CLS |
| **Sin `dangerouslySetInnerHTML`, sin `eval`** | Superficie de XSS propia muy reducida |
| **Ningún dato personal sale hacia terceros** | Sin analítica, sin telemetría externa |
| **Tutoriales sólidamente probados** | 118 casos, incluida validación de contrato entre catálogo y DOM |
| **Comentarios que explican el porqué** | El código documenta decisiones reales, no lo obvio |

**El problema no es la calidad de lo construido: es que la inversión en verificación no acompaña al riesgo, y que un descuido de desarrollo quedó publicado.**

---

## Declaración final

> **NO APTO PARA PRODUCCIÓN.**
>
> Requisito bloqueante: **SEC-01**.
>
> Corregido SEC-01 y verificados los puntos críticos 2 a 6, el sistema podría declararse apto **con riesgos residuales altos documentados y aceptados formalmente**.

Ver [final-validation.md](final-validation.md) para el informe consolidado.
