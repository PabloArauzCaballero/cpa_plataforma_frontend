# Plan de equipo — cierre y base para el resto del front

**Equipo:** Justin · Pablo · Ender · Itzan · Marcelo · **Horizonte:** miércoles (calibra el tamaño
de las tareas, no es látigo — todos con Claude Max, skills y contexto).
**Objetivo:** terminar, arreglar y dejar sentado lo pendiente, para que después de esto la
incorporación del resto del front (y más adelante la app móvil) arranque sin arrastrar deuda.

**Referencias:** `PLAN-FRONTEND.md` · `CLAUDE.md` · `COORDINACION-AGENTES.md` (protocolo si dos
sesiones tocan el mismo repo — usarlo SIEMPRE).

---

## Cómo leer las tareas (pauta nueva)

Cada tarea declara:

- **Prerrequisitos** — qué tiene que estar terminado antes. `Ninguno` = se puede arrancar ya.
- **Sin el prerrequisito se puede avanzar hasta:** el punto de corte seguro. Todo lo anterior al
  corte se hace tranquilo; lo posterior espera. Así nadie queda bloqueado ni trabaja de más.
- **Prompt** para Claude Code, **Terminado cuando** (observable, con evidencia de la skill
  `verify`), y a qué tarjeta de Jira va la evidencia.

Reglas de siempre: PRs chicos sobre `dev` (ojo: **`dev` de la API está protegida** — todo entra
por PR ahí) · nada se declara listo sin `verify` · cero hex literales (§G1) · los conflictos de
modelo se REPORTAN a Marcelo, jamás se resuelven con DDL propio.

---

## G1 · Elegir la disposición de los Stitch — decisión corta, no compuerta

**Quién:** Justin + Marcelo (con `Alemel31` si es el diseñador) · **Prerrequisitos:** ninguno ·
**Condiciona (no bloquea):** la disposición final de E2, I1, I2 y J2.

### Lo que se decide y lo que NO

Abrí y comparé los `code.html` de las tres variantes. **Las tres comparten la misma paleta y las
mismas tipografías** — difieren en 3 hex sobre ~37, y las fuentes son idénticas (Public Sans,
Spectral, Spline Sans Mono). Además **ninguna usa un solo color REDSAT**: busqué petróleo
`#0B557E`, aqua `#4FB3A9`, menta y ámbar → **cero coincidencias** en los tres archivos.

> **Conclusión: G1 NO es una decisión de identidad visual.** Esa ya está tomada y es REDSAT.
> Lo único que varía entre familias es **la disposición y la densidad**. Es una decisión de una
> hora mirando los `screen.png` lado a lado, no una reunión de diseño.

### El material real, contado

Hay un **set de referencia** (los nombres lo delatan: `login_..._referencia`,
`mfa_..._estándar`, `f_01_filiacion_del_paciente` sin sufijo) y tres familias de variantes con
**cobertura despareja**:

| Familia | Pantallas | Observación |
|---|---|---|
| **kardex técnico** | 7 | la más completa; densidad de ficha (domina el gris-verde de fondo) |
| **expediente / carpeta** | 6 | intermedia |
| **acta / ministerial** | 3 | **incompleta** — elegirla obliga a diseñar 4 pantallas desde cero |
| *(sueltas)* | 2 | variantes de selección de espacio que no encajan en las tres familias |

Esa tabla casi decide sola: ministerial queda descartada por cobertura, y la elección real es
entre kardex (más denso) y expediente (más aireado). El criterio: el M34 dice que **la densidad
es una decisión clínica, no estética** — quien pasa ocho horas en la pantalla necesita densidad;
el paciente que la lee una vez, aire.

### ⚠️ Esto es reimplementar, no convertir

Regla dura para todo el equipo, y la razón por la que ningún test la atraparía si se rompe:

Los exports traen **Tailwind** (prohibido en el proyecto), **fuentes ajenas** (Public Sans /
Spectral, no Poppins + Inter), **paleta ajena** (verde/teal Material) y **tokens de Material
Design**. Si alguien abre el `code.html` y copia clases o hex, entra basura al repo que el
chequeo de deriva TS↔CSS **no detecta**, porque son valores nuevos y no tokens corridos.

