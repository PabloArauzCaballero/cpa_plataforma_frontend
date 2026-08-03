import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageState } from '@/shared/components/PageState';
import { humanizeFieldLabel, humanizeTitleLabel } from '@/shared/utils/humanize';
import { findResourceModule } from '@/features/resources/domain/resourceDefinitions';
import { TUTORIAL_ANCHORS, tutorialAnchor, tutorialAnchorFor } from '@/features/tutorials/domain/tutorialAnchors';
import { TutorialLauncher } from '@/features/tutorials/react/TutorialLauncher';
import { getModuleVisualMeta } from '../moduleMeta';
import styles from './ModuleResourcePickerPage.module.css';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function humanizeFieldName(value: string): string {
  return value
    .replace(/^id_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ModuleResourcePickerPage() {
  const { module: moduleKey } = useParams();
  const resourceModule = findResourceModule(moduleKey);
  const [search, setSearch] = useState('');

  const filteredResources = useMemo(() => {
    if (!resourceModule) return [];

    const term = normalizeText(search.trim());
    if (!term) return resourceModule.resources;

    return resourceModule.resources.filter((resource) => {
      const fields = resource.fields.map((field) => `${field.label} ${field.name}`).join(' ');
      return normalizeText(`${resource.label} ${resource.key} ${resource.table} ${fields}`).includes(term);
    });
  }, [resourceModule, search]);

  if (!resourceModule) {
    return <PageState title="Módulo no encontrado" message="La opción solicitada no está disponible en este momento." />;
  }

  const meta = getModuleVisualMeta(resourceModule.key);

  return (
    <section className={styles.page}>
      <div className={styles.hero} {...tutorialAnchor(TUTORIAL_ANCHORS.moduleHero)}>
        <div className={styles.heroIcon}>
          <i className={meta.icon} aria-hidden="true" />
        </div>
        <div className={styles.heroCopy}>
          <span>{meta.accent}</span>
          <h2>{humanizeTitleLabel(resourceModule.label, resourceModule.key)}</h2>
          <p>{meta.description}</p>
          <TutorialLauncher
            moduleKey={resourceModule.key}
            className={styles.tutorialButton}
            label="Ver tutorial paso a paso"
            anchor={TUTORIAL_ANCHORS.moduleTutorial}
          />
        </div>
      </div>

      <div className={styles.toolbar}>
        <div>
          <span>Tablero del módulo</span>
          <h3>Elige la tabla que quieres consultar</h3>
          <p>No se abre ninguna tabla por defecto. Selecciona el registro operativo que necesitas trabajar.</p>
        </div>
        <label className={styles.searchBox} {...tutorialAnchor(TUTORIAL_ANCHORS.moduleSearch)}>
          <span>Buscar tabla</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej. cuenta, estudiante, pago, producto..."
          />
        </label>
      </div>

      {filteredResources.length === 0 ? (
        <PageState title="Sin coincidencias" message="No hay tablas que coincidan con tu búsqueda dentro de este módulo." />
      ) : (
        <div className={styles.grid} {...tutorialAnchor(TUTORIAL_ANCHORS.moduleGrid)}>
          {filteredResources.map((resource) => {
            const requiredFields = resource.fields.filter((field) => field.required).slice(0, 4);
            const sampleFields = (requiredFields.length > 0 ? requiredFields : resource.fields.slice(0, 4)).map((field) => humanizeFieldLabel(field.label, field.name));

            return (
              <article className={styles.card} key={resource.key} {...tutorialAnchorFor(TUTORIAL_ANCHORS.moduleResourceCard, resource.key)}>
                <div className={styles.cardHeader}>
                  <div>
                    <span>{resource.table}</span>
                    <h4>{humanizeTitleLabel(resource.label, resource.key)}</h4>
                  </div>
                  <i className="fa-solid fa-table" aria-hidden="true" />
                </div>

                <div className={styles.cardBody}>
                  <p>Campos principales:</p>
                  <div className={styles.chips}>
                    {sampleFields.map((field) => (
                      <span key={field}>{field}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <Link to={`/modulos/${resourceModule.key}/${resource.key}`} className={styles.primaryAction} {...tutorialAnchorFor(TUTORIAL_ANCHORS.moduleResourceOpen, resource.key)}>
                    {resource.composite === 'venta-clase-batch' ? 'Abrir formulario' : 'Abrir tabla'}
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                  {resource.composite === 'venta-clase-batch' ? null : (
                    <Link to={`/batch/${resourceModule.key}/${resource.key}`} className={styles.secondaryAction} {...tutorialAnchorFor(TUTORIAL_ANCHORS.moduleResourceImport, resource.key)}>
                      Importar
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
