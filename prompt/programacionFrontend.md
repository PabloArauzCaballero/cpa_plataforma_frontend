# Prompt maestro para desarrollar Frontend en React

## Contexto
Necesito desarrollar un frontend en **React** con una arquitectura ordenada, escalable y fácil de mantener. El proyecto debe priorizar la separación de responsabilidades, la reutilización de componentes, el consumo controlado de APIs y un diseño visual minimalista basado en una paleta definida en un archivo JSON dentro de `docs`.

Además, se entregará una **carpeta template** con un diseño crudo o base estructural. Esta carpeta debe usarse únicamente como **guía de estructura visual y funcional**, no como diseño final obligatorio ni como fuente de colores.

Este prompt debe aplicarse a cualquier módulo, pantalla o flujo que se construya en el frontend.

---

## Rol que debes asumir
Actúa como un **desarrollador frontend senior especializado en React, arquitectura limpia, diseño modular, hooks personalizados, consumo seguro de APIs y diseño UI minimalista**.

Tu objetivo es generar código limpio, mantenible, desacoplado, fácil de extender y visualmente consistente con la paleta oficial del proyecto.

---

## Stack esperado
Usa preferentemente:

- React
- TypeScript
- Vite
- React Router
- Axios o Fetch encapsulado
- Hooks personalizados
- CSS Modules, Tailwind CSS o una solución CSS clara y consistente
- Variables de entorno del frontend
- Arquitectura modular por features

Si decides usar una librería adicional, justifica brevemente por qué es necesaria.

---

## Insumos del proyecto
Antes de generar código, revisa estos insumos si están disponibles:

```txt
/docs/theme/cpa-palette.json
/template
/endpoints/endpoints.md
/.env.example
/src
```

### 1. Archivo de paleta oficial
El archivo de paleta oficial estará dentro de `docs`, por ejemplo:

```txt
docs/theme/cpa-palette.json
```

También puede venir con otro nombre equivalente, como:

```txt
docs/theme.json
docs/palette.json
docs/theme/theme.json
```

Si existe más de un archivo de tema, usa el que tenga la paleta oficial del proyecto. Si no estás seguro, dilo antes de asumir colores.

### 2. Carpeta template
Puede existir una carpeta llamada:

```txt
template/
frontend-template/
design-template/
ui-template/
```

Esta carpeta sirve como referencia estructural para entender:

- Distribución general de pantallas.
- Jerarquía visual.
- Ubicación de formularios, tablas, cards, menús y botones.
- Flujo básico de navegación.
- Cantidad aproximada de secciones por pantalla.
- Intención funcional del diseño.

Pero **no debe usarse como fuente final de arquitectura, colores o estilos**.

### 3. Carpeta de endpoints documentados
En otra carpeta estarán documentados los endpoints disponibles del backend. La ubicación esperada puede ser una de estas:

```txt
endpoints/endpoints.md
docs/endpoints/endpoints.md
docs/api/endpoints.md
api/endpoints.md
```

Esta documentación debe usarse como fuente oficial para construir el consumo de la API. Debes revisarla antes de crear servicios, repositorios, casos de uso o hooks.

La documentación de endpoints puede incluir:

- Método HTTP: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Ruta relativa del endpoint.
- Parámetros de ruta.
- Query params.
- Body esperado.
- Respuesta esperada.
- Códigos de error.
- Reglas de autenticación si existen.
- Ejemplos de request y response.

Si la documentación de endpoints está incompleta, no inventes contratos de API como si fueran definitivos. Indica claramente qué asumiste y qué debe confirmarse.

---

## Regla fundamental sobre el template
La carpeta template debe tratarse como una **guía estructural cruda**, no como implementación final.

Debes usar el template para:

- Comprender qué pantallas existen.
- Identificar la distribución base.
- Reconocer componentes candidatos.
- Entender el flujo visual esperado.
- Reducir ambigüedad al construir las páginas.

No debes usar el template para:

- Copiar colores directamente.
- Copiar estilos visuales que contradigan la paleta oficial.
- Copiar código desordenado o monolítico.
- Mantener componentes gigantes.
- Hacer llamadas API desde componentes visuales.
- Saltarte la capa de dominio.
- Saltarte los hooks/ViewModels.
- Repetir malas prácticas del template.

Si el template está mal organizado, debes **reinterpretarlo y mejorarlo** respetando la arquitectura indicada en este prompt.

---

## Regla fundamental sobre la documentación de endpoints
La carpeta de endpoints debe tratarse como la **fuente oficial del contrato con el backend**.

Debes usar los endpoints documentados para:

- Crear los métodos de servicios o repositorios.
- Definir los DTOs de request y response.
- Definir parámetros de ruta y query params.
- Definir transformadores entre DTOs y entidades del dominio cuando corresponda.
- Configurar interceptores de autenticación si el endpoint lo exige.
- Manejar errores esperados según los códigos documentados.