**La instrucción correcta: mirá el `screen.png` como si fuera un wireframe** y construí con los
átomos y tokens que ya existen. El `code.html` sirve para leer estructura y jerarquía, nunca para
copiar.

### Por qué NO bloquea a nadie

Como la paleta y las tipografías son idénticas entre variantes **y las tres se descartan igual**,
lo único que la elección afecta es cómo se acomodan las piezas. Por eso todo el mundo puede
avanzar hoy: Itzan construye F-01 con sus campos, validaciones y selectores; Ender hace la deuda
de breakpoints; Justin arma la estructura del interior. La disposición se aplica después, sin
rehacer lógica.

### Cómo tomarla (protocolo de una hora)

1. Abrir los tres `screen.png` de login lado a lado, y los tres de F-01.
2. Elegir familia por densidad, con el criterio clínico de arriba.
3. Escribir en la tarjeta 7: familia elegida + una línea de porqué + qué pantallas quedan sin
   referencia (para diseñarlas).

**Terminado cuando:** la elección está en la tarjeta 7 y avisada en el canal.

> **Corrección al plan:** `clinical_archive` **no tiene pantalla** — solo un `DESIGN.md` con
> lista de colores, sin `code.html` ni `screen.png`. El armazón interior de J2 **no tiene
> referencia visual**: se diseña, no se convierte. La tarea J2 ya está ajustada abajo.

---

## Justin

### J1 · Dejar el repo front listo para que Ender e Itzan aterricen

**Prerrequisitos:** ninguno. **Es la primera tarea del plan en ejecutarse** — los desbloquea a ellos.

Tres cosas en un solo PR + una verificación:

1. **Commitear tu fix de `scripts/generate-env.mjs`** (el `fileURLToPath` — hoy cualquier clon en
   una ruta con espacios muere con `ENOENT ... Sistema%20Salud`, y ellos clonan en Windows).
2. **Fijar `nodeLinker: node-modules` en `.yarnrc.yml`** — hoy el front instala en PnP por
   accidente mientras la API usa node-modules; PnP + Angular en Windows da fricción rara y la
   primera impresión de ellos sería esa.
3. **Sección de arranque** (en el README del front): clonar → `corepack enable` → `yarn install`
   → `yarn test --watch=false` → `yarn start`, más el protocolo de `COORDINACION-AGENTES.md` y
   la regla de los hex de Stitch (§G1).

**Prompt:**

```
En mantra-core-health: (1) commiteá el fix ya presente en scripts/generate-env.mjs (working
tree) con su porqué; (2) agregá nodeLinker: node-modules a .yarnrc.yml, borrá los artefactos de
PnP si los hay, regenerá el lockfile si hace falta y verificá que yarn install + yarn test +
yarn build siguen en verde; (3) agregá al README una sección "Arranque para el equipo" con la
secuencia de setup, el protocolo de COORDINACION-AGENTES.md y la regla "los hex de los DESIGN.md
de Stitch no se copian: se mapean a tokens de styles.css". Skill clean-code antes, verify al
final: la evidencia es un clon FRESCO en otra carpeta (con espacio en el nombre) que instala,
testea y levanta.
```

**Terminado cuando:** un clon fresco en carpeta con espacios pasa `install → test → start` sin
tocar nada. Evidencia en la tarjeta 3/9 según corresponda.

### J2 · El armazón interior — se diseña, no se convierte

**Prerrequisitos:** ninguno para construirlo; G1 solo afecta la **densidad** final.
**Sin G1 se puede avanzar hasta:** todo — navegación real del área autenticada sobre el
`shell-layout` existente, rutas lazy de las secciones futuras, integración del 403-puerta →
`features/identity-verification`, breadcrumbs/título por ruta. El corte: el ajuste fino de
densidad y espaciado según la familia elegida, que es un repaso menor, no un rehacer.

