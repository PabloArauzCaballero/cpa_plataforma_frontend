import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/shared/components/Modal';
import { humanizeFieldLabel } from '@/shared/utils/humanize';
import type { CrudResourceDefinition, ResourceFieldDefinition } from '../domain/CrudResource';
import { humanizeTitleLabel } from '@/shared/utils/humanize';
import styles from './HelpGuideModal.module.css';

type HelpTab = 'tabla' | 'orden' | 'transaccion' | 'campos';

interface HelpStep {
  label: string;
  text: string;
}

interface TransactionHelp {
  title: string;
  typeLabel: string;
  description: string;
  steps: HelpStep[];
}

const SYSTEM_FIELDS = new Set([
  'estado_registro',
  'fecha_registro',
  'fecha_modificacion',
  'version_registro',
  'id_usuario_creador',
  'id_usuario_modificacion',
]);

function fieldLabel(field: ResourceFieldDefinition): string {
  return humanizeFieldLabel(field.label || field.name, field.name);
}

function getRequiredFields(resource: CrudResourceDefinition): ResourceFieldDefinition[] {
  return resource.fields.filter((field) => field.required && !SYSTEM_FIELDS.has(field.name));
}

function getRelationshipFields(resource: CrudResourceDefinition): ResourceFieldDefinition[] {
  return resource.fields.filter((field) => field.name.startsWith('id_') && field.name !== resource.primaryKey && !SYSTEM_FIELDS.has(field.name));
}

function getMainFields(resource: CrudResourceDefinition): ResourceFieldDefinition[] {
  const preferred = ['codigo', 'sku', 'nombre', 'nombre_cuenta', 'descripcion', 'tipo', 'categoria', 'fecha', 'fecha_pago', 'monto', 'total'];
  const selected = resource.fields.filter((field) => preferred.includes(field.name) || field.required);
  return selected.length ? selected.slice(0, 8) : resource.fields.filter((field) => !SYSTEM_FIELDS.has(field.name)).slice(0, 8);
}

function formatFieldList(fields: ResourceFieldDefinition[], fallback: string): string {
  if (fields.length === 0) return fallback;
  return fields.map(fieldLabel).join(', ');
}

