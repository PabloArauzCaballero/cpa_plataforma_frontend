# Datos de prueba

## Estado

**Todos los datos de prueba son sintéticos y deterministas.** Ninguna prueba toca un servicio real.

Verificable: no hay prueba que llegue a la capa HTTP, porque no hay pruebas de `httpClient` ni de servicios.

## Fábrica existente

`src/__tests__/tutorials/testFactories.ts` es el único módulo de datos de prueba, y está bien construido:

| Elemento | Qué aporta |
| --- | --- |
| `InMemoryProgressStorage` | **Implementa el mismo puerto** `TutorialProgressStorage` que la implementación de producción |
| Constructores de tutorial y de progreso | Datos deterministas para las 118 pruebas del subsistema |

Que el doble de prueba implemente el puerto real es una señal de buen diseño: Graphify lo destacó como una de las «conexiones sorprendentes» del grafo, y garantiza que el doble no se desvíe del contrato.

## Reglas

1. **Datos sintéticos siempre.** Nunca datos de producción, ni siquiera anonimizados.
2. **Deterministas.** Sin `Math.random()`, sin `Date.now()` sin control: una prueba debe dar el mismo resultado siempre.
3. **Sin datos personales reales.** El sistema trata datos de menores; ni un nombre real debe entrar en el repositorio.
4. **Sin credenciales.** Ninguna prueba debe contener una contraseña que exista de verdad.
5. **Sin llamadas de red.** Ninguna prueba debe alcanzar el backend, Cloudinary ni ningún CDN.

## Nombres de ejemplo sugeridos

Para las pruebas futuras del núcleo de negocio, y para que el glosario sea reconocible sin usar datos reales:

| Entidad | Ejemplo |
| --- | --- |
| Estudiante universitario | `Ana Quispe`, carrera `Ingeniería`, año `2024` |
| Estudiante colegial | `Luis Mamani`, nivel `SECUNDARIA`, curso `4to`, turno `Mañana` |
| Tutor | `Carla Rojas`, `pago_por_hora: 45`, `nivel_experiencia: SENIOR` |
| Unidad educativa | `Colegio San Calixto` (útil: ejercita la búsqueda sin acentos de `SearchableSelect`) |
| Cuenta contable | `1101 · Caja` |
| Centro de costo | `CC-ADM` (formato exigido por `validateCostCenterCode`) |

## Datos necesarios para las pruebas pendientes

### `session.ts`

Respuestas de login que ejerciten las **9 posiciones del token**:

```ts
{ data: { sessionToken: 'tok-1' } }
{ data: { token: 'tok-2' } }
{ data: { session_token: 'tok-3' } }
{ sessionToken: 'tok-4' }
{ token: 'tok-5' }
{ session_token: 'tok-6' }
{ data: { idSesion: 'ses-1' } }
{ data: { id_sesion: 'ses-2' } }
{ data: { sessionId: 'ses-3' } }
{ data: {} }                        // debe lanzar
```

Y variantes de usuario con alias distintos (`nombres`/`nombre`/`firstName`, `permisos`/`permissions`, etc.).

### `formValidation.ts`

Un payload por regla, y su caso límite:

| Regla | Caso positivo | Caso negativo |
| --- | --- | --- |
| `pago-tutor` | `subtotal: 100, ajustes: 5, total: 105` | `total: 104` |
| `pago-tutor` tolerancia | `total: 105.005` (dentro de 0,009) | `total: 105.02` |
| `grupo-cuenta` | `tipo: BALANCE, sub_tipo: ACTIVO` | `tipo: BALANCE, sub_tipo: INGRESO` |
| `centro-costo` | cuentas distintas | mismas cuentas |
| `centro-costo-mapa` | 2 entidades | 0 entidades; 4 entidades |
| Pares temporales | fin ≥ inicio | fin < inicio |

### `resourceMapper.ts`

Las 10 formas de respuesta, más una forma desconocida que debe producir lista vacía.

### `localDraftStore.ts`

Payloads con claves sensibles anidadas, para verificar que `sanitizeDraftPayload` las elimina en profundidad:

```ts
{ nombres: 'Ana', password: 'x', datos: { token: 'y', telefono: '700' } }
// esperado: { nombres: 'Ana', datos: { telefono: '700' } }
```

Y un borrador con `expiresAt` en el pasado, que debe borrarse al leerlo.

## Datos que NO deben usarse jamás

| Prohibido | Motivo |
| --- | --- |
| `pablo.admin` / la contraseña de [SEC-01](../security/frontend-security.md#sec-01) | Es una credencial real y ya expuesta |
| Nombres, teléfonos o correos de estudiantes reales | Datos de menores |
| La URL de producción del API | Debe permanecer fuera de las pruebas |
| El preset real de Cloudinary | — |
| Un token de sesión válido | — |

## Estado actual verificado

| Comprobación | Resultado |
| --- | --- |
| Pruebas que hacen peticiones de red | **0** |
| Pruebas con datos de producción | **0** |
| Snapshots | **0** |
| Pruebas ignoradas (`skip`) | **0** |
| Fábricas de datos | 1 (`testFactories.ts`) |