> ⚠️ **`clinical_archive` NO tiene pantalla** — solo un `DESIGN.md` con lista de colores (sin
> `code.html` ni `screen.png`). No hay referencia visual del interior: **este armazón se diseña**,
> apoyándose en las FRONTEND RULES del M34 y en el sistema de diseño existente. Si aparece una
> referencia del diseñador, se ajusta después.

**Prompt:**

```
En mantra-core-health, DISEÑÁ Y construí el armazón interior de la aplicación (no hay export de
referencia: clinical_archive solo trae una lista de colores, que además NO es la paleta REDSAT —
ignorala). Basate en el sistema de diseño existente y en las FRONTEND RULES del M34.
Partí del shell-layout existente: navegación lateral/superior del área autenticada,
zona de contenido, rutas lazy preparadas para las secciones futuras (aunque apunten a
placeholders con ViewState S3 "vacío con próxima acción"), integración del 403 de identidad
(la "puerta" ya implementada) hacia features/identity-verification, y estados S1/S2 del M34 en
la carga de cada sección. Mobile-first con los breakpoints tokenizados; accesibilidad completa
(navegación por teclado, foco visible, aria en la nav). Skills frontend-design y clean-code
antes; verify con: build SSR en verde, navegación real en el navegador con sesión activa
(cuenta del bootstrap), y capturas móvil/escritorio.
```

**Terminado cuando:** con sesión iniciada se navega el interior real (no rutas sueltas), el
403-puerta aterriza en la pantalla de verificación, y los e2e de sesión siguen en verde.

### J3 · Altas administrativas (tarjeta 23) — cierra la Fase 4

**Prerrequisitos:** ninguno duro. J2 aporta el lugar donde viven; G1, la densidad.
**Sin ellos se puede avanzar hasta:** los formularios completos como features montadas en rutas
propias + su `data-access` + specs — el corte: enlazarlas desde la navegación (una línea cuando
J2 exista) y el repaso de densidad. **Backend: cero bloqueo** — el bootstrap del admin y el
`$expand` de lectura ya existen.

**Prompt:**

```
En mantra-core-health, implementá las altas administrativas (SECURITY_ADMIN): alta de usuario
simple (POST /iam/users), alta de paciente y alta de médico (compuestas: perfil → cuenta →
vínculo, decisión D3 del plan: orden fijo, idempotencia por intento, estado "perfil sin cuenta"
visible y reanudable — un reintento NO duplica). Selectores de terminología poblados con
GET /terminology/value-sets/:id/$expand (cliente ya en data-access/terminology, paginado por
cursor). Médico: licenseNumber y credentialNumber obligatorios; su verificación de matrícula la
hace él después por self-service. Usar los átomos con CVA y ViewState<T>; errores por
error.code. Skills clean-code y verify: el cierre exige demostrar el fallo parcial (matar la
segunda llamada y reanudar sin duplicar) contra la API real con la cuenta admin del bootstrap.
```

**Terminado cuando:** un admin da de alta paciente y médico desde la UI, ambos entran con sus
credenciales, y el caso de fallo parcial está probado con evidencia. → tarjeta 23.

---

## Pablo

### P1 · Cacería "implementado ≠ funciona" en los módulos que el interior va a consumir

**Prerrequisitos:** ninguno. **Es EL trabajo de fondo que deja sentado el resto del front.**

El bug de terminología (la expansión que jamás devolvió un miembro, sin error) probó que los
endpoints unit-testeados con mocks pueden estar rotos de nacimiento. El interior va a consumir
`profiles` (lectura de pacientes — la filiación F-01), `scheduling` (agenda) y `chart`/`clinical`
(archivo clínico). **Ejercitalos contra datos reales ANTES de que el front llegue.**

**Prompt:**

