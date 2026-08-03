import { findResourceDefinition, findResourceModule } from '@/features/resources/domain/resourceDefinitions';

/**
 * Rutas reales de la aplicación (espejo de `src/app/router.tsx`).
 *
 * Se mantiene aquí como lista de patrones para que el validador de tutoriales pueda
 * detectar rutas inexistentes sin arrastrar el router (y su carga perezosa) a las pruebas.
 */
export const APP_ROUTE_PATTERNS = [
  '/',
  '/login',
  '/tutoriales',
  '/perfil',
  '/modulos/:module',
  '/modulos/:module/:resource',
  '/batch/:module/:resource',
  '/contabilidad/catalogos-cuentas-operativas',
  '/contabilidad/archivos',
] as const;

export const TUTORIAL_CENTER_ROUTE = '/tutoriales';

function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/** Normaliza una ruta a la forma `/a/b` (sin barra final, sin query ni hash). */
export function normalizeRoute(path: string): string {
  const withoutQuery = path.split(/[?#]/)[0];
  if (!withoutQuery || withoutQuery === '/') return '/';
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function matchPattern(pattern: string, path: string): Record<string, string> | null {
  const patternParts = splitPath(pattern);
  const pathParts = splitPath(path);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];
    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = pathPart;
      continue;
    }
    if (patternPart !== pathPart) return null;
  }
  return params;
}

export interface RouteMatch {
  pattern: string;
  params: Record<string, string>;
}

export function matchAppRoute(path: string): RouteMatch | null {
  const normalized = normalizeRoute(path);
  for (const pattern of APP_ROUTE_PATTERNS) {
    const params = matchPattern(pattern, normalized);
    if (params) return { pattern, params };
  }
  return null;
}

export interface RouteValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Comprueba que una ruta usada por un tutorial exista de verdad: no basta con que
 * encaje en el patrón, el módulo y el recurso deben existir en el catálogo CRUD.
 */
export function validateTutorialRoute(path: string): RouteValidationResult {
  const match = matchAppRoute(path);
  if (!match) return { valid: false, reason: `la ruta "${path}" no existe en la aplicación` };

  const { module, resource } = match.params;

  if (module && !findResourceModule(module)) {
    return { valid: false, reason: `el módulo "${module}" de la ruta "${path}" no existe` };
  }

  if (module && resource && !findResourceDefinition(module, resource)) {
    return { valid: false, reason: `el recurso "${module}/${resource}" de la ruta "${path}" no existe` };
  }

  return { valid: true };
}

export function routeMatchesPattern(currentPath: string, expected: string): boolean {
  return normalizeRoute(currentPath) === normalizeRoute(expected);
}
