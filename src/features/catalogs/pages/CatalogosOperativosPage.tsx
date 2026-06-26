import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { PageState } from '@/shared/components/PageState';
import {
  REQUIRED_ACCOUNT_CONFIGS,
  listConfiguracionCuentaOperativa,
  listCuentaOptions,
  listMateriaTreeCatalog,
  listProductosEducativosCatalog,
  listUnidadesEducativasCatalog,
  upsertConfiguracionCuentaOperativa,
  type ConfiguracionCuentaOperativa,
  type CuentaOption,
  type MateriaTreeCatalogItem,
  type ProductoEducativoCatalogItem,
  type UnidadEducativaCatalogItem,
} from '../services/catalogosOperativosApi';
import styles from './CatalogosOperativosPage.module.css';

type TabKey = 'cuentas' | 'materias' | 'productos' | 'unidades' | 'flujo';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'cuentas', label: 'Cuentas operativas' },
  { key: 'materias', label: 'Materias, temas y subtemas' },
  { key: 'productos', label: 'Productos educativos' },
  { key: 'unidades', label: 'Unidades educativas' },
  { key: 'flujo', label: 'Uso en parte de clases' },
];

function asText(value: unknown): string {
  return value === undefined || value === null || String(value).trim() === '' ? '—' : String(value);
}

function money(value: unknown): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '—';
}

function keyByCodigo(configs: ConfiguracionCuentaOperativa[]) {
  return new Map(configs.map((config) => [config.codigo, config]));
}

function buildAccountRows(configs: ConfiguracionCuentaOperativa[]): ConfiguracionCuentaOperativa[] {
  const map = keyByCodigo(configs);
  return REQUIRED_ACCOUNT_CONFIGS.map((base) => ({
    ...base,
    ...(map.get(base.codigo) ?? {}),
  }));
}

function groupMaterias(items: MateriaTreeCatalogItem[]) {
  const map = new Map<string, { materia: string; temas: Map<string, string[]> }>();
  items.forEach((item) => {
    const materia = item.nombre || 'Sin materia';
    const tema = item.tema || 'Sin tema';
    const subtema = item.subtema || 'Sin subtema';
    if (!map.has(materia)) map.set(materia, { materia, temas: new Map() });
    const group = map.get(materia)!;
    const current = group.temas.get(tema) ?? [];
    if (!current.includes(subtema)) current.push(subtema);
    group.temas.set(tema, current.sort((a, b) => a.localeCompare(b, 'es')));
  });
  return Array.from(map.values()).sort((a, b) => a.materia.localeCompare(b.materia, 'es'));
}

function filterText(source: string, query: string): boolean {
  return source.toLowerCase().includes(query.toLowerCase().trim());
}

