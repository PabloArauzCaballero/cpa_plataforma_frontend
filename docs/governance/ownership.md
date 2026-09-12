# Propiedad y responsabilidades

## Estado actual

**El repositorio no declara propietarios.** No existe `CODEOWNERS`, ni `MAINTAINERS`, ni sección de responsables en el `README.md`.

Lo único verificable es el historial de git:

```bash
git shortlog -sn --all
```

El historial muestra un **único autor principal** (Pablo Arauz Caballero), con ramas de trabajo con prefijo `pablo/`.

> Durante esta auditoría había **otros dos agentes trabajando simultáneamente** sobre el repositorio, que produjeron commits y modificaciones en paralelo. Eso confirma que el modelo de propiedad real es más amplio que el que refleja el historial, y refuerza la necesidad de declararlo.

## Propuesta de asignación

> **No implementada**: crear `CODEOWNERS` requiere conocer las personas y equipos reales, información que no está en el repositorio.

| Área | Archivos | Perfil responsable sugerido |
| --- | --- | --- |
| Composición raíz y routing | `src/app/**` | Frontend senior |
| Motor CRUD | `src/features/resources/**` | Frontend senior — **mayor concentración de riesgo** |
| Definiciones de recurso | `resourceDefinitions.ts`, `resourceFieldCatalog.ts` | Frontend + negocio: los campos reflejan reglas contables y académicas |
| Autenticación y sesión | `src/shared/auth/**`, `src/features/auth/**` | Frontend + seguridad |
| Cliente HTTP y servicios | `src/shared/api/**`, `src/features/*/services/**` | Frontend + backend |
| Componentes compartidos | `src/shared/components/**` | Frontend + diseño |
| Sistema de diseño | `src/shared/styles/**` | Diseño |
| Tutoriales | `src/features/tutorials/**` | Quien mantenga la adopción del producto |
| Validaciones contables | `src/shared/validation/formValidation.ts` | **Contabilidad** debe revisar las reglas |
| Build y despliegue | `vite.config.ts`, `Dockerfile`, `docker/`, `wrangler.jsonc` | Operaciones |
| Documentación | `docs/`, `structurizr/`, `scripts/` | Quien realice el cambio, revisado por el área correspondiente |

## Responsabilidades que hoy no tienen dueño declarado

| Responsabilidad | Consecuencia de que nadie la asuma |
| --- | --- |
| **Rotar la credencial de [SEC-01](../security/frontend-security.md#sec-01)** | El acceso administrativo sigue expuesto |
| Configurar restricciones del preset de Cloudinary | Única mitigación posible de [SEC-04](../security/frontend-security.md#sec-04) |
| Mantener `CORS_ORIGINS` sincronizado con el dominio | Un cambio de dominio deja la aplicación sin datos |
| Verificar los endpoints de batch con backend | La ruta `/batch/...` puede estar rota sin que nadie lo sepa |
| Vigilar vulnerabilidades de dependencias | Nadie ejecuta `yarn audit` |
| Publicar en Cloudflare | Proceso manual sin registro de quién publicó |
| Aprobar cambios que afectan a los 59 recursos | Nada exige revisión |

## Fronteras con otros equipos

| Frontera | Quién decide |
| --- | --- |
| Contrato de la API | **Backend.** El frontend lo consume y lo tolera; no lo define |
| Autorización real | **Backend.** El frontend solo oculta botones |
| Reglas de negocio | **Backend** es la autoridad; el frontend replica algunas como ayuda al usuario |
| Esquema de base de datos | **Backend.** `resourceDefinitions` lo refleja |
| Dominio y DNS | Operaciones / Cloudflare |
| Cuenta de Cloudinary | Operaciones |

> **Supuesto crítico sin verificar:** todo el [modelo de amenazas](../security/threat-model.md) asume que el backend valida y autoriza cada operación de forma independiente. **Nadie ha confirmado ese supuesto durante esta auditoría.** Verificarlo es responsabilidad conjunta y es requisito previo a declarar aptitud productiva.

## Propuesta de `CODEOWNERS`

```
# .github/CODEOWNERS — plantilla, requiere nombres reales
/src/app/                                   @frontend-lead
/src/features/resources/                    @frontend-lead
/src/features/resources/domain/             @frontend-lead @contabilidad
/src/shared/auth/                           @frontend-lead @seguridad
/src/shared/api/                            @frontend-lead @backend-lead
/src/shared/components/                     @frontend-lead @diseno
/src/shared/styles/                         @diseno
/src/shared/validation/formValidation.ts    @contabilidad
/vite.config.ts                             @operaciones
/Dockerfile                                 @operaciones
/wrangler.jsonc                             @operaciones
/docs/                                      @frontend-lead
/docs/security/                             @seguridad
```

Requiere que el repositorio esté en una plataforma que soporte `CODEOWNERS` y que existan los equipos correspondientes.

## Rotación de conocimiento

Riesgo identificado: la mayor parte del conocimiento del proyecto está concentrada, y una porción relevante **no está en el repositorio** (configuración de Cloudinary, del Worker, del dominio y de `CORS_ORIGINS`).

Esta documentación reduce ese riesgo para el código. La configuración externa sigue siendo conocimiento tácito: registrarla es la acción pendiente. Ver [../operations/configuration.md](../operations/configuration.md).
