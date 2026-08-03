/**
 * Diccionario central de tooltips de negocio para los campos de los recursos.
 *
 * Objetivo: dar al usuario aclaraciones en lenguaje de negocio sobre QUÉ significa cada
 * campo y CÓMO llenarlo, sin ensuciar los formularios. El texto se muestra como tooltip
 * (ícono de ayuda) junto a la etiqueta del campo.
 *
 * Precedencia (ver applyResourceFieldCatalog): un `helpText` declarado explícitamente en
 * la definición del recurso gana; si no hay, se usa el tooltip específico
 * `resourceKey.fieldName`; y como último recurso, un tooltip genérico por nombre de campo.
 *
 * Cobertura inicial (módulos insignia): Personas y Servicios educativos, más los campos
 * de auditoría/comunes que aparecen en todo el sistema. El resto de módulos se irá
 * poblando de forma incremental sin cambiar esta mecánica.
 */

/** Tooltips genéricos por nombre de campo, aplicables a cualquier recurso. */
const genericFieldTooltips: Record<string, string> = {
  estado_registro:
    'Estado lógico del registro. "Activo" participa en las operaciones; "Inactivo" lo conserva como historial sin eliminarlo.',
  fecha_registro: 'Fecha en que se creó el registro. La asigna el sistema automáticamente.',
  fecha_modificacion: 'Última fecha en que se editó el registro. La asigna el sistema.',
  version_registro: 'Contador interno de versiones para control de concurrencia. Lo gestiona el sistema.',
  id_usuario_creador: 'Usuario que creó el registro. Lo asigna el sistema según tu sesión.',
  observaciones: 'Notas libres para dar contexto. No afecta cálculos ni validaciones.',
  descripcion: 'Texto descriptivo para identificar y entender el registro con facilidad.',
  telefono: 'Número de contacto. Incluye el prefijo si aplica; se usa para comunicación operativa.',
  email: 'Correo electrónico de contacto. Debe tener un formato válido (nombre@dominio).',
  nombres: 'Nombre(s) de pila de la persona.',
  apellidos: 'Apellidos de la persona.',
  fecha_nacimiento: 'Fecha de nacimiento. Se usa para clasificaciones académicas y de edad.',

  // Campos comunes que aparecen en muchos recursos de todos los módulos.
  codigo: 'Código único para identificar el registro. Debe ser irrepetible dentro de su catálogo.',
  nombre: 'Nombre con el que se identifica el registro en listas y reportes.',
  direccion: 'Domicilio o ubicación de referencia.',
  categoria: 'Clasificación del registro. Agrupa elementos similares para filtrar y reportar.',
  moneda: 'Moneda en la que se expresa el monto (por ejemplo, BOB o USD).',
  monto: 'Importe en dinero. Usa punto decimal y no incluyas separadores de miles.',
  fecha_inicio: 'Fecha desde la que aplica o entra en vigencia el registro.',
  fecha_fin: 'Fecha hasta la que aplica. Déjala vacía si sigue vigente.',
  cantidad: 'Número de unidades. Debe ser un valor mayor o igual a cero.',
  estado: 'Estado operativo actual del registro dentro de su flujo.',
  prioridad: 'Orden de preferencia cuando hay varias opciones válidas. Menor número = mayor prioridad.',
};

/**
 * Tooltips específicos por recurso y campo (`resourceKey.fieldName`).
 * Los campos ya cubiertos con `helpText` inline en resourceDefinitions.ts no necesitan
 * repetirse aquí; este mapa complementa el resto.
 */