function detectTransactionHelp(resource: CrudResourceDefinition): TransactionHelp {
  const key = resource.key;
  const module = resource.module;

  if (key === 'transaccion') {
    return {
      title: 'Esta tabla es la cabecera contable de la operación',
      typeLabel: 'Tipo según operación',
      description: 'Aquí se registra la transacción principal y sus movimientos contables. El tipo elegido define qué referencias se muestran y cuáles se limpian del payload.',
      steps: [
        { label: 'Tipo', text: 'Elige GENERAL, COSTO, VENTA, BIEN o DEUDA según el hecho real que estás registrando.' },
        { label: 'Referencia', text: 'Completa solo los campos relacionados con el tipo seleccionado. Por ejemplo, BIEN usa bien o movimiento de inventario; DEUDA usa deuda o pago de deuda.' },
        { label: 'Movimientos', text: 'Agrega las cuentas con el buscador, coloca Debe o Haber en cada línea y valida que ambos totales cuadren.' },
      ],
    };
  }

  if (key === 'archivos-transaccion') {
    return {
      title: 'Esta tabla se usa después de crear una transacción',
      typeLabel: 'Comprobante',
      description: 'Sirve para adjuntar evidencia digital a una transacción ya existente. La imagen se sube a Cloudinary y el enlace se guarda en el payload.',
      steps: [
        { label: 'Primero', text: 'Crea o identifica la transacción contable correspondiente.' },
        { label: 'Luego', text: 'Selecciona la transacción y sube el comprobante como imagen.' },
        { label: 'Resultado', text: 'El sistema guarda el enlace del archivo para auditoría y respaldo.' },
      ],
    };
  }

  if (key === 'bien') {
    return {
      title: 'Esta tabla alimenta ventas, costos y activos',
      typeLabel: 'VENTA / BIEN / COSTO',
      description: 'Un bien puede ser mercadería, servicio, suministro o activo fijo. Según su tipo se usa en inventario, ventas o transacciones de bienes.',
      steps: [
        { label: 'Inventario', text: 'Registra aquí el bien con SKU, nombre, tipo, unidad y costo/precio de referencia.' },
        { label: 'Venta', text: 'Si se vende como producto de tienda, úsalo como producto de venta y luego registra la transacción tipo VENTA.' },
        { label: 'Activo', text: 'Si es ACTIVO_FIJO, crea después la transacción tipo BIEN para registrar su compra, alta o ajuste contable.' },
      ],
    };
  }

  if (key === 'movimiento-detalle' || key === 'bien-instancia' || key === 'bien-lote') {
    return {
      title: 'Esta tabla da trazabilidad física al bien',
      typeLabel: 'BIEN',
      description: 'Se usa para controlar lote, instancia o movimiento antes de relacionar el hecho físico con contabilidad.',
      steps: [
        { label: 'Base', text: 'Primero debe existir el Bien en Inventario.' },
        { label: 'Detalle', text: 'Registra lote, instancia o movimiento según el control que tenga el bien.' },
        { label: 'Contabilidad', text: 'Cuando corresponda, usa la transacción tipo BIEN y relaciona el bien o movimiento de inventario.' },
      ],
    };
  }

  if (key === 'deuda' || key === 'pago-deuda') {
    return {
      title: 'Esta tabla se conecta con transacciones de deuda',
      typeLabel: 'DEUDA',
      description: 'Las deudas y sus pagos se registran operativamente aquí y luego se reflejan en contabilidad con tipo DEUDA.',
      steps: [
        { label: 'Deuda', text: 'Registra primero la deuda con proveedor, condiciones, moneda, tasa y fechas.' },
        { label: 'Pago', text: 'Cuando exista pago, registra el pago de deuda con monto, fecha y referencia.' },
        { label: 'Contabilidad', text: 'Crea una transacción tipo DEUDA y relaciona la deuda o el pago para cuadrar las cuentas.' },
      ],
    };
  }

  if (key === 'pago-tutor' || key === 'pago-tutor-detalle') {
    return {
      title: 'Esta tabla respalda costos por tutor',
      typeLabel: 'COSTO',
      description: 'El pago del tutor y su detalle deben quedar registrados antes de llevar el costo a contabilidad.',
      steps: [
        { label: 'Detalle', text: 'Registra las clases u horas que originan el pago.' },
        { label: 'Pago', text: 'Calcula subtotal, ajustes y total. Valida fechas de aprobación y pago.' },
        { label: 'Contabilidad', text: 'Usa una transacción tipo COSTO y relaciona el pago del tutor o centro de costo.' },
      ],
    };
  }

  if (key === 'producto-educativo') {
    return {
      title: 'Esta tabla define servicios vendibles',
      typeLabel: 'VENTA',
      description: 'El producto educativo representa el servicio académico que luego puede formar parte de una venta.',
      steps: [
        { label: 'Servicio', text: 'Registra nombre, tipo de producto, precio base y límites de estudiantes.' },
        { label: 'Venta', text: 'Cuando se cobre el servicio, crea una transacción tipo VENTA relacionada con este producto educativo.' },
        { label: 'Detalle', text: 'Si una venta incluye muchos servicios/productos, el detalle debe manejarse separado cuando el backend exponga esa entidad.' },
      ],
    };
  }

  if (key === 'clase' || key === 'clase-por-hora' || key === 'clase-curso' || key === 'aula') {
    return {
      title: 'Esta tabla organiza la operación académica',
      typeLabel: 'COSTO / VENTA',
      description: 'Las clases y aulas respaldan ingresos por servicio académico y costos por tutor.',
      steps: [
        { label: 'Programación', text: 'Registra aula, estudiante, tutor, materia y horario según corresponda.' },
        { label: 'Cobro', text: 'Si la clase genera venta, relaciona el producto educativo o curso en una transacción tipo VENTA.' },
        { label: 'Costo', text: 'Si genera pago a tutor, registra el pago/detalle y luego una transacción tipo COSTO.' },
      ],
    };
  }

  if (key === 'cuenta' || key === 'grupo-cuenta' || key === 'cuenta-asignacion' || key === 'centro-costo' || key === 'centro-costo-mapa' || key === 'concepto-costo') {
    return {
      title: 'Esta tabla prepara la estructura contable',
      typeLabel: 'Soporte contable',
      description: 'Estas tablas no siempre representan una operación por sí mismas; preparan cuentas, grupos, asignaciones o centros para que las transacciones salgan bien.',
      steps: [
        { label: 'Catálogo', text: 'Registra primero grupos, cuentas y conceptos con códigos claros.' },
        { label: 'Asignación', text: 'Relaciona cuentas con entidades operativas cuando aplique.' },
        { label: 'Transacción', text: 'Al crear una transacción, selecciona las cuentas correctas en los movimientos Debe/Haber.' },
      ],
    };
  }

  if (module === 'personas') {
    return {
      title: 'Esta tabla alimenta relaciones operativas',
      typeLabel: 'VENTA / COSTO / GENERAL',
      description: 'Personas, estudiantes, tutores, clientes o proveedores suelen usarse como referencia en clases, pagos, deudas, ventas y transacciones.',
      steps: [
        { label: 'Persona base', text: 'Registra primero los datos generales de la persona.' },
        { label: 'Rol', text: 'Luego crea el rol específico: estudiante, tutor, cliente, proveedor u otro.' },
        { label: 'Operación', text: 'Usa esa entidad en clases, pagos, ventas, deudas o transacciones según corresponda.' },
      ],
    };
  }

  return {
    title: 'Esta tabla puede usarse como soporte operativo',
    typeLabel: 'Según el caso',
    description: 'No todas las tablas llegan directo a contabilidad, pero pueden servir como catálogo, referencia o dato base para operaciones posteriores.',
    steps: [
      { label: 'Registrar', text: `Crea primero el registro de ${resource.label} con sus campos obligatorios.` },
      { label: 'Validar', text: 'Verifica que no exista duplicado y que las relaciones seleccionadas sean correctas.' },
      { label: 'Usar', text: 'Cuando una operación lo requiera, selecciónalo como referencia en la tabla correspondiente o en una transacción.' },
    ],
  };
}

