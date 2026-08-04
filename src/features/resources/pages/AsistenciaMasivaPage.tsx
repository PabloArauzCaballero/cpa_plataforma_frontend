import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  listarInscritosDeCurso,
  registrarAsistenciaMasiva,
  type AsistenciaFilaPayload,
  type ClaseDelCurso,
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
  /** Está matriculado en el curso de esta clase. */
  inscrito: boolean;
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
 * horas en Bolivia. Se toman los dígitos tal cual vienen.
 */
function aValorDeInput(valor: string | null): string {
  if (!valor) return '';
  const partes = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!partes) return String(valor).slice(0, 16);
  const [, anio, mes, dia, hora, minuto] = partes;
  return `${anio}-${mes}-${dia}T${hora}:${minuto}`;
}

let contadorFilas = 0;
function nuevaFila(idEstudiante = '', inscrito = false): FilaAsistencia {
  contadorFilas += 1;
  return {
    clave: `fila-${contadorFilas}`,
    idEstudiante,
    estado: 'Asistió',
    hora: '',
    observaciones: '',
    idAsistencia: null,
    inscrito,
  };
}

/**
 * Planilla de asistencia: una clase, los estudiantes matriculados en su curso y
 * sus horas en una sola pantalla.
 *
 * Convive con el alta de a uno, que se sigue usando para corregir un registro
 * suelto. Esta pantalla existe porque marcar un curso completo de a uno obliga a
 * repetir clase, estado y hora por cada estudiante.
 *
 * La lista sale de las matrículas del curso, no del padrón completo del centro.
 * Quien tiene asistencia registrada pero ya no está matriculado sigue apareciendo,
 * marcado como tal, para poder corregirlo en vez de perderlo de vista.
 */