const resourceFieldTooltips: Record<string, Record<string, string>> = {
  // ---------------------------------------------------------------- Personas
  estudiante: {
    codigo_estudiante:
      'Lo genera el sistema al guardar, con formato EST-AAAA-NNNNN (por ejemplo EST-2026-00007). No se escribe a mano y no cambia al editar el registro.',
    id_unidad_educativa:
      'Colegio o universidad de procedencia. Debe existir previamente en "Unidad Educativa".',
    tipo: 'Define qué campos se piden después: COLEGIAL (nivel/curso/turno) o UNIVERSITARIO (carrera/año).',
    nivel_actual: 'Nivel escolar actual (por ejemplo, PRIMARIA o SECUNDARIA). Solo para COLEGIAL.',
    curso_actual: 'Curso o grado actual. Solo para COLEGIAL.',
    turno_actual: 'Turno de asistencia (por ejemplo, MAÑANA o TARDE). Solo para COLEGIAL.',
    carrera: 'Carrera universitaria que cursa. Solo para UNIVERSITARIO.',
    anio_ingreso: 'Año en que ingresó a la carrera. Solo para UNIVERSITARIO.',
  },
  tutor: {
    // nombres/apellidos/pago/nivel/especialidad ya tienen helpText inline en la definición.
    telefono: 'Teléfono de contacto del tutor para coordinar clases.',
    email: 'Correo del tutor. Se usa para notificaciones y coordinación.',
  },
  usuario: {
    // los campos ya tienen helpText inline en la definición.
  },
  padre: {
    es_embajador:
      'Marca si el padre/madre participa como embajador (recomienda la institución y accede a beneficios).',
  },
  proveedor: {
    nombre_proveedor: 'Razón social o nombre comercial del proveedor.',
    categoria: 'Rubro del proveedor (por ejemplo, papelería, tecnología, servicios).',
  },
  'unidad-educativa': {
    nombre: 'Nombre del colegio o universidad.',
    categoria: 'Clasificación de la unidad educativa (por ejemplo, privada, fiscal, de convenio).',
    latitud: 'Coordenada de ubicación (opcional). Útil para mapas y logística.',
    longitud: 'Coordenada de ubicación (opcional). Útil para mapas y logística.',
  },

  // ------------------------------------------------- Servicios educativos
  horarios: {
    hora_inicio_lunes: 'Hora de inicio del bloque del lunes. Deja vacío si no hay clase ese día.',
    hora_fin_lunes: 'Hora de fin del bloque del lunes. Debe ser posterior a la hora de inicio.',
    hora_inicio_martes: 'Hora de inicio del bloque del martes. Deja vacío si no hay clase.',
    hora_fin_martes: 'Hora de fin del bloque del martes.',
    hora_inicio_miercoles: 'Hora de inicio del bloque del miércoles.',
    hora_fin_miercoles: 'Hora de fin del bloque del miércoles.',
    hora_inicio_jueves: 'Hora de inicio del bloque del jueves.',
    hora_fin_jueves: 'Hora de fin del bloque del jueves.',
    hora_inicio_viernes: 'Hora de inicio del bloque del viernes.',
    hora_fin_viernes: 'Hora de fin del bloque del viernes.',
    hora_inicio_sabado: 'Hora de inicio del bloque del sábado.',
    hora_fin_sabado: 'Hora de fin del bloque del sábado.',
    repeticion:
      'Patrón de repetición del horario (por ejemplo, semanal). Define cómo se replican los bloques en el tiempo.',
  },
  'curso-version': {
    id_producto_educativo: 'Producto educativo (curso/servicio) del que esta es una versión. Regístralo primero en "Producto Educativo".',
    nombre_version: 'Nombre de esta edición del curso (por ejemplo, "Preuniversitario 2026 - Grupo A").',
    descripcion_version: 'Detalle de qué incluye esta versión: temario, duración, condiciones.',
    precio_version: 'Precio de venta de esta versión. Usa punto decimal, sin separadores de miles.',
    id_horario:
      'Horario semanal en el que se dicta esta versión del curso. Regístralo primero en "Horarios".',
  },
  'producto-educativo': {
    tipo_producto: 'Clasifica el producto (por ejemplo, curso, clase suelta, paquete). Determina cómo se vende y agenda.',
    precio_base: 'Precio de referencia del producto antes de descuentos o versiones específicas.',
    lim_sup_estudiantes: 'Cupo máximo de estudiantes admitidos. Se usa para controlar la ocupación.',
    lim_inf_estudiantes: 'Mínimo de estudiantes para que el curso se dicte (punto de equilibrio).',
    id_producto_tienda: 'Producto de tienda asociado, si el curso incluye materiales vendibles. Opcional.',
    link_bibliografia: 'Enlace a la bibliografía o material de apoyo del curso.',
    link_publicidad: 'Enlace al material de difusión o publicidad del curso.',
  },
  'paquetes-producto-educativo': {
    nombre_paquete: 'Nombre comercial del paquete de horas o servicios.',
    cantidad_horas_paquete: 'Total de horas que incluye el paquete.',
    precio_paquete: 'Precio del paquete completo. Suele ser menor que comprar las horas por separado.',
  },
  'materia-tree': {
    nombre: 'Nombre de la materia raíz (por ejemplo, Matemáticas, Física).',
    tema: 'Tema dentro de la materia. Deja vacío si registras solo la materia.',
    subtema: 'Subtema específico dentro del tema. Es el nivel más detallado del árbol.',
  },
  'clase-curso': {
    id_curso_version: 'Versión del curso a la que pertenece la clase. Créala primero en "Curso Version".',
    id_aula: 'Espacio/aula donde se dicta. Debe existir en Infraestructura → Espacio.',
    id_tutor: 'Tutor que dicta la clase. Debe existir en "Tutor".',
    fecha: 'Día en que se dicta la clase.',
    hora_inicio_real: 'Hora real en que empezó la clase (para control de asistencia y pago a tutores).',
    hora_fin_real: 'Hora real en que terminó la clase.',
    estado: 'Estado de la sesión (por ejemplo, programada, dictada, cancelada).',
    modalidad: 'Modalidad de la clase (presencial, virtual o híbrida).',
    detalle_temas_revisados: 'Resumen de los temas efectivamente cubiertos en la sesión.',
    motivo_cancelacion: 'Si la clase se canceló, indica el motivo. Deja vacío en caso contrario.',
  },
  'clase-por-hora': {
    id_aula: 'Espacio/aula donde se dicta. Debe existir en Infraestructura → Espacio.',
    id_tutor: 'Tutor que dicta la clase por hora. Debe existir en "Tutor".',
    id_estudiante: 'Estudiante que recibe la clase. Debe existir en "Estudiante".',
    id_materia_tree: 'Materia/tema de la clase, tomada del árbol de materias.',
    hora_llegada: 'Hora en que llegó el estudiante. Base para calcular las horas facturables.',
    hora_salida: 'Hora en que terminó la clase.',
    motivo: 'Motivo o tema de la clase individual.',
    modalidad: 'Modalidad de la clase (presencial, virtual o híbrida).',
    estado_operativo: 'Estado operativo de la sesión (en curso, finalizada, cancelada).',
  },
  'asistencia-clase-curso': {
    id_clase_curso: 'Clase (sesión) a la que corresponde esta marcación. Debe existir en "Clase Curso".',
    id_estudiante: 'Estudiante cuya asistencia se registra. Debe existir en "Estudiante".',
    estado_asistencia: 'Resultado de la asistencia (presente, ausente, tardanza, justificado).',
    hora_marcacion: 'Hora en que se registró la asistencia.',
  },

  // ---------------------------------------------------------- Administración
  departamento: {
    descripcion_funciones: 'Funciones o responsabilidades principales del área.',
    id_departamento_padre: 'Departamento del que depende, para armar la jerarquía. Opcional.',
    id_sucursal: 'Sucursal a la que pertenece el departamento. Debe existir en Infraestructura.',
    id_jefe_empleado: 'Empleado que jefatura el área. Debe existir en "Empleado". Opcional.',
    es_activo: 'Indica si el departamento está operativo actualmente.',
  },
  empleado: {
    id_persona: 'Persona que ocupa el puesto. Debe existir en Personas (regístrala allí primero).',
    fecha_ingreso: 'Fecha de alta laboral del empleado.',
    fecha_salida: 'Fecha de baja. Déjala vacía si el empleado sigue activo.',
    tipo_contrato: 'Tipo de contrato (por ejemplo, indefinido, plazo fijo, honorarios).',
    jornada: 'Jornada laboral (tiempo completo, medio tiempo, por horas).',
    email_corporativo: 'Correo institucional del empleado.',
    telefono_corporativo: 'Teléfono institucional del empleado.',
    id_sucursal: 'Sucursal donde trabaja. Debe existir en Infraestructura.',
  },
  'empleado-posicion-pago': {
    id_empleado: 'Empleado al que aplica este esquema de pago. Debe existir en "Empleado".',
    id_posicion: 'Cargo/posición asociada. Debe existir en "Posicion".',
    vigente_desde: 'Fecha desde la que rige este esquema de pago.',
    vigente_hasta: 'Fecha hasta la que rige. Déjala vacía si es el esquema vigente.',
    tipo_esquema_pago: 'Forma de pago (sueldo, comisión, mixto, por hora).',
    frecuencia_pago: 'Cada cuánto se paga (mensual, quincenal, etc.).',
    pago_por_hora: 'Tarifa por hora, si el esquema es por hora.',
    sueldo_mensual: 'Sueldo fijo mensual, si aplica.',
    porcentaje_comision: 'Porcentaje de comisión sobre lo comisionable, si aplica.',
    comision_fija: 'Monto fijo de comisión por operación, si aplica.',
    tipo_comisionable: 'Sobre qué se calcula la comisión (por ejemplo, ventas, cobranzas).',
    tipo_calculo_comisionable: 'Método de cálculo de la comisión (por monto, por unidad, etc.).',
  },
  'empleado-registro-pago': {
    fecha_pago: 'Fecha en que se realizó el pago al empleado.',
    haber_basico_pagado: 'Monto del haber básico pagado en este período.',
    comisiones_totales_pagadas: 'Total de comisiones pagadas en el período.',
    aguinaldos_totales_pagados: 'Total de aguinaldos pagados, si corresponde.',
    indemnizacion_total_pagada: 'Monto de indemnización pagada, si corresponde.',
    otros_cargos_pagados: 'Otros conceptos pagados no incluidos arriba.',
    descripcion_otros_cargos_pagados: 'Detalle de esos otros cargos.',
    notas_pago: 'Notas u observaciones sobre este pago.',
  },
  kpi: {
    unidad_medida: 'Unidad en la que se mide el indicador. Usa "%" para porcentajes, "BOB" para dinero, etc. Mantén la convención para no mezclar formatos.',
    frecuencia: 'Cada cuánto se mide el KPI (DIARIA, SEMANAL, MENSUAL, TRIMESTRAL).',
  },
  'objetivo-kpi': {
    id_kpi: 'Indicador al que se le fija la meta. Debe existir en "Kpi".',
    periodo: 'Período de la meta (por ejemplo, 2026-01 o 2026-T1).',
    valor_meta: 'Valor objetivo que se busca alcanzar.',
    valor_minimo: 'Umbral mínimo aceptable. Por debajo se considera incumplido.',
    valor_maximo: 'Techo esperado o máximo razonable del indicador.',
    responsable: 'Persona o área responsable de cumplir la meta.',
    cumplido: 'Marca si la meta del período se cumplió.',
  },
  posicion: {
    id_posicion_parent: 'Cargo superior del que depende, para armar el organigrama. Opcional.',
  },

  // ------------------------------------------------------------ Contabilidad
  'grupo-cuenta': {
    id_parent: 'Grupo superior en el árbol de cuentas. Déjalo vacío para un grupo de primer nivel.',
    tipo: 'Naturaleza contable del grupo (activo, pasivo, patrimonio, ingreso, egreso).',
    sub_tipo: 'Subclasificación del grupo dentro de su tipo.',
    sub_grupo: 'Nivel adicional de agrupación, si el plan lo requiere.',
    orden_reporte: 'Orden en que aparece en los estados financieros. Menor número = primero.',
  },
  cuenta: {
    codigo: 'Código contable de la cuenta según el plan (por ejemplo, 1.1.01).',
    nombre_cuenta: 'Nombre descriptivo de la cuenta.',
    id_grupo_cuenta: 'Grupo del plan al que pertenece. Debe existir en "Grupo Cuenta".',
  },
  'cuenta-asignacion': {
    entidad_tipo: 'Tipo de entidad a la que se asigna la cuenta (empleado, estudiante, tienda, etc.).',
    prioridad: 'Orden de preferencia cuando hay varias asignaciones aplicables. Menor número = mayor prioridad.',
    id_cuenta: 'Cuenta contable que se usará para esa entidad. Debe existir en "Cuenta".',
  },
  'concepto-costo': {
    tipo_concepto: 'Clasificación del concepto de costo (por ejemplo, fijo o variable).',
    unidad_medida: 'Unidad en la que se expresa el concepto (horas, unidades, %, etc.).',
  },
  'centro-costo': {
    id_cuenta_ingreso: 'Cuenta donde se registran los ingresos del centro. Debe existir en "Cuenta".',
    id_cuenta_costo: 'Cuenta donde se registran los costos del centro. Debe existir en "Cuenta".',
  },
  'centro-costo-mapa': {
    id_centro_costo: 'Centro de costo a mapear. Debe existir en "Centro Costo".',
    tipo: 'Tipo de vínculo del mapeo.',
    naturaleza: 'Naturaleza del costo (fijo o variable).',
    vigente_desde: 'Fecha desde la que rige el mapeo.',
    vigente_hasta: 'Fecha hasta la que rige. Vacío = vigente.',
  },
  transaccion: {
    fecha_transaccion: 'Fecha contable del asiento.',
    tipo_transaccion: 'Tipo de operación (venta, compra, pago, ajuste, etc.).',
    sub_tipo_transaccion: 'Subclasificación de la operación.',
    glosa: 'Descripción del asiento. Explica el motivo de la transacción.',
    id_centro_costo_mapa: 'Centro de costo al que se imputa. Debe existir en "Centro Costo Mapa".',
  },
  'transaccion-movimiento-cuenta': {
    id_transaccion: 'Asiento contable (cabecera) al que pertenece el movimiento.',
    id_cuenta: 'Cuenta afectada por este movimiento. Debe existir en "Cuenta".',
    debe: 'Importe al Debe. Usa Debe o Haber en un mismo renglón, no ambos.',
    haber: 'Importe al Haber. La suma total del Debe debe cuadrar con la del Haber.',
  },
  'archivos-transaccion': {
    id_transaccion: 'Transacción a la que se adjunta el respaldo. Debe existir en "Transaccion".',
    link_achivo: 'Enlace al archivo de respaldo (comprobante). Súbelo desde la Biblioteca de archivos.',
    link_archivo: 'Enlace al archivo de respaldo (comprobante). Súbelo desde la Biblioteca de archivos.',
  },
  'pago-tutor': {
    id_tutor: 'Tutor al que se le liquida el pago. Debe existir en "Tutor".',
    periodo_inicio: 'Inicio del período de clases que se liquida.',
    periodo_fin: 'Fin del período de clases que se liquida.',
    estado_pago: 'Estado de la liquidación (borrador, aprobado, pagado).',
    subtotal: 'Suma de las horas dictadas por la tarifa, antes de ajustes.',
    ajustes: 'Ajustes al alza o a la baja (bonos, descuentos).',
    total: 'Total a pagar = subtotal + ajustes.',
    referencia_pago: 'Referencia del pago realizado (número de transferencia, recibo).',
  },
  'pago-tutor-detalle': {
    id_pago_tutor: 'Liquidación a la que pertenece el detalle. Debe existir en "Pago Tutor".',
    id_clase: 'Clase dictada que se está pagando.',
    horas_pasadas: 'Horas efectivamente dictadas en esa clase.',
    tarifa_hora_aplicada: 'Tarifa por hora aplicada a esas horas.',
  },
  'venta-clase': {
    nombre_completo_estudiante: 'Estudiante que asistió a la clase vendida.',
    materia_producto: 'Materia o producto de la clase.',
    efectivo: 'Monto cobrado en efectivo.',
    qr: 'Monto cobrado por QR/transferencia.',
    cxc: 'Monto que queda como cuenta por cobrar (a crédito).',
    paquete: 'Paquete de horas contra el que se descuenta la clase, si aplica.',
    situacion_base: 'Situación de la venta que determina cómo se contabiliza.',
  },

  // ------------------------------------------------------------------- Deuda
  deuda: {
    id_proveedor: 'Acreedor de la deuda (si es una deuda con un proveedor). Opcional según el caso.',
    monto_inicial: 'Monto original de la deuda al momento de contraerse.',
    tasa_anual: 'Tasa de interés anual pactada (en porcentaje).',
    tipo_tasa: 'Tipo de tasa (fija o variable).',
    capitalizacion: 'Frecuencia con que se capitalizan los intereses.',
    plazo_meses: 'Duración de la deuda en meses.',
    seguro_desgravamen_fijo: 'Monto fijo del seguro de desgravamen, si aplica.',
    seguro_desgravamen_variable: 'Porcentaje variable del seguro de desgravamen, si aplica.',
    tipo_calculo_cuotas: 'Método de cálculo de las cuotas (por ejemplo, francés, alemán).',
    frecuencia_cuotas: 'Cada cuánto se paga una cuota (mensual, etc.).',
    tipo_pago: 'Modalidad de pago pactada.',
    tipo_primer_pago: 'Condición del primer pago (por ejemplo, vencido o anticipado).',
    anualidad_acordada: 'Cuota anualizada acordada, si se definió una.',
  },
  pago: {
    id_deuda: 'Deuda a la que se aplica el abono. Debe existir en "Deuda".',
    fecha_pago: 'Fecha en que se recibió el pago.',
    interes_pagado: 'Parte del pago que cubre intereses.',
    capital_amortizado: 'Parte del pago que reduce el capital adeudado.',
    seguro_desgravamen_pagado: 'Parte del pago correspondiente al seguro de desgravamen.',
    otros_recargos_pagados: 'Otros recargos cubiertos por el pago (mora, gastos).',
  },

  // --------------------------------------------------------- Infraestructura
  sucursal: {
    direccion_linea1: 'Dirección principal de la sucursal.',
    horario_texto: 'Horario de atención en texto libre (por ejemplo, "Lun-Vie 8:00-18:00").',
    largo_m: 'Largo del inmueble en metros. Opcional, para cálculos de espacio.',
    ancho_m: 'Ancho del inmueble en metros. Opcional.',
  },
  edificio: {
    id_sucursal: 'Sucursal a la que pertenece el edificio. Debe existir en "Sucursal".',
    direccion_linea1: 'Dirección del edificio.',
    pisos: 'Número de pisos del edificio.',
    largo_m: 'Largo del edificio en metros. Opcional.',
    ancho_m: 'Ancho del edificio en metros. Opcional.',
    id_administrador: 'Empleado responsable del edificio. Debe existir en "Empleado". Opcional.',
  },
  espacio: {
    id_edificio: 'Edificio donde está el espacio. Debe existir en "Edificio".',
    tipo: 'Tipo de espacio (aula, oficina, depósito, etc.).',
    categoria_sala: 'Categoría de la sala, si aplica.',
    tipo_aula: 'Tipo de aula (por ejemplo, teórica, laboratorio).',
    es_privada: 'Marca si el espacio es de uso privado/restringido.',
    piso: 'Piso en el que se ubica el espacio.',
    capacidad: 'Número máximo de personas que admite el espacio.',
    largo_m: 'Largo del espacio en metros. Opcional.',
    ancho_m: 'Ancho del espacio en metros. Opcional.',
  },
  tienda: {
    id_espacio: 'Espacio físico que ocupa la tienda. Debe existir en "Espacio".',
    horario_texto: 'Horario de atención de la tienda en texto libre.',
    id_responsable: 'Empleado responsable de la tienda. Debe existir en "Empleado".',
  },
  encargado: {
    id_sucursal: 'Sucursal a cargo. Debe existir en "Sucursal".',
    id_empleado: 'Empleado designado como encargado. Debe existir en "Empleado".',
  },

  // -------------------------------------------------------------- Inventario
  bien: {
    sku: 'Código único del bien (SKU). Sirve para identificarlo en compras y ventas.',
    tipo: 'Tipo de bien (por ejemplo, producto, insumo, activo).',
    subcategoria: 'Subcategoría dentro de la categoría, para clasificar con más detalle.',
    unidad_compra: 'Unidad en la que se compra el bien (caja, docena, unidad).',
    unidad_venta: 'Unidad en la que se vende el bien.',
    factor_conversion: 'Cuántas unidades de venta hay en una unidad de compra.',
    controla_inventario_loteable: 'Marca si el bien se controla por lotes (con vencimiento/origen).',
    controla_inventario_no_loteable: 'Marca si el bien se controla sin lotes (stock simple).',
    metodo_valuacion: 'Método para valorar existencias (por ejemplo, PEPS, promedio).',
    costo_referencia: 'Costo estimado de referencia del bien.',
  },
  'bien-lote': {
    id_bien: 'Bien al que pertenece el lote. Debe existir en "Bien".',
    lote_codigo: 'Código del lote (para trazabilidad).',
    fecha_compra: 'Fecha en que se adquirió el lote.',
    id_proveedor_compra: 'Proveedor al que se compró el lote. Debe existir en "Proveedor".',
    cantidad_compra: 'Cantidad de unidades ingresadas en el lote.',
    costo_compra_unitario: 'Costo por unidad al que se compró el lote.',
    precio_compra_unitario: 'Precio unitario de compra (con cargos, si aplica).',
    fecha_fabricacion: 'Fecha de fabricación del lote, si aplica.',
    fecha_vencimiento: 'Fecha de vencimiento del lote, si aplica.',
  },
  'bien-instancia': {
    id_bien: 'Bien del que esta es una instancia individual. Debe existir en "Bien".',
    descripcion_especificaciones: 'Especificaciones propias de esta instancia (modelo, características).',
    fecha_compra: 'Fecha de compra de la instancia.',
    id_proveedor_compra: 'Proveedor al que se compró. Debe existir en "Proveedor".',
    costo_compra: 'Costo de adquisición de la instancia.',
    precio_compra: 'Precio de compra (con cargos, si aplica).',
    serial_unico: 'Número de serie único que identifica la instancia.',
    fecha_fabricacion: 'Fecha de fabricación, si aplica.',
    fecha_vencimiento: 'Fecha de vencimiento, si aplica.',
  },
  'movimiento-detalle': {
    id_bien: 'Bien que se mueve. Debe existir en "Bien".',
    id_lote: 'Lote afectado, si el bien es loteable. Debe existir en "Bien Lote".',
    id_bien_instancia: 'Instancia afectada, si el bien se controla uno por uno.',
    cantidad: 'Cantidad que entra, sale o se traslada. Positiva.',
    id_espacio_entrada: 'Espacio destino (para entradas y traslados). Debe existir en "Espacio".',
    id_espacio_salida: 'Espacio origen (para salidas y traslados). Debe existir en "Espacio".',
  },

  // -------------------------------------------------------------- Societario
  titular: {
    id_persona: 'Persona que es el titular (socio/accionista). Debe existir en Personas.',
    es_beneficial_owner: 'Marca si es el beneficiario final real de los títulos.',
  },
  'clase-titulo': {
    tipo: 'Tipo de título/acción (por ejemplo, ordinaria o preferente).',
    sub_tipo: 'Subclasificación del título, si aplica.',
    valor_nominal: 'Valor nominal de cada título.',
    derechos_voto_por_titulo: 'Cantidad de votos que otorga cada título.',
    prioridad_dividendo_bp: 'Prioridad en el reparto de dividendos, en puntos básicos.',
    pref_liquidacion_x: 'Múltiplo de preferencia en la liquidación (por ejemplo, 1x).',
    es_convertible: 'Marca si el título puede convertirse en otra clase.',
    es_participante: 'Marca si participa además en dividendos comunes.',
  },
  'emision-titulo': {
    id_clase_titulo: 'Clase de título que se emite. Debe existir en "Clase Titulo".',
    ronda: 'Ronda de emisión (por ejemplo, Serie A).',
    instrumento: 'Instrumento emitido (acción, bono convertible, etc.).',
    serie: 'Serie de la emisión.',
    fecha_emision: 'Fecha en que se emiten los títulos.',
    cantidad_autorizada: 'Cantidad máxima autorizada a emitir.',
    cantidad_emitida: 'Cantidad efectivamente emitida.',
    precio_emision: 'Precio por título al momento de la emisión.',
  },
  tenencia: {
    id_emision: 'Emisión de la que provienen los títulos. Debe existir en "Emision Titulo".',
    id_titular: 'Titular que posee los títulos. Debe existir en "Titular".',
    cantidad: 'Cantidad de títulos en posesión.',
    fecha_adquisicion: 'Fecha en que el titular adquirió los títulos.',
    origen: 'Origen de la tenencia (emisión primaria, transferencia, etc.).',
    es_nominativa: 'Marca si la tenencia es nominativa (a nombre del titular).',
  },
  'transferencia-titulo': {
    id_emision: 'Emisión de los títulos transferidos. Debe existir en "Emision Titulo".',
    id_titular_origen: 'Titular que cede los títulos. Debe existir en "Titular".',
    id_titular_destino: 'Titular que recibe los títulos. Debe existir en "Titular".',
    cantidad: 'Cantidad de títulos transferidos.',
    precio_unitario: 'Precio por título en la transferencia.',
    fecha_transferencia: 'Fecha en que se realiza la transferencia.',
    motivo: 'Motivo de la transferencia (venta, donación, herencia).',
  },
  dividendo: {
    id_clase_titulo: 'Clase de título que recibe el dividendo. Debe existir en "Clase Titulo".',
    fecha_declaracion: 'Fecha en que se declara el dividendo.',
    fecha_pago: 'Fecha prevista de pago del dividendo.',
    monto_total: 'Monto total a repartir entre los titulares.',
  },
  'dividendo-pago': {
    id_dividendo: 'Dividendo declarado que se está pagando. Debe existir en "Dividendo".',
    id_titular: 'Titular que recibe el pago. Debe existir en "Titular".',
    monto_pagado: 'Monto pagado a ese titular según su tenencia.',
    fecha_pago_real: 'Fecha en que se pagó efectivamente.',
  },

  // --------------------------------------------------------------- Seguridad
  permiso: {
    codigo: 'Código único del permiso (por ejemplo, PERSONAS.ESTUDIANTE.CREATE). Es lo que se valida en el sistema.',
    modulo: 'Módulo al que pertenece el permiso, para organizarlos.',
  },
  rol: {
    codigo: 'Código único del rol (por ejemplo, CONTADOR).',
    nombre: 'Nombre legible del rol.',
  },
  'rol-permiso': {
    id_rol: 'Rol al que se le concede el permiso. Debe existir en "Rol".',
    id_permiso: 'Permiso que se incluye en el rol. Debe existir en "Permiso".',
  },
  'usuario-rol': {
    id_persona: 'Usuario (persona con cuenta) que recibe el rol. Debe existir en Personas → Usuario.',
    id_rol: 'Rol asignado al usuario. Debe existir en "Rol".',
  },
  'usuario-permiso': {
    id_persona: 'Usuario (persona con cuenta) al que se ajusta el permiso. Debe existir en Personas → Usuario.',
    id_permiso: 'Permiso que se otorga o restringe puntualmente. Debe existir en "Permiso".',
    permitido: 'Marca "permitido" para conceder o desmárcalo para restringir este permiso al usuario.',
  },
};

/**
 * Genera un tooltip razonable para campos de clave foránea (`id_...`) que no tienen uno
 * explícito. Son los más confusos para el usuario, así que aclaramos que referencian a
 * otro registro que debe existir antes. Devuelve undefined para el resto de campos.
 */
function generateForeignKeyTooltip(fieldName: string): string | undefined {
  if (!/^id_/.test(fieldName)) return undefined;
  const entidad = fieldName
    .replace(/^id_/, '')
    .replace(/_/g, ' ')
    .trim();
  if (!entidad) return undefined;
  return `Referencia a "${entidad}". Debe existir previamente en su propio módulo; selecciónalo o ingresa su identificador.`;
}

/**
 * Devuelve el tooltip de negocio para un campo, o undefined si no hay uno definido.
 * Precedencia: específico del recurso → genérico por nombre → generado para claves foráneas.
 */
export function getFieldTooltip(resourceKey: string, fieldName: string): string | undefined {
  return (
    resourceFieldTooltips[resourceKey]?.[fieldName] ??
    genericFieldTooltips[fieldName] ??
    generateForeignKeyTooltip(fieldName)
  );
}