function getOrderSteps(resource: CrudResourceDefinition): HelpStep[] {
  const requiredFields = formatFieldList(getRequiredFields(resource), 'No hay campos obligatorios marcados en el frontend para esta tabla.');
  const relations = getRelationshipFields(resource);
  const relationText = relations.length
    ? `Antes de guardar, confirma que estas relaciones ya existan: ${formatFieldList(relations, '')}.`
    : 'Esta tabla no tiene relaciones obligatorias visibles. Puedes registrarla como dato base.';

  return [
    { label: '1. Buscar', text: `Busca primero en ${resource.label} para evitar duplicar registros.` },
    { label: '2. Dependencias', text: relationText },
    { label: '3. Campos mínimos', text: `Completa los campos principales: ${requiredFields}` },
    { label: '4. Guardar y reutilizar', text: 'Guarda el registro y confirma que aparezca en la tabla antes de usarlo en otra pantalla.' },
  ];
}

function getFieldRows(resource: CrudResourceDefinition): HelpStep[] {
  const mainFields = getMainFields(resource);
  return mainFields.map((field) => {
    const details: string[] = [];
    if (field.required) details.push('obligatorio');
    if (field.type === 'select') details.push('selección controlada');
    if (field.name.startsWith('id_') && field.name !== resource.primaryKey) details.push('relación con otra tabla');
    if (field.helpText) details.push(field.helpText);
    return {
      label: fieldLabel(field),
      text: details.length ? details.join(' · ') : `Campo de tipo ${field.type}.`,
    };
  });
}