```
En mantra-core-health-api, contra tu stack poblado: ejercitá con curls (usuario real, no mocks)
los flujos completos de lectura y escritura que el frontend va a consumir de profiles,
scheduling y chart/clinical — los casos de uso de agenda (crear disponibilidad, reservar,
confirmar, cancelar), lectura de perfil de paciente, y lectura del chart. Documentá cada endpoint
ejercitado con request/response real. Todo lo que encuentres roto (el patrón terminology:
estados nunca seteados, filtros que no seleccionan nada, FKs mal, respuestas vacías sin error)
corregilo con su spec de integración correspondiente — mismo estándar que
outbox-relay-race.int-spec.ts. Si algo requiere columna/tabla/concepto que el modelo no declara:
NO lo inventes — tarjeta a Marcelo. Skills clean-code y verify; PR a dev (protegida: entra por
PR). Entregable extra: el catálogo de flujos verificados pegado en la tarjeta correspondiente,
para que el front sepa qué está garantizado.
```

**Terminado cuando:** los flujos de agenda + perfil + chart corren de punta a punta con curls
documentados, cada bug hallado tiene fix + spec de integración, y el catálogo está publicado.

### P2 · Refresh token a cookie httpOnly (detrás de flag)

**Prerrequisitos:** ninguno del lado backend.
**Corte explícito:** implementar **sin activarlo por defecto** (flag de entorno apagado) y sin
tocar el contrato actual — el front adapta su `AuthService` después, coordinado; no romperle la
sesión al equipo a mitad de semana.

**Prompt:**

```
En mantra-core-health-api: diseñá e implementá la entrega del refresh token como cookie httpOnly
(SameSite estricto, Secure según entorno, path acotado al endpoint de refresh) detrás de una
variable de entorno APAGADA por defecto — hoy el token viaja en el body y el front lo guarda en
localStorage (superficie XSS aceptada temporalmente, decisión previa a producción). Con el flag
encendido: login/refresh setean la cookie y el refresh la lee de la cookie; con el flag apagado:
comportamiento actual intacto (verificalo con la suite existente). Documentá en el README de
common/auth qué cambia el front cuando se active (retirar persistencia local, credentials:
'include', y el ajuste de CORS que requerirá allowlist + credentials). Specs de los dos modos.
Skills clean-code y verify con curls demostrando ambos modos.
```

**Terminado cuando:** ambos modos probados con evidencia, suite en verde, flag documentado, y
nada cambió para el equipo con el flag apagado.

---

## Ender (incorporación)

**Setup previo común** (30 min, no es tarjeta): clonar los 3 repos en `dev` — **esperá a que J1
esté mergeado**, o cloná en una ruta SIN espacios como workaround — `ORM_SCHEMA_SYNC=off` en el
`.env` de la API, leer `CLAUDE.md` + este plan + `COORDINACION-AGENTES.md`.

### E1 · Deuda mobile-first: las 42 `max-width` → tokens `min-width`

**Prerrequisitos:** ninguno (J1 ayuda al setup, no bloquea la tarea).
Tarea de incorporación ideal: toca todo el design system sin poder romper dominio, y el CI de
Selenium te protege. La deuda además **creció** con el último merge (28 → 42).

**Prompt:**

```
En mantra-core-health: styles.css declara mobile-first (móvil < 780 · tablet 780-1024 ·
escritorio > 1024) pero hay 42 media queries max-width (desktop-first) contra 28 min-width, más
valores sueltos que no corresponden a ningún breakpoint declarado. (1) Verificá que los
breakpoints estén tokenizados en styles.css (si falta alguno, tokenizalo); (2) reescribí TODAS
las max-width como min-width — el estilo base es el móvil; (3) regla del M34 que gobierna: en
móvil se reordena por prioridad, nunca se oculta información de seguridad clínica. Solo archivos
.css. Skills clean-code y verify: cero max-width en src/, yarn test en verde, la vitrina
/design-system y las pantallas de auth se ven correctas en móvil y escritorio (capturas de
ambos), y los e2e de Selenium en verde.
```

**Terminado cuando:** `grep max-width src/` da cero, tests + e2e en verde, capturas pegadas. → tarjeta 10.

### E2 · Restyling de las pantallas de auth a la familia elegida + carta al diseñador

