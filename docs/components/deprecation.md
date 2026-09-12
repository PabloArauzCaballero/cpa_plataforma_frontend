# Deprecación

## Estado: no existe convención

**Ningún componente, función ni recurso está marcado como obsoleto.** Verificado: no hay anotaciones `@deprecated`, ni sufijos `Legacy`/`Old`, ni comentarios de retirada.

Eso no significa que no haya nada que retirar.

## Candidatos reales a retirada

| Elemento | Situación | Evidencia | Acción propuesta |
| --- | --- | --- | --- |
| `features/quality/pages/QualityGatePage.tsx` + su CSS | **Código huérfano**: nadie lo importa | `grep -rn "QualityGatePage" src` devuelve solo su definición; comunidad C28 aislada en el grafo | **Eliminar** |
| `persistentDraftApi.ts` **o** `backendDraftApi.ts` | Duplicados: mismo endpoint, misma superficie | Línea 27 de ambos apunta a `/api/administracion/registro-borrador` | Unificar y eliminar uno |
| `normalizeOption()` / `renderFilterInput()` en `ResourceExportModal` | Duplicados de `SearchFilterBar` | Ambos archivos | Extraer a módulo común |
| Claves `cpa_session_token` y `cpa_user_email` | Duplicados de `cpa.sessionToken` y `cpa.userEmail`; parecen compatibilidad heredada | `session.ts:14-15` | Verificar si algo las lee todavía; si no, retirar |
| Una de las dos vías de FontAwesome | CDN y paquetes npm cargados a la vez | `index.html:14` + `package.json` | Elegir una |
| Condición `resource.key === 'aula'` | El recurso `aula` **no existe** | `ResourceListPage.tsx:56` | La condición nunca se cumple: retirar o corregir |
| Campo `link_achivo` | Errata replicada; convive con `link_archivo` y es el obligatorio | `resourceDefinitions.ts:239` | Verificar con backend antes de tocar |

## Por qué no se han retirado

**Todas son modificaciones de `src/` y por tanto cambios de producto.** Este trabajo es exclusivamente documental. Cada una está registrada en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md) como propuesta pendiente de autorización.

Además, dos de ellas (`link_achivo` y las claves de sesión duplicadas) requieren **verificación externa** antes de actuar: podría haber un consumidor que este repositorio no ve.

## Convención propuesta

> No implementada.

### 1. Marcar antes de eliminar

```ts
/**
 * @deprecated desde v1.2.0 — usar `nuevoNombre`.
 * Se eliminará en v1.4.0.
 * Motivo: <por qué>.
 */
```

### 2. Ciclo de vida

| Fase | Duración sugerida | Estado |
| --- | --- | --- |
| Marcado | Al menos una versión menor | Funciona, con aviso |
| Aviso en consola | Opcional, solo en desarrollo | — |
| Eliminación | Versión menor siguiente | — |

### 3. Registro

Mantener en este documento una tabla de elementos marcados, con versión de marcado, versión de eliminación prevista y sustituto.

### 4. Qué **no** se depreca sin coordinación

| Elemento | Motivo |
| --- | --- |
| Una ruta | Puede estar en favoritos o enlazada externamente |
| Una clave de `resourceDefinitions` | Cambia la URL del recurso |
| Un permiso | Debe coordinarse con el backend |
| Una clave de `localStorage` | Los usuarios tienen datos guardados |
| Una prop pública de componente compartido | Afecta a los 59 recursos |

## Riesgo actual sin convención

| Riesgo | Estado |
| --- | --- |
| Código muerto que nadie se atreve a borrar | 🟡 Ya ocurre con `QualityGatePage` |
| Duplicados que divergen en comportamiento | 🟠 Ya ocurre con los dos servicios de borrador |
| Condiciones muertas que confunden | 🟡 `resource.key === 'aula'` |
| Claves de almacenamiento heredadas sin documentar | 🟡 `cpa_session_token` |

**Ninguno es grave hoy**, pero todos crecen con el tiempo y ninguno tiene detección automática.

## Verificación de código muerto

Comandos reproducibles, no destructivos:

```bash
# Componentes que nadie importa
for f in $(find src -name "*.tsx" | grep -v __tests__); do
  name=$(basename "$f" .tsx)
  count=$(grep -rl "\\b$name\\b" src --include="*.tsx" --include="*.ts" | grep -v "^$f$" | wc -l)
  [ "$count" -eq 0 ] && echo "HUÉRFANO: $f"
done

# Exportaciones sin consumidores conocidos
grep -rn "^export " src --include="*.ts" | wc -l
```

Una herramienta como `knip` o `ts-prune` lo automatizaría, pero **añadiría una dependencia de desarrollo**: es una propuesta, no una acción documental.