export function CatalogosOperativosPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('cuentas');
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [savingCode, setSavingCode] = useState('');
  const [cuentas, setCuentas] = useState<CuentaOption[]>([]);
  const [configRows, setConfigRows] = useState<ConfiguracionCuentaOperativa[]>([]);
  const [materias, setMaterias] = useState<MateriaTreeCatalogItem[]>([]);
  const [productos, setProductos] = useState<ProductoEducativoCatalogItem[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativaCatalogItem[]>([]);
  const [accountSearch, setAccountSearch] = useState<Record<string, string>>({});
  const [catalogSearch, setCatalogSearch] = useState('');

  async function loadData() {
    setState('loading');
    setError('');
    setSaveMessage('');
    try {
      const [accountOptions, configs, materiaRows, productoRows, unidadRows] = await Promise.all([
        listCuentaOptions(),
        listConfiguracionCuentaOperativa(),
        listMateriaTreeCatalog(),
        listProductosEducativosCatalog(),
        listUnidadesEducativasCatalog(),
      ]);
      setCuentas(accountOptions);
      setConfigRows(buildAccountRows(configs));
      setMaterias(materiaRows);
      setProductos(productoRows);
      setUnidades(unidadRows);
      setState('ready');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los catálogos operativos.');
      setState('error');
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const materiaGroups = useMemo(() => groupMaterias(materias), [materias]);
  const configuredAccounts = configRows.filter((row) => row.id_cuenta).length;
  const filteredProductos = productos.filter((item) => filterText(`${item.nombre} ${item.tipo_producto ?? ''}`, catalogSearch));
  const filteredUnidades = unidades.filter((item) => filterText(`${item.nombre} ${item.categoria ?? ''}`, catalogSearch));
  const filteredMateriaGroups = materiaGroups.filter((group) => filterText(group.materia, catalogSearch) || Array.from(group.temas.keys()).some((tema) => filterText(tema, catalogSearch)));

  function updateConfig(codigo: string, idCuenta: string) {
    setConfigRows((rows) => rows.map((row) => row.codigo === codigo ? { ...row, id_cuenta: idCuenta } : row));
  }

  async function saveConfig(row: ConfiguracionCuentaOperativa) {
    if (!row.id_cuenta) {
      setSaveMessage(`Selecciona una cuenta contable para ${row.codigo}.`);
      return;
    }

    setSavingCode(row.codigo);
    setSaveMessage('');
    try {
      await upsertConfiguracionCuentaOperativa(row);
      setSaveMessage(`Configuración guardada: ${row.codigo}.`);
      await loadData();
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : 'No se pudo guardar la configuración.');
    } finally {
      setSavingCode('');
    }
  }

  function accountOptionsFor(code: string): CuentaOption[] {
    const query = (accountSearch[code] ?? '').trim();
    if (!query) return cuentas.slice(0, 120);
    return cuentas.filter((account) => filterText(`${account.codigo} ${account.nombre} ${account.label}`, query)).slice(0, 120);
  }

  if (state === 'loading' || state === 'idle') {
    return <PageState title="Cargando catálogos" message="Consultando cuentas operativas y catálogos académicos desde el backend." />;
  }

  if (state === 'error') {
    return <PageState title="No se pudieron cargar los catálogos" message={error} actionLabel="Reintentar" onAction={() => void loadData()} />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <span>Configuración previa · Venta clase</span>
          <h2>CATÁLOGOS Y CUENTAS OPERATIVAS</h2>
          <p>
            Diseña y valida los catálogos que alimentan el parte de clases pasadas. El frontend solo captura datos; el backend resuelve la contabilidad, las ventas, los detalles y la trazabilidad.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Button type="button" variant="secondary" onClick={() => void loadData()}>Actualizar catálogos</Button>
          <Link className={styles.primaryLink} to="/modulos/contabilidad/venta-clase">Ir a parte de clases</Link>
        </div>
      </div>

      <div className={styles.metrics}>
        <div><strong>{configuredAccounts}/4</strong><span>Cuentas operativas configuradas</span></div>
        <div><strong>{materias.length}</strong><span>Registros materia-tree</span></div>
        <div><strong>{productos.length}</strong><span>Productos educativos</span></div>
        <div><strong>{unidades.length}</strong><span>Unidades educativas</span></div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Catálogos operativos">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? styles.activeTab : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {saveMessage ? <div className={styles.message}>{saveMessage}</div> : null}

      {activeTab === 'cuentas' ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Configuración de cuentas operativas</h3>
              <p>Estas cuentas se seleccionan desde base de datos. No se configuran desde variables de entorno.</p>
            </div>
            <Link to="/modulos/contabilidad/cuenta">Administrar plan de cuentas</Link>
          </div>

          <div className={styles.accountGrid}>
            {configRows.map((row) => (
              <article key={row.codigo} className={styles.accountCard}>
                <div>
                  <span className={styles.code}>{row.codigo}</span>
                  <h4>{row.nombre}</h4>
                  <p>{row.descripcion}</p>
                </div>
                <label>
                  Buscar cuenta
                  <input
                    value={accountSearch[row.codigo] ?? ''}
                    onChange={(event) => setAccountSearch((current) => ({ ...current, [row.codigo]: event.target.value }))}
                    placeholder="Código o nombre de cuenta"
                  />
                </label>
                <label>
                  Cuenta contable
                  <select value={String(row.id_cuenta ?? '')} onChange={(event) => updateConfig(row.codigo, event.target.value)}>
                    <option value="">Selecciona una cuenta</option>
                    {accountOptionsFor(row.codigo).map((account) => (
                      <option key={account.id} value={account.id}>{account.label}</option>
                    ))}
                  </select>
                </label>
                <Button type="button" disabled={savingCode === row.codigo} onClick={() => void saveConfig(row)}>
                  {savingCode === row.codigo ? 'Guardando...' : 'Guardar configuración'}
                </Button>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab !== 'cuentas' && activeTab !== 'flujo' ? (
        <div className={styles.searchPanel}>
          <label>
            Buscar en el catálogo
            <input value={catalogSearch} onChange={(event) => setCatalogSearch(event.target.value)} placeholder="Escribe nombre, categoría, tipo o tema" />
          </label>
        </div>
      ) : null}

      {activeTab === 'materias' ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Materias, temas y subtemas</h3>
              <p>Este catálogo alimenta los selects dependientes de materia, tema y subtema en parte de clases pasadas.</p>
            </div>
            <Link to="/modulos/servicios_educativos/materia-tree">Administrar materia tree</Link>
          </div>

          <div className={styles.materiaGrid}>
            {filteredMateriaGroups.map((group) => (
              <article key={group.materia} className={styles.catalogCard}>
                <h4>{group.materia}</h4>
                {Array.from(group.temas.entries()).map(([tema, subtemas]) => (
                  <div key={tema} className={styles.topicBlock}>
                    <strong>{tema}</strong>
                    <div className={styles.chips}>{subtemas.map((subtema) => <span key={subtema}>{subtema}</span>)}</div>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === 'productos' ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Productos educativos</h3>
              <p>Se usan para el detalle de venta que genera el backend: clases, cursos, paquetes y productos académicos.</p>
            </div>
            <Link to="/modulos/servicios_educativos/producto-educativo">Administrar productos educativos</Link>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Producto</th><th>Tipo</th><th>Precio base</th><th>Estado</th></tr></thead>
              <tbody>
                {filteredProductos.slice(0, 120).map((item) => (
                  <tr key={String(item.id_producto_educativo ?? item.nombre)}>
                    <td>{item.nombre}</td>
                    <td>{asText(item.tipo_producto)}</td>
                    <td>{money(item.precio_base)}</td>
                    <td>{asText(item.estado_registro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {activeTab === 'unidades' ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Unidades educativas</h3>
              <p>Se usan principalmente al registrar estudiantes, para mantener ordenado el contexto académico.</p>
            </div>
            <Link to="/modulos/personas/unidad-educativa">Administrar unidades educativas</Link>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Unidad educativa</th><th>Categoría</th><th>Latitud</th><th>Longitud</th><th>Estado</th></tr></thead>
              <tbody>
                {filteredUnidades.slice(0, 120).map((item) => (
                  <tr key={String(item.id_unidad_educativa ?? item.nombre)}>
                    <td>{item.nombre}</td>
                    <td>{asText(item.categoria)}</td>
                    <td>{asText(item.latitud)}</td>
                    <td>{asText(item.longitud)}</td>
                    <td>{asText(item.estado_registro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {activeTab === 'flujo' ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Orden recomendado antes de registrar clases pasadas</h3>
              <p>Este diseño evita datos sueltos y permite que el backend genere la transacción completa sin que el frontend arme contabilidad manual.</p>
            </div>
          </div>
          <div className={styles.flowGrid}>
            <article><strong>1</strong><h4>Plan de cuentas</h4><p>Crea grupos y cuentas contables. Luego selecciona las cuentas de efectivo, QR, IVA e ingreso por clases.</p></article>
            <article><strong>2</strong><h4>Catálogos académicos</h4><p>Registra materia, tema y subtema en materia-tree. Esto alimenta los selects del parte.</p></article>
            <article><strong>3</strong><h4>Productos educativos</h4><p>Crea Clases de Matemáticas, Física, Química, cursos y paquetes. El backend los usa para el detalle de venta.</p></article>
            <article><strong>4</strong><h4>Personas</h4><p>Registra estudiantes y tutores. El backend asocia cuentas CxC, paquete diferido y CxP tutor cuando corresponde.</p></article>
            <article><strong>5</strong><h4>Parte de clases</h4><p>Captura fecha, horas, estudiante, tutor, aula, materia, tema, subtema, producto y montos.</p></article>
            <article><strong>6</strong><h4>Backend contable</h4><p>El backend genera clase, venta, detalle, transacción, movimientos y guarda trazabilidad.</p></article>
          </div>
        </div>
      ) : null}
    </section>
  );
}
