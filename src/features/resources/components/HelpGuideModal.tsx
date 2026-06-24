import { useMemo, useState } from 'react';
import { Modal } from '@/shared/components/Modal';
import type { CrudResourceDefinition } from '../domain/CrudResource';
import styles from './HelpGuideModal.module.css';

type GuideKey = 'general' | 'activo' | 'venta' | 'aula' | 'contabilidad';

interface GuideDefinition {
  key: GuideKey;
  label: string;
  title: string;
  description: string;
  steps: string[];
  note?: string;
}

const guides: GuideDefinition[] = [
  {
    key: 'general',
    label: 'Registro básico',
    title: 'Cómo registrar información sin romper el flujo',
    description: 'Primero registra catálogos y entidades base. Después registra operaciones que dependan de esas entidades.',
    steps: [
      'Busca si el registro ya existe para evitar duplicados.',
      'Completa primero campos obligatorios y relaciones principales.',
      'Guarda el registro y revisa que aparezca en la tabla antes de usarlo en otra operación.',
      'Usa filtros y exportación cuando necesites validar grupos grandes de datos.',
    ],
  },
  {
    key: 'activo',
    label: 'Activo / bien',
    title: 'Flujo recomendado para registrar un activo',
    description: 'Un activo no debería nacer directamente en una transacción contable sin estar identificado como bien.',
    steps: [
      'Registra el activo en Inventario > Bien con tipo ACTIVO_FIJO o el tipo que corresponda.',
      'Si el activo necesita seguimiento físico, registra su instancia, lote o movimiento de inventario según corresponda.',
      'Luego registra la Transacción con tipo BIEN y selecciona el bien o movimiento relacionado.',
      'Adjunta el comprobante en Archivos Transacción usando la carga a Cloudinary.',
    ],
    note: 'Así queda trazabilidad entre inventario, contabilidad y comprobante digital.',
  },
  {
    key: 'venta',
    label: 'Venta y detalle',
    title: 'Venta con varios productos o servicios',
    description: 'La cabecera de una venta y sus líneas de detalle deben tratarse como cosas distintas.',
    steps: [
      'Registra primero los productos de tienda en Inventario > Bien o los servicios académicos en Servicios Educativos > Producto Educativo.',
      'Crea la operación principal como Transacción de tipo VENTA.',
      'El detalle de venta debe quedar aparte para soportar muchos productos o servicios en una misma venta.',
      'Después relaciona la venta con sus movimientos contables y valida que el Debe y Haber cuadren.',
    ],
    note: 'En la documentación disponible no aparece un endpoint específico de venta detalle. Por eso no se inventó una tabla falsa; la guía deja el flujo preparado para cuando esa tabla/endpoint esté disponible en el backend.',
  },
  {
    key: 'aula',
    label: 'Aula por hora',
    title: 'Lectura visual de clases por hora',
    description: 'Para aulas y clases por hora, la tabla se ordena por hora y usa color por bloque horario.',
    steps: [
      'Registra primero el aula en Infraestructura > Aula.',
      'Crea la clase por hora indicando aula, estudiante, tutor, materia y hora de llegada.',
      'Usa los colores de la tabla para identificar rápidamente registros del mismo bloque horario.',
      'Filtra por aula, tutor, estudiante, modalidad o estado operativo cuando necesites revisar ocupación.',
    ],
  },
  {
    key: 'contabilidad',
    label: 'Contabilidad',
    title: 'Validación contable mínima',
    description: 'La contabilidad debe conservar relación con el hecho operativo que la origina.',
    steps: [
      'Define Grupo Cuenta y Cuenta antes de crear movimientos contables.',
      'Selecciona el tipo de transacción correcto: GENERAL, COSTO, VENTA, BIEN o DEUDA.',
      'Completa solo las referencias que correspondan al tipo elegido.',
      'Agrega movimientos con cuenta buscable y confirma que el total Debe sea igual al total Haber.',
    ],
  },
];

function chooseInitialGuide(resource?: CrudResourceDefinition): GuideKey {
  if (!resource) return 'general';
  if (resource.key === 'bien' || resource.key.includes('bien')) return 'activo';
  if (resource.key === 'transaccion') return 'contabilidad';
  if (resource.key === 'clase-por-hora' || resource.key === 'aula') return 'aula';
  return 'general';
}

interface HelpGuideModalProps {
  isOpen: boolean;
  resource?: CrudResourceDefinition;
  onClose: () => void;
}

export function HelpGuideModal({ isOpen, resource, onClose }: HelpGuideModalProps) {
  const initialGuide = useMemo(() => chooseInitialGuide(resource), [resource]);
  const [activeKey, setActiveKey] = useState<GuideKey>(initialGuide);

  const activeGuide = guides.find((guide) => guide.key === activeKey) ?? guides[0];

  return (
    <Modal title="Ayuda operativa" isOpen={isOpen} onClose={onClose}>
      <div className={styles.guide}>
        <p className={styles.intro}>
          Esta ayuda explica el orden recomendado para registrar información y evitar datos sueltos o duplicados.
        </p>
        <div className={styles.tabs} role="tablist" aria-label="Temas de ayuda">
          {guides.map((guide) => (
            <button
              key={guide.key}
              type="button"
              aria-pressed={guide.key === activeKey}
              onClick={() => setActiveKey(guide.key)}
            >
              {guide.label}
            </button>
          ))}
        </div>
        <section className={styles.panel}>
          <h3>{activeGuide.title}</h3>
          <p>{activeGuide.description}</p>
          <ol className={styles.steps}>
            {activeGuide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {activeGuide.note ? <div className={styles.note}>{activeGuide.note}</div> : null}
        </section>
      </div>
    </Modal>
  );
}