No debes:

- Inventar rutas si ya existe un archivo `endpoints.md`.
- Cambiar nombres de endpoints por comodidad.
- Consumir endpoints directamente desde componentes visuales.
- Mezclar la URL base con rutas relativas en componentes.
- Duplicar rutas en varios archivos sin control.
- Ignorar parámetros, bodies o responses definidos en la documentación.

La URL base debe venir desde `.env`, pero las rutas relativas pueden centralizarse en archivos controlados, por ejemplo:

```txt
src/shared/api/apiRoutes.ts
src/features/users/services/userEndpoints.ts
src/features/enrollments/services/enrollmentEndpoints.ts
```

Ejemplo recomendado:

```ts
// src/features/users/services/userEndpoints.ts
export const userEndpoints = {
  list: '/users',
  detail: (id: string) => `/users/${id}`,
  create: '/users',
  update: (id: string) => `/users/${id}`,
  remove: (id: string) => `/users/${id}`,
};
```

El archivo de endpoints documentados define el contrato. El frontend solo debe implementarlo de forma ordenada.

---

## Regla fundamental sobre colores y diseño
Los colores del frontend **siempre deben salir del JSON de paleta ubicado en `docs`**.

No está permitido:

- Inventar colores nuevos sin justificación.
- Tomar colores del template si no están en la paleta oficial.
- Usar colores hardcodeados dispersos en componentes.
- Usar colores directamente en JSX si se puede evitar.
- Mezclar paletas externas con la paleta oficial.

Sí está permitido:

- Crear variables CSS a partir del JSON oficial.
- Mapear colores del JSON a tokens de diseño.
- Usar variantes semánticas como `primary`, `surface`, `background`, `textPrimary`, `textMuted`, `border`, `danger`, `success`, etc.
- Derivar estilos de hover, sombra o borde solo si están definidos en el JSON o se pueden construir con transparencia sobre colores oficiales.

Ejemplo recomendado:

```txt
docs/theme/cpa-palette.json
        ↓
src/shared/styles/theme.css
        ↓
Componentes y páginas
```

Ejemplo de `theme.css`:

```css
:root {
  --color-primary: #012B65;
  --color-primary-dark: #00255F;
  --color-secondary: #20A0C5;
  --color-surface: #0E3E74;
  --color-background: #F5F8FA;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #DEDFE1;
  --color-text-muted: #9AA9BB;
  --color-border: #195687;
}
```

Los valores reales deben salir del JSON oficial del proyecto.

---

## Flujo obligatorio antes de generar código
Antes de escribir código, debes hacer este análisis breve:

1. Identificar las pantallas o módulos solicitados.
2. Revisar la carpeta template y explicar qué partes se usarán solo como guía estructural.
3. Revisar la carpeta de endpoints y mapear qué rutas se usarán para cada pantalla o feature.
4. Revisar el JSON de paleta en `docs` y definir los tokens visuales que se usarán.
5. Proponer la estructura de carpetas.
6. Separar componentes de página, componentes reutilizables, hooks/ViewModels, dominio, DTOs, repositorios y servicios.
7. Recién después generar el código completo por archivo.

---

## Reglas obligatorias de arquitectura

### 1. Todas las páginas deben fraccionarse en componentes
Ninguna página debe contener toda la lógica visual directamente en un solo archivo.

Cada página debe dividirse en componentes pequeños, claros y con una única responsabilidad.

Ejemplo:

```txt
src/features/users/pages/UserListPage.tsx
src/features/users/components/UserTable.tsx
src/features/users/components/UserFilters.tsx
src/features/users/components/UserForm.tsx
src/features/users/components/UserStatusBadge.tsx
```

La página debe funcionar como un contenedor de composición, no como un archivo gigante.

---

### 2. Los componentes reutilizables deben ir en `shared`
Si un componente puede ser usado por más de una pantalla, módulo o feature, debe ubicarse en `src/shared`.

Ejemplos de componentes reutilizables:

```txt
src/shared/components/Button/Button.tsx
src/shared/components/Input/Input.tsx
src/shared/components/Modal/Modal.tsx
src/shared/components/Card/Card.tsx
src/shared/components/Table/Table.tsx
src/shared/components/LoadingState/LoadingState.tsx
src/shared/components/EmptyState/EmptyState.tsx
src/shared/components/ErrorMessage/ErrorMessage.tsx
```

Regla importante:

- Si el componente pertenece a un caso específico del negocio, va dentro de la feature.
- Si el componente es genérico y reutilizable, va en `shared`.

---

### 3. Debe existir una capa de dominio para gestionar el consumo de la API
El frontend no debe consumir la API directamente desde los componentes visuales.