export function AsistenciaMasivaPage() {
  const puedeRegistrar = userHasAnyPermission('create=SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE');

  const [clases, setClases] = useState<ClaseDelCurso[]>([]);
  const [estudiantes, setEstudiantes] = useState<SelectOption[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  const [idClase, setIdClase] = useState('');
  const [filas, setFilas] = useState<FilaAsistencia[]>([]);
  const [totalInscritos, setTotalInscritos] = useState(0);
  const [cargandoClase, setCargandoClase] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let montado = true;
    Promise.all([
      listarClasesDeCurso().catch(() => [] as ClaseDelCurso[]),
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

  const claseElegida = useMemo(() => clases.find((clase) => clase.value === idClase) ?? null, [clases, idClase]);

  const cargarClase = useCallback(
    async (valorClase: string) => {
      setIdClase(valorClase);
      setMensaje(null);
      setError(null);
      setFilas([]);
      setTotalInscritos(0);
      if (!valorClase) return;

      const clase = clases.find((candidata) => candidata.value === valorClase) ?? null;
      setCargandoClase(true);
      try {
        const [registradas, inscritos] = await Promise.all([
          listarAsistenciaDeClase(valorClase),
          clase?.idCursoVersion ? listarInscritosDeCurso(clase.idCursoVersion) : Promise.resolve<string[]>([]),
        ]);

        const porEstudiante = new Map(registradas.map((registro) => [String(registro.id_estudiante), registro]));
        setTotalInscritos(inscritos.length);

        // Primero los matriculados, en el orden en que están inscritos.
        const filasInscritos = inscritos.map((idEstudiante) => {
          const registro = porEstudiante.get(idEstudiante);
          porEstudiante.delete(idEstudiante);
          return {
            ...nuevaFila(idEstudiante, true),
            estado: registro?.estado_asistencia || 'Asistió',
            hora: aValorDeInput(registro?.hora_marcacion ?? null),
            observaciones: registro?.observaciones ?? '',
            idAsistencia: registro?.id_asistencia ?? null,
          };
        });

        // Y después lo que quedó: asistencias de quien ya no figura matriculado.
        const filasSinMatricula = Array.from(porEstudiante.values()).map((registro) => ({
          ...nuevaFila(String(registro.id_estudiante), false),
          estado: registro.estado_asistencia || 'Asistió',
          hora: aValorDeInput(registro.hora_marcacion),
          observaciones: registro.observaciones ?? '',
          idAsistencia: registro.id_asistencia,
        }));

        setFilas([...filasInscritos, ...filasSinMatricula]);
      } catch (fallo) {
        setError(explicarErrorAsistencia(fallo));
      } finally {
        setCargandoClase(false);
      }
    },
    [clases],
  );

  function actualizarFila(clave: string, cambios: Partial<FilaAsistencia>) {
    setFilas((actuales) => actuales.map((fila) => (fila.clave === clave ? { ...fila, ...cambios } : fila)));
  }

  const estudiantesDisponibles = useMemo(() => {
    const yaEnPlanilla = new Set(filas.map((fila) => fila.idEstudiante).filter(Boolean));
    return estudiantes.filter((opcion) => !yaEnPlanilla.has(String(opcion.value)));
  }, [estudiantes, filas]);

  const resumen = useMemo(() => {
    const conEstudiante = filas.filter((fila) => fila.idEstudiante.trim() !== '');
    return {
      enPlanilla: conEstudiante.length,
      guardados: conEstudiante.filter((fila) => fila.idAsistencia !== null).length,
      sinMatricula: conEstudiante.filter((fila) => !fila.inscrito).length,
    };
  }, [filas]);

  async function guardar() {
    setError(null);
    setMensaje(null);

    const conEstudiante = filas.filter((fila) => fila.idEstudiante.trim() !== '');
    if (!idClase) {
      setError('Elige la clase antes de guardar.');
      return;
    }
    if (conEstudiante.length === 0) {
      setError('No hay estudiantes en la planilla.');
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
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Servicios educativos</p>
          <h1>Planilla de asistencia</h1>
          <p className={styles.lead}>
            Elige una clase y marca de una vez a los estudiantes matriculados en su curso. Lo que ya estaba registrado
            se carga y se actualiza, no se duplica.
          </p>
        </div>

        <label className={styles.claseField}>
          <span>Clase del curso</span>
          <select value={idClase} onChange={(event) => void cargarClase(event.target.value)} disabled={guardando}>
            <option value="">Seleccionar clase</option>
            {clases.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
          {clases.length === 0 ? (
            <small className={styles.hint}>
              No hay clases registradas todavía. Créalas en <Link to="/modulos/servicios_educativos/clase-curso">Clase Curso</Link>.
            </small>
          ) : null}
        </label>
      </header>

      {mensaje ? <p className={styles.message}>{mensaje}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {!idClase ? null : cargandoClase ? (
        <div className={styles.panel}>
          <p className={styles.empty}>Cargando matrícula y asistencia de esta clase...</p>
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.resumen}>
            <div className={styles.stat}>
              <strong>{totalInscritos}</strong>
              <span>matriculados</span>
            </div>
            <div className={styles.stat}>
              <strong>{resumen.guardados}</strong>
              <span>ya registrados</span>
            </div>
            <div className={styles.stat} data-tone={resumen.enPlanilla - resumen.guardados > 0 ? 'pendiente' : 'ok'}>
              <strong>{resumen.enPlanilla - resumen.guardados}</strong>
              <span>por guardar</span>
            </div>
            {resumen.sinMatricula > 0 ? (
              <div className={styles.stat} data-tone="aviso">
                <strong>{resumen.sinMatricula}</strong>
                <span>sin matrícula</span>
              </div>
            ) : null}
          </div>

          {filas.length === 0 ? (
            <div className={styles.empty}>
              <strong>Este curso no tiene estudiantes matriculados.</strong>
              <p>
                La planilla se arma con las matrículas del curso. Inscribe estudiantes en{' '}
                <Link to="/modulos/servicios_educativos/inscripcion-curso">Inscripción a curso</Link> y vuelve aquí, o
                agrega a alguien puntualmente con el botón de abajo.
              </p>
              <Button type="button" variant="ghost" onClick={() => setFilas([nuevaFila()])}>
                Agregar un estudiante igualmente
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.acciones}>
                <div className={styles.grupoAcciones}>
                  <span className={styles.grupoTitulo}>Marcar a todos</span>
                  <div className={styles.chips}>
                    {ESTADOS_ASISTENCIA.map((estado) => (
                      <button
                        key={estado}
                        type="button"
                        className={styles.chip}
                        data-estado={estado}
                        disabled={guardando}
                        onClick={() => setFilas((actuales) => actuales.map((fila) => ({ ...fila, estado })))}
                      >
                        {estado}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={styles.chip}
                      disabled={guardando}
                      onClick={() => setFilas((actuales) => actuales.map((fila) => ({ ...fila, hora: ahoraLocal() })))}
                    >
                      Hora de ahora
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.chip}
                  disabled={guardando || estudiantesDisponibles.length === 0}
                  onClick={() => setFilas((actuales) => [...actuales, nuevaFila()])}
                >
                  Agregar estudiante fuera de matrícula
                </button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Estado</th>
                      <th>Hora de marcación</th>
                      <th>Observaciones</th>
                      <th aria-label="Quitar de la planilla" />
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((fila) => (
                      <tr key={fila.clave} data-guardado={fila.idAsistencia !== null} data-sin-matricula={!fila.inscrito}>
                        <td>
                          {fila.idEstudiante && fila.inscrito ? (
                            <div className={styles.estudianteCell}>
                              <strong>{etiquetaEstudiante.get(fila.idEstudiante) ?? `Estudiante ${fila.idEstudiante}`}</strong>
                              {fila.idAsistencia !== null ? <span className={styles.marcaGuardado}>Ya registrado</span> : null}
                            </div>
                          ) : fila.idEstudiante ? (
                            <div className={styles.estudianteCell}>
                              <strong>{etiquetaEstudiante.get(fila.idEstudiante) ?? `Estudiante ${fila.idEstudiante}`}</strong>
                              <span className={styles.marcaAviso}>Sin matrícula en este curso</span>
                            </div>
                          ) : (
                            <select
                              className={styles.rowControl}
                              value={fila.idEstudiante}
                              onChange={(event) => actualizarFila(fila.clave, { idEstudiante: event.target.value })}
                            >
                              <option value="">Seleccionar estudiante</option>
                              {estudiantesDisponibles.map((opcion) => (
                                <option key={String(opcion.value)} value={String(opcion.value)}>{opcion.label}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td>
                          <select
                            className={styles.estadoControl}
                            data-estado={fila.estado}
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
                            <button
                              type="button"
                              className={styles.horaAhora}
                              title="Poner la hora de este momento"
                              onClick={() => actualizarFila(fila.clave, { hora: ahoraLocal() })}
                            >
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
                            className={styles.quitar}
                            aria-label="Quitar de la planilla"
                            title="Quitar de la planilla"
                            onClick={() => setFilas((actuales) => actuales.filter((otra) => otra.clave !== fila.clave))}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={() => void cargarClase(idClase)} disabled={guardando}>
                  Recargar clase
                </Button>
                <Button type="button" onClick={() => void guardar()} disabled={guardando || resumen.enPlanilla === 0}>
                  {guardando ? 'Guardando...' : `Guardar asistencia (${resumen.enPlanilla})`}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