interface HelpGuideModalProps {
  isOpen: boolean;
  resource?: CrudResourceDefinition;
  onClose: () => void;
}

export function HelpGuideModal({ isOpen, resource, onClose }: HelpGuideModalProps) {
  const [activeTab, setActiveTab] = useState<HelpTab>('tabla');

  useEffect(() => {
    if (isOpen) setActiveTab('tabla');
  }, [isOpen, resource?.key]);

  const transactionHelp = useMemo(() => (resource ? detectTransactionHelp(resource) : undefined), [resource]);
  const orderSteps = useMemo(() => (resource ? getOrderSteps(resource) : []), [resource]);
  const fieldRows = useMemo(() => (resource ? getFieldRows(resource) : []), [resource]);

  if (!resource || !transactionHelp) {
    return (
      <Modal title="Ayuda operativa" isOpen={isOpen} onClose={onClose}>
        <div className={styles.guideBody}>No hay una tabla seleccionada para mostrar ayuda.</div>
      </Modal>
    );
  }

  return (
    <Modal title={`Ayuda: ${humanizeTitleLabel(resource.label, resource.key)}`} isOpen={isOpen} onClose={onClose}>
      <div className={styles.guideBody}>
        <div className={styles.summaryCard}>
          <span>{resource.moduleLabel}</span>
          <h3>{humanizeTitleLabel(resource.label, resource.key)}</h3>
          <p>{transactionHelp.description}</p>
          <strong>Uso en transacción: {transactionHelp.typeLabel}</strong>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Ayuda por tabla">
          <button type="button" aria-pressed={activeTab === 'tabla'} onClick={() => setActiveTab('tabla')}>Cómo registrar esta tabla</button>
          <button type="button" aria-pressed={activeTab === 'orden'} onClick={() => setActiveTab('orden')}>Orden recomendado</button>
          <button type="button" aria-pressed={activeTab === 'transaccion'} onClick={() => setActiveTab('transaccion')}>Uso en transacciones</button>
          <button type="button" aria-pressed={activeTab === 'campos'} onClick={() => setActiveTab('campos')}>Campos clave</button>
        </div>

        {activeTab === 'tabla' ? (
          <section className={styles.panel}>
            <h3>{transactionHelp.title}</h3>
            <p>Usa esta guía para registrar correctamente la tabla actual, no para una tabla genérica.</p>
            <ol className={styles.steps}>
              {orderSteps.map((step) => (
                <li key={step.label}>
                  <strong>{step.label}</strong>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {activeTab === 'orden' ? (
          <section className={styles.panel}>
            <h3>Antes y después de registrar</h3>
            <p>Este orden evita datos sueltos y reduce errores al relacionar tablas.</p>
            <ol className={styles.steps}>
              {orderSteps.map((step) => (
                <li key={step.label}>
                  <strong>{step.label}</strong>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {activeTab === 'transaccion' ? (
          <section className={styles.panel}>
            <h3>{transactionHelp.title}</h3>
            <p>{transactionHelp.description}</p>
            <ol className={styles.steps}>
              {transactionHelp.steps.map((step) => (
                <li key={step.label}>
                  <strong>{step.label}</strong>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {activeTab === 'campos' ? (
          <section className={styles.panel}>
            <h3>Campos que debes revisar</h3>
            <p>Estos son los campos más importantes de esta tabla para registrarla y usarla después.</p>
            <div className={styles.fieldGrid}>
              {fieldRows.map((field) => (
                <article key={field.label} className={styles.fieldCard}>
                  <strong>{field.label}</strong>
                  <span>{field.text}</span>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Modal>
  );
}
