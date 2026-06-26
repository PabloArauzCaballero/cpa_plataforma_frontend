import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { PageState } from '@/shared/components/PageState';
import { explainVentaClaseError, registrarVentaClaseBatch, type VentaClaseRowPayload } from '../services/ventaClaseApi';
import {
  listAulaOptions,
  listEstudianteOptions,
  listMateriaTreeOptions,
  listProductoEducativoOptions,
  listTutorOptions,
  type MateriaTreeOption,
  type ProductoEducativoOption,
  type VentaClaseLookupOption,
} from '../services/ventaClaseLookupApi';
import styles from './VentaClaseBatchPage.module.css';

type VentaClaseDraftRow = {
  id: string;
  fecha: string;
  hora_ingreso: string;
  hora_salida: string;
  id_estudiante: string;
  nombre_estudiante: string;
  id_tutor: string;
  nombre_tutor: string;
  id_aula: string;
  id_materia_tree: string;
  id_producto_educativo: string;
  materia: string;
  tema: string;
  subtema: string;
  motivo_clase: string;
  efectivo: string;
  qr: string;
  cxc: string;
  paquete: string;
  situacion_base: string;
};

type DraftField = keyof VentaClaseDraftRow;

const MOTIVOS = ['Nivelación', 'Apoyo', 'Reforzamiento', 'Avance', 'Recuperación', 'Examen', 'Otro'];
const SIT_BASE = ['CLASE_PASADA', 'OBSERVADA'];

function createEmptyRow(index: number): VentaClaseDraftRow {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    fecha: new Date().toISOString().slice(0, 10),
    hora_ingreso: '',
    hora_salida: '',
    id_estudiante: '',
    nombre_estudiante: '',
    id_tutor: '',
    nombre_tutor: '',
    id_aula: '',
    id_materia_tree: '',
    id_producto_educativo: '',
    materia: '',
    tema: '',
    subtema: '',
    motivo_clase: 'Nivelación',
    efectivo: '0',
    qr: '0',
    cxc: '0',
    paquete: '0',
    situacion_base: 'CLASE_PASADA',
  };
}

function parseMoney(value: unknown): number {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function optionalNumber(value: string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function asPayload(row: VentaClaseDraftRow): VentaClaseRowPayload {
  return {
    fecha: row.fecha,
    hora_ingreso: row.hora_ingreso,
    hora_salida: row.hora_salida || undefined,
    id_estudiante: optionalNumber(row.id_estudiante),
    nombre_estudiante: row.nombre_estudiante.trim() || undefined,
    id_tutor: optionalNumber(row.id_tutor),
    nombre_tutor: row.nombre_tutor.trim() || undefined,
    id_aula: optionalNumber(row.id_aula),
    id_materia_tree: optionalNumber(row.id_materia_tree),
    id_producto_educativo: optionalNumber(row.id_producto_educativo),
    materia: row.materia.trim() || undefined,
    tema: row.tema.trim() || undefined,
    subtema: row.subtema.trim() || undefined,
    motivo_clase: row.motivo_clase.trim(),
    efectivo: parseMoney(row.efectivo),
    qr: parseMoney(row.qr),
    cxc: parseMoney(row.cxc),
    paquete: parseMoney(row.paquete),
    situacion_base: row.situacion_base.trim() || 'CLASE_PASADA',
  };
}

function hasContent(row: VentaClaseDraftRow): boolean {
  const values = [
    row.hora_ingreso,
    row.hora_salida,
    row.id_estudiante,
    row.nombre_estudiante,
    row.id_tutor,
    row.nombre_tutor,
    row.id_aula,
    row.id_materia_tree,
    row.id_producto_educativo,
    row.materia,
    row.tema,
    row.subtema,
  ];
  const hasText = values.some((value) => String(value ?? '').trim() !== '');
  const hasAmount = [row.efectivo, row.qr, row.cxc, row.paquete].some((value) => parseMoney(value) > 0);
  return hasText || hasAmount;
}

function validateRows(rows: VentaClaseDraftRow[]): string[] {
  const activeRows = rows.filter(hasContent);
  const errors: string[] = [];

  if (activeRows.length === 0) {
    errors.push('Agrega al menos una clase con datos reales antes de enviar.');
  }

  activeRows.forEach((row, index) => {
    const number = index + 1;
    const efectivo = parseMoney(row.efectivo);
    const qr = parseMoney(row.qr);
    const cxc = parseMoney(row.cxc);
    const paquete = parseMoney(row.paquete);
    const total = efectivo + qr + cxc + paquete;

    if (!row.fecha) errors.push(`Fila ${number}: la fecha es obligatoria.`);
    if (!row.hora_ingreso) errors.push(`Fila ${number}: la hora de ingreso es obligatoria.`);
    if (row.hora_ingreso && row.hora_salida && row.hora_salida <= row.hora_ingreso) {
      errors.push(`Fila ${number}: la hora de salida debe ser mayor a la hora de ingreso.`);
    }
    if (total <= 0) errors.push(`Fila ${number}: debe registrar al menos un monto en efectivo, QR, CxC o paquete.`);
    if ([efectivo, qr, cxc, paquete].some((value) => value < 0)) {
      errors.push(`Fila ${number}: los montos no pueden ser negativos.`);
    }
    if ((cxc > 0 || paquete > 0) && !row.id_estudiante) {
      errors.push(`Fila ${number}: para CxC o paquete debes seleccionar un estudiante registrado.`);
    }
    if (!row.motivo_clase.trim()) errors.push(`Fila ${number}: el motivo de clase es obligatorio.`);
  });

  return errors;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, 'es'));
}