**Prerrequisitos:** G1 para aplicar la disposición.
**Sin G1 se puede avanzar hasta:** el **inventario comparativo** — pantalla por pantalla (login,
MFA, recuperación, registro, selección de espacio), qué difiere entre lo codeado hoy y cada una
de las 3 variantes en **estructura y densidad** (no en color: la paleta de los tres exports es la
misma y ninguna es REDSAT — ver §G1), publicado como comentario en la tarjeta 7. **Ese inventario
es el insumo que hace que G1 se decida en una hora**, así que conviene hacerlo primero. El corte:
no tocar CSS de pantalla hasta que la elección esté escrita.

Incluye **reescribir y enviar la carta al diseñador** (la vieja `PARA-EL-DISENADOR.md` se
perdió): divergencia de variantes de botón web↔móvil, tinta no-blanca sobre aqua/ámbar, y las
excepciones WCAG E1–E4 de `identidad-visual.md` — probablemente vía el vault, donde `Alemel31`
tiene acceso.

**Prompt (para después de G1):**

```
En mantra-core-health: aplicá la familia visual elegida (tarjeta 7 de Jira) a las pantallas de
auth existentes (login, registro dual, recuperar, nueva-clave, verificar, selección de
organización), usando los exports de Stitch de esa familia como referencia de layout y
estructura — los colores y tipografías salen EXCLUSIVAMENTE de los tokens de styles.css, jamás
de los hex del DESIGN.md de Stitch. No cambies comportamiento ni contratos: es restyling; los
778+ tests y los e2e deben seguir en verde sin modificar asserts de lógica (los de apariencia
que cambien, actualizalos con su porqué). Mobile-first. Skills frontend-design, clean-code,
verify: capturas antes/después de cada pantalla en móvil y escritorio + suite completa en verde.
```

**Terminado cuando:** las 6 pantallas de auth lucen la familia elegida, cero hex nuevos en el
CSS (`grep '#[0-9a-fA-F]\{6\}' src/app/features/auth` limpio salvo tokens), suites en verde, y
la carta al diseñador enviada y registrada en la tarjeta 14.

---

## Itzan (incorporación)

**Setup previo:** igual que Ender.

### I1 · Conversión de F-01 Filiación del Paciente (la primera pantalla clínica)

**Prerrequisitos:** ninguno duro. G1 aporta la disposición; J2, el lugar donde se integra.
**Sin ellos se puede avanzar hasta:** el formulario completo como feature montada en ruta propia
— estructura del F-01 según los exports de Stitch (4 variantes: mirá la estructura común, no el estilo),
átomos con CVA, validaciones, `ViewState<T>`, specs — con tokens neutros y montado en una ruta
temporal. El corte: ni estética de variante ni integración a la navegación ni conexión a
backend de escritura (eso llega con el catálogo de P1).

**Prompt:**

```
En mantra-core-health: construí la pantalla F-01 Filiación del Paciente tomando como referencia
estructural los exports stitch f_01_filiaci_n_del_paciente y f_01_registro_de_filiaci_n_*
(estructura y jerarquía de campos; colores SOLO de tokens styles.css). Formulario con los átomos
CVA existentes y form-field (labels asociados por FORM_CONTROL_CONTEXT); los campos *_concept_id
como selectores poblados por data-access/terminology ($expand de lectura) — nunca input libre;
validaciones con mensajes en español; estados S1-S9 con ViewState<T>; regla M34: los campos de
seguridad clínica no se ocultan en móvil, se reordenan. La escritura al backend queda detrás de
una interfaz inyectada con implementación mock hasta que el catálogo de endpoints verificados de
Pablo (P1) confirme el contrato — dejá el TODO explícito apuntando a esa tarjeta. Skills
frontend-design, clean-code, verify: specs del formulario (validaciones, CVA, estados) + build
SSR + capturas móvil/escritorio.
```

**Terminado cuando:** F-01 existe, valida, se navega por teclado, sus selectores se pueblan de
terminología real, y queda lista para enchufar la escritura cuando P1 publique el catálogo.

### I2 · Estados post-registro + sello de estado como organismos reutilizables

**Prerrequisitos:** ninguno duro. G1 solo define el acabado del "sello".
**Sin G1 se puede avanzar hasta:** la semántica completa — un organismo `status-seal`/estado de
trámite que envuelve `ViewState`/estados de caso (pendiente, verificado, rechazado, vencido) con
`aria` correcto y el `*_tone` siempre acompañado de `*_label` (el color nunca es el único
portador de significado), ya con los tríos `--st-*` de `styles.css`. El corte: el acabado visual
de sello/papel de la familia elegida, que es una capa de estilo sobre lo mismo.

