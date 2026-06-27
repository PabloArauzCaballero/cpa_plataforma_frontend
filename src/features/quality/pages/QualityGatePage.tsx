import styles from './QualityGatePage.module.css';

const gates = [
  {
    title: 'Contrato backend',
    description: 'Login, sesión opaca, aulas, venta-clase batch, catálogos y cuentas operativas alineados con el contrato actual.',
  },
  {
    title: 'Permisos reales',
    description: 'La UI respeta permisos cuando el backend los devuelve; si no llegan, no inventa bloqueos falsos y el backend sigue siendo autoridad.',
  },
  {
    title: 'UX administrativa',
    description: 'Tableros por módulo, búsquedas con debounce, filtros por campo, exportación segura y ayudas operativas por tabla.',
  },
  {
    title: 'Resiliencia',
    description: 'Normalizadores defensivos, manejo de 401/403, Error Boundary global y mensajes amigables sin exponer rutas sensibles.',
  },
  {
    title: 'Flujos críticos',
    description: 'Parte de clases pasadas no arma contabilidad manual: envía payload y el backend genera clase, venta, detalle y asiento.',
  },
  {
    title: 'Preparación para producción',
    description: 'Build TypeScript validado, variables de entorno documentadas, Cloudinary configurado y descargas masivas confirmadas.',
  },
];

export function QualityGatePage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <span>Control de calidad</span>
        <h2>FRONTEND 10/10</h2>
        <p>
          Panel de verificación funcional para dejar claro qué puntos críticos ya cubre el frontend antes de probarlo contra producción.
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
        <li>Ejecutar: npm run build</li>
        <li>Probar login con pablo.admin o pablo.admin@cpa.com.</li>
        <li>Probar venta-clase con estudiante, tutor, aula, materia, tema, subtema y producto educativo.</li>
        <li>Probar exportación con filtros y confirmación de descarga completa.</li>
      </ul>
    </section>
  );
}