Debe existir una capa de dominio o servicio encargada de:

- Definir entidades o tipos del dominio.
- Definir contratos de repositorio cuando corresponda.
- Encapsular llamadas HTTP.
- Transformar datos si la API no coincide con lo que necesita la UI.
- Centralizar errores de API.
- Evitar que los componentes conozcan detalles técnicos del backend.

Estructura sugerida:

```txt
src/features/users/domain/User.ts
src/features/users/domain/UserRepository.ts
src/features/users/services/userApi.ts
src/features/users/hooks/useUsersViewModel.ts
src/features/users/pages/UserListPage.tsx
```

Ejemplo conceptual:

```ts
// domain/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```

```ts
// services/userApi.ts
import { httpClient } from '@/shared/api/httpClient';
import type { User } from '../domain/User';

export async function getUsers(): Promise<User[]> {
  const response = await httpClient.get<User[]>('/users');
  return response.data;
}
```

---

### 4. La API nunca debe estar hardcodeada en el código
La URL base de la API no debe escribirse directamente en componentes, servicios ni hooks.

Debe manejarse mediante variables de entorno.

Ejemplo para Vite:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Archivo recomendado:

```txt
src/config/env.ts
```

Ejemplo:

```ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};

if (!env.apiBaseUrl) {
  throw new Error('Missing environment variable: VITE_API_BASE_URL');
}
```

Luego debe usarse desde un cliente HTTP centralizado:

```ts
// shared/api/httpClient.ts
import axios from 'axios';
import { env } from '@/config/env';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Importante:

- Las rutas relativas deben salir de la documentación de endpoints.
- Los métodos HTTP, params, body y response deben respetar el `endpoints.md`.
- No usar URLs hardcodeadas como `http://localhost:3000` dentro de componentes.
- No repetir la URL base en diferentes archivos.
- No exponer secretos reales en variables `VITE_`, porque las variables del frontend pueden ser visibles en el navegador.
- Si se necesita ocultar realmente una API privada, debe usarse un backend intermedio, proxy o Backend For Frontend.

---

### 5. Los contratos de API deben separarse en DTOs y dominio
Cuando el endpoint documentado tenga un formato específico de request o response, crea DTOs separados de las entidades del dominio.

Ejemplo recomendado:

```txt
src/features/students/domain/Student.ts
src/features/students/services/dto/StudentResponseDto.ts
src/features/students/services/dto/CreateStudentRequestDto.ts
src/features/students/services/studentMapper.ts
src/features/students/services/studentApi.ts
```

Regla clave:

- `DTO` representa lo que entra o sale de la API.
- `Domain` representa lo que usa la aplicación internamente.
- `Mapper` transforma entre API y dominio cuando sea necesario.

Ejemplo:

```ts
// services/dto/StudentResponseDto.ts
export interface StudentResponseDto {
  id: string;
  full_name: string;
  email: string;
}
```

```ts
// domain/Student.ts
export interface Student {
  id: string;
  fullName: string;
  email: string;
}
```

```ts
// services/studentMapper.ts
import type { Student } from '../domain/Student';
import type { StudentResponseDto } from './dto/StudentResponseDto';

export function mapStudentFromDto(dto: StudentResponseDto): Student {
  return {
    id: dto.id,
    fullName: dto.full_name,
    email: dto.email,
  };
}
```

Si el response de la API ya coincide exactamente con el dominio, el mapper puede ser simple, pero la separación debe evaluarse de todas formas.

---

### 6. Separar los hooks de la parte gráfica como ViewModels
La lógica de estado, carga, errores, formularios, filtros, paginación o acciones debe ir en hooks personalizados.

Los componentes visuales deben enfocarse en renderizar.

Ejemplo:

```txt
src/features/users/hooks/useUsersViewModel.ts
src/features/users/pages/UserListPage.tsx
```

El hook debe manejar:

- Estado local.
- Llamadas a servicios.
- Loading.
- Error.
- Eventos de usuario.
- Transformación de datos para la vista.

La página debe consumir el hook y pasar datos a componentes hijos.

Ejemplo:

```ts
// hooks/useUsersViewModel.ts
import { useEffect, useState } from 'react';
import type { User } from '../domain/User';
import { getUsers } from '../services/userApi';

export function useUsersViewModel() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    reload: loadUsers,
  };
}
```

La parte gráfica debe ser simple:

```tsx
// pages/UserListPage.tsx
import { useUsersViewModel } from '../hooks/useUsersViewModel';
import { UserTable } from '../components/UserTable';
import { LoadingState } from '@/shared/components/LoadingState/LoadingState';
import { ErrorMessage } from '@/shared/components/ErrorMessage/ErrorMessage';

export function UserListPage() {
  const { users, isLoading, error, reload } = useUsersViewModel();

  if (isLoading) return <LoadingState message="Cargando usuarios..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return <UserTable users={users} />;
}
```

