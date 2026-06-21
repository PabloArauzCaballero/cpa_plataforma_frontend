import { Button } from '@/shared/components/Button';
import styles from './PageState.module.css';

interface PageStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageState({ title, message, actionLabel, onAction }: PageStateProps) {
  return (
    <div className={styles.state}>
      <div className={styles.marker} aria-hidden="true" />
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
