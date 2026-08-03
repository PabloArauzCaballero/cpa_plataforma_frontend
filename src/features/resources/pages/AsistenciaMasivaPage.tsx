import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { PageState } from '@/shared/components/PageState';
import { userHasAnyPermission } from '@/shared/auth/session';
import { listAllLookupOptions } from '../services/lookupApi';
import type { SelectOption } from '../domain/CrudResource';
import {
  ESTADOS_ASISTENCIA,
  explicarErrorAsistencia,
  listarAsistenciaDeClase,
  listarClasesDeCurso,
  registrarAsistenciaMasiva,
  type AsistenciaFilaPayload,
} from '../services/asistenciaMasivaApi';
import styles from './AsistenciaMasivaPage.module.css';

const ESTUDIANTE_RELATION = {
  endpoint: '/api/personas/estudiante',
  valueField: 'id_persona',
  labelFields: ['codigo_estudiante', 'nombre_completo', 'tipo'],
};

/** Una línea de la planilla: un estudiante y su marca para la clase elegida. */
interface FilaAsistencia {
  clave: string;
  idEstudiante: string;
  estado: string;
  hora: string;
  observaciones: string;
  /** Id de la asistencia ya guardada, si la fila venía de la base. */
  idAsistencia: number | string | null;
}

function ahoraLocal(): string {
  const ahora = new Date();
  const pad = (valor: number) => String(valor).padStart(2, '0');
  return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}T${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
}

/**
 * Valor guardado -> valor que acepta datetime-local.
 *
 * `hora_marcacion` es `timestamp without time zone`: guarda una hora de reloj,
 * no un instante en la línea del tiempo. El sistema la serializa con sufijo `Z`,
 * así que pasarla por `new Date(...)` y leerla en hora local la corría cuatro
 * horas en Bolivia: se guardaba 08:05 y al volver a abrir la planilla decía
 * 04:05. Se toman los dígitos tal cual vienen.
 */
function aValorDeInput(valor: string | null): string {
  if (!valor) return '';
  const partes = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!partes) return String(valor).slice(0, 16);
  const [, anio, mes, dia, hora, minuto] = partes;
  return `${anio}-${mes}-${dia}T${hora}:${minuto}`;
}

let contadorFilas = 0;
function nuevaFila(idEstudiante = ''): FilaAsistencia {
  contadorFilas += 1;
  return {
    clave: `fila-${contadorFilas}`,
    idEstudiante,
    estado: 'Asistió',
    hora: ahoraLocal(),
    observaciones: '',
    idAsistencia: null,
  };
}

/**
 * Planilla de asistencia: una clase, todos sus estudiantes y sus horas en una
 * sola pantalla.
 *
 * Convive con el alta de a uno, que se sigue usando para corregir un registro
 * suelto. Esta pantalla existe porque marcar un curso completo de a uno obliga a
 * repetir clase, estado y hora por cada estudiante.
 *
 * La tabla tiene llave única por (clase, estudiante): al elegir la clase se
 * cargan las marcas existentes, que se actualizan en vez de duplicarse.
 */
