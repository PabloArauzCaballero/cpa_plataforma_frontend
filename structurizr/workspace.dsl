/*
 * CPA Plataforma Frontend — modelo C4
 *
 * Fuente oficial del modelo de arquitectura. Los diagramas Mermaid de docs/architecture/
 * son su representación navegable y deben mantenerse coherentes con este archivo.
 *
 * Verificado contra el commit 618e5c3 (2026-08-04).
 * Cada elemento lleva en su descripción el archivo del repositorio que lo respalda.
 *
 * Este archivo es DOCUMENTAL: no participa en el build ni en el despliegue.
 * Requiere structurizr-cli o Structurizr Lite para renderizar; ninguno está
 * instalado en el proyecto, y su incorporación sería una propuesta aparte.
 */
workspace "CPA Plataforma Frontend" "Panel administrativo interno del Centro de Preparacion Academica" {

    !identifiers hierarchical

    model {
        admin = person "Personal administrativo CPA" {
            description "Operadores, contabilidad y servicios educativos. Unico tipo de usuario del frontend."
        }

        backend = softwareSystem "CPA Plataforma Backend" "API REST NestJS. Autoridad de datos, permisos y reglas de negocio." {
            tags "External"
        }

        cloudinary = softwareSystem "Cloudinary" "Almacenamiento de archivos. Recibe subidas directas del navegador con un unsigned upload preset." {
            tags "External"
        }

        cdnjs = softwareSystem "cdnjs.cloudflare.com" "CDN publico. Sirve la hoja de estilos de FontAwesome 6.5.2 sin SRI (index.html:14)." {
            tags "External"
        }

        frontend = softwareSystem "CPA Plataforma Frontend" "SPA React 19 servida como assets estaticos desde dist/ versionado." {

            spa = container "Aplicacion de pagina unica" "React 19.2.7, TypeScript 6, react-router-dom 7.18.0" "JavaScript/TypeScript" {

                appRoot = component "Composicion raiz" "main.tsx, App.tsx. Monta ErrorBoundary + RouterProvider." "React"
                router = component "Router" "router.tsx. 10 rutas, todas con lazy() + Suspense." "react-router-dom"
                guard = component "ProtectedRoute" "Redirige a /login si getSessionToken() es null. No valida el token ni comprueba permisos." "React"
                shell = component "AppShell" "Layout autenticado: barra lateral, cabecera, pie. Monta TutorialProvider. Remonta el contenido con key={location.pathname}." "React"

                pages = component "Paginas" "9 paginas enrutadas + 2 compuestas embebidas (VentaClaseBatchPage, AsistenciaMasivaPage) + 1 huerfana (QualityGatePage)." "React"
                viewModels = component "View models" "6 hooks. useResourceListViewModel concentra 774 lineas y 22 useState." "React hooks"
                sharedUi = component "Componentes compartidos" "Button, Card, ConfirmDialog, DataTable, ErrorBoundary, FormField+SearchableSelect, Modal, PageState, SearchFilterBar, InfoHint." "React + CSS Modules"

                resourceDomain = component "Dominio de recursos" "resourceDefinitions.ts declara 59 recursos en 9 modulos. resourceFieldCatalog.ts (4803 lineas) enriquece los campos." "TypeScript"
                validation = component "Validacion de formularios" "shared/validation/formValidation.ts. Reglas genericas mas reglas especificas por recurso." "TypeScript"
                tutorials = component "Subsistema de tutoriales" "Engine, Registry, Provider, renderer driver.js, almacen resiliente de progreso. 17 de 32 comunidades del grafo." "TypeScript + driver.js"

                services = component "Servicios HTTP" "16 clientes: resourceApi, lookupApi, authApi, profileApi, ventaClaseApi, asistenciaMasivaApi, catalogosOperativosApi, fileServerApi, tutorialProgressApi, draft APIs." "TypeScript"
                mappers = component "Mappers" "Normalizan respuestas de forma variable. normalizeListResult tolera 5 estructuras distintas." "TypeScript"
                httpClient = component "httpClient" "Envoltorio de fetch. Anade X-Session-Token, sanea mensajes de error y limpia la sesion ante 401." "TypeScript"
                sessionStore = component "Sesion" "shared/auth/session.ts. Lee y escribe localStorage. userHasAnyPermission opera en modo permisivo." "TypeScript"
                envConfig = component "Configuracion" "config/env.ts. Lee VITE_API_BASE_URL y aborta si falta." "TypeScript"
                cloudinaryClient = component "Cliente Cloudinary" "shared/services/cloudinaryUpload.ts. Sube directo al tercero, sin pasar por el backend." "TypeScript"
            }

            storage = container "Almacenamiento del navegador" "localStorage. Sesion, borradores, carpetas de archivos, progreso y preferencias de tutoriales." "Web Storage API" {
                tags "Storage"
            }
        }

        hostingWorker = deploymentEnvironment "Produccion - Cloudflare" {
            deploymentNode "Navegador del usuario" {
                containerInstance frontend.spa
                containerInstance frontend.storage
            }
            deploymentNode "Cloudflare Workers" "Worker cpaplataformafrontend. assets.directory = ./dist (wrangler.jsonc). Sin CSP ni cabeceras de seguridad." {
                infrastructureNode "Assets estaticos" "dist/ versionado en el repositorio git"
            }
        }

        hostingDocker = deploymentEnvironment "Alternativa - Docker" {
            deploymentNode "Navegador del usuario" {
                containerInstance frontend.spa
            }
            deploymentNode "nginx 1.27-alpine" "docker/nginx.conf. try_files a index.html, gzip, cache inmutable en /assets/, no-store en index.html." {
                infrastructureNode "dist/ copiado en la imagen" "Etapa de build con node:24-alpine"
            }
        }

        # Relaciones de contexto
        admin -> frontend "Opera el panel administrativo" "HTTPS"
        frontend -> backend "Consume la API REST" "HTTPS/JSON, cabecera X-Session-Token"
        frontend -> cloudinary "Sube archivos directamente desde el navegador" "HTTPS multipart, unsigned preset"
        frontend -> cdnjs "Descarga la hoja de estilos de iconos" "HTTPS, sin SRI"

        # Relaciones de contenedor
        admin -> frontend.spa "Usa" "HTTPS"
        frontend.spa -> frontend.storage "Persiste sesion y estado local" "localStorage"
        frontend.spa -> backend "Peticiones REST" "fetch"
        frontend.spa -> cloudinary "Subida de archivos" "fetch multipart"

        # Relaciones de componente
        frontend.spa.appRoot -> frontend.spa.router "Monta"
        frontend.spa.router -> frontend.spa.guard "Protege las rutas privadas"
        frontend.spa.guard -> frontend.spa.sessionStore "getSessionToken()"
        frontend.spa.guard -> frontend.spa.shell "Renderiza si hay token"
        frontend.spa.shell -> frontend.spa.pages "Outlet, remontado por pathname"
        frontend.spa.shell -> frontend.spa.tutorials "Monta TutorialProvider"
        frontend.spa.shell -> frontend.spa.sessionStore "userHasAnyPermission para filtrar la navegacion"
        frontend.spa.shell -> frontend.spa.resourceDomain "resourceModules construye la barra lateral"

        frontend.spa.pages -> frontend.spa.viewModels "Delegan estado y efectos"
        frontend.spa.pages -> frontend.spa.sharedUi "Componen la interfaz"
        frontend.spa.pages -> frontend.spa.resourceDomain "findResourceDefinition"
        frontend.spa.pages -> frontend.spa.sessionStore "Permisos de accion"

        frontend.spa.viewModels -> frontend.spa.services "Invocan operaciones"
        frontend.spa.viewModels -> frontend.spa.validation "Validan antes de enviar"
        frontend.spa.services -> frontend.spa.mappers "Normalizan la respuesta"
        frontend.spa.services -> frontend.spa.httpClient "Peticiones"
        frontend.spa.httpClient -> frontend.spa.envConfig "assertEnv()"
        frontend.spa.httpClient -> frontend.spa.sessionStore "Token y limpieza ante 401"
        frontend.spa.httpClient -> backend "fetch"

        frontend.spa.cloudinaryClient -> cloudinary "Subida directa, sin backend"
        frontend.spa.pages -> frontend.spa.cloudinaryClient "Biblioteca de archivos y campo de subida"

        frontend.spa.tutorials -> frontend.spa.services "Sincroniza progreso"
        frontend.spa.tutorials -> frontend.spa.storage "Almacen local de respaldo"

        # Violacion de capas documentada: shared depende de features/tutorials
        frontend.spa.sharedUi -> frontend.spa.tutorials "Importa tutorialAnchors para incrustar anclas data-* (15 importaciones). Invierte la direccion esperada shared -> features."
    }

    views {
        systemContext frontend "Contexto" {
            include *
            autolayout lr
            description "C4 nivel 1. Actores y sistemas externos."
        }

        container frontend "Contenedores" {
            include *
            autolayout tb
            description "C4 nivel 2. SPA y almacenamiento del navegador."
        }

        component frontend.spa "Componentes" {
            include *
            autolayout tb
            description "C4 nivel 3. Composicion interna de la SPA."
        }

        deployment frontend "Produccion - Cloudflare" "DespliegueCloudflare" {
            include *
            autolayout lr
        }

        deployment frontend "Alternativa - Docker" "DespliegueDocker" {
            include *
            autolayout lr
        }

        styles {
            element "Person" {
                shape person
                background "#012B65"
                color "#ffffff"
            }
            element "Software System" {
                background "#012B65"
                color "#ffffff"
            }
            element "External" {
                background "#9AA9BB"
                color "#012B65"
            }
            element "Container" {
                background "#0E3E74"
                color "#ffffff"
            }
            element "Storage" {
                shape cylinder
                background "#195687"
                color "#ffffff"
            }
            element "Component" {
                background "#20A0C5"
                color "#ffffff"
            }
        }
    }
}