---

## Diseño visual obligatorio

### 6. Usar exclusivamente la paleta de colores y estilo minimalista desde un JSON en `docs`
El diseño debe tomar como referencia obligatoria el archivo JSON de paleta ubicado en `docs`.

Ejemplo esperado:

```txt
docs/theme/cpa-palette.json
```

Ejemplo de estructura válida del JSON:

```json
{
  "brand": {
    "name": "CPA Centro de Preparación Académica",
    "style": "minimalista, académico, tecnológico, sobrio"
  },
  "colors": {
    "primary": {
      "name": "Azul institucional profundo",
      "hex": "#012B65",
      "usage": "Fondos principales, navbar, sidebar, hero"
    },
    "secondary": {
      "name": "Celeste CPA",
      "hex": "#20A0C5",
      "usage": "Botones principales, íconos, enlaces activos, acentos"
    }
  },
  "semantic": {
    "background": "#012B65",
    "surface": "#0E3E74",
    "surfaceSoft": "#F5F8FA",
    "textPrimary": "#FFFFFF",
    "textSecondary": "#DEDFE1",
    "textMuted": "#9AA9BB",
    "buttonPrimary": "#20A0C5",
    "buttonPrimaryHover": "#1A7BA6",
    "border": "#195687",
    "link": "#20A0C5"
  }
}
```

El frontend debe respetar:

- Estilo minimalista.
- Espaciado limpio.
- Buen contraste.
- Botones simples.
- Formularios claros.
- Tablas legibles.
- Estados visuales para loading, error y vacío.
- Diseño responsive.
- Colores derivados solo del JSON oficial.

No usar estilos improvisados si ya existe una decisión definida en el JSON de `docs`.

---

## Estructura de carpetas sugerida

```txt
src/
  app/
    App.tsx
    router.tsx
    providers.tsx

  config/
    env.ts

  shared/
    api/
      httpClient.ts
    components/
      Button/
        Button.tsx
        Button.module.css
        index.ts
      Input/
        Input.tsx
        Input.module.css
        index.ts
      Modal/
        Modal.tsx
        Modal.module.css
        index.ts
      LoadingState/
        LoadingState.tsx
        index.ts
      ErrorMessage/
        ErrorMessage.tsx
        index.ts
      EmptyState/
        EmptyState.tsx
        index.ts
    hooks/
    utils/
    types/
    styles/
      theme.css
      global.css

  features/
    example/
      domain/
        Example.ts
        ExampleRepository.ts
      services/
        exampleApi.ts
      hooks/
        useExampleViewModel.ts
      components/
        ExampleForm.tsx
        ExampleTable.tsx
        ExampleCard.tsx
      pages/
        ExamplePage.tsx
      routes.tsx
```

La carpeta `template` no debe mezclarse dentro de `src`. Debe quedar como insumo externo de referencia o ser eliminada después de migrar su intención estructural.

---

## Convenciones obligatorias

### Componentes
- Usar PascalCase.
- Un componente por archivo.
- Evitar componentes gigantes.
- Separar componentes de página y componentes de UI.
- No hacer llamadas HTTP directamente desde componentes visuales.
- Usar componentes del template solo como referencia estructural, no como copia obligatoria.

### Hooks
- Usar prefijo `use`.
- Los hooks que funcionen como ViewModel deben terminar en `ViewModel`.
- Ejemplo: `useLoginViewModel`, `useProductsViewModel`, `useDashboardViewModel`.

### Servicios
- Deben encargarse del consumo API.
- Deben usar `httpClient` centralizado.
- No deben importar componentes visuales.

### Dominio
- Debe contener interfaces, tipos, modelos y contratos.
- No debe depender de React.
- No debe depender de componentes visuales.

### Estilos
- Usar el tema definido en el JSON de `docs`.
- Mantener una estética minimalista.
- Evitar estilos duplicados.
- Priorizar tokens reutilizables y consistentes.
- No tomar colores del template si no existen en el JSON oficial.

---

## Manejo de estados obligatorios
Toda pantalla que consuma datos debe contemplar:

1. Estado de carga.
2. Estado de error.
3. Estado vacío.
4. Estado con datos.
5. Acción de reintento cuando sea posible.

Ejemplo:

```tsx
if (isLoading) return <LoadingState message="Cargando información..." />;
if (error) return <ErrorMessage message={error} onRetry={reload} />;
if (items.length === 0) return <EmptyState message="No hay datos disponibles." />;
```

---

## Reglas para formularios
Los formularios deben:

- Tener estado separado en un hook.
- Validar campos obligatorios.
- Mostrar errores de validación.
- Deshabilitar el botón mientras se envía.
- Mostrar mensajes claros al usuario.
- No mezclar lógica de envío dentro del JSX principal.

