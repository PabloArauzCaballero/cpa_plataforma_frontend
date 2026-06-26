import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { PageState } from '@/shared/components/PageState';
import { registrarVentaClaseBatch, type VentaClaseRowPayload } from '../services/ventaClaseApi';
import { listEstudianteOptions, listMateriaProductoOptions, listTutorOptions, type VentaClaseLookupOption } from '../services/ventaClaseLookupApi';
import styles from './VentaClaseBatchPage.module.css';

type VentaClaseDraftRow = VentaClaseRowPayload & {
  id: string;
  id_estudiante_lookup: string;
  id_tutor_lookup: string;
  id_materia_producto_lookup: string;
};

type DraftField = keyof VentaClaseDraftRow;

const MOTIVOS = ['CLASE', 'RECUPERACION', 'REFORZAMIENTO', 'NIVELACION', 'EXAMEN', 'OTRO'];
const SIT_BASE = ['PENDIENTE', 'REGISTRADA', 'OBSERVADA', 'ANULADA'];

function createEmptyRow(index: number): VentaClaseDraftRow {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    fecha: new Date().toISOString().slice(0, 10),
    hora_ingreso: '',
    hora_salida: '',
    nombre_completo_estudiante: '',
    tutor: '',
    id_estudiante_lookup: '',
    id_tutor_lookup: '',
    id_materia_producto_lookup: '',
    motivo_clase: 'CLASE',
    materia_producto: '',
    tema: '',
    subtema: '',
    efectivo: 0,
    qr: 0,
    cxc: 0,
    paquete: '',
    situacion_base: 'PENDIENTE',
  };
}