**Prompt:**

```
En mantra-core-health: creá en shared/components/organisms/ los componentes de estado
post-registro inspirados en los exports stitch estado_post_registro_* y sello_de_estado_oficial_*
(estructura; colores de tokens): un organismo de "estado de trámite/caso" reutilizable (lo van a
consumir la verificación de identidad, los casos de identity_assurance y los futuros trámites)
con variantes semánticas (pendiente/en revisión/aprobado/rechazado/vencido) mapeadas a los tríos
--st-* de styles.css, texto siempre presente junto al color, role/aria correctos, y una entrada
en la vitrina /design-system mostrando todas las variantes. Conectalo donde ya corresponde:
features/identity-verification muestra el estado del caso con este organismo. Skills
frontend-design, clean-code, verify: specs + vitrina + capturas, suites en verde.
```

**Terminado cuando:** el organismo está en la vitrina con todas sus variantes, la pantalla de
verificación de identidad lo usa, y las suites siguen en verde.

---

## Marcelo (pocas tareas, grandes — y el rol de test final)

### M1 · Promoción al modelo: `email_verifications`, `password_resets` e índice único

**Prerrequisitos:** ninguno. **Es la deuda que crece con cada feature nueva de Pablo.**

Las dos tablas y el índice único de credenciales existen solo como migraciones en `database/`
del repo API — fuera de los `.puml` y del `SQL/` canónico. Es el mismo patrón que obligó la
promoción v4.0.8, ya con dos tablas acumuladas. Incluye reconciliar la relación entre el
`database/` versionado del repo API y el `SQL/` canónico de la raíz (hoy son dos fuentes de DDL
sin chequeo de desfase entre sí).

**Prompt:**

```
Aplicando el protocolo completo de la skill db-fidelity: promové al modelo canónico las tablas
iam.email_verifications e iam.password_resets y el índice único parcial de
authentication_credentials (hoy solo en mantra-core-health-api/database/SQL/99_migrations/).
Recorrido: nota de entidad en el vault + .puml + regeneración de SQL/ con gen_ddl.py +
verificación de las 4 capas (.puml → SQL/ → BD → ORM) con el verificador de fidelidad en
dry-run esperando cero deriva nueva. Definí y documentá además la relación oficial entre el
database/ versionado del repo API y el SQL/ canónico de la raíz (cuál manda, cómo se sincroniza,
qué chequeo detecta desfase). Versión resultante del modelo: la que corresponda (¿v4.0.9?).
Skill verify con los conteos canónicos como evidencia.
```

**Terminado cuando:** las 4 capas declaran las tablas, el dry-run reporta solo las 6 derivas
históricas conocidas, y la relación database/ ↔ SQL/ quedó escrita. → tarjeta 4.

### M2 · Seeds v4.0.8+: las 5 tablas REDESA pobladas (cierra D-05 fail-open)

**Prerrequisitos:** idealmente M1 (un solo rebuild para verificar ambas).
**Sin M1 se puede avanzar hasta:** extender `gen_seeds_v407.py` (que hoy solo recorre las
`NEW_TABLES` de v4.0.7) y generar el paquete — el corte: la recarga y verificación final contra
la base, que conviene hacer junto con M1 en el mismo rebuild.

**Prompt:**

```
Aplicando las skills db-fidelity y verify: extendé el generador de seeds para cubrir las 5
tablas de v4.0.8 (authz.care_relationships, authz.patient_legal_representations,
clinical.prescription_signature_policies, scheduling.booking_confirmation_rules,
iam.account_activations) + las promovidas en M1 si ya están. Prioridad funcional:
prescription_signature_policies — mientras esté vacía, la regla D-05 es fail-open y la firma de
receta no se exige nunca; sembrá una política por defecto coherente con lo que la spec REDESA
declara (lo jurisdiccional fino sigue PENDIENTE_DE_APROBACIÓN — dejalo señalado, no lo
inventes). Generación determinista e idempotente, carga con load_seeds.py --refresh, y
verificación final: rebuild completo (down -v + up + carga) con conteos y 0 FKs violadas.
```