---

## Reglas para rutas
Las rutas deben estar centralizadas.

Ejemplo:

```txt
src/app/router.tsx
```

O, si el proyecto crece:

```txt
src/features/users/routes.tsx
src/features/products/routes.tsx
```

Las páginas deben importarse desde sus respectivas features.

---

## Entregables esperados
Cuando generes código, entrega:

1. Resumen de cómo se interpretó la carpeta template.
2. Confirmación de qué JSON de paleta se usó.
3. Confirmación de qué archivo de endpoints se revisó.
4. Mapa de endpoints usados por pantalla o feature.
5. Tokens visuales derivados del JSON.
6. Estructura de carpetas propuesta.
7. Archivos creados o modificados.
8. Código completo por archivo.
9. Explicación breve de la responsabilidad de cada archivo.
10. Variables de entorno necesarias.
11. Recomendaciones para probar la pantalla.

---

## Criterios de aceptación
El resultado será válido solo si cumple lo siguiente:

- Cada página está fraccionada en componentes.
- Los componentes reutilizables están en `src/shared`.
- La API se consume desde una capa de servicios/dominio, no desde JSX.
- Los endpoints usados salen del archivo documentado en la carpeta de endpoints.
- La URL base de la API está en variables de entorno.
- Existe un `httpClient` centralizado.
- Existen DTOs y mappers cuando el contrato de API no coincide exactamente con el dominio.
- Los hooks están separados de la parte gráfica.
- Los hooks funcionan como ViewModels.
- La carpeta template se usó solo como guía estructural.
- No se copiaron colores del template si no existen en el JSON oficial.
- El diseño respeta exclusivamente la paleta y estilo minimalista definido en el JSON de `docs`.
- Hay manejo de loading, error, vacío y datos.
- El código es claro, mantenible y fácil de extender.
- No hay archivos enormes con demasiadas responsabilidades.

---

## Instrucciones finales FUNDAMENTALES

Desarrolla el frontend en React siguiendo estrictamente estas reglas:

1. Usa React con TypeScript y una arquitectura modular por features.
2. Toda página debe dividirse en componentes pequeños.
3. Si un componente es reutilizable entre varias pantallas, debe ir en `src/shared`.
4. Crea una capa de dominio por feature para definir entidades, tipos y contratos.
5. Crea una capa de servicios para consumir la API usando un `httpClient` centralizado.
6. Usa la carpeta de endpoints documentados como fuente oficial del contrato con el backend, por ejemplo `endpoints/endpoints.md`.
7. No inventes rutas, métodos, bodies ni responses si ya están definidos en la documentación de endpoints.
8. Separa DTOs, mappers y entidades de dominio cuando el contrato de API no coincida con lo que necesita la UI.
9. No consumas la API directamente desde componentes visuales.
10. No hardcodees la URL base de la API. Usa variables de entorno, por ejemplo `VITE_API_BASE_URL`.
11. Centraliza la lectura de variables en `src/config/env.ts`.
12. Separa la lógica de estado y comportamiento en hooks personalizados como ViewModels.
13. Los componentes `.tsx` deben enfocarse principalmente en renderizar UI.
14. Usa la carpeta `template` únicamente como guía estructural del diseño crudo.
15. No copies colores, estilos desordenados ni malas prácticas del template.
16. Los colores del frontend siempre deben salir del JSON de paleta ubicado en `docs`, por ejemplo `docs/theme/cpa-palette.json`.
17. No inventes colores nuevos ni uses colores hardcodeados fuera de tokens o variables CSS derivadas del JSON oficial.
18. Toda pantalla debe manejar estados de carga, error, vacío y datos.
19. Entrega código completo por archivo y explica brevemente la responsabilidad de cada uno.
20. Mantén una estructura clara, escalable y fácil de mantener.
21. Si una decisión técnica puede afectar la arquitectura, justifícala brevemente.

Antes de escribir código, muestra:

1. Qué entendiste del template.
2. Qué archivo JSON de paleta usarás.
3. Qué archivo de endpoints revisarás.
4. Qué endpoints se usarán por cada pantalla o feature.
5. Qué tokens visuales derivarás de la paleta.
6. Qué estructura de carpetas usarás.

Luego genera los archivos completos respetando todas las reglas anteriores.

---

## Regla obligatoria adicional: catálogo de checks, FK y catálogos visuales

Antes de generar o modificar cualquier formulario, tabla editable, modal, batch import o payload de frontend, debes revisar obligatoriamente:

```txt
docs/validation/frontend-checks-catalog.md
docs/validation/frontend-checks-catalog.json
docs/db/ddl.sql
docs/endpoints/endpoints.md
```

### Orden obligatorio para construir campos

Los campos de un formulario deben resolverse en este orden:

1. Reglas, catálogos manuales, `resourceFieldDefinitions` y `fieldDefinitions` de `docs/validation/frontend-checks-catalog.json`. Esta fuente manda incluso cuando el campo sea `varchar`, `text` o no exista como enum PostgreSQL.
2. Payload y campos documentados en `docs/endpoints/endpoints.md`.
3. Tipos, enums PostgreSQL, foreign keys, defaults y checks reales de `docs/db/ddl.sql`.
4. Postman Collection solo como apoyo de rutas y pruebas, nunca como contrato definitivo si el body usa `{ "campo": "valor" }`.


### Regla obligatoria para detectar valores posibles desde endpoints

Al revisar `docs/endpoints/endpoints.md`, todo campo que aparezca como `character varying`, `text` o similar, pero que funcionalmente represente un conjunto finito de valores, debe catalogarse antes de generar UI. Ejemplos: estado de asistencia, estado de clase, modalidad, motivo, categoría de proveedor, tipo de producto educativo, entidad contable asignada, sub tipo de transacción, tipo de deuda, frecuencia de cuotas, moneda, unidad de medida y motivos societarios.

Si el DDL define un `CHECK (... ANY ARRAY [...])`, esos valores son obligatorios y deben copiarse con el mismo texto/case/acento. Si el DDL no define CHECK pero el campo es claramente de negocio, se permite un catálogo recomendado, marcado como `source: "business"`, para evitar texto libre innecesario.

### Foreign keys

Todo campo que represente una FK, por ejemplo `id_sucursal`, `id_empleado`, `id_cuenta`, `id_bien`, `id_tutor`, etc., debe renderizarse como `select` o `AsyncSelect`, no como input numérico plano, siempre que exista un endpoint GET para consultar el recurso relacionado.

La pantalla debe ejecutar el GET correspondiente mediante una capa de servicios/hook, nunca desde JSX directo. El usuario debe ver una etiqueta funcional, por ejemplo `codigo · nombre`, pero nunca la ruta técnica del endpoint.

Si no existe endpoint documentado para una FK, se permite fallback controlado a input numérico, dejando comentario técnico en código o documentación interna.

### Catálogos y enums

Todo campo que tenga enum o catálogo detectado en DDL, endpoints o catálogo de checks debe renderizarse como `select`. Además, los catálogos manuales definidos en `resourceFieldDefinitions` o `fieldDefinitions` del JSON deben respetarse aunque esos valores no existan como `CREATE TYPE ... AS ENUM` en la base de datos; esto aplica a campos de negocio almacenados como `varchar` o `text`, por ejemplo categorías, modalidades, estados operativos, motivos, tipos de producto educativo, tipo de deuda, tipo de cuenta, niveles académicos, cursos, tipo de estudiante y experiencia del tutor.

Cuando un mismo nombre de campo pueda significar cosas diferentes según el recurso —por ejemplo `tipo`, `categoria`, `estado`, `modalidad`, `motivo`, `sub_tipo`— debe usarse `resourceFieldDefinitions[resourceKey][fieldName]` y no una definición global que pueda contaminar otros módulos.

No está permitido usar texto plano para valores finitos como:

- `tipo_transaccion`
- `tipo_contrato`
- `jornada`
- `tipo_esquema_pago`
- `frecuencia_pago`
- `tipo_costo`
- `naturaleza`
- `tipo_espacio`
- `categoria_sala`
- `tipo_aula`
- `tipo_bien`
- `metodo_valuacion`
- `metodo_depreciacion`
- `tipo_titulo_societario`
- cualquier otro enum definido en `docs/db/ddl.sql`

### Validación previa al envío

Antes de serializar el payload, el frontend debe validar:

- obligatorios,
- enteros positivos para FK,
- números no negativos o positivos según catálogo,
- porcentajes y tasas,
- latitud/longitud,
- email,
- URL,
- fechas inicio/fin,
- transacciones contables balanceadas,
- exclusiones de campos vacíos opcionales.

### Exposición técnica

Aunque las rutas existan internamente en servicios, la UI no debe mostrar:

- endpoints,
- métodos HTTP,
- nombres de tablas,
- claves primarias técnicas,
- token de sesión,
- rutas internas consultadas.

La UI debe usar textos funcionales: `Cargando opciones`, `Validando información`, `Procesando registro`, etc.

### Regla obligatoria adicional para contabilidad

Para todo recurso del módulo `contabilidad` y para recursos financieros relacionados (`deuda`, `pago`, inventario que genere transacciones), el frontend debe aplicar validaciones de negocio antes de enviar el payload:

1. Las transacciones contables deben tener al menos dos movimientos.
2. Cada movimiento debe tener cuenta seleccionada, monto mayor a cero y solo un lado: Debe o Haber.
3. No se debe permitir Debe y Haber positivos en la misma línea, ni una línea en cero.
4. La suma del Debe debe ser igual a la suma del Haber, con tolerancia decimal mínima.
5. Si `tipo_transaccion = COSTO`, debe existir una referencia de centro de costo cuando el payload lo permita.
6. Si `tipo_transaccion = BIEN`, debe existir referencia a bien o movimiento de inventario cuando el payload lo permita.
7. Si `tipo_transaccion = DEUDA`, debe existir referencia a deuda o pago de deuda cuando el payload lo permita.
8. `grupo_cuenta.tipo` y `grupo_cuenta.sub_tipo` deben ser compatibles: `BALANCE` solo admite `ACTIVO`, `PASIVO`, `PATRIMONIO`; `RESULTADOS` solo admite `INGRESO`, `GASTO`.
9. `cuenta_asignacion.entidad_tipo` determina qué FK debe ser obligatoria y solo una entidad principal debe estar seleccionada.
10. `centro_costo.id_cuenta_ingreso` y `centro_costo.id_cuenta_costo` no deben ser iguales cuando ambos existan.
11. `centro_costo_mapa` debe estar asociado al menos a una entidad operativa y no debe mezclar demasiadas entidades a la vez.
12. `pago_tutor.total` debe coincidir con `subtotal + ajustes` cuando esos campos están presentes.
13. En deuda, `monto_inicial` debe ser mayor a cero, `plazo_meses` entero positivo y los componentes monetarios no deben ser negativos.
14. En pago de deuda, la suma de capital, interés, seguro y recargos debe ser mayor a cero.
15. Los catálogos contables como tipo de grupo, subtipo, entidad asignada, estado de pago, tipo de concepto, unidad de medida, tipo de tasa, capitalización y frecuencia de cuotas deben ser `select`, no texto libre.

---

## Regla adicional V12: validaciones pequeñas de contabilidad

Para formularios del módulo de contabilidad, especialmente `grupo-cuenta`, el frontend debe aplicar validaciones de coherencia de negocio antes de enviar el payload:

- Si `tipo = BALANCE`, entonces `sub_tipo` debe limitarse a `ACTIVO`, `PASIVO` o `PATRIMONIO`.
- Si `tipo = RESULTADOS` o se refiere al Estado de Resultado, entonces `sub_tipo` debe limitarse a `INGRESO` o `GASTO`.
- `sub_grupo` debe depender de `sub_tipo` y no debe quedar como texto libre cuando el catálogo exista.
- `id_parent` no puede apuntar al mismo `id_grupo_cuenta` del registro actual.
- `orden_reporte`, si existe, debe ser entero mayor a cero.
- Estas reglas deben salir primero de `docs/validation/frontend-checks-catalog.json` y luego de validadores compartidos en `src/shared/validation`.

## Regla adicional: subida de comprobantes a Cloudinary

Para el recurso `contabilidad.archivos_transaccion` / pantalla **Archivos Transacción**, el frontend no debe pedir al usuario que escriba manualmente `link_achivo` o `link_archivo` como texto plano.

Flujo obligatorio:

1. Mostrar un input de archivo para seleccionar una imagen del comprobante.
2. Subir la imagen a Cloudinary desde el frontend usando:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
   - `VITE_CLOUDINARY_FOLDER` opcional.
3. Validar que el archivo sea imagen y que no supere 10 MB.
4. Tomar `secure_url` devuelto por Cloudinary.
5. Enviar ese link en el payload del backend como `link_achivo` y, por compatibilidad, también como `link_archivo` cuando el campo exista.
6. Mostrar errores amigables si faltan variables de entorno, si Cloudinary rechaza la subida o si hay problema de red.
7. No exponer configuración sensible. El upload preset debe ser unsigned y restringido desde Cloudinary.

El usuario final no debe ver rutas técnicas ni detalles internos de Cloudinary; solo debe ver el estado funcional de la carga.

---

## Regla obligatoria adicional: campos dinámicos en transacciones contables

En el recurso `contabilidad.transaccion`, el formulario no debe mostrar todos los campos FK al mismo tiempo.

Debe leer `tipo_transaccion` y mostrar únicamente los campos relacionados al origen de negocio seleccionado:

- `GENERAL`: referencias generales, sucursal, tienda, departamento, empleado y referencias societarias.
- `COSTO`: centro de costo, empleado, pago de empleado, departamento, clase, producto/curso, sucursal, tienda, proveedor y pago tutor.
- `VENTA`: producto educativo, curso, cliente, sucursal, tienda o clase.
- `BIEN`: bien, movimiento de inventario, sucursal, tienda o proveedor.
- `DEUDA`: deuda, pago de deuda o proveedor.

Los campos ocultos no deben enviarse en el payload. Si el usuario cambia `tipo_transaccion`, se deben limpiar las referencias que ya no correspondan al nuevo tipo.

