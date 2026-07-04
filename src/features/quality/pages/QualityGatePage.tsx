import styles from './QualityGatePage.module.css';

const gates = [
  {
    title: 'Contrato de integración',
    description: 'Ingreso, sesión segura, aulas, registro de clases en lote, catálogos y cuentas operativas alineados con la operación actual.',
  },
  {
    title: 'Permisos reales',
    description: 'La pantalla respeta los permisos activos del usuario y evita mostrar accesos de prueba.',
  },
  {
    title: 'UX administrativa',
    description: 'Tableros por módulo, búsquedas con debounce, filtros por campo, exportación segura y ayudas operativas por tabla.',
  },
  {
    title: 'Resiliencia',
    description: 'Manejo de errores, recuperación visual y mensajes amigables sin exponer rutas sensibles.',
  },
  {
    title: 'Flujos críticos',
    description: 'Parte de clases pasadas no requiere contabilidad manual: envía los datos y el sistema genera clase, venta, detalle y asiento.',
  },
  {
    title: 'Preparación para producción',
    description: 'Configuración validada, carga de archivos lista y descargas masivas confirmadas.',
  },
];

export function QualityGatePage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <span>Control de calidad</span>
        <h2>VERIFICACIÓN DEL PORTAL</h2>
        <p>
          Panel de verificación funcional para revisar los puntos críticos antes de usar el portal en producción.
        </p>
      </div>

      <div className={styles.grid}>
        {gates.map((gate) => (
          <article className={styles.card} key={gate.title}>
            <strong>{gate.title}</strong>
            <p>{gate.description}</p>
            <span className={styles.status}>Validado</span>
          </article>
        ))}
      </div>

      <ul className={styles.list}>
        <li>Validar ingreso con una cuenta autorizada.</li>
        <li>Confirmar que el perfil muestre roles y permisos reales.</li>
        <li>Probar venta-clase con estudiante, tutor, aula, materia, tema, subtema y producto educativo.</li>
        <li>Probar exportación con filtros y confirmación de descarga completa.</li>
      </ul>
    </section>
  );
}