**Terminado cuando:** rebuild desde cero deja las tablas pobladas, D-05 deja de ser fail-open
(verificado ejercitando la regla), y los conteos canónicos quedan registrados. → tarjeta 8.

### M+ · Rol permanente: G1 con Justin al inicio, y el test integral al cierre

Sin prompt — es tu estilo propio: cuando J2/J3/E2/I1 estén mergeadas, tu pasada de prueba
independiente del avance completo (front + API + base reconstruida), reportando lo que
encuentres como tarjetas, no como arreglos directos.

---

## 📱 Para después (planteado, NO es tarea de esta semana): la app para el cliente

El cliente quiere **abrir la app en su teléfono y ver el logo** — iOS y Android → Flutter.
Cuando llegue el momento trabajamos todos; esto queda sentado para no improvisar ese día:

1. **El repo móvil no está en este workspace.** El `CLAUDE.md` describe `mantra_core_health_mobile`
   con el tema REDSAT completo, átomos (`MantraButton`, `MantraBadge`, `MantraAvatar`) y 175
   tests — pero la carpeta no existe en el disco de Justin ni en los remotos que veo. **Paso 0:
   localizarlo con Marcelo y subirlo/compartirlo.** Si ese repo está como lo describe el
   CLAUDE.md, el hito "abrir y ver la marca" está a un splash + ícono de distancia.
2. **Android es el camino corto:** `flutter build apk --debug` → APK instalable directo en el
   teléfono (sin Play Store). Si el tío tiene Android, la demo es casi inmediata.
3. **iOS tiene dos restricciones duras:** no se puede compilar desde Windows (hace falta un Mac
   o CI con runner macOS — GitHub Actions o Codemagic), y para instalarlo en su iPhone sin
   publicar se necesita **TestFlight**, que exige cuenta Apple Developer (USD 99/año) — trámite
   que conviene iniciar ANTES del día de la demo. Preguntar qué teléfono tiene el tío define
   cuánto esfuerzo real hay.
4. **El logo:** hace falta el asset oficial de marca (¿del diseñador / `Alemel31`?) en calidad
   vectorial, más ícono adaptativo Android y set de íconos iOS. Pedirlo con anticipación.
5. Alcance sugerido del hito cuando toque: splash con logo + pantalla de login con el tema
   REDSAT (aunque no autentique contra la API todavía) — se ve producto, no un "hello world".

---

## Tablero: qué arranca hoy sin esperar a nadie

| Tarea | Quién | ¿Prerrequisitos? |
|---|---|---|
| G1 elegir disposición | Justin + Marcelo | **Ninguno** — decisión de 1 h; no frena a nadie |
| J1 repo listo para el equipo | Justin | **Ninguno** — primera en ejecutarse |
| P1 cacería en profiles/scheduling/chart | Pablo | **Ninguno** |
| P2 cookie httpOnly tras flag | Pablo | **Ninguno** (corte: no activar) |
| E1 deuda mobile-first | Ender | **Ninguno** (workaround de ruta sin espacios si J1 no llegó) |
| M1 promoción al modelo | Marcelo | **Ninguno** |
| E2 inventario comparativo → restyling auth | Ender | **Ninguno** para el inventario (que además destraba G1) |
| I1 F-01 filiación | Itzan | **Ninguno** para el formulario; G1/J2 solo aportan disposición y lugar |
| I2 organismos de estado | Itzan | **Ninguno** para la semántica; G1 solo el acabado |
| J2 armazón interior | Justin | **Ninguno** — se diseña (no hay export de referencia) |
| J3 altas administrativas | Justin | **Ninguno**; J2 aporta dónde viven, G1 la densidad |
| M2 seeds v4.0.8 | Marcelo | M1 ideal · sin ella: generador |
| M+ test integral | Marcelo | J2/J3/E2/I1 mergeadas |
