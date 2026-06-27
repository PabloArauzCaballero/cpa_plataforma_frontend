import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Evita pantalla blanca en producción y deja evidencia en consola para depuración local.
    console.error('Error no controlado en CPA Frontend', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className={styles.wrapper}>
        <section className={styles.card}>
          <span className={styles.eyebrow}>CPA Plataforma</span>
          <h1>Algo se desajustó</h1>
          <p>
            La pantalla tuvo un error inesperado. No se perdió tu sesión. Puedes recargar la vista o volver al inicio.
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={() => window.location.reload()}>Recargar pantalla</button>
            <button type="button" className={styles.secondary} onClick={() => { window.location.href = '/'; }}>Ir al inicio</button>
          </div>
        </section>
      </div>
    );
  }
}
