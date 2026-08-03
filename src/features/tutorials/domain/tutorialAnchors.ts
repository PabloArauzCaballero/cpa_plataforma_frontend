/**
 * Anclas estables de la interfaz.
 *
 * Los tutoriales NUNCA apuntan a clases CSS (cambian con el diseño) ni a textos.
 * Apuntan a `data-tutorial-id`, un contrato explícito entre la UI y el catálogo.
 *
 * En un componente:
 *   <button {...tutorialAnchor(TUTORIAL_ANCHORS.resourceCreate)}>Crear registro</button>
 *
 * En un tutorial:
 *   target: anchorTarget(TUTORIAL_ANCHORS.resourceCreate)
 */

export const TUTORIAL_ANCHORS = {
  // Layout general
  sidebar: 'app-sidebar',
  sidebarHome: 'nav-home',
  sidebarTutorials: 'nav-tutorials',
  sidebarModule: 'nav-module',
  sidebarModuleBoard: 'nav-module-board',
  headerLauncher: 'header-launcher',
  headerProfile: 'header-profile',
  headerLogout: 'header-logout',
  menuButton: 'header-menu-button',

  // Inicio
  homeHero: 'home-hero',
  homeModules: 'home-modules',
  homeModuleCard: 'home-module-card',

  // Tablero de módulo
  moduleHero: 'module-hero',
  moduleTutorial: 'module-tutorial',
  moduleSearch: 'module-search',
  moduleGrid: 'module-grid',
  moduleResourceCard: 'module-resource-card',
  moduleResourceOpen: 'module-resource-open',
  moduleResourceImport: 'module-resource-import',

  // Listado de recursos
  resourceHeader: 'resource-header',
  resourceTutorial: 'resource-tutorial',
  resourceHelp: 'resource-help',
  resourceImport: 'resource-import',
  resourceSearch: 'resource-search',
  resourceFilters: 'resource-filters',
  resourceReload: 'resource-reload',
  resourceClearFilters: 'resource-clear-filters',
  resourceExport: 'resource-export',
  resourceCreate: 'resource-create',
  resourceTable: 'resource-table',
  resourceRowEdit: 'resource-row-edit',
  resourcePagination: 'resource-pagination',

  // Formularios y modales
  modal: 'modal',
  modalClose: 'modal-close',
  resourceForm: 'resource-form',
  resourceFormSubmit: 'resource-form-submit',

  // Importación masiva
  batchHeader: 'batch-header',

  // Contabilidad
  catalogsHero: 'catalogs-hero',
  filesHero: 'files-hero',

  // Perfil
  profileHeader: 'profile-header',
  profileRefresh: 'profile-refresh',
  profileSummary: 'profile-summary',
  profilePermissions: 'profile-permissions',

  // Centro de tutoriales
  centerHero: 'center-hero',
  centerProgress: 'center-progress',
  centerSearch: 'center-search',
  centerFilters: 'center-filters',
  centerList: 'center-list',
  centerCard: 'center-card',
  centerStart: 'center-start',
} as const;

export type TutorialAnchor = (typeof TUTORIAL_ANCHORS)[keyof typeof TUTORIAL_ANCHORS];

export const TUTORIAL_ANCHOR_ATTRIBUTE = 'data-tutorial-id';

/** Props a esparcir en un elemento JSX para que sea alcanzable por los tutoriales. */
export function tutorialAnchor(anchor: TutorialAnchor): { 'data-tutorial-id': TutorialAnchor } {
  return { [TUTORIAL_ANCHOR_ATTRIBUTE]: anchor } as { 'data-tutorial-id': TutorialAnchor };
}

/** Selector CSS del ancla, para usar en `TutorialStep.target`. */
export function anchorTarget(anchor: TutorialAnchor): string {
  return `[${TUTORIAL_ANCHOR_ATTRIBUTE}="${anchor}"]`;
}

/** Selector del ancla acotado a una clave adicional (por ejemplo, un módulo concreto). */
export function anchorTargetFor(anchor: TutorialAnchor, key: string): string {
  return `[${TUTORIAL_ANCHOR_ATTRIBUTE}="${anchor}"][data-tutorial-key="${key}"]`;
}

/** Props para un ancla que se repite (listas, tarjetas) y necesita distinguir instancia. */
export function tutorialAnchorFor(
  anchor: TutorialAnchor,
  key: string,
): { 'data-tutorial-id': TutorialAnchor; 'data-tutorial-key': string } {
  return {
    [TUTORIAL_ANCHOR_ATTRIBUTE]: anchor,
    'data-tutorial-key': key,
  } as { 'data-tutorial-id': TutorialAnchor; 'data-tutorial-key': string };
}
