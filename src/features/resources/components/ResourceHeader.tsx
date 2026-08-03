import { Link } from 'react-router-dom';
import type { CrudResourceDefinition } from '../domain/CrudResource';
import { humanizeTitleLabel } from '@/shared/utils/humanize';
import { TUTORIAL_ANCHORS, tutorialAnchor } from '@/features/tutorials/domain/tutorialAnchors';
import { TutorialLauncher } from '@/features/tutorials/react/TutorialLauncher';
import styles from './ResourceHeader.module.css';

interface ResourceHeaderProps {
  resource: CrudResourceDefinition;
  total: number;
  visible: number;
  onHelpOpen?: () => void;
}

export function ResourceHeader({ resource, total, visible, onHelpOpen }: ResourceHeaderProps) {
  return (
    <div className={styles.header} {...tutorialAnchor(TUTORIAL_ANCHORS.resourceHeader)}>
      <div>
        <span>{resource.moduleLabel}</span>
        <h2>{humanizeTitleLabel(resource.label, resource.key)}</h2>
        <p>{visible} de {total} registros visibles · Gestiona esta información desde una vista segura y operativa.</p>
      </div>
      <div className={styles.actions}>
        <TutorialLauncher moduleKey={resource.module} anchor={TUTORIAL_ANCHORS.resourceTutorial} />
        {onHelpOpen ? (
          <button type="button" onClick={onHelpOpen} {...tutorialAnchor(TUTORIAL_ANCHORS.resourceHelp)}>
            <i className="fa-solid fa-circle-question" aria-hidden="true" />
            Ayuda
          </button>
        ) : null}
        <Link to={`/batch/${resource.module}/${resource.key}`} {...tutorialAnchor(TUTORIAL_ANCHORS.resourceImport)}>Importar Excel</Link>
      </div>
    </div>
  );
}