function toMoney(value: unknown): number {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function normalizeRow(row: VentaClaseDraftRow): VentaClaseRowPayload {
  return {
    fecha: row.fecha,
    hora_ingreso: row.hora_ingreso,
    hora_salida: row.hora_salida,
    nombre_completo_estudiante: row.nombre_completo_estudiante.trim(),
    tutor: row.tutor.trim(),
    motivo_clase: row.motivo_clase.trim(),
    materia_producto: row.materia_producto.trim(),
    tema: row.tema.trim(),
    subtema: row.subtema.trim(),
    efectivo: toMoney(row.efectivo),
    qr: toMoney(row.qr),
    cxc: toMoney(row.cxc),
    paquete: row.paquete.trim(),
    situacion_base: row.situacion_base.trim(),
  };
}

function hasContent(row: VentaClaseDraftRow): boolean {
  const normalized = normalizeRow(row);
  return Object.entries(normalized).some(([key, value]) => {
    if (key === 'fecha' || key === 'motivo_clase' || key === 'situacion_base') return false;
    if (typeof value === 'number') return value > 0;
    return String(value ?? '').trim() !== '';
  });
}

function validateRows(rows: VentaClaseDraftRow[]): string[] {
  const activeRows = rows.filter(hasContent);
  const errors: string[] = [];

  if (activeRows.length === 0) {
    errors.push('Agrega al menos una clase con datos reales antes de enviar.');
  }

  activeRows.forEach((row, index) => {
    const number = index + 1;
    if (!row.fecha) errors.push(`Fila ${number}: la fecha es obligatoria.`);
    if (!row.hora_ingreso) errors.push(`Fila ${number}: la hora de ingreso es obligatoria.`);
    if (!row.hora_salida) errors.push(`Fila ${number}: la hora de salida es obligatoria.`);
    if (row.hora_ingreso && row.hora_salida && row.hora_salida <= row.hora_ingreso) {
      errors.push(`Fila ${number}: la hora de salida debe ser mayor a la hora de ingreso.`);
    }
    if (!row.nombre_completo_estudiante.trim()) errors.push(`Fila ${number}: el nombre del estudiante es obligatorio.`);
    if (!row.tutor.trim()) errors.push(`Fila ${number}: el tutor es obligatorio.`);
    if (!row.materia_producto.trim()) errors.push(`Fila ${number}: la materia o producto es obligatorio.`);
  });

  return errors;
}

export function VentaClaseBatchPage() {
  const [rows, setRows] = useState<VentaClaseDraftRow[]>(() => [createEmptyRow(1), createEmptyRow(2), createEmptyRow(3)]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [responsePreview, setResponsePreview] = useState('');
  const [estudianteOptions, setEstudianteOptions] = useState<VentaClaseLookupOption[]>([]);
  const [tutorOptions, setTutorOptions] = useState<VentaClaseLookupOption[]>([]);
  const [materiaProductoOptions, setMateriaProductoOptions] = useState<VentaClaseLookupOption[]>([]);
  const [lookupStatus, setLookupStatus] = useState('Cargando estudiantes, tutores y materias desde el backend...');
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadLookups() {
      setLookupError('');
      setLookupStatus('Cargando estudiantes, tutores y materias desde el backend...');
      try {
        const [estudiantes, tutores, materiasProductos] = await Promise.all([
          listEstudianteOptions(),
          listTutorOptions(),
          listMateriaProductoOptions(),
        ]);
        if (!active) return;
        setEstudianteOptions(estudiantes);
        setTutorOptions(tutores);
        setMateriaProductoOptions(materiasProductos);
        setLookupStatus('Listas de selección cargadas desde el backend.');
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'No se pudieron cargar los datos relacionados.';
        setLookupError(message);
        setLookupStatus('No se pudieron cargar las listas relacionadas.');
      }
    }

    void loadLookups();
    return () => { active = false; };
  }, []);

  const payloadRows = useMemo(() => rows.filter(hasContent).map(normalizeRow), [rows]);
  const totals = useMemo(() => payloadRows.reduce(
    (acc, row) => ({
      efectivo: acc.efectivo + row.efectivo,
      qr: acc.qr + row.qr,
      cxc: acc.cxc + row.cxc,
    }),
    { efectivo: 0, qr: 0, cxc: 0 },
  ), [payloadRows]);

  function updateRow(id: string, field: DraftField, value: string | number) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function chooseOption(id: string, field: 'id_estudiante_lookup' | 'id_tutor_lookup' | 'id_materia_producto_lookup', value: string) {
    setRows((current) => current.map((row) => {
      if (row.id !== id) return row;

      if (field === 'id_estudiante_lookup') {
        const option = estudianteOptions.find((item) => item.value === value);
        return {
          ...row,
          id_estudiante_lookup: value,
          nombre_completo_estudiante: option?.payloadLabel ?? '',
        };
      }

      if (field === 'id_tutor_lookup') {
        const option = tutorOptions.find((item) => item.value === value);
        return {
          ...row,
          id_tutor_lookup: value,
          tutor: option?.payloadLabel ?? '',
        };
      }

      const option = materiaProductoOptions.find((item) => item.value === value);
      return {
        ...row,
        id_materia_producto_lookup: value,
        materia_producto: option?.payloadLabel ?? '',
        tema: option?.tema || row.tema,
        subtema: option?.subtema || row.subtema,
      };
    }));
  }

  function addRow() {
    setRows((current) => [...current, createEmptyRow(current.length + 1)]);
  }

  function duplicateLastRow() {
    setRows((current) => {
      const last = current[current.length - 1] ?? createEmptyRow(1);
      return [...current, { ...last, id: `${Date.now()}-copy-${Math.random().toString(16).slice(2)}` }];
    });
  }

  function removeRow(id: string) {
    setRows((current) => current.length === 1 ? current : current.filter((row) => row.id !== id));
  }

  function clearRows() {
    setRows([createEmptyRow(1), createEmptyRow(2), createEmptyRow(3)]);
    setErrors([]);
    setSuccessMessage('');
    setResponsePreview('');
  }

  async function submit() {
    const nextErrors = validateRows(rows);
    setErrors(nextErrors);
    setSuccessMessage('');
    setResponsePreview('');

    if (nextErrors.length > 0) return;

    setIsSaving(true);
    try {
      const response = await registrarVentaClaseBatch({ registros: payloadRows });
      setSuccessMessage(`Se enviaron ${payloadRows.length} clases pasadas correctamente.`);
      setResponsePreview(JSON.stringify(response, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar la parte de clases pasadas.';
      setErrors([message]);
    } finally {
      setIsSaving(false);
    }
  }

  if (!rows.length) {
    return <PageState title="Formulario no disponible" message="No se pudo preparar la tabla editable." />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <span>Contabilidad · clases pasadas</span>
          <h2>PARTE DE CLASES PASADAS</h2>
          <p>
            Registra en lote las clases ya realizadas. La pantalla replica el formulario físico: horas, estudiante,
            tutor, motivo, materia o producto, tema, subtema y forma de cobro.
          </p>
        </div>
      </div>

      <div className={styles.notice}>
        Este formulario envía un lote bajo la llave <strong>registros</strong>. Cada fila con datos se convierte en un registro del batch.
        Estudiante, tutor, materia/producto y tema se seleccionan desde los datos reales del backend.
      </div>

      {lookupError ? (
        <div className={styles.error}>
          No se pudieron cargar las listas relacionadas: {lookupError}
        </div>
      ) : <div className={styles.lookupInfo}>{lookupStatus}</div>}

      {errors.length > 0 ? (
        <div className={styles.error}>
          {errors.map((error) => <div key={error}>{error}</div>)}
        </div>
      ) : null}

      {successMessage ? <div className={styles.success}>{successMessage}</div> : null}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h3>Tabla editable</h3>
            <p>Completa solo las filas necesarias. Las filas vacías no se envían al backend.</p>
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={clearRows}>Limpiar</Button>
            <Button type="button" variant="secondary" onClick={duplicateLastRow}>Duplicar última</Button>
            <Button type="button" onClick={addRow}>Añadir fila</Button>
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}><strong>{payloadRows.length}</strong><span>Filas a enviar</span></div>
          <div className={styles.summaryCard}><strong>{totals.efectivo.toFixed(2)}</strong><span>Total efectivo</span></div>
          <div className={styles.summaryCard}><strong>{totals.qr.toFixed(2)}</strong><span>Total QR</span></div>
          <div className={styles.summaryCard}><strong>{totals.cxc.toFixed(2)}</strong><span>Total CxC</span></div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Hora ingreso</th>
                <th>Hora salida</th>
                <th>Nombre completo estudiante</th>
                <th>Tutor</th>
                <th>Motivo clase</th>
                <th>Materia / Producto</th>
                <th>Tema</th>
                <th>Subtema</th>
                <th>Efectivo</th>
                <th>QR</th>
                <th>CxC</th>
                <th>Paq.</th>
                <th>Sit. Base</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td><span className={styles.rowNumber}>{index + 1}</span></td>
                  <td><input type="date" value={row.fecha} onChange={(event) => updateRow(row.id, 'fecha', event.target.value)} /></td>
                  <td><input type="time" value={row.hora_ingreso} onChange={(event) => updateRow(row.id, 'hora_ingreso', event.target.value)} /></td>
                  <td><input type="time" value={row.hora_salida} onChange={(event) => updateRow(row.id, 'hora_salida', event.target.value)} /></td>
                  <td>
                    <select value={row.id_estudiante_lookup} onChange={(event) => chooseOption(row.id, 'id_estudiante_lookup', event.target.value)}>
                      <option value="">Selecciona estudiante</option>
                      {estudianteOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.id_tutor_lookup} onChange={(event) => chooseOption(row.id, 'id_tutor_lookup', event.target.value)}>
                      <option value="">Selecciona tutor</option>
                      {tutorOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.motivo_clase} onChange={(event) => updateRow(row.id, 'motivo_clase', event.target.value)}>
                      {MOTIVOS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.id_materia_producto_lookup} onChange={(event) => chooseOption(row.id, 'id_materia_producto_lookup', event.target.value)}>
                      <option value="">Selecciona materia/producto</option>
                      {materiaProductoOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <input value={row.tema} onChange={(event) => updateRow(row.id, 'tema', event.target.value)} placeholder="Tema cargado del backend" list="venta-clase-temas" />
                  </td>
                  <td>
                    <input value={row.subtema} onChange={(event) => updateRow(row.id, 'subtema', event.target.value)} placeholder="Subtema cargado del backend" list="venta-clase-subtemas" />
                  </td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.efectivo} onChange={(event) => updateRow(row.id, 'efectivo', event.target.value)} /></td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.qr} onChange={(event) => updateRow(row.id, 'qr', event.target.value)} /></td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.cxc} onChange={(event) => updateRow(row.id, 'cxc', event.target.value)} /></td>
                  <td><input value={row.paquete} onChange={(event) => updateRow(row.id, 'paquete', event.target.value)} placeholder="Paq." /></td>
                  <td>
                    <select value={row.situacion_base} onChange={(event) => updateRow(row.id, 'situacion_base', event.target.value)}>
                      {SIT_BASE.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </td>
                  <td><button className={styles.removeButton} type="button" onClick={() => removeRow(row.id)}>Quitar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <datalist id="venta-clase-temas">
            {Array.from(new Set(materiaProductoOptions.map((option) => option.tema).filter(Boolean))).map((tema) => (
              <option key={tema} value={tema} />
            ))}
          </datalist>
          <datalist id="venta-clase-subtemas">
            {Array.from(new Set(materiaProductoOptions.map((option) => option.subtema).filter(Boolean))).map((subtema) => (
              <option key={subtema} value={subtema} />
            ))}
          </datalist>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={clearRows}>Cancelar / limpiar</Button>
          <Button type="button" disabled={isSaving} onClick={() => void submit()}>{isSaving ? 'Enviando...' : 'Enviar parte de clases'}</Button>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h3>Vista previa del payload</h3>
            <p>Sirve para revisar exactamente lo que se enviará antes de confirmar.</p>
          </div>
        </div>
        <pre className={styles.preview}>{JSON.stringify({ registros: payloadRows }, null, 2)}</pre>
      </div>

      {responsePreview ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Respuesta del backend</h3>
              <p>Resultado devuelto por el endpoint de registro batch.</p>
            </div>
          </div>
          <pre className={styles.preview}>{responsePreview}</pre>
        </div>
      ) : null}
    </section>
  );
}