function getSelectedLabel(options: VentaClaseLookupOption[], value: string): string {
  return options.find((option) => option.value === value)?.payloadLabel ?? '';
}

export function VentaClaseBatchPage() {
  const [rows, setRows] = useState<VentaClaseDraftRow[]>(() => [createEmptyRow(1), createEmptyRow(2), createEmptyRow(3)]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [responsePreview, setResponsePreview] = useState('');
  const [estudianteOptions, setEstudianteOptions] = useState<VentaClaseLookupOption[]>([]);
  const [tutorOptions, setTutorOptions] = useState<VentaClaseLookupOption[]>([]);
  const [aulaOptions, setAulaOptions] = useState<VentaClaseLookupOption[]>([]);
  const [materiaTreeOptions, setMateriaTreeOptions] = useState<MateriaTreeOption[]>([]);
  const [productoOptions, setProductoOptions] = useState<ProductoEducativoOption[]>([]);
  const [lookupStatus, setLookupStatus] = useState('Cargando catálogos desde el backend...');
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadLookups() {
      setLookupError('');
      setLookupStatus('Cargando estudiantes, tutores, aulas, materias, temas, subtemas y productos desde el backend...');
      try {
        const [estudiantes, tutores, aulas, materias, productos] = await Promise.all([
          listEstudianteOptions(),
          listTutorOptions(),
          listAulaOptions(),
          listMateriaTreeOptions(),
          listProductoEducativoOptions(),
        ]);
        if (!active) return;
        setEstudianteOptions(estudiantes);
        setTutorOptions(tutores);
        setAulaOptions(aulas);
        setMateriaTreeOptions(materias);
        setProductoOptions(productos);
        setLookupStatus('Catálogos cargados desde el backend. El frontend solo captura datos; el backend genera venta, detalle, clase y asiento contable.');
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

  const materiaOptions = useMemo(() => uniqueStrings(materiaTreeOptions.map((option) => option.materia)), [materiaTreeOptions]);

  const payloadRows = useMemo(() => rows.filter(hasContent).map(asPayload), [rows]);
  const batchPayload = useMemo(() => ({
    fecha: payloadRows[0]?.fecha ?? new Date().toISOString().slice(0, 10),
    items: payloadRows,
  }), [payloadRows]);

  const totals = useMemo(() => payloadRows.reduce(
    (acc, row) => ({
      efectivo: acc.efectivo + row.efectivo,
      qr: acc.qr + row.qr,
      cxc: acc.cxc + row.cxc,
      paquete: acc.paquete + row.paquete,
    }),
    { efectivo: 0, qr: 0, cxc: 0, paquete: 0 },
  ), [payloadRows]);

  function getTemaOptions(row: VentaClaseDraftRow): string[] {
    return uniqueStrings(materiaTreeOptions
      .filter((option) => !row.materia || option.materia === row.materia)
      .map((option) => option.tema));
  }

  function getSubtemaOptions(row: VentaClaseDraftRow): MateriaTreeOption[] {
    return materiaTreeOptions
      .filter((option) => !row.materia || option.materia === row.materia)
      .filter((option) => !row.tema || option.tema === row.tema)
      .filter((option) => option.subtema)
      .sort((a, b) => a.subtema.localeCompare(b.subtema, 'es'));
  }

  function findMateriaTreeBySubtema(row: VentaClaseDraftRow, selectedId: string): MateriaTreeOption | undefined {
    const id = Number(selectedId);
    if (!Number.isFinite(id)) return undefined;
    return getSubtemaOptions(row).find((option) => option.id === id);
  }

  function updateRow(id: string, field: DraftField, value: string) {
    setRows((current) => current.map((row) => {
      if (row.id !== id) return row;
      if (field === 'materia') return { ...row, materia: value, tema: '', subtema: '', id_materia_tree: '' };
      if (field === 'tema') return { ...row, tema: value, subtema: '', id_materia_tree: '' };
      return { ...row, [field]: value };
    }));
  }

  function chooseLookup(id: string, field: 'id_estudiante' | 'id_tutor' | 'id_aula' | 'id_producto_educativo', value: string) {
    setRows((current) => current.map((row) => {
      if (row.id !== id) return row;
      if (field === 'id_estudiante') return { ...row, id_estudiante: value, nombre_estudiante: getSelectedLabel(estudianteOptions, value) };
      if (field === 'id_tutor') return { ...row, id_tutor: value, nombre_tutor: getSelectedLabel(tutorOptions, value) };
      if (field === 'id_aula') return { ...row, id_aula: value };
      return { ...row, id_producto_educativo: value };
    }));
  }

  function chooseSubtema(id: string, selectedId: string) {
    setRows((current) => current.map((row) => {
      if (row.id !== id) return row;
      const selected = findMateriaTreeBySubtema(row, selectedId);
      if (!selected) return { ...row, id_materia_tree: '', subtema: '' };
      return {
        ...row,
        id_materia_tree: String(selected.id),
        materia: selected.materia,
        tema: selected.tema,
        subtema: selected.subtema,
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
      const response = await registrarVentaClaseBatch(batchPayload);
      setSuccessMessage(`Se enviaron ${payloadRows.length} clases pasadas correctamente. Si el backend devolvió advertencias por fila, revísalas abajo.`);
      setResponsePreview(JSON.stringify(response, null, 2));
    } catch (error) {
      setErrors([explainVentaClaseError(error)]);
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
            Registra en lote las clases ya realizadas. El frontend captura datos; el backend genera la clase, venta,
            detalle, transacción, movimientos contables y trazabilidad.
          </p>
        </div>
      </div>

      <div className={styles.noticeRow}>
        <div className={styles.notice}>
          No registres movimientos contables manuales para este flujo. Efectivo, QR, CxC y paquete se resuelven con la configuración y cuentas asociadas desde el backend.
        </div>
        <Link className={styles.catalogLink} to="/contabilidad/catalogos-cuentas-operativas">Configurar catálogos y cuentas</Link>
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
          <div className={styles.summaryCard}><strong>{totals.paquete.toFixed(2)}</strong><span>Total paquete</span></div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Hora ingreso</th>
                <th>Hora salida</th>
                <th>Estudiante</th>
                <th>Tutor</th>
                <th>Aula</th>
                <th>Materia</th>
                <th>Tema</th>
                <th>Subtema</th>
                <th>Producto educativo</th>
                <th>Motivo clase</th>
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
                    <select value={row.id_estudiante} onChange={(event) => chooseLookup(row.id, 'id_estudiante', event.target.value)}>
                      <option value="">Selecciona estudiante</option>
                      {estudianteOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.id_tutor} onChange={(event) => chooseLookup(row.id, 'id_tutor', event.target.value)}>
                      <option value="">Selecciona tutor</option>
                      {tutorOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.id_aula} onChange={(event) => chooseLookup(row.id, 'id_aula', event.target.value)}>
                      <option value="">Sin aula</option>
                      {aulaOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.materia} onChange={(event) => updateRow(row.id, 'materia', event.target.value)}>
                      <option value="">Selecciona materia</option>
                      {materiaOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.tema} onChange={(event) => updateRow(row.id, 'tema', event.target.value)}>
                      <option value="">Selecciona tema</option>
                      {getTemaOptions(row).map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.id_materia_tree} onChange={(event) => chooseSubtema(row.id, event.target.value)}>
                      <option value="">Selecciona subtema</option>
                      {getSubtemaOptions(row).map((option) => <option key={option.id} value={option.id}>{option.subtema}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.id_producto_educativo} onChange={(event) => chooseLookup(row.id, 'id_producto_educativo', event.target.value)}>
                      <option value="">Sin producto</option>
                      {productoOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.motivo_clase} onChange={(event) => updateRow(row.id, 'motivo_clase', event.target.value)}>
                      {MOTIVOS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.efectivo} onChange={(event) => updateRow(row.id, 'efectivo', event.target.value)} /></td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.qr} onChange={(event) => updateRow(row.id, 'qr', event.target.value)} /></td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.cxc} onChange={(event) => updateRow(row.id, 'cxc', event.target.value)} /></td>
                  <td><input className={styles.moneyInput} type="number" min="0" step="0.01" value={row.paquete} onChange={(event) => updateRow(row.id, 'paquete', event.target.value)} /></td>
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
            <p>Se envía como batch con llave <strong>items</strong>. El backend arma la contabilidad.</p>
          </div>
        </div>
        <pre className={styles.preview}>{JSON.stringify(batchPayload, null, 2)}</pre>
      </div>

      {responsePreview ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Respuesta del backend</h3>
              <p>Resultado devuelto por el registro batch. Revisa advertencias por fila si existen.</p>
            </div>
          </div>
          <pre className={styles.preview}>{responsePreview}</pre>
        </div>
      ) : null}
    </section>
  );
}