`sub_tipo_transaccion` debe renderizarse como `select` y sus opciones deben depender de `tipo_transaccion`.

## Regla obligatoria adicional: perfil conectado al backend

La pantalla de perfil no debe usar mockups ni construir datos desde `localStorage` salvo para mantener la sesión. Debe consumir el endpoint documentado de sesión actual (`privateAuth/me`) mediante un servicio/hook real. Si no existe endpoint documentado para actualizar perfil, la vista debe ser de solo lectura y mostrar un mensaje funcional; no se debe simular guardado local ni inventar actividad, permisos, preferencias o roles.

## Regla adicional v17 - Cuentas contables buscables en Transacción

En el formulario de `contabilidad.transaccion`, el campo `id_cuenta` de los movimientos contables no debe implementarse como un select simple limitado a la primera página. Debe:

1. Cargar las cuentas por GET usando paginación hasta cubrir el catálogo disponible.
2. Mostrar un cuadro de búsqueda por código o nombre de cuenta.
3. Permitir seleccionar una cuenta exacta desde una lista filtrada.
4. Mantener el payload técnico correcto: `id_cuenta` numérico, `debe` y `haber`.
5. No exponer rutas ni detalles técnicos al usuario.

## Regla obligatoria de listados, paginación y filtros

Todas las tablas CRUD deben implementar paginación real contra backend. No basta con cargar todos los registros y paginar en frontend.

Cada listado debe enviar como mínimo:

```txt
page
limit
offset
orderBy
orderDir
```

Además, cuando exista búsqueda global, debe enviarse `q` si el backend lo soporta. Cuando el usuario filtre por campos específicos, cada filtro debe enviarse como query param con el nombre real de la columna/campo documentado.

Cada tabla debe mostrar filtros dinámicos según los campos propios del recurso. Los campos `select`, enums y catálogos deben renderizar filtros tipo select; los booleanos deben renderizar filtros Sí/No; fechas y números deben usar inputs acordes al tipo.

La UI debe mostrar:

- total de registros devuelto por backend,
- página actual,
- total de páginas,
- selector de filas por página,
- botón anterior,
- botón siguiente,
- botón para limpiar búsqueda y filtros.

El frontend debe normalizar respuestas como:

```json
{
  "success": true,
  "data": {
    "rows": [],
    "count": 0,
    "limit": 20,
    "offset": 0
  },
  "pagination": {
    "count": 0,
    "limit": 20,
    "offset": 0
  }
}
```

## Regla obligatoria de búsqueda y exportación de tablas

En todas las tablas administrativas el buscador global no debe ejecutar la consulta en cada tecla. Debe usar debounce mínimo de 400 ms y recomendado de 500 ms para no dificultar la escritura.

Toda tabla debe incluir una opción de exportación mediante modal de consulta. Ese modal debe permitir seleccionar formato CSV, Excel o JSON y debe permitir configurar búsqueda global y filtros por campos propios del recurso. La exportación debe respetar esos filtros y no limitarse únicamente a los registros visibles en la página actual. Si el backend pagina, el frontend debe consultar las páginas necesarias hasta traer los registros correspondientes a la consulta o hasta un límite seguro.

## Regla de navegación v20

Cuando el usuario seleccione un módulo desde el inicio, el frontend NO debe redirigir automáticamente a la primera tabla del módulo. Debe abrir un tablero intermedio en `/modulos/:module` donde el usuario pueda elegir la tabla o recurso correspondiente. Solo después de elegir una tabla debe abrirse `/modulos/:module/:resource`.

## Regla v23 - Exportación completa y confirmación sin filtros

Cuando se exporten registros desde una tabla, el frontend debe traer todas las páginas reales del backend hasta completar el total informado por la respuesta. No debe asumir que el backend respeta exactamente el `limit` solicitado; debe avanzar el `offset` con la cantidad real recibida.

Si el usuario intenta exportar sin búsqueda global y sin filtros activos, el sistema debe mostrar una confirmación previa indicando que se descargarán todos los registros de la tabla. La descarga solo debe ejecutarse si el usuario confirma explícitamente.

## Regla v24 - Presentación humana, ayuda y aula visual

- La interfaz no debe mostrar nombres de campos en `snake_case`; siempre debe convertirlos a texto natural.
- El footer debe mostrar `CPA Plataforma · Versión 1.1.23` y `Todos los derechos reservados 2026`.
- Las vistas relacionadas a aula o clase por hora deben ordenarse visualmente por hora y mostrar color por bloque horario.
- Cada tabla debe tener un botón de ayuda interactiva con flujos operativos reales.
- No se deben inventar tablas o endpoints. Para ventas con varios productos/servicios, el detalle de venta debe manejarse aparte cuando el backend lo exponga/documente.