export function AsistenciaMasivaPage() {
  const puedeRegistrar = userHasAnyPermission('create=SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE');

  const [clases, setClases] = useState<SelectOption[]>([]);
  const [estudiantes, setEstudiantes] = useState<SelectOption[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  const [idClase, setIdClase] = useState('');
  const [filas, setFilas] = useState<FilaAsistencia[]>([]);
  const [cargandoClase, setCargandoClase] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let montado = true;
    Promise.all([
      listarClasesDeCurso().catch(() => [] as SelectOption[]),
      listAllLookupOptions(ESTUDIANTE_RELATION, 300, 20000).catch(() => [] as SelectOption[]),
    ]).then(([opcionesClase, opcionesEstudiante]) => {
      if (!montado) return;
      setClases(opcionesClase);
      setEstudiantes(opcionesEstudiante);
      setCargandoCatalogos(false);
    });
    return () => {
      montado = false;
    };
  }, []);

  const etiquetaEstudiante = useMemo(() => {
    return new Map(estudiantes.map((opcion) => [String(opcion.value), opcion.label]));
  }, [estudiantes]);

  const cargarClase = useCallback(async (valorClase: string) => {
    setIdClase(valorClase);
    setMensaje(null);
    setError(null);
    setFilas([]);
    if (!valorClase) return;

    setCargandoClase(true);
    try {
      const registradas = await listarAsistenciaDeClase(valorClase);
      setFilas(
        registradas.map((registro) => ({
          ...nuevaFila(String(registro.id_estudiante)),
          estado: registro.estado_asistencia || 'Asistió',
          hora: aValorDeInput(registro.hora_marcacion),
          observaciones: registro.observaciones ?? '',
          idAsistencia: registro.id_asistencia,
        })),
      );
    } catch (fallo) {
      setError(explicarErrorAsistencia(fallo));
    } finally {
      setCargandoClase(false);
    }
  }, []);

  function actualizarFila(clave: string, cambios: Partial<FilaAsistencia>) {
    setFilas((actuales) => actuales.map((fila) => (fila.clave === clave ? { ...fila, ...cambios } : fila)));
  }

  const estudiantesDisponibles = useMemo(() => {
    const yaEnPlanilla = new Set(filas.map((fila) => fila.idEstudiante).filter(Boolean));
    return estudiantes.filter((opcion) => !yaEnPlanilla.has(String(opcion.value)));
  }, [estudiantes, filas]);

  function agregarTodos() {
    setFilas((actuales) => [...actuales, ...estudiantesDisponibles.map((opcion) => nuevaFila(String(opcion.value)))]);
  }

  async function guardar() {
    setError(null);
    setMensaje(null);

    const conEstudiante = filas.filter((fila) => fila.idEstudiante.trim() !== '');
    if (!idClase) {
      setError('Elige la clase antes de guardar.');
      return;
    }
    if (conEstudiante.length === 0) {
      setError('Agrega al menos un estudiante a la planilla.');
      return;
    }

    const repetidos = conEstudiante.length - new Set(conEstudiante.map((fila) => fila.idEstudiante)).size;
    if (repetidos > 0) {
      setError('Hay estudiantes repetidos en la planilla. Cada estudiante se marca una sola vez por clase.');
      return;
    }

    const aPayload = (fila: FilaAsistencia): AsistenciaFilaPayload => ({
      id_clase_curso: Number(idClase),
      id_estudiante: Number(fila.idEstudiante),
      estado_asistencia: fila.estado,
      hora_marcacion: fila.hora ? fila.hora : null,
      observaciones: fila.observaciones.trim() || null,
    });

    setGuardando(true);
    try {
      const nuevas = conEstudiante.filter((fila) => fila.idAsistencia === null).map(aPayload);
      const existentes = conEstudiante
        .filter((fila) => fila.idAsistencia !== null)
        .map((fila) => ({ ...aPayload(fila), id_asistencia: fila.idAsistencia as number | string }));

      const resultado = await registrarAsistenciaMasiva(nuevas, existentes);
      setMensaje(
        `Asistencia guardada: ${resultado.creadas} registro(s) nuevo(s) y ${resultado.actualizadas} actualizado(s).`,
      );
      await cargarClase(idClase);
    } catch (fallo) {
      setError(explicarErrorAsistencia(fallo));
    } finally {
      setGuardando(false);
    }
  }

  if (!puedeRegistrar) {
    return <PageState title="Sin permisos" message="No tienes permiso para registrar asistencia de clases." />;
  }

  if (cargandoCatalogos) {
    return <PageState title="Cargando" message="Preparando el listado de clases y estudiantes." />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>
          <strong>Planilla de asistencia</strong>
          <span>
            Marca a todos los estudiantes de una clase en una sola pantalla. Si un estudiante ya tenía asistencia en
            esta clase, aparece cargado y se actualiza en vez de duplicarse.
          </span>
        </div>

        <div className={styles.claseRow}>
          <label className={styles.field}>
            <span>Clase del curso *</span>
            <select value={idClase} onChange={(event) => void cargarClase(event.target.value)} disabled={guardando}>
              <option value="">Seleccionar clase</option>
              {clases.map((opcion) => (
                <option key={String(opcion.value)} value={String(opcion.value)}>{opcion.label}</option>
              ))}
            </select>
          </label>

          <div className={styles.toolbar}>
            <button type="button" onClick={() => setFilas((actuales) => [...actuales, nuevaFila()])} disabled={!idClase || guardando}>
              Agregar estudiante
            </button>
            <button type="button" onClick={agregarTodos} disabled={!idClase || guardando || estudiantesDisponibles.length === 0}>
              Agregar todos ({estudiantesDisponibles.length})
            </button>
          </div>
        </div>
      </div>

      {mensaje ? <p className={styles.message}>{mensaje}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {idClase ? (
        <div className={styles.panel}>
          <div className={styles.toolbar}>
            {ESTADOS_ASISTENCIA.map((estado) => (
              <button
                key={estado}
                type="button"
                disabled={filas.length === 0 || guardando}
                onClick={() => setFilas((actuales) => actuales.map((fila) => ({ ...fila, estado })))}
              >
                Marcar todos: {estado}
              </button>
            ))}
            <button
              type="button"
              disabled={filas.length === 0 || guardando}
              onClick={() => setFilas((actuales) => actuales.map((fila) => ({ ...fila, hora: ahoraLocal() })))}
            >
              Hora de ahora a todos
            </button>
          </div>

          {cargandoClase ? (
            <p className={styles.empty}>Cargando la asistencia ya registrada de esta clase...</p>
          ) : filas.length === 0 ? (
            <p className={styles.empty}>
              Todavía no hay estudiantes en la planilla. Usa &quot;Agregar estudiante&quot; o &quot;Agregar todos&quot;.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Estado</th>
                    <th>Hora de marcación</th>
                    <th>Observaciones</th>
                    <th>Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila) => (
                    <tr key={fila.clave} data-existing={fila.idAsistencia !== null}>
                      <td>
                        {fila.idAsistencia !== null ? (
                          <div className={styles.estudianteCell}>
                            <span className={styles.marca}>Ya registrado</span>
                            <strong>{etiquetaEstudiante.get(fila.idEstudiante) ?? `Estudiante ${fila.idEstudiante}`}</strong>
                          </div>
                        ) : (
                          <select
                            className={styles.rowControl}
                            value={fila.idEstudiante}
                            onChange={(event) => actualizarFila(fila.clave, { idEstudiante: event.target.value })}
                          >
                            <option value="">Seleccionar estudiante</option>
                            {estudiantes.map((opcion) => (
                              <option key={String(opcion.value)} value={String(opcion.value)}>{opcion.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        <select
                          className={styles.rowControl}
                          value={fila.estado}
                          onChange={(event) => actualizarFila(fila.clave, { estado: event.target.value })}
                        >
                          {ESTADOS_ASISTENCIA.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className={styles.horaCell}>
                          <input
                            className={styles.rowControl}
                            type="datetime-local"
                            value={fila.hora}
                            onChange={(event) => actualizarFila(fila.clave, { hora: event.target.value })}
                          />
                          <button type="button" onClick={() => actualizarFila(fila.clave, { hora: ahoraLocal() })}>
                            Ahora
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          className={styles.rowControl}
                          type="text"
                          value={fila.observaciones}
                          maxLength={240}
                          placeholder="Opcional"
                          onChange={(event) => actualizarFila(fila.clave, { observaciones: event.target.value })}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.removeButton}
                          aria-label="Quitar de la planilla"
                          onClick={() => setFilas((actuales) => actuales.filter((otra) => otra.clave !== fila.clave))}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={() => void cargarClase(idClase)} disabled={guardando}>
              Recargar clase
            </Button>
            <Button type="button" onClick={() => void guardar()} disabled={guardando || filas.length === 0}>
              {guardando ? 'Guardando...' : `Guardar asistencia (${filas.length})`}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
