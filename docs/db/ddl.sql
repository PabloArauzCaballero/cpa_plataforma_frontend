--
-- PostgreSQL database dump
--

-- Dumped from database version 17.10 (21f7c76)
-- Dumped by pg_dump version 17.0

-- Started on 2026-06-18 21:50:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE neondb;
--
-- TOC entry 4933 (class 1262 OID 16391)
-- Name: neondb; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = builtin LOCALE = 'C.UTF-8' BUILTIN_LOCALE = 'C.UTF-8';


\connect neondb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 10 (class 2615 OID 90112)
-- Name: administracion; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA administracion;


--
-- TOC entry 7 (class 2615 OID 16484)
-- Name: contabilidad; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA contabilidad;


--
-- TOC entry 12 (class 2615 OID 204800)
-- Name: deuda; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA deuda;


--
-- TOC entry 11 (class 2615 OID 114688)
-- Name: infraestructura; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA infraestructura;


--
-- TOC entry 9 (class 2615 OID 65536)
-- Name: inventario; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA inventario;


--
-- TOC entry 8 (class 2615 OID 40960)
-- Name: persona; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA persona;


--
-- TOC entry 15 (class 2615 OID 409600)
-- Name: seguridad; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA seguridad;


--
-- TOC entry 13 (class 2615 OID 204878)
-- Name: servicios_educativos; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA servicios_educativos;


--
-- TOC entry 14 (class 2615 OID 311296)
-- Name: societario; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA societario;


--
-- TOC entry 2 (class 3079 OID 352257)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 1340 (class 1247 OID 90174)
-- Name: direccion_kpi; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.direccion_kpi AS ENUM (
    'ASC',
    'DESC'
);


--
-- TOC entry 1337 (class 1247 OID 90164)
-- Name: estado_okr; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.estado_okr AS ENUM (
    'PLANIFICADO',
    'EN_PROGRESO',
    'COMPLETADO',
    'CANCELADO'
);


--
-- TOC entry 1334 (class 1247 OID 90154)
-- Name: frecuencia_kpi; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.frecuencia_kpi AS ENUM (
    'DIARIA',
    'SEMANAL',
    'MENSUAL',
    'TRIMESTRAL'
);


--
-- TOC entry 1325 (class 1247 OID 90128)
-- Name: frecuencia_pago; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.frecuencia_pago AS ENUM (
    'MENSUAL',
    'QUINCENAL',
    'SEMANAL'
);


--
-- TOC entry 1322 (class 1247 OID 90122)
-- Name: jornada_laboral; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.jornada_laboral AS ENUM (
    'FULL_TIME',
    'PART_TIME'
);


--
-- TOC entry 1319 (class 1247 OID 90114)
-- Name: tipo_contrato; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.tipo_contrato AS ENUM (
    'INDEFINIDO',
    'PLAZO_FIJO',
    'HONORARIOS'
);


--
-- TOC entry 1328 (class 1247 OID 90136)
-- Name: tipo_esquema_pago; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.tipo_esquema_pago AS ENUM (
    'SUELDO',
    'POR_HORA',
    'COMISION',
    'MIXTO'
);


--
-- TOC entry 1331 (class 1247 OID 90146)
-- Name: tipo_kpi; Type: TYPE; Schema: administracion; Owner: -
--

CREATE TYPE administracion.tipo_kpi AS ENUM (
    'INPUT',
    'OUTPUT',
    'OUTCOME'
);


--
-- TOC entry 1436 (class 1247 OID 294918)
-- Name: naturaleza_costo; Type: TYPE; Schema: contabilidad; Owner: -
--

CREATE TYPE contabilidad.naturaleza_costo AS ENUM (
    'FIJO',
    'VARIABLE'
);


--
-- TOC entry 1433 (class 1247 OID 294913)
-- Name: tipo_costo; Type: TYPE; Schema: contabilidad; Owner: -
--

CREATE TYPE contabilidad.tipo_costo AS ENUM (
    'DIRECTO',
    'INDIRECTO'
);


--
-- TOC entry 1283 (class 1247 OID 24577)
-- Name: tipo_transaccion; Type: TYPE; Schema: contabilidad; Owner: -
--

CREATE TYPE contabilidad.tipo_transaccion AS ENUM (
    'GENERAL',
    'COSTO',
    'VENTA',
    'BIEN',
    'DEUDA'
);


--
-- TOC entry 1355 (class 1247 OID 114696)
-- Name: categoria_sala; Type: TYPE; Schema: infraestructura; Owner: -
--

CREATE TYPE infraestructura.categoria_sala AS ENUM (
    'OFICINA',
    'CONFERENCIA',
    'REUNION',
    'ESPERA',
    'TIENDA',
    'OTRA'
);


--
-- TOC entry 1379 (class 1247 OID 155649)
-- Name: tipo_aula; Type: TYPE; Schema: infraestructura; Owner: -
--

CREATE TYPE infraestructura.tipo_aula AS ENUM (
    'TEORIA',
    'LABORATORIO',
    'COMPUTACION',
    'MULTIUSO'
);


--
-- TOC entry 1352 (class 1247 OID 114690)
-- Name: tipo_espacio; Type: TYPE; Schema: infraestructura; Owner: -
--

CREATE TYPE infraestructura.tipo_espacio AS ENUM (
    'AULA',
    'SALA'
);


--
-- TOC entry 1316 (class 1247 OID 65566)
-- Name: metodo_depreciacion; Type: TYPE; Schema: inventario; Owner: -
--

CREATE TYPE inventario.metodo_depreciacion AS ENUM (
    'LINEA_RECTA',
    'SDD',
    'UNIDADES'
);


--
-- TOC entry 1313 (class 1247 OID 65558)
-- Name: metodo_valuacion; Type: TYPE; Schema: inventario; Owner: -
--

CREATE TYPE inventario.metodo_valuacion AS ENUM (
    'PEPS',
    'UEPS',
    'PROM'
);


--
-- TOC entry 1310 (class 1247 OID 65550)
-- Name: seguimiento_bien; Type: TYPE; Schema: inventario; Owner: -
--

CREATE TYPE inventario.seguimiento_bien AS ENUM (
    'NINGUNO',
    'LOTE',
    'SERIE'
);


--
-- TOC entry 1307 (class 1247 OID 65538)
-- Name: tipo_bien; Type: TYPE; Schema: inventario; Owner: -
--

CREATE TYPE inventario.tipo_bien AS ENUM (
    'MERCADERIA',
    'MATERIA_PRIMA',
    'SUMINISTRO',
    'SERVICIO',
    'ACTIVO_FIJO'
);


--
-- TOC entry 1454 (class 1247 OID 319524)
-- Name: instrumento_emision; Type: TYPE; Schema: societario; Owner: -
--

CREATE TYPE societario.instrumento_emision AS ENUM (
    'AUMENTO_CAPITAL',
    'CONVERSION',
    'PLAN_OPCIONES',
    'EMISION_SECUNDARIA',
    'OTRO'
);


--
-- TOC entry 1457 (class 1247 OID 319536)
-- Name: tipo_origen_tenencia; Type: TYPE; Schema: societario; Owner: -
--

CREATE TYPE societario.tipo_origen_tenencia AS ENUM (
    'EMISION',
    'TRANSFERENCIA',
    'CONVERSION',
    'EJERCICIO_OPCION',
    'AJUSTE'
);


--
-- TOC entry 1451 (class 1247 OID 319504)
-- Name: tipo_ronda; Type: TYPE; Schema: societario; Owner: -
--

CREATE TYPE societario.tipo_ronda AS ENUM (
    'FOUNDERS',
    'ANGEL',
    'SEED',
    'A',
    'B',
    'C',
    'D',
    'PUENTE',
    'OTRA'
);


--
-- TOC entry 1448 (class 1247 OID 319489)
-- Name: tipo_titulo_societario; Type: TYPE; Schema: societario; Owner: -
--

CREATE TYPE societario.tipo_titulo_societario AS ENUM (
    'ACCION',
    'CUOTA',
    'PARTICIPACION',
    'BONO_CONVERTIBLE',
    'SAFE',
    'WARRANT',
    'OPCION'
);


--
-- TOC entry 624 (class 1255 OID 540681)
-- Name: api_actualizar_departamento(bigint, bigint, character varying, character varying, character varying, bigint, bigint, bigint, boolean, date, date); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_actualizar_departamento(p_id_sesion bigint, p_id_departamento bigint, p_codigo character varying, p_nombre character varying, p_descripcion_funciones character varying DEFAULT NULL::character varying, p_id_departamento_padre bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_jefe_empleado bigint DEFAULT NULL::bigint, p_es_activo boolean DEFAULT true, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.DEPARTAMENTO.EDITAR','ACTUALIZAR_DEPARTAMENTO');

  PERFORM administracion.fn_actualizar_departamento(
    v_id_usuario,
    p_id_departamento,
    p_codigo, p_nombre, p_descripcion_funciones,
    p_id_departamento_padre, p_id_sucursal, p_id_jefe_empleado,
    p_es_activo, p_fecha_inicio, p_fecha_fin
  );

  v_msg := format('Departamento actualizado (id_departamento=%s)', p_id_departamento);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_DEPARTAMENTO','INFO','administracion','departamento',
    jsonb_build_object('id_departamento', p_id_departamento),
    TRUE,
    jsonb_build_object('codigo',p_codigo,'nombre',p_nombre)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_departamento', p_id_departamento));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_DEPARTAMENTO','ERROR','administracion','departamento',
      jsonb_build_object('id_departamento',p_id_departamento),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 433 (class 1255 OID 540689)
-- Name: api_actualizar_empleado(bigint, bigint, bigint, date, date, character varying, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_actualizar_empleado(p_id_sesion bigint, p_id_empleado bigint, p_id_persona bigint, p_fecha_ingreso date, p_fecha_salida date DEFAULT NULL::date, p_tipo_contrato character varying DEFAULT NULL::character varying, p_jornada character varying DEFAULT NULL::character varying, p_email_corporativo character varying DEFAULT NULL::character varying, p_telefono_corporativo character varying DEFAULT NULL::character varying, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO.EDITAR','ACTUALIZAR_EMPLEADO');

  PERFORM administracion.fn_actualizar_empleado(
    v_id_usuario,
    p_id_empleado,
    p_id_persona,
    p_fecha_ingreso,
    p_fecha_salida,
    CASE WHEN p_tipo_contrato IS NULL THEN NULL ELSE p_tipo_contrato::administracion.tipo_contrato END,
    CASE WHEN p_jornada IS NULL THEN NULL ELSE p_jornada::administracion.jornada_laboral END,
    p_email_corporativo,
    p_telefono_corporativo,
    p_id_sucursal
  );

  v_msg := format('Empleado actualizado (id_empleado=%s)', p_id_empleado);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_EMPLEADO','INFO','administracion','empleado',
    jsonb_build_object('id_empleado', p_id_empleado),
    TRUE,
    jsonb_build_object('id_persona',p_id_persona,'fecha_ingreso',p_fecha_ingreso)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_empleado', p_id_empleado));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_EMPLEADO','ERROR','administracion','empleado',
      jsonb_build_object('id_empleado',p_id_empleado),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 438 (class 1255 OID 540675)
-- Name: api_actualizar_kpi(bigint, bigint, character varying, character varying, character varying, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_actualizar_kpi(p_id_sesion bigint, p_id_kpi bigint, p_nombre character varying, p_unidad_medida character varying, p_frecuencia character varying DEFAULT NULL::character varying, p_descripcion text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.KPI.EDITAR','ACTUALIZAR_KPI');

  PERFORM administracion.fn_actualizar_kpi(v_id_usuario, p_id_kpi, p_nombre, p_unidad_medida, p_frecuencia, p_descripcion);

  v_msg := format('KPI actualizado (id_kpi=%s)', p_id_kpi);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_KPI','INFO','administracion','kpi',
    jsonb_build_object('id_kpi', p_id_kpi),
    TRUE,
    jsonb_build_object('nombre',p_nombre,'unidad_medida',p_unidad_medida,'frecuencia',p_frecuencia)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_kpi', p_id_kpi));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_KPI','ERROR','administracion','kpi',
      jsonb_build_object('id_kpi',p_id_kpi),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 374 (class 1255 OID 540693)
-- Name: api_actualizar_objetivo_kpi(bigint, bigint, bigint, character varying, numeric, numeric, numeric, integer, integer, integer, integer, integer, boolean); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_actualizar_objetivo_kpi(p_id_sesion bigint, p_id_objetivo_kpi bigint, p_id_kpi bigint, p_periodo character varying, p_valor_meta numeric, p_valor_minimo numeric DEFAULT NULL::numeric, p_valor_maximo numeric DEFAULT NULL::numeric, p_responsable integer DEFAULT NULL::integer, p_id_sucursal integer DEFAULT NULL::integer, p_id_tienda integer DEFAULT NULL::integer, p_id_producto integer DEFAULT NULL::integer, p_id_producto_tienda integer DEFAULT NULL::integer, p_cumplido boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.OBJETIVO_KPI.EDITAR','ACTUALIZAR_OBJETIVO_KPI');

  PERFORM administracion.fn_actualizar_objetivo_kpi(
    v_id_usuario,
    p_id_objetivo_kpi,
    p_id_kpi,p_periodo,p_valor_meta,p_valor_minimo,p_valor_maximo,
    p_responsable,p_id_sucursal,p_id_tienda,p_id_producto,p_id_producto_tienda,
    p_cumplido
  );

  v_msg := format('Objetivo KPI actualizado (id_objetivo_kpi=%s)', p_id_objetivo_kpi);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_OBJETIVO_KPI','INFO','administracion','objetivo_kpi',
    jsonb_build_object('id_objetivo_kpi', p_id_objetivo_kpi),
    TRUE,
    jsonb_build_object('id_kpi',p_id_kpi,'periodo',p_periodo,'valor_meta',p_valor_meta)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_objetivo_kpi', p_id_objetivo_kpi));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_OBJETIVO_KPI','ERROR','administracion','objetivo_kpi',
      jsonb_build_object('id_objetivo_kpi',p_id_objetivo_kpi),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 568 (class 1255 OID 540685)
-- Name: api_actualizar_posicion(bigint, bigint, character varying, character varying, bigint, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_actualizar_posicion(p_id_sesion bigint, p_id_posicion bigint, p_codigo character varying, p_nombre character varying, p_id_posicion_parent bigint DEFAULT NULL::bigint, p_descripcion text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.POSICION.EDITAR','ACTUALIZAR_POSICION');

  PERFORM administracion.fn_actualizar_posicion(v_id_usuario,p_id_posicion,p_codigo,p_nombre,p_id_posicion_parent,p_descripcion);

  v_msg := format('Posición actualizada (id_posicion=%s)', p_id_posicion);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_POSICION','INFO','administracion','posicion',
    jsonb_build_object('id_posicion', p_id_posicion),
    TRUE,
    jsonb_build_object('codigo',p_codigo,'nombre',p_nombre)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_posicion', p_id_posicion));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_POSICION','ERROR','administracion','posicion',
      jsonb_build_object('id_posicion',p_id_posicion),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 509 (class 1255 OID 540680)
-- Name: api_crear_departamento(bigint, character varying, character varying, character varying, bigint, bigint, bigint, boolean, date, date); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_departamento(p_id_sesion bigint, p_codigo character varying, p_nombre character varying, p_descripcion_funciones character varying DEFAULT NULL::character varying, p_id_departamento_padre bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_jefe_empleado bigint DEFAULT NULL::bigint, p_es_activo boolean DEFAULT true, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.DEPARTAMENTO.CREAR','CREAR_DEPARTAMENTO');

  v_id := administracion.fn_crear_departamento(
    v_id_usuario,
    p_codigo, p_nombre, p_descripcion_funciones,
    p_id_departamento_padre, p_id_sucursal, p_id_jefe_empleado,
    p_es_activo, p_fecha_inicio, p_fecha_fin
  );

  v_msg := format('Departamento creado (id_departamento=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_DEPARTAMENTO','INFO','administracion','departamento',
    jsonb_build_object('id_departamento', v_id),
    TRUE,
    jsonb_build_object('codigo',p_codigo,'nombre',p_nombre,'id_sucursal',p_id_sucursal)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_departamento', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_DEPARTAMENTO','ERROR','administracion','departamento',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'codigo',p_codigo)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 400 (class 1255 OID 540688)
-- Name: api_crear_empleado(bigint, bigint, date, date, character varying, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_empleado(p_id_sesion bigint, p_id_persona bigint, p_fecha_ingreso date, p_fecha_salida date DEFAULT NULL::date, p_tipo_contrato character varying DEFAULT NULL::character varying, p_jornada character varying DEFAULT NULL::character varying, p_email_corporativo character varying DEFAULT NULL::character varying, p_telefono_corporativo character varying DEFAULT NULL::character varying, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO.CREAR','CREAR_EMPLEADO');

  v_id := administracion.fn_crear_empleado(
    v_id_usuario,
    p_id_persona,
    p_fecha_ingreso,
    p_fecha_salida,
    CASE WHEN p_tipo_contrato IS NULL THEN NULL ELSE p_tipo_contrato::administracion.tipo_contrato END,
    CASE WHEN p_jornada IS NULL THEN NULL ELSE p_jornada::administracion.jornada_laboral END,
    p_email_corporativo,
    p_telefono_corporativo,
    p_id_sucursal
  );

  v_msg := format('Empleado creado (id_empleado=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_EMPLEADO','INFO','administracion','empleado',
    jsonb_build_object('id_empleado', v_id),
    TRUE,
    jsonb_build_object('id_persona',p_id_persona,'fecha_ingreso',p_fecha_ingreso,'id_sucursal',p_id_sucursal)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_empleado', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_EMPLEADO','ERROR','administracion','empleado',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_persona',p_id_persona)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 480 (class 1255 OID 712704)
-- Name: api_crear_empleado_con_persona(bigint, character varying, character varying, character varying, character varying, date, date, date, character varying, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_empleado_con_persona(p_id_sesion bigint, p_nombres character varying, p_apellidos character varying, p_telefono character varying DEFAULT NULL::character varying, p_email character varying DEFAULT NULL::character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_fecha_ingreso date DEFAULT now(), p_fecha_salida date DEFAULT NULL::date, p_tipo_contrato character varying DEFAULT NULL::character varying, p_jornada character varying DEFAULT NULL::character varying, p_email_corporativo character varying DEFAULT NULL::character varying, p_telefono_corporativo character varying DEFAULT NULL::character varying, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario  bigint;
  v_id_persona  bigint;
  v_id_empleado bigint;
  v_msg         text;
BEGIN
  -- Permiso igual que api_crear_empleado existente
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ADMIN.EMPLEADO.CREAR',
    'CREAR_EMPLEADO'
  );

  -- 1) Crear persona (core existente en dump)
  v_id_persona := persona.fn_crear_persona(
    v_id_usuario,
    p_nombres,
    p_apellidos,
    p_telefono,
    p_email,
    p_fecha_nacimiento
  );

  -- 2) Crear empleado (core existente en dump)
  v_id_empleado := administracion.fn_crear_empleado(
    v_id_usuario,
    v_id_persona,
    p_fecha_ingreso,
    p_fecha_salida,
    CASE WHEN p_tipo_contrato IS NULL THEN NULL ELSE p_tipo_contrato::administracion.tipo_contrato END,
    CASE WHEN p_jornada IS NULL THEN NULL ELSE p_jornada::administracion.jornada_laboral END,
    p_email_corporativo,
    p_telefono_corporativo,
    p_id_sucursal
  );

  v_msg := format('Empleado creado (id_empleado=%s, id_persona=%s)', v_id_empleado, v_id_persona);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_EMPLEADO','INFO','administracion','empleado',
    jsonb_build_object('id_empleado', v_id_empleado),
    TRUE,
    jsonb_build_object(
      'id_persona', v_id_persona,
      'nombres', p_nombres,
      'apellidos', p_apellidos,
      'fecha_ingreso', p_fecha_ingreso,
      'id_sucursal', p_id_sucursal
    )
  );

  RETURN seguridad.fn_api_result(
    TRUE,
    v_msg,
    jsonb_build_object('id_empleado', v_id_empleado, 'id_persona', v_id_persona)
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_EMPLEADO','ERROR','administracion','empleado',
      NULL,FALSE,
      jsonb_build_object(
        'sqlstate',SQLSTATE,
        'error',SQLERRM,
        'nombres',p_nombres,
        'apellidos',p_apellidos
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 583 (class 1255 OID 540677)
-- Name: api_crear_empleado_posicion_pago(bigint, bigint, bigint, character varying, date, date, character varying, character varying, numeric, numeric, numeric, numeric, text, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_empleado_posicion_pago(p_id_sesion bigint, p_id_empleado bigint, p_id_posicion bigint, p_tipo_esquema_pago character varying, p_vigente_desde date DEFAULT CURRENT_DATE, p_vigente_hasta date DEFAULT NULL::date, p_frecuencia_pago character varying DEFAULT 'MENSUAL'::character varying, p_moneda character varying DEFAULT 'BOB'::character varying, p_pago_por_hora numeric DEFAULT NULL::numeric, p_sueldo_mensual numeric DEFAULT NULL::numeric, p_porcentaje_comision numeric DEFAULT NULL::numeric, p_comision_fija numeric DEFAULT NULL::numeric, p_tipo_comisionable text DEFAULT NULL::text, p_tipo_calculo_comisionable text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO_POSICION_PAGO.CREAR','CREAR_EMPLEADO_POSICION_PAGO');

  v_id := administracion.fn_crear_empleado_posicion_pago(
    v_id_usuario,
    p_id_empleado,
    p_id_posicion,
    p_tipo_esquema_pago::administracion.tipo_esquema_pago,
    p_vigente_desde,
    p_vigente_hasta,
    p_frecuencia_pago::administracion.frecuencia_pago,
    p_moneda,
    p_pago_por_hora,
    p_sueldo_mensual,
    p_porcentaje_comision,
    p_comision_fija,
    p_tipo_comisionable,
    p_tipo_calculo_comisionable
  );

  v_msg := format('Empleado/Posición/Pago creado (id_empleado_posicion=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_EMPLEADO_POSICION_PAGO','INFO','administracion','empleado_posicion_pago',
    jsonb_build_object('id_empleado_posicion', v_id),
    TRUE,
    jsonb_build_object('id_empleado',p_id_empleado,'id_posicion',p_id_posicion,'tipo_esquema_pago',p_tipo_esquema_pago)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_empleado_posicion', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_EMPLEADO_POSICION_PAGO','ERROR','administracion','empleado_posicion_pago',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_empleado',p_id_empleado,'id_posicion',p_id_posicion)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 381 (class 1255 OID 540695)
-- Name: api_crear_empleado_registro_pago(bigint, date, double precision, double precision, double precision, double precision, double precision, text, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_empleado_registro_pago(p_id_sesion bigint, p_fecha_pago date, p_haber_basico_pagado double precision DEFAULT 0, p_comisiones_totales_pagadas double precision DEFAULT 0, p_aguinaldos_totales_pagados double precision DEFAULT 0, p_indemnizacion_total_pagada double precision DEFAULT 0, p_otros_cargos_pagados double precision DEFAULT 0, p_descripcion_otros_cargos_pagados text DEFAULT NULL::text, p_notas_pago text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO_REGISTRO_PAGO.CREAR','CREAR_EMPLEADO_REGISTRO_PAGO');

  v_id := administracion.fn_crear_empleado_registro_pago(
    v_id_usuario,
    p_fecha_pago,
    p_haber_basico_pagado,
    p_comisiones_totales_pagadas,
    p_aguinaldos_totales_pagados,
    p_indemnizacion_total_pagada,
    p_otros_cargos_pagados,
    p_descripcion_otros_cargos_pagados,
    p_notas_pago
  );

  v_msg := format('Registro de pago creado (id_pago=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_EMPLEADO_REGISTRO_PAGO','INFO','administracion','empleado_registro_pago',
    jsonb_build_object('id_pago', v_id),
    TRUE,
    jsonb_build_object('fecha_pago',p_fecha_pago,'haber_basico_pagado',p_haber_basico_pagado)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_pago', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_EMPLEADO_REGISTRO_PAGO','ERROR','administracion','empleado_registro_pago',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'fecha_pago',p_fecha_pago)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 504 (class 1255 OID 540674)
-- Name: api_crear_kpi(bigint, character varying, character varying, character varying, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_kpi(p_id_sesion bigint, p_nombre character varying, p_unidad_medida character varying, p_frecuencia character varying DEFAULT NULL::character varying, p_descripcion text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.KPI.CREAR','CREAR_KPI');

  v_id := administracion.fn_crear_kpi(v_id_usuario, p_nombre, p_unidad_medida, p_frecuencia, p_descripcion);

  v_msg := format('KPI creado (id_kpi=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_KPI','INFO','administracion','kpi',
    jsonb_build_object('id_kpi', v_id),
    TRUE,
    jsonb_build_object('nombre',p_nombre,'unidad_medida',p_unidad_medida,'frecuencia',p_frecuencia)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_kpi', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_KPI','ERROR','administracion','kpi',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'nombre',p_nombre)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 436 (class 1255 OID 540692)
-- Name: api_crear_objetivo_kpi(bigint, bigint, character varying, numeric, numeric, numeric, integer, integer, integer, integer, integer, boolean); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_objetivo_kpi(p_id_sesion bigint, p_id_kpi bigint, p_periodo character varying, p_valor_meta numeric, p_valor_minimo numeric DEFAULT NULL::numeric, p_valor_maximo numeric DEFAULT NULL::numeric, p_responsable integer DEFAULT NULL::integer, p_id_sucursal integer DEFAULT NULL::integer, p_id_tienda integer DEFAULT NULL::integer, p_id_producto integer DEFAULT NULL::integer, p_id_producto_tienda integer DEFAULT NULL::integer, p_cumplido boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.OBJETIVO_KPI.CREAR','CREAR_OBJETIVO_KPI');

  v_id := administracion.fn_crear_objetivo_kpi(
    v_id_usuario,
    p_id_kpi,p_periodo,p_valor_meta,p_valor_minimo,p_valor_maximo,
    p_responsable,p_id_sucursal,p_id_tienda,p_id_producto,p_id_producto_tienda,
    p_cumplido
  );

  v_msg := format('Objetivo KPI creado (id_objetivo_kpi=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_OBJETIVO_KPI','INFO','administracion','objetivo_kpi',
    jsonb_build_object('id_objetivo_kpi', v_id),
    TRUE,
    jsonb_build_object('id_kpi',p_id_kpi,'periodo',p_periodo,'valor_meta',p_valor_meta)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_objetivo_kpi', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_OBJETIVO_KPI','ERROR','administracion','objetivo_kpi',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_kpi',p_id_kpi,'periodo',p_periodo)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 395 (class 1255 OID 663553)
-- Name: api_crear_objetivo_kpi_batch(bigint, jsonb); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_objetivo_kpi_batch(p_id_sesion bigint, p_lineas jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_res jsonb;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ADMIN.OBJETIVO_KPI.CREAR',
    'CREAR_OBJETIVO_KPI_BATCH'
  );

  v_res := administracion.fn_crear_objetivo_kpi_batch(v_id_usuario, p_lineas);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_OBJETIVO_KPI_BATCH',
    'INFO',
    'administracion',
    'objetivo_kpi',
    (v_res->'ids_objetivo_kpi'),
    TRUE,
    jsonb_build_object('insertados', v_res->'insertados')
  );

  RETURN seguridad.fn_api_result(TRUE, 'Objetivos KPI creados', v_res);

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_OBJETIVO_KPI_BATCH',
      'ERROR',
      'administracion',
      'objetivo_kpi',
      NULL,
      FALSE,
      jsonb_build_object('sqlstate', SQLSTATE, 'error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 525 (class 1255 OID 540684)
-- Name: api_crear_posicion(bigint, character varying, character varying, bigint, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_crear_posicion(p_id_sesion bigint, p_codigo character varying, p_nombre character varying, p_id_posicion_parent bigint DEFAULT NULL::bigint, p_descripcion text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.POSICION.CREAR','CREAR_POSICION');

  v_id := administracion.fn_crear_posicion(v_id_usuario,p_codigo,p_nombre,p_id_posicion_parent,p_descripcion);

  v_msg := format('Posición creada (id_posicion=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_POSICION','INFO','administracion','posicion',
    jsonb_build_object('id_posicion', v_id),
    TRUE,
    jsonb_build_object('codigo',p_codigo,'nombre',p_nombre)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_posicion', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_POSICION','ERROR','administracion','posicion',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'codigo',p_codigo)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 615 (class 1255 OID 704512)
-- Name: api_listar_departamentos(bigint, integer, integer, boolean, text, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_departamentos(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.DEPARTAMENTO.VER','LISTAR_DEPARTAMENTOS');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.departamento d
  WHERE
    (NOT COALESCE(p_only_activos,true) OR d.estado_registro='Activo')
    AND (p_id_sucursal IS NULL OR d.id_sucursal = p_id_sucursal)
    AND (
      v_q IS NULL
      OR lower(d.codigo) LIKE '%'||lower(v_q)||'%'
      OR lower(d.nombre) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(d.descripcion_funciones,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      d.id_departamento,
      d.codigo,
      d.nombre,
      d.descripcion_funciones,
      d.id_departamento_padre,
      d.id_sucursal,
      s.nombre AS sucursal_nombre,
      d.id_jefe_empleado,
      pe.nombres AS jefe_nombres,
      pe.apellidos AS jefe_apellidos,
      (pe.nombres || ' ' || coalesce(pe.apellidos,'')) AS jefe_nombre_completo,
      d.es_activo,
      d.fecha_inicio,
      d.fecha_fin,
      d.estado_registro,
      d.fecha_registro,
      d.fecha_modificacion,
      d.version_registro
    FROM administracion.departamento d
    LEFT JOIN infraestructura.sucursal s
      ON s.id_sucursal = d.id_sucursal
    LEFT JOIN administracion.empleado e
      ON e.id_empleado = d.id_jefe_empleado
    LEFT JOIN persona.persona pe
      ON pe.id_persona = e.id_persona
    WHERE
      (NOT COALESCE(p_only_activos,true) OR d.estado_registro='Activo')
      AND (p_id_sucursal IS NULL OR d.id_sucursal = p_id_sucursal)
      AND (
        v_q IS NULL
        OR lower(d.codigo) LIKE '%'||lower(v_q)||'%'
        OR lower(d.nombre) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(d.descripcion_funciones,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY d.id_departamento DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 498 (class 1255 OID 704517)
-- Name: api_listar_empleado_posicion_pago(bigint, integer, integer, boolean, bigint, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_empleado_posicion_pago(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_id_empleado bigint DEFAULT NULL::bigint, p_id_posicion bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO.VER','LISTAR_EMPLEADO_POSICION_PAGO');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.empleado_posicion_pago ep
  WHERE
    (NOT COALESCE(p_only_activos,true) OR ep.estado_registro='Activo')
    AND (p_id_empleado IS NULL OR ep.id_empleado = p_id_empleado)
    AND (p_id_posicion IS NULL OR ep.id_posicion = p_id_posicion);

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      ep.id_empleado_posicion AS id_empleado_posicion_pago,
      ep.id_empleado,
      (pp.nombres || ' ' || coalesce(pp.apellidos,'')) AS empleado_nombre_completo,
      ep.id_posicion,
      pos.nombre AS posicion_nombre,
      ep.vigente_desde,
      ep.vigente_hasta,
      ep.tipo_esquema_pago::text AS tipo_esquema_pago,
      ep.frecuencia_pago::text AS frecuencia_pago,
      ep.moneda,
      ep.pago_por_hora,
      ep.sueldo_mensual,
      ep.porcentaje_comision,
      ep.comision_fija,
      ep.tipo_comisionable,
      ep.tipo_calculo_comisionable,
      ep.estado_registro,
      ep.fecha_registro,
      ep.fecha_modificacion,
      ep.version_registro
    FROM administracion.empleado_posicion_pago ep
    JOIN administracion.empleado e ON e.id_empleado = ep.id_empleado
    JOIN persona.persona pp ON pp.id_persona = e.id_persona
    JOIN administracion.posicion pos ON pos.id_posicion = ep.id_posicion
    WHERE
      (NOT COALESCE(p_only_activos,true) OR ep.estado_registro='Activo')
      AND (p_id_empleado IS NULL OR ep.id_empleado = p_id_empleado)
      AND (p_id_posicion IS NULL OR ep.id_posicion = p_id_posicion)
    ORDER BY ep.id_empleado_posicion DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 635 (class 1255 OID 704518)
-- Name: api_listar_empleado_registro_pago(bigint, integer, integer, boolean, date, date); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_empleado_registro_pago(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_desde date DEFAULT NULL::date, p_hasta date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO.VER','LISTAR_EMPLEADO_REGISTRO_PAGO');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.empleado_registro_pago r
  WHERE
    (NOT COALESCE(p_only_activos,true) OR r.estado_registro='Activo')
    AND (p_desde IS NULL OR r.fecha_pago >= p_desde)
    AND (p_hasta IS NULL OR r.fecha_pago <= p_hasta);

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      r.id_pago,
      r.fecha_pago,
      r.haber_basico_pagado,
      r.comisiones_totales_pagadas,
      r.aguinaldos_totales_pagados,
      r.indemnizacion_total_pagada,
      r.otros_cargos_pagados,
      r.descripcion_otros_cargos_pagados,
      r.notas_pago,
      r.estado_registro,
      r.fecha_registro,
      r.fecha_modificacion,
      r.version_registro
    FROM administracion.empleado_registro_pago r
    WHERE
      (NOT COALESCE(p_only_activos,true) OR r.estado_registro='Activo')
      AND (p_desde IS NULL OR r.fecha_pago >= p_desde)
      AND (p_hasta IS NULL OR r.fecha_pago <= p_hasta)
    ORDER BY r.id_pago DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 413 (class 1255 OID 704514)
-- Name: api_listar_empleados(bigint, integer, integer, boolean, text, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_empleados(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.EMPLEADO.VER','LISTAR_EMPLEADOS');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.empleado e
  JOIN persona.persona p ON p.id_persona = e.id_persona
  WHERE
    (NOT COALESCE(p_only_activos,true) OR e.estado_registro='Activo')
    AND (p_id_sucursal IS NULL OR e.id_sucursal = p_id_sucursal)
    AND (
      v_q IS NULL
      OR lower(coalesce(p.nombres,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(p.apellidos,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(p.email,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(e.email_corporativo,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(e.telefono_corporativo,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      e.id_empleado,
      e.id_persona,
      p.nombres,
      p.apellidos,
      (p.nombres || ' ' || coalesce(p.apellidos,'')) AS nombre_completo,
      e.fecha_ingreso,
      e.fecha_salida,
      e.tipo_contrato::text AS tipo_contrato,
      e.jornada::text AS jornada,
      e.email_corporativo,
      e.telefono_corporativo,
      e.id_sucursal,
      s.nombre AS sucursal_nombre,
      e.estado_registro,
      e.fecha_registro,
      e.fecha_modificacion,
      e.version_registro
    FROM administracion.empleado e
    JOIN persona.persona p ON p.id_persona = e.id_persona
    LEFT JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
    WHERE
      (NOT COALESCE(p_only_activos,true) OR e.estado_registro='Activo')
      AND (p_id_sucursal IS NULL OR e.id_sucursal = p_id_sucursal)
      AND (
        v_q IS NULL
        OR lower(coalesce(p.nombres,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(p.apellidos,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(p.email,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(e.email_corporativo,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(e.telefono_corporativo,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY e.id_empleado DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 427 (class 1255 OID 704515)
-- Name: api_listar_kpis(bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_kpis(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.KPI.VER','LISTAR_KPIS');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.kpi k
  WHERE
    (NOT COALESCE(p_only_activos,true) OR k.estado_registro='Activo')
    AND (
      v_q IS NULL
      OR lower(k.nombre) LIKE '%'||lower(v_q)||'%'
      OR lower(k.unidad_medida) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(k.frecuencia,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(k.descripcion,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      k.id_kpi,
      k.nombre,
      k.unidad_medida,
      k.frecuencia,
      k.descripcion,
      k.estado_registro,
      k.fecha_registro,
      k.fecha_modificacion,
      k.version_registro
    FROM administracion.kpi k
    WHERE
      (NOT COALESCE(p_only_activos,true) OR k.estado_registro='Activo')
      AND (
        v_q IS NULL
        OR lower(k.nombre) LIKE '%'||lower(v_q)||'%'
        OR lower(k.unidad_medida) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(k.frecuencia,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(k.descripcion,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY k.id_kpi DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 595 (class 1255 OID 704516)
-- Name: api_listar_objetivos_kpi(bigint, integer, integer, boolean, bigint, character varying, boolean, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_objetivos_kpi(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_id_kpi bigint DEFAULT NULL::bigint, p_periodo character varying DEFAULT NULL::character varying, p_cumplido boolean DEFAULT NULL::boolean, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.KPI.VER','LISTAR_OBJETIVOS_KPI');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.objetivo_kpi o
  JOIN administracion.kpi k ON k.id_kpi = o.id_kpi
  WHERE
    (NOT COALESCE(p_only_activos,true) OR o.estado_registro='Activo')
    AND (p_id_kpi IS NULL OR o.id_kpi = p_id_kpi)
    AND (p_periodo IS NULL OR o.periodo = p_periodo)
    AND (p_cumplido IS NULL OR o.cumplido = p_cumplido)
    AND (
      v_q IS NULL
      OR lower(o.periodo) LIKE '%'||lower(v_q)||'%'
      OR lower(k.nombre) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      o.id_objetivo_kpi,
      o.id_kpi,
      k.nombre AS kpi_nombre,
      k.unidad_medida AS kpi_unidad_medida,
      o.periodo,
      o.valor_meta,
      o.valor_minimo,
      o.valor_maximo,
      o.responsable,
      o.id_sucursal,
      o.id_tienda,
      o.id_producto,
      o.id_producto_tienda,
      o.cumplido,
      o.estado_registro,
      o.fecha_registro,
      o.fecha_modificacion,
      o.version_registro
    FROM administracion.objetivo_kpi o
    JOIN administracion.kpi k ON k.id_kpi = o.id_kpi
    WHERE
      (NOT COALESCE(p_only_activos,true) OR o.estado_registro='Activo')
      AND (p_id_kpi IS NULL OR o.id_kpi = p_id_kpi)
      AND (p_periodo IS NULL OR o.periodo = p_periodo)
      AND (p_cumplido IS NULL OR o.cumplido = p_cumplido)
      AND (
        v_q IS NULL
        OR lower(o.periodo) LIKE '%'||lower(v_q)||'%'
        OR lower(k.nombre) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY o.id_objetivo_kpi DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 379 (class 1255 OID 704513)
-- Name: api_listar_posiciones(bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.api_listar_posiciones(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'ADMIN.POSICION.VER','LISTAR_POSICIONES');

  SELECT COUNT(*)
    INTO v_total
  FROM administracion.posicion p
  WHERE
    (NOT COALESCE(p_only_activos,true) OR p.estado_registro='Activo')
    AND (
      v_q IS NULL
      OR lower(p.codigo) LIKE '%'||lower(v_q)||'%'
      OR lower(p.nombre) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(p.descripcion,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      p.id_posicion,
      p.codigo,
      p.nombre,
      p.id_posicion_parent,
      pp.nombre AS posicion_parent_nombre,
      p.descripcion,
      p.estado_registro,
      p.fecha_registro,
      p.fecha_modificacion,
      p.version_registro
    FROM administracion.posicion p
    LEFT JOIN administracion.posicion pp
      ON pp.id_posicion = p.id_posicion_parent
    WHERE
      (NOT COALESCE(p_only_activos,true) OR p.estado_registro='Activo')
      AND (
        v_q IS NULL
        OR lower(p.codigo) LIKE '%'||lower(v_q)||'%'
        OR lower(p.nombre) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(p.descripcion,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY p.id_posicion DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 409 (class 1255 OID 540679)
-- Name: fn_actualizar_departamento(bigint, bigint, character varying, character varying, character varying, bigint, bigint, bigint, boolean, date, date); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_actualizar_departamento(p_id_actor bigint, p_id_departamento bigint, p_codigo character varying, p_nombre character varying, p_descripcion_funciones character varying DEFAULT NULL::character varying, p_id_departamento_padre bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_jefe_empleado bigint DEFAULT NULL::bigint, p_es_activo boolean DEFAULT true, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_departamento IS NULL THEN
    RAISE EXCEPTION 'id_departamento es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_codigo),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE administracion.departamento
  SET
    codigo = p_codigo,
    nombre = p_nombre,
    descripcion_funciones = p_descripcion_funciones,
    id_departamento_padre = p_id_departamento_padre,
    id_sucursal = p_id_sucursal,
    id_jefe_empleado = p_id_jefe_empleado,
    es_activo = coalesce(p_es_activo,true),
    fecha_inicio = p_fecha_inicio,
    fecha_fin = p_fecha_fin,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_departamento = p_id_departamento
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'departamento no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 422 (class 1255 OID 540687)
-- Name: fn_actualizar_empleado(bigint, bigint, bigint, date, date, administracion.tipo_contrato, administracion.jornada_laboral, character varying, character varying, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_actualizar_empleado(p_id_actor bigint, p_id_empleado bigint, p_id_persona bigint, p_fecha_ingreso date, p_fecha_salida date DEFAULT NULL::date, p_tipo_contrato administracion.tipo_contrato DEFAULT NULL::administracion.tipo_contrato, p_jornada administracion.jornada_laboral DEFAULT NULL::administracion.jornada_laboral, p_email_corporativo character varying DEFAULT NULL::character varying, p_telefono_corporativo character varying DEFAULT NULL::character varying, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_empleado IS NULL THEN
    RAISE EXCEPTION 'id_empleado es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_persona IS NULL THEN
    RAISE EXCEPTION 'id_persona es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_fecha_ingreso IS NULL THEN
    RAISE EXCEPTION 'fecha_ingreso es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE administracion.empleado
  SET
    id_persona = p_id_persona,
    fecha_ingreso = p_fecha_ingreso,
    fecha_salida = p_fecha_salida,
    tipo_contrato = COALESCE(p_tipo_contrato, tipo_contrato),
    jornada = COALESCE(p_jornada, jornada),
    email_corporativo = p_email_corporativo,
    telefono_corporativo = p_telefono_corporativo,
    id_sucursal = p_id_sucursal,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_empleado = p_id_empleado
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'empleado no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 557 (class 1255 OID 540673)
-- Name: fn_actualizar_kpi(bigint, bigint, character varying, character varying, character varying, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_actualizar_kpi(p_id_actor bigint, p_id_kpi bigint, p_nombre character varying, p_unidad_medida character varying, p_frecuencia character varying DEFAULT NULL::character varying, p_descripcion text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_kpi IS NULL THEN
    RAISE EXCEPTION 'id_kpi es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_unidad_medida),'') = '' THEN
    RAISE EXCEPTION 'unidad_medida es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE administracion.kpi
  SET
    nombre = p_nombre,
    descripcion = p_descripcion,
    unidad_medida = p_unidad_medida,
    frecuencia = p_frecuencia,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_kpi = p_id_kpi
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'kpi no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 430 (class 1255 OID 540691)
-- Name: fn_actualizar_objetivo_kpi(bigint, bigint, bigint, character varying, numeric, numeric, numeric, integer, integer, integer, integer, integer, boolean); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_actualizar_objetivo_kpi(p_id_actor bigint, p_id_objetivo_kpi bigint, p_id_kpi bigint, p_periodo character varying, p_valor_meta numeric, p_valor_minimo numeric DEFAULT NULL::numeric, p_valor_maximo numeric DEFAULT NULL::numeric, p_responsable integer DEFAULT NULL::integer, p_id_sucursal integer DEFAULT NULL::integer, p_id_tienda integer DEFAULT NULL::integer, p_id_producto integer DEFAULT NULL::integer, p_id_producto_tienda integer DEFAULT NULL::integer, p_cumplido boolean DEFAULT false) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_objetivo_kpi IS NULL THEN
    RAISE EXCEPTION 'id_objetivo_kpi es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_kpi IS NULL THEN
    RAISE EXCEPTION 'id_kpi es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_periodo),'') = '' THEN
    RAISE EXCEPTION 'periodo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_valor_meta IS NULL THEN
    RAISE EXCEPTION 'valor_meta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE administracion.objetivo_kpi
  SET
    id_kpi = p_id_kpi,
    periodo = p_periodo,
    valor_meta = p_valor_meta,
    valor_minimo = p_valor_minimo,
    valor_maximo = p_valor_maximo,
    responsable = p_responsable,
    id_sucursal = p_id_sucursal,
    id_tienda = p_id_tienda,
    id_producto = p_id_producto,
    id_producto_tienda = p_id_producto_tienda,
    cumplido = coalesce(p_cumplido,false),
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_objetivo_kpi = p_id_objetivo_kpi
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'objetivo_kpi no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 388 (class 1255 OID 540683)
-- Name: fn_actualizar_posicion(bigint, bigint, character varying, character varying, bigint, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_actualizar_posicion(p_id_actor bigint, p_id_posicion bigint, p_codigo character varying, p_nombre character varying, p_id_posicion_parent bigint DEFAULT NULL::bigint, p_descripcion text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_posicion IS NULL THEN
    RAISE EXCEPTION 'id_posicion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_codigo),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE administracion.posicion
  SET
    codigo = p_codigo,
    nombre = p_nombre,
    id_posicion_parent = p_id_posicion_parent,
    descripcion = p_descripcion,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_posicion = p_id_posicion
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'posicion no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 483 (class 1255 OID 540678)
-- Name: fn_crear_departamento(bigint, character varying, character varying, character varying, bigint, bigint, bigint, boolean, date, date); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_departamento(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_descripcion_funciones character varying DEFAULT NULL::character varying, p_id_departamento_padre bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_jefe_empleado bigint DEFAULT NULL::bigint, p_es_activo boolean DEFAULT true, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO administracion.departamento (
    codigo, nombre, descripcion_funciones,
    id_departamento_padre, id_sucursal, id_jefe_empleado,
    es_activo, fecha_inicio, fecha_fin,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_codigo, p_nombre, p_descripcion_funciones,
    p_id_departamento_padre, p_id_sucursal, p_id_jefe_empleado,
    coalesce(p_es_activo,true), p_fecha_inicio, p_fecha_fin,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_departamento INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 566 (class 1255 OID 540686)
-- Name: fn_crear_empleado(bigint, bigint, date, date, administracion.tipo_contrato, administracion.jornada_laboral, character varying, character varying, bigint); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_empleado(p_id_actor bigint, p_id_persona bigint, p_fecha_ingreso date, p_fecha_salida date DEFAULT NULL::date, p_tipo_contrato administracion.tipo_contrato DEFAULT NULL::administracion.tipo_contrato, p_jornada administracion.jornada_laboral DEFAULT NULL::administracion.jornada_laboral, p_email_corporativo character varying DEFAULT NULL::character varying, p_telefono_corporativo character varying DEFAULT NULL::character varying, p_id_sucursal bigint DEFAULT NULL::bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_persona IS NULL THEN
    RAISE EXCEPTION 'id_persona es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_fecha_ingreso IS NULL THEN
    RAISE EXCEPTION 'fecha_ingreso es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO administracion.empleado (
    id_persona, fecha_ingreso, fecha_salida,
    tipo_contrato, jornada,
    email_corporativo, telefono_corporativo,
    id_sucursal,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_persona, p_fecha_ingreso, p_fecha_salida,
    COALESCE(p_tipo_contrato, 'INDEFINIDO'::administracion.tipo_contrato),
    COALESCE(p_jornada, 'FULL_TIME'::administracion.jornada_laboral),
    p_email_corporativo, p_telefono_corporativo,
    p_id_sucursal,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_empleado INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 599 (class 1255 OID 540676)
-- Name: fn_crear_empleado_posicion_pago(bigint, bigint, bigint, administracion.tipo_esquema_pago, date, date, administracion.frecuencia_pago, character varying, numeric, numeric, numeric, numeric, text, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_empleado_posicion_pago(p_id_actor bigint, p_id_empleado bigint, p_id_posicion bigint, p_tipo_esquema_pago administracion.tipo_esquema_pago, p_vigente_desde date DEFAULT CURRENT_DATE, p_vigente_hasta date DEFAULT NULL::date, p_frecuencia_pago administracion.frecuencia_pago DEFAULT 'MENSUAL'::administracion.frecuencia_pago, p_moneda character varying DEFAULT 'BOB'::character varying, p_pago_por_hora numeric DEFAULT NULL::numeric, p_sueldo_mensual numeric DEFAULT NULL::numeric, p_porcentaje_comision numeric DEFAULT NULL::numeric, p_comision_fija numeric DEFAULT NULL::numeric, p_tipo_comisionable text DEFAULT NULL::text, p_tipo_calculo_comisionable text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_empleado IS NULL THEN RAISE EXCEPTION 'id_empleado es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_id_posicion IS NULL THEN RAISE EXCEPTION 'id_posicion es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_tipo_esquema_pago IS NULL THEN RAISE EXCEPTION 'tipo_esquema_pago es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  INSERT INTO administracion.empleado_posicion_pago (
    id_empleado, id_posicion, vigente_desde, vigente_hasta,
    tipo_esquema_pago, frecuencia_pago, moneda,
    pago_por_hora, sueldo_mensual, porcentaje_comision, comision_fija,
    tipo_comisionable, tipo_calculo_comisionable,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_empleado, p_id_posicion, coalesce(p_vigente_desde,CURRENT_DATE), p_vigente_hasta,
    p_tipo_esquema_pago, coalesce(p_frecuencia_pago,'MENSUAL'::administracion.frecuencia_pago), coalesce(p_moneda,'BOB'),
    p_pago_por_hora, p_sueldo_mensual, p_porcentaje_comision, p_comision_fija,
    p_tipo_comisionable, p_tipo_calculo_comisionable,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_empleado_posicion INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 491 (class 1255 OID 540694)
-- Name: fn_crear_empleado_registro_pago(bigint, date, double precision, double precision, double precision, double precision, double precision, text, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_empleado_registro_pago(p_id_actor bigint, p_fecha_pago date, p_haber_basico_pagado double precision DEFAULT 0, p_comisiones_totales_pagadas double precision DEFAULT 0, p_aguinaldos_totales_pagados double precision DEFAULT 0, p_indemnizacion_total_pagada double precision DEFAULT 0, p_otros_cargos_pagados double precision DEFAULT 0, p_descripcion_otros_cargos_pagados text DEFAULT NULL::text, p_notas_pago text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_fecha_pago IS NULL THEN
    RAISE EXCEPTION 'fecha_pago es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO administracion.empleado_registro_pago (
    fecha_pago,
    haber_basico_pagado,
    comisiones_totales_pagadas,
    aguinaldos_totales_pagados,
    indemnizacion_total_pagada,
    otros_cargos_pagados,
    descripcion_otros_cargos_pagados,
    notas_pago,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_fecha_pago,
    coalesce(p_haber_basico_pagado,0),
    coalesce(p_comisiones_totales_pagadas,0),
    coalesce(p_aguinaldos_totales_pagados,0),
    coalesce(p_indemnizacion_total_pagada,0),
    coalesce(p_otros_cargos_pagados,0),
    p_descripcion_otros_cargos_pagados,
    p_notas_pago,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_pago INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 515 (class 1255 OID 540672)
-- Name: fn_crear_kpi(bigint, character varying, character varying, character varying, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_kpi(p_id_actor bigint, p_nombre character varying, p_unidad_medida character varying, p_frecuencia character varying DEFAULT NULL::character varying, p_descripcion text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_unidad_medida),'') = '' THEN
    RAISE EXCEPTION 'unidad_medida es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO administracion.kpi (
    nombre, descripcion, unidad_medida, frecuencia,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_nombre, p_descripcion, p_unidad_medida, p_frecuencia,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_kpi INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 362 (class 1255 OID 540690)
-- Name: fn_crear_objetivo_kpi(bigint, bigint, character varying, numeric, numeric, numeric, integer, integer, integer, integer, integer, boolean); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_objetivo_kpi(p_id_actor bigint, p_id_kpi bigint, p_periodo character varying, p_valor_meta numeric, p_valor_minimo numeric DEFAULT NULL::numeric, p_valor_maximo numeric DEFAULT NULL::numeric, p_responsable integer DEFAULT NULL::integer, p_id_sucursal integer DEFAULT NULL::integer, p_id_tienda integer DEFAULT NULL::integer, p_id_producto integer DEFAULT NULL::integer, p_id_producto_tienda integer DEFAULT NULL::integer, p_cumplido boolean DEFAULT false) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_kpi IS NULL THEN
    RAISE EXCEPTION 'id_kpi es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_periodo),'') = '' THEN
    RAISE EXCEPTION 'periodo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_valor_meta IS NULL THEN
    RAISE EXCEPTION 'valor_meta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO administracion.objetivo_kpi (
    id_kpi, periodo, valor_meta, valor_minimo, valor_maximo,
    responsable, id_sucursal, id_tienda, id_producto, id_producto_tienda,
    cumplido,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_kpi, p_periodo, p_valor_meta, p_valor_minimo, p_valor_maximo,
    p_responsable, p_id_sucursal, p_id_tienda, p_id_producto, p_id_producto_tienda,
    coalesce(p_cumplido,false),
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_objetivo_kpi INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 625 (class 1255 OID 663552)
-- Name: fn_crear_objetivo_kpi_batch(bigint, jsonb); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_objetivo_kpi_batch(p_id_usuario_creador bigint, p_lineas jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_ids jsonb := '[]'::jsonb;
  v_total int := 0;
BEGIN
  IF p_id_usuario_creador IS NULL THEN
    RAISE EXCEPTION 'id_usuario_creador es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_lineas IS NULL OR jsonb_typeof(p_lineas) <> 'array' OR jsonb_array_length(p_lineas) = 0 THEN
    RAISE EXCEPTION 'p_lineas debe ser un JSON array no vacío'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Validaciones mínimas (sin adivinar reglas de negocio extra)
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_kpi bigint,
      periodo varchar,
      valor_meta numeric,
      valor_minimo numeric,
      valor_maximo numeric,
      responsable integer,
      id_sucursal integer,
      id_tienda integer,
      id_producto integer,
      id_producto_tienda integer,
      cumplido boolean
    )
    WHERE id_kpi IS NULL
  ) THEN
    RAISE EXCEPTION 'Todas las líneas deben tener id_kpi'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_kpi bigint,
      periodo varchar,
      valor_meta numeric,
      valor_minimo numeric,
      valor_maximo numeric,
      responsable integer,
      id_sucursal integer,
      id_tienda integer,
      id_producto integer,
      id_producto_tienda integer,
      cumplido boolean
    )
    WHERE periodo IS NULL OR length(periodo) = 0 OR length(periodo) > 30
  ) THEN
    RAISE EXCEPTION 'periodo es obligatorio y debe tener máximo 30 caracteres'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_kpi bigint,
      periodo varchar,
      valor_meta numeric,
      valor_minimo numeric,
      valor_maximo numeric,
      responsable integer,
      id_sucursal integer,
      id_tienda integer,
      id_producto integer,
      id_producto_tienda integer,
      cumplido boolean
    )
    WHERE valor_meta IS NULL
  ) THEN
    RAISE EXCEPTION 'valor_meta es obligatorio en todas las líneas'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Insert masivo (id_objetivo_kpi tiene DEFAULT nextval(...) en tu dump)
  WITH items AS (
    SELECT
      x.id_kpi::bigint                                AS id_kpi,
      x.periodo::varchar                              AS periodo,
      x.valor_meta::numeric(18,4)                     AS valor_meta,
      x.valor_minimo::numeric(18,4)                   AS valor_minimo,
      x.valor_maximo::numeric(18,4)                   AS valor_maximo,
      x.responsable::integer                          AS responsable,
      x.id_sucursal::integer                          AS id_sucursal,
      x.id_tienda::integer                            AS id_tienda,
      x.id_producto::integer                          AS id_producto,
      x.id_producto_tienda::integer                   AS id_producto_tienda,
      COALESCE(x.cumplido, false)::boolean            AS cumplido
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_kpi bigint,
      periodo varchar,
      valor_meta numeric,
      valor_minimo numeric,
      valor_maximo numeric,
      responsable integer,
      id_sucursal integer,
      id_tienda integer,
      id_producto integer,
      id_producto_tienda integer,
      cumplido boolean
    )
  ),
  ins AS (
    INSERT INTO administracion.objetivo_kpi (
      id_kpi,
      periodo,
      valor_meta,
      valor_minimo,
      valor_maximo,
      responsable,
      id_sucursal,
      id_tienda,
      id_producto,
      id_producto_tienda,
      cumplido,
      estado_registro,
      fecha_registro,
      fecha_modificacion,
      version_registro,
      id_usuario_creador,
      id_usuario_modificacion
    )
    SELECT
      i.id_kpi,
      i.periodo,
      i.valor_meta,
      i.valor_minimo,
      i.valor_maximo,
      i.responsable,
      i.id_sucursal,
      i.id_tienda,
      i.id_producto,
      i.id_producto_tienda,
      i.cumplido,
      'Activo',
      now(),
      NULL,
      1,
      p_id_usuario_creador,
      NULL
    FROM items i
    RETURNING id_objetivo_kpi
  )
  SELECT
    COUNT(*)::int,
    COALESCE(jsonb_agg(id_objetivo_kpi), '[]'::jsonb)
  INTO v_total, v_ids
  FROM ins;

  RETURN jsonb_build_object(
    'ok', true,
    'insertados', v_total,
    'ids_objetivo_kpi', v_ids
  );
END;
$$;


--
-- TOC entry 366 (class 1255 OID 540682)
-- Name: fn_crear_posicion(bigint, character varying, character varying, bigint, text); Type: FUNCTION; Schema: administracion; Owner: -
--

CREATE FUNCTION administracion.fn_crear_posicion(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_id_posicion_parent bigint DEFAULT NULL::bigint, p_descripcion text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO administracion.posicion (
    codigo, nombre, id_posicion_parent, descripcion,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_codigo, p_nombre, p_id_posicion_parent, p_descripcion,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_posicion INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 497 (class 1255 OID 630907)
-- Name: api_actualizar_archivos_transaccion(bigint, bigint, integer, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_archivos_transaccion(p_id_sesion bigint, p_id_archivo bigint, p_id_transaccion integer, p_link_achivo text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN contabilidad.api_actualizar_archivos_transaccion(
    p_id_sesion,
    p_id_archivo,
    p_id_transaccion::bigint,
    p_link_achivo
  );
END;
$$;


--
-- TOC entry 488 (class 1255 OID 745521)
-- Name: api_actualizar_archivos_transaccion(bigint, bigint, bigint, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_archivos_transaccion(p_id_sesion bigint, p_id_archivo bigint, p_id_transaccion bigint, p_link_archivo text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  -- Actor desde sesión (mismo patrón que el resto de api_*)
  SELECT s.id_persona
  INTO v_id_actor
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.esta_activa = true
    AND s.timestamp_logout IS NULL;

  IF v_id_actor IS NULL THEN
    RETURN jsonb_build_object('status','error','type_error','SESSION','message','Sesión inválida o expirada','data',NULL);
  END IF;

  UPDATE contabilidad.archivos_transaccion
  SET
    id_transaccion = p_id_transaccion,
    link_archivo   = p_link_archivo,
    link_achivo    = p_link_archivo,
    fecha_modificacion = now(),
    id_usuario_modificacion = v_id_actor,
    version_registro = COALESCE(version_registro,1) + 1
  WHERE id_archivo = p_id_archivo;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status','error','type_error','NOT_FOUND','message','Archivo no encontrado','data',NULL);
  END IF;

  RETURN jsonb_build_object('status','ok','type_error',NULL,'message','Actualizado','data',jsonb_build_object('id_archivo',p_id_archivo));
END;
$$;


--
-- TOC entry 392 (class 1255 OID 630883)
-- Name: api_actualizar_centro_costo(bigint, bigint, character varying, character varying, bigint, bigint, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_centro_costo(p_id_sesion bigint, p_id_centro_costo bigint, p_codigo character varying, p_nombre character varying, p_id_cuenta_ingreso bigint, p_id_cuenta_costo bigint, p_observaciones text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CENTRO_COSTO.GESTIONAR',
    'ACTUALIZAR_CENTRO_COSTO'
  );

  PERFORM contabilidad.fn_actualizar_centro_costo(
    v_id_usuario, p_id_centro_costo, p_codigo, p_nombre, p_id_cuenta_ingreso, p_id_cuenta_costo, p_observaciones
  );

  v_msg := 'centro_costo actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_CENTRO_COSTO',
    'INFO',
    'contabilidad',
    'centro_costo',
    jsonb_build_object('id_centro_costo', p_id_centro_costo),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_centro_costo', p_id_centro_costo));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_CENTRO_COSTO',
      'ERROR',
      'contabilidad',
      'centro_costo',
      jsonb_build_object('id_centro_costo', p_id_centro_costo),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 429 (class 1255 OID 630891)
-- Name: api_actualizar_centro_costo_mapa(bigint, bigint, bigint, contabilidad.tipo_costo, contabilidad.naturaleza_costo, date, date, bigint, bigint, bigint, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_centro_costo_mapa(p_id_sesion bigint, p_id_cc_mapa bigint, p_id_centro_costo bigint, p_tipo contabilidad.tipo_costo, p_naturaleza contabilidad.naturaleza_costo, p_vigente_desde date, p_vigente_hasta date, p_id_deuda bigint, p_id_bien bigint, p_id_sucursal bigint, p_id_tienda bigint, p_id_empleado bigint, p_id_posicion bigint, p_id_departamento bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CENTRO_COSTO.GESTIONAR',
    'ACTUALIZAR_CENTRO_COSTO_MAPA'
  );

  PERFORM contabilidad.fn_actualizar_centro_costo_mapa(
    v_id_usuario, p_id_cc_mapa, p_id_centro_costo, p_tipo, p_naturaleza, p_vigente_desde, p_vigente_hasta, p_id_deuda, p_id_bien, p_id_sucursal, p_id_tienda, p_id_empleado, p_id_posicion, p_id_departamento
  );

  v_msg := 'centro_costo_mapa actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_CENTRO_COSTO_MAPA',
    'INFO',
    'contabilidad',
    'centro_costo_mapa',
    jsonb_build_object('id_cc_mapa', p_id_cc_mapa),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_cc_mapa', p_id_cc_mapa));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_CENTRO_COSTO_MAPA',
      'ERROR',
      'contabilidad',
      'centro_costo_mapa',
      jsonb_build_object('id_cc_mapa', p_id_cc_mapa),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 644 (class 1255 OID 630887)
-- Name: api_actualizar_concepto_costo(bigint, bigint, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_concepto_costo(p_id_sesion bigint, p_id_concepto bigint, p_codigo character varying, p_nombre character varying, p_tipo_concepto character varying, p_unidad_medida character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CENTRO_COSTO.GESTIONAR',
    'ACTUALIZAR_CONCEPTO_COSTO'
  );

  PERFORM contabilidad.fn_actualizar_concepto_costo(
    v_id_usuario, p_id_concepto, p_codigo, p_nombre, p_tipo_concepto, p_unidad_medida
  );

  v_msg := 'concepto_costo actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_CONCEPTO_COSTO',
    'INFO',
    'contabilidad',
    'concepto_costo',
    jsonb_build_object('id_concepto', p_id_concepto),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_concepto', p_id_concepto));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_CONCEPTO_COSTO',
      'ERROR',
      'contabilidad',
      'concepto_costo',
      jsonb_build_object('id_concepto', p_id_concepto),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 410 (class 1255 OID 630879)
-- Name: api_actualizar_cuenta(bigint, bigint, character varying, character varying, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_cuenta(p_id_sesion bigint, p_id_cuenta bigint, p_codigo character varying, p_nombre_cuenta character varying, p_id_grupo_cuenta bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.GESTIONAR',
    'ACTUALIZAR_CUENTA'
  );

  PERFORM contabilidad.fn_actualizar_cuenta(
    v_id_usuario, p_id_cuenta, p_codigo, p_nombre_cuenta, p_id_grupo_cuenta
  );

  v_msg := 'cuenta actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_CUENTA',
    'INFO',
    'contabilidad',
    'cuenta',
    jsonb_build_object('id_cuenta', p_id_cuenta),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_cuenta', p_id_cuenta));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_CUENTA',
      'ERROR',
      'contabilidad',
      'cuenta',
      jsonb_build_object('id_cuenta', p_id_cuenta),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 559 (class 1255 OID 630895)
-- Name: api_actualizar_cuenta_asignacion(bigint, bigint, text, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, smallint, date, date); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_cuenta_asignacion(p_id_sesion bigint, p_id_cuenta_asignacion bigint, p_entidad_tipo text, p_id_empleado bigint, p_id_persona_estudiante bigint, p_id_persona_tutor bigint, p_id_sucursal bigint, p_id_edificio bigint, p_id_tienda bigint, p_id_bien bigint, p_id_deuda bigint, p_id_proveedor bigint, p_id_departamento bigint, p_id_cuenta bigint, p_prioridad smallint, p_vigente_desde date, p_vigente_hasta date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.GESTIONAR',
    'ACTUALIZAR_CUENTA_ASIGNACION'
  );

  PERFORM contabilidad.fn_actualizar_cuenta_asignacion(
    v_id_usuario, p_id_cuenta_asignacion, p_entidad_tipo, p_id_empleado, p_id_persona_estudiante, p_id_persona_tutor, p_id_sucursal, p_id_edificio, p_id_tienda, p_id_bien, p_id_deuda, p_id_proveedor, p_id_departamento, p_id_cuenta, p_prioridad, p_vigente_desde, p_vigente_hasta
  );

  v_msg := 'cuenta_asignacion actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_CUENTA_ASIGNACION',
    'INFO',
    'contabilidad',
    'cuenta_asignacion',
    jsonb_build_object('id_cuenta_asignacion', p_id_cuenta_asignacion),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_cuenta_asignacion', p_id_cuenta_asignacion));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_CUENTA_ASIGNACION',
      'ERROR',
      'contabilidad',
      'cuenta_asignacion',
      jsonb_build_object('id_cuenta_asignacion', p_id_cuenta_asignacion),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 449 (class 1255 OID 630875)
-- Name: api_actualizar_grupo_cuenta(bigint, bigint, character varying, character varying, bigint, character varying, character varying, character varying, smallint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_grupo_cuenta(p_id_sesion bigint, p_id_grupo_cuenta bigint, p_codigo character varying, p_nombre character varying, p_id_parent bigint, p_tipo character varying, p_sub_tipo character varying, p_sub_grupo character varying, p_orden_reporte smallint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.GESTIONAR',
    'ACTUALIZAR_GRUPO_CUENTA'
  );

  PERFORM contabilidad.fn_actualizar_grupo_cuenta(
    v_id_usuario, p_id_grupo_cuenta, p_codigo, p_nombre, p_id_parent, p_tipo, p_sub_tipo, p_sub_grupo, p_orden_reporte
  );

  v_msg := 'grupo_cuenta actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_GRUPO_CUENTA',
    'INFO',
    'contabilidad',
    'grupo_cuenta',
    jsonb_build_object('id_grupo_cuenta', p_id_grupo_cuenta),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_grupo_cuenta', p_id_grupo_cuenta));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_GRUPO_CUENTA',
      'ERROR',
      'contabilidad',
      'grupo_cuenta',
      jsonb_build_object('id_grupo_cuenta', p_id_grupo_cuenta),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 474 (class 1255 OID 630911)
-- Name: api_actualizar_pago_tutor(bigint, bigint, bigint, timestamp with time zone, timestamp with time zone, text, numeric, numeric, numeric, timestamp without time zone, timestamp without time zone, text, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_pago_tutor(p_id_sesion bigint, p_id_pago_tutor bigint, p_id_tutor bigint, p_periodo_inicio timestamp with time zone, p_periodo_fin timestamp with time zone, p_estado_pago text, p_subtotal numeric, p_ajustes numeric, p_total numeric, p_fecha_aprobacion timestamp without time zone, p_fecha_pago timestamp without time zone, p_referencia_pago text, p_observacion text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.PAGO_TUTOR.GESTIONAR',
    'ACTUALIZAR_PAGO_TUTOR'
  );

  PERFORM contabilidad.fn_actualizar_pago_tutor(
    v_id_usuario, p_id_pago_tutor, p_id_tutor, p_periodo_inicio, p_periodo_fin, p_estado_pago, p_subtotal, p_ajustes, p_total, p_fecha_aprobacion, p_fecha_pago, p_referencia_pago, p_observacion
  );

  v_msg := 'pago_tutor actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_PAGO_TUTOR',
    'INFO',
    'contabilidad',
    'pago_tutor',
    jsonb_build_object('id_pago_tutor', p_id_pago_tutor),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_pago_tutor', p_id_pago_tutor));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_PAGO_TUTOR',
      'ERROR',
      'contabilidad',
      'pago_tutor',
      jsonb_build_object('id_pago_tutor', p_id_pago_tutor),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 539 (class 1255 OID 630915)
-- Name: api_actualizar_pago_tutor_detalle(bigint, bigint, bigint, bigint, integer, numeric); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_pago_tutor_detalle(p_id_sesion bigint, p_id_pago_tutor_detalle bigint, p_id_pago_tutor bigint, p_id_clase bigint, p_horas_pasadas integer, p_tarifa_hora_aplicada numeric) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.PAGO_TUTOR.GESTIONAR',
    'ACTUALIZAR_PAGO_TUTOR_DETALLE'
  );

  PERFORM contabilidad.fn_actualizar_pago_tutor_detalle(
    v_id_usuario, p_id_pago_tutor_detalle, p_id_pago_tutor, p_id_clase, p_horas_pasadas, p_tarifa_hora_aplicada
  );

  v_msg := 'pago_tutor_detalle actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_PAGO_TUTOR_DETALLE',
    'INFO',
    'contabilidad',
    'pago_tutor_detalle',
    jsonb_build_object('id_pago_tutor_detalle', p_id_pago_tutor_detalle),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_pago_tutor_detalle', p_id_pago_tutor_detalle));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_PAGO_TUTOR_DETALLE',
      'ERROR',
      'contabilidad',
      'pago_tutor_detalle',
      jsonb_build_object('id_pago_tutor_detalle', p_id_pago_tutor_detalle),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 524 (class 1255 OID 630899)
-- Name: api_actualizar_transaccion(bigint, bigint, date, contabilidad.tipo_transaccion, text, character varying, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_transaccion(p_id_sesion bigint, p_id_transaccion bigint, p_fecha_transaccion date, p_tipo_transaccion contabilidad.tipo_transaccion, p_sub_tipo_transaccion text, p_glosa character varying, p_id_centro_costo_mapa bigint, p_id_bien bigint, p_id_movimiento_detalle bigint, p_id_deuda bigint, p_id_pago_deuda bigint, p_id_empleado bigint, p_id_empleado_pago bigint, p_id_departamento bigint, p_id_clase_por_hora bigint, p_id_producto_educativo bigint, p_id_curso_version bigint, p_id_sucursal bigint, p_id_tienda bigint, p_id_proveedor bigint, p_id_dividendo_pago bigint, p_id_emision_titulo bigint, p_id_cliente integer, p_id_pago_tutor integer) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.TRANSACCION.REGISTRAR',
    'ACTUALIZAR_TRANSACCION'
  );

  PERFORM contabilidad.fn_actualizar_transaccion(
    v_id_usuario, p_id_transaccion, p_fecha_transaccion, p_tipo_transaccion, p_sub_tipo_transaccion, p_glosa, p_id_centro_costo_mapa, p_id_bien, p_id_movimiento_detalle, p_id_deuda, p_id_pago_deuda, p_id_empleado, p_id_empleado_pago, p_id_departamento, p_id_clase_por_hora, p_id_producto_educativo, p_id_curso_version, p_id_sucursal, p_id_tienda, p_id_proveedor, p_id_dividendo_pago, p_id_emision_titulo, p_id_cliente, p_id_pago_tutor
  );

  v_msg := 'transaccion actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_TRANSACCION',
    'INFO',
    'contabilidad',
    'transaccion',
    jsonb_build_object('id_transaccion', p_id_transaccion),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_transaccion', p_id_transaccion));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_TRANSACCION',
      'ERROR',
      'contabilidad',
      'transaccion',
      jsonb_build_object('id_transaccion', p_id_transaccion),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 540 (class 1255 OID 630903)
-- Name: api_actualizar_transaccion_movimiento_cuenta(bigint, bigint, integer, integer, double precision, double precision); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_actualizar_transaccion_movimiento_cuenta(p_id_sesion bigint, p_id_movimiento bigint, p_id_transaccion integer, p_id_cuenta integer, p_debe double precision, p_haber double precision) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.TRANSACCION.REGISTRAR',
    'ACTUALIZAR_TRANSACCION_MOVIMIENTO_CUENTA'
  );

  PERFORM contabilidad.fn_actualizar_transaccion_movimiento_cuenta(
    v_id_usuario, p_id_movimiento, p_id_transaccion, p_id_cuenta, p_debe, p_haber
  );

  v_msg := 'transaccion_movimiento_cuenta actualizado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_TRANSACCION_MOVIMIENTO_CUENTA',
    'INFO',
    'contabilidad',
    'transaccion_movimiento_cuenta',
    jsonb_build_object('id_movimiento', p_id_movimiento),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_movimiento', p_id_movimiento));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_TRANSACCION_MOVIMIENTO_CUENTA',
      'ERROR',
      'contabilidad',
      'transaccion_movimiento_cuenta',
      jsonb_build_object('id_movimiento', p_id_movimiento),
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 368 (class 1255 OID 630906)
-- Name: api_crear_archivos_transaccion(bigint, integer, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_archivos_transaccion(p_id_sesion bigint, p_id_transaccion integer, p_link_achivo text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.TRANSACCION.REGISTRAR',
    'CREAR_ARCHIVOS_TRANSACCION'
  );

  v_id := contabilidad.fn_crear_archivos_transaccion(
    v_id_usuario, p_id_transaccion, p_link_achivo
  );

  v_msg := 'archivos_transaccion creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_ARCHIVOS_TRANSACCION',
    'INFO',
    'contabilidad',
    'archivos_transaccion',
    jsonb_build_object('id_archivo', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_archivo', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_ARCHIVOS_TRANSACCION',
      'ERROR',
      'contabilidad',
      'archivos_transaccion',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 383 (class 1255 OID 630882)
-- Name: api_crear_centro_costo(bigint, character varying, character varying, bigint, bigint, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_centro_costo(p_id_sesion bigint, p_codigo character varying, p_nombre character varying, p_id_cuenta_ingreso bigint DEFAULT NULL::bigint, p_id_cuenta_costo bigint DEFAULT NULL::bigint, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CENTRO_COSTO.GESTIONAR',
    'CREAR_CENTRO_COSTO'
  );

  v_id := contabilidad.fn_crear_centro_costo(
    v_id_usuario, p_codigo, p_nombre, p_id_cuenta_ingreso, p_id_cuenta_costo, p_observaciones
  );

  v_msg := 'centro_costo creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_CENTRO_COSTO',
    'INFO',
    'contabilidad',
    'centro_costo',
    jsonb_build_object('id_centro_costo', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_centro_costo', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_CENTRO_COSTO',
      'ERROR',
      'contabilidad',
      'centro_costo',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 401 (class 1255 OID 630890)
-- Name: api_crear_centro_costo_mapa(bigint, bigint, contabilidad.tipo_costo, contabilidad.naturaleza_costo, date, date, bigint, bigint, bigint, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_centro_costo_mapa(p_id_sesion bigint, p_id_centro_costo bigint, p_tipo contabilidad.tipo_costo, p_naturaleza contabilidad.naturaleza_costo, p_vigente_desde date DEFAULT NULL::date, p_vigente_hasta date DEFAULT NULL::date, p_id_deuda bigint DEFAULT NULL::bigint, p_id_bien bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_tienda bigint DEFAULT NULL::bigint, p_id_empleado bigint DEFAULT NULL::bigint, p_id_posicion bigint DEFAULT NULL::bigint, p_id_departamento bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CENTRO_COSTO.GESTIONAR',
    'CREAR_CENTRO_COSTO_MAPA'
  );

  v_id := contabilidad.fn_crear_centro_costo_mapa(
    v_id_usuario, p_id_centro_costo, p_tipo, p_naturaleza, p_vigente_desde, p_vigente_hasta, p_id_deuda, p_id_bien, p_id_sucursal, p_id_tienda, p_id_empleado, p_id_posicion, p_id_departamento
  );

  v_msg := 'centro_costo_mapa creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_CENTRO_COSTO_MAPA',
    'INFO',
    'contabilidad',
    'centro_costo_mapa',
    jsonb_build_object('id_cc_mapa', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_cc_mapa', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_CENTRO_COSTO_MAPA',
      'ERROR',
      'contabilidad',
      'centro_costo_mapa',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 643 (class 1255 OID 630886)
-- Name: api_crear_concepto_costo(bigint, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_concepto_costo(p_id_sesion bigint, p_codigo character varying, p_nombre character varying, p_tipo_concepto character varying, p_unidad_medida character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CENTRO_COSTO.GESTIONAR',
    'CREAR_CONCEPTO_COSTO'
  );

  v_id := contabilidad.fn_crear_concepto_costo(
    v_id_usuario, p_codigo, p_nombre, p_tipo_concepto, p_unidad_medida
  );

  v_msg := 'concepto_costo creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_CONCEPTO_COSTO',
    'INFO',
    'contabilidad',
    'concepto_costo',
    jsonb_build_object('id_concepto', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_concepto', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_CONCEPTO_COSTO',
      'ERROR',
      'contabilidad',
      'concepto_costo',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 533 (class 1255 OID 778240)
-- Name: api_crear_cuenta(bigint, text, text, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_cuenta(p_id_sesion bigint, p_codigo text, p_nombre_cuenta text, p_id_grupo_cuenta bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_cuenta bigint;
  v_msg text;
BEGIN
  -- permiso + sesión (mismo patrón que tu api_crear_pago_tutor_detalle)
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTA.GESTIONAR',     -- <-- AJUSTA si tu permiso se llama distinto
    'CREAR_CUENTA'
  );

  v_id_cuenta := contabilidad.fn_crear_cuenta(
    v_id_usuario,
    p_codigo,
    p_nombre_cuenta,
    p_id_grupo_cuenta
  );

  v_msg := 'cuenta creada correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_CUENTA',
    'INFO',
    'contabilidad',
    'cuenta',
    jsonb_build_object(
      'id_cuenta', v_id_cuenta,
      'codigo', NULLIF(BTRIM(p_codigo), ''),
      'id_grupo_cuenta', p_id_grupo_cuenta
    ),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(
    TRUE,
    v_msg,
    jsonb_build_object('id_cuenta', v_id_cuenta)
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_CUENTA',
      'ERROR',
      'contabilidad',
      'cuenta',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 598 (class 1255 OID 630878)
-- Name: api_crear_cuenta(bigint, character varying, character varying, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_cuenta(p_id_sesion bigint, p_codigo character varying, p_nombre_cuenta character varying, p_id_grupo_cuenta bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.GESTIONAR',
    'CREAR_CUENTA'
  );

  v_id := contabilidad.fn_crear_cuenta(
    v_id_usuario, p_codigo, p_nombre_cuenta, p_id_grupo_cuenta
  );

  v_msg := 'cuenta creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_CUENTA',
    'INFO',
    'contabilidad',
    'cuenta',
    jsonb_build_object('id_cuenta', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_cuenta', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_CUENTA',
      'ERROR',
      'contabilidad',
      'cuenta',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 645 (class 1255 OID 630894)
-- Name: api_crear_cuenta_asignacion(bigint, text, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, smallint, date, date); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_cuenta_asignacion(p_id_sesion bigint, p_entidad_tipo text, p_id_cuenta bigint, p_id_empleado bigint DEFAULT NULL::bigint, p_id_persona_estudiante bigint DEFAULT NULL::bigint, p_id_persona_tutor bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_edificio bigint DEFAULT NULL::bigint, p_id_tienda bigint DEFAULT NULL::bigint, p_id_bien bigint DEFAULT NULL::bigint, p_id_deuda bigint DEFAULT NULL::bigint, p_id_proveedor bigint DEFAULT NULL::bigint, p_id_departamento bigint DEFAULT NULL::bigint, p_prioridad smallint DEFAULT NULL::smallint, p_vigente_desde date DEFAULT NULL::date, p_vigente_hasta date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.GESTIONAR',
    'CREAR_CUENTA_ASIGNACION'
  );

  v_id := contabilidad.fn_crear_cuenta_asignacion(
    v_id_usuario, p_entidad_tipo, p_id_cuenta, p_id_empleado, p_id_persona_estudiante, p_id_persona_tutor, p_id_sucursal, p_id_edificio, p_id_tienda, p_id_bien, p_id_deuda, p_id_proveedor, p_id_departamento, p_prioridad, p_vigente_desde, p_vigente_hasta
  );

  v_msg := 'cuenta_asignacion creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_CUENTA_ASIGNACION',
    'INFO',
    'contabilidad',
    'cuenta_asignacion',
    jsonb_build_object('id_cuenta_asignacion', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_cuenta_asignacion', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_CUENTA_ASIGNACION',
      'ERROR',
      'contabilidad',
      'cuenta_asignacion',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 414 (class 1255 OID 630874)
-- Name: api_crear_grupo_cuenta(bigint, character varying, character varying, character varying, character varying, bigint, character varying, smallint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_grupo_cuenta(p_id_sesion bigint, p_codigo character varying, p_nombre character varying, p_tipo character varying, p_sub_tipo character varying, p_id_parent bigint DEFAULT NULL::bigint, p_sub_grupo character varying DEFAULT NULL::character varying, p_orden_reporte smallint DEFAULT NULL::smallint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.GESTIONAR',
    'CREAR_GRUPO_CUENTA'
  );

  v_id := contabilidad.fn_crear_grupo_cuenta(
    v_id_usuario, p_codigo, p_nombre, p_tipo, p_sub_tipo, p_id_parent, p_sub_grupo, p_orden_reporte
  );

  v_msg := 'grupo_cuenta creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_GRUPO_CUENTA',
    'INFO',
    'contabilidad',
    'grupo_cuenta',
    jsonb_build_object('id_grupo_cuenta', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_grupo_cuenta', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_GRUPO_CUENTA',
      'ERROR',
      'contabilidad',
      'grupo_cuenta',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 391 (class 1255 OID 630910)
-- Name: api_crear_pago_tutor(bigint, bigint, timestamp with time zone, timestamp with time zone, text, numeric, numeric, numeric, timestamp without time zone, timestamp without time zone, text, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_pago_tutor(p_id_sesion bigint, p_id_tutor bigint, p_periodo_inicio timestamp with time zone, p_periodo_fin timestamp with time zone DEFAULT NULL::timestamp with time zone, p_estado_pago text DEFAULT NULL::text, p_subtotal numeric DEFAULT NULL::numeric, p_ajustes numeric DEFAULT NULL::numeric, p_total numeric DEFAULT NULL::numeric, p_fecha_aprobacion timestamp without time zone DEFAULT NULL::timestamp without time zone, p_fecha_pago timestamp without time zone DEFAULT NULL::timestamp without time zone, p_referencia_pago text DEFAULT NULL::text, p_observacion text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.PAGO_TUTOR.GESTIONAR',
    'CREAR_PAGO_TUTOR'
  );

  v_id := contabilidad.fn_crear_pago_tutor(
    v_id_usuario, p_id_tutor, p_periodo_inicio, p_periodo_fin, p_estado_pago, p_subtotal, p_ajustes, p_total, p_fecha_aprobacion, p_fecha_pago, p_referencia_pago, p_observacion
  );

  v_msg := 'pago_tutor creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_PAGO_TUTOR',
    'INFO',
    'contabilidad',
    'pago_tutor',
    jsonb_build_object('id_pago_tutor', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_pago_tutor', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_PAGO_TUTOR',
      'ERROR',
      'contabilidad',
      'pago_tutor',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 363 (class 1255 OID 630914)
-- Name: api_crear_pago_tutor_detalle(bigint, bigint, bigint, integer, numeric); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_pago_tutor_detalle(p_id_sesion bigint, p_id_pago_tutor bigint, p_id_clase bigint, p_horas_pasadas integer, p_tarifa_hora_aplicada numeric) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.PAGO_TUTOR.GESTIONAR',
    'CREAR_PAGO_TUTOR_DETALLE'
  );

  v_id := contabilidad.fn_crear_pago_tutor_detalle(
    v_id_usuario, p_id_pago_tutor, p_id_clase, p_horas_pasadas, p_tarifa_hora_aplicada
  );

  v_msg := 'pago_tutor_detalle creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_PAGO_TUTOR_DETALLE',
    'INFO',
    'contabilidad',
    'pago_tutor_detalle',
    jsonb_build_object('id_pago_tutor_detalle', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_pago_tutor_detalle', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_PAGO_TUTOR_DETALLE',
      'ERROR',
      'contabilidad',
      'pago_tutor_detalle',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 411 (class 1255 OID 630898)
-- Name: api_crear_transaccion(bigint, contabilidad.tipo_transaccion, date, text, character varying, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_transaccion(p_id_sesion bigint, p_tipo_transaccion contabilidad.tipo_transaccion, p_fecha_transaccion date DEFAULT NULL::date, p_sub_tipo_transaccion text DEFAULT NULL::text, p_glosa character varying DEFAULT NULL::character varying, p_id_centro_costo_mapa bigint DEFAULT NULL::bigint, p_id_bien bigint DEFAULT NULL::bigint, p_id_movimiento_detalle bigint DEFAULT NULL::bigint, p_id_deuda bigint DEFAULT NULL::bigint, p_id_pago_deuda bigint DEFAULT NULL::bigint, p_id_empleado bigint DEFAULT NULL::bigint, p_id_empleado_pago bigint DEFAULT NULL::bigint, p_id_departamento bigint DEFAULT NULL::bigint, p_id_clase_por_hora bigint DEFAULT NULL::bigint, p_id_producto_educativo bigint DEFAULT NULL::bigint, p_id_curso_version bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_tienda bigint DEFAULT NULL::bigint, p_id_proveedor bigint DEFAULT NULL::bigint, p_id_dividendo_pago bigint DEFAULT NULL::bigint, p_id_emision_titulo bigint DEFAULT NULL::bigint, p_id_cliente integer DEFAULT NULL::integer, p_id_pago_tutor integer DEFAULT NULL::integer) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.TRANSACCION.REGISTRAR',
    'CREAR_TRANSACCION'
  );

  v_id := contabilidad.fn_crear_transaccion(
    v_id_usuario, p_tipo_transaccion, p_fecha_transaccion, p_sub_tipo_transaccion, p_glosa, p_id_centro_costo_mapa, p_id_bien, p_id_movimiento_detalle, p_id_deuda, p_id_pago_deuda, p_id_empleado, p_id_empleado_pago, p_id_departamento, p_id_clase_por_hora, p_id_producto_educativo, p_id_curso_version, p_id_sucursal, p_id_tienda, p_id_proveedor, p_id_dividendo_pago, p_id_emision_titulo, p_id_cliente, p_id_pago_tutor
  );

  v_msg := 'transaccion creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_TRANSACCION',
    'INFO',
    'contabilidad',
    'transaccion',
    jsonb_build_object('id_transaccion', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_transaccion', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_TRANSACCION',
      'ERROR',
      'contabilidad',
      'transaccion',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 596 (class 1255 OID 630902)
-- Name: api_crear_transaccion_movimiento_cuenta(bigint, integer, integer, double precision, double precision); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_crear_transaccion_movimiento_cuenta(p_id_sesion bigint, p_id_transaccion integer, p_id_cuenta integer, p_debe double precision DEFAULT NULL::double precision, p_haber double precision DEFAULT NULL::double precision) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.TRANSACCION.REGISTRAR',
    'CREAR_TRANSACCION_MOVIMIENTO_CUENTA'
  );

  v_id := contabilidad.fn_crear_transaccion_movimiento_cuenta(
    v_id_usuario, p_id_transaccion, p_id_cuenta, p_debe, p_haber
  );

  v_msg := 'transaccion_movimiento_cuenta creado correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_TRANSACCION_MOVIMIENTO_CUENTA',
    'INFO',
    'contabilidad',
    'transaccion_movimiento_cuenta',
    jsonb_build_object('id_movimiento', v_id),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_movimiento', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_TRANSACCION_MOVIMIENTO_CUENTA',
      'ERROR',
      'contabilidad',
      'transaccion_movimiento_cuenta',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 402 (class 1255 OID 786439)
-- Name: api_listar_cuentas(bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_listar_cuentas(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_items jsonb;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTA.VER',      -- AJUSTA a tu permiso real si difiere
    'LISTAR_CUENTAS'
  );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
  INTO v_items
  FROM contabilidad.fn_listar_cuentas(
    v_id_usuario,
    p_id_sesion,
    p_limit,
    p_offset
  ) AS t;

  v_msg := 'cuentas listadas correctamente';

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'LISTAR_CUENTAS',
    'INFO',
    'contabilidad',
    'cuenta',
    jsonb_build_object(
      'limit', p_limit,
      'offset', p_offset,
      'count', jsonb_array_length(v_items)
    ),
    TRUE,
    NULL
  );

  RETURN seguridad.fn_api_result(
    TRUE,
    v_msg,
    jsonb_build_object(
      'items', v_items,
      'limit', p_limit,
      'offset', p_offset,
      'count', jsonb_array_length(v_items)
    )
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'LISTAR_CUENTAS',
      'ERROR',
      'contabilidad',
      'cuenta',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 629 (class 1255 OID 761857)
-- Name: api_listar_grupos_cuenta(bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.api_listar_grupos_cuenta(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_items jsonb;
  v_msg text;
BEGIN
  -- 1) Validar sesión + permiso (AJUSTA el permiso si tu estándar usa otro string)
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CONTAB.CUENTAS.VER',     -- <--- CAMBIA si corresponde
    'LISTAR_GRUPOS_CUENTA'
  );

  -- 2) Ejecutar la función “core” y empaquetar resultado como JSON array
  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
  INTO v_items
  FROM contabilidad.fn_listar_grupos_cuenta(
    v_id_usuario::integer,    -- actor_user_id (cast por tu firma actual)
    p_id_sesion::integer,     -- id_sesion (cast por tu firma actual)
    p_limit,
    p_offset
  ) AS t;

  v_msg := 'grupos_cuenta listados correctamente';

  -- 3) Log de auditoría (mismo patrón)
  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'LISTAR_GRUPOS_CUENTA',
    'INFO',
    'contabilidad',
    'grupo_cuenta',
    jsonb_build_object(
      'limit', p_limit,
      'offset', p_offset,
      'count', jsonb_array_length(v_items)
    ),
    TRUE,
    NULL
  );

  -- 4) Respuesta API estándar
  RETURN seguridad.fn_api_result(
    TRUE,
    v_msg,
    jsonb_build_object(
      'items', v_items,
      'limit', p_limit,
      'offset', p_offset,
      'count', jsonb_array_length(v_items)
    )
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'LISTAR_GRUPOS_CUENTA',
      'ERROR',
      'contabilidad',
      'grupo_cuenta',
      NULL,
      FALSE,
      jsonb_build_object('error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 502 (class 1255 OID 630905)
-- Name: fn_actualizar_archivos_transaccion(bigint, bigint, integer, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_archivos_transaccion(p_id_actor bigint, p_id_archivo bigint, p_id_transaccion integer, p_link_achivo text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_archivo IS NULL THEN
    RAISE EXCEPTION 'id_archivo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_transaccion IS NULL THEN
    RAISE EXCEPTION 'id_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_link_achivo::text),'') = '' THEN
    RAISE EXCEPTION 'link_achivo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.archivos_transaccion
     SET id_transaccion = p_id_transaccion,
         link_achivo = p_link_achivo,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_archivo = p_id_archivo AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'archivos_transaccion no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 432 (class 1255 OID 630881)
-- Name: fn_actualizar_centro_costo(bigint, bigint, character varying, character varying, bigint, bigint, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_centro_costo(p_id_actor bigint, p_id_centro_costo bigint, p_codigo character varying, p_nombre character varying, p_id_cuenta_ingreso bigint, p_id_cuenta_costo bigint, p_observaciones text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_centro_costo IS NULL THEN
    RAISE EXCEPTION 'id_centro_costo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.centro_costo
     SET codigo = p_codigo,
         nombre = p_nombre,
         id_cuenta_ingreso = p_id_cuenta_ingreso,
         id_cuenta_costo = p_id_cuenta_costo,
         observaciones = p_observaciones,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_centro_costo = p_id_centro_costo AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'centro_costo no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 534 (class 1255 OID 630889)
-- Name: fn_actualizar_centro_costo_mapa(bigint, bigint, bigint, contabilidad.tipo_costo, contabilidad.naturaleza_costo, date, date, bigint, bigint, bigint, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_centro_costo_mapa(p_id_actor bigint, p_id_cc_mapa bigint, p_id_centro_costo bigint, p_tipo contabilidad.tipo_costo, p_naturaleza contabilidad.naturaleza_costo, p_vigente_desde date, p_vigente_hasta date, p_id_deuda bigint, p_id_bien bigint, p_id_sucursal bigint, p_id_tienda bigint, p_id_empleado bigint, p_id_posicion bigint, p_id_departamento bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_cc_mapa IS NULL THEN
    RAISE EXCEPTION 'id_cc_mapa es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_centro_costo IS NULL THEN
    RAISE EXCEPTION 'id_centro_costo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_tipo IS NULL THEN
    RAISE EXCEPTION 'tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_naturaleza IS NULL THEN
    RAISE EXCEPTION 'naturaleza es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.centro_costo_mapa
     SET id_centro_costo = p_id_centro_costo,
         tipo = p_tipo,
         naturaleza = p_naturaleza,
         vigente_desde = p_vigente_desde,
         vigente_hasta = p_vigente_hasta,
         id_deuda = p_id_deuda,
         id_bien = p_id_bien,
         id_sucursal = p_id_sucursal,
         id_tienda = p_id_tienda,
         id_empleado = p_id_empleado,
         id_posicion = p_id_posicion,
         id_departamento = p_id_departamento,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_cc_mapa = p_id_cc_mapa AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'centro_costo_mapa no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 631 (class 1255 OID 630885)
-- Name: fn_actualizar_concepto_costo(bigint, bigint, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_concepto_costo(p_id_actor bigint, p_id_concepto bigint, p_codigo character varying, p_nombre character varying, p_tipo_concepto character varying, p_unidad_medida character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_concepto IS NULL THEN
    RAISE EXCEPTION 'id_concepto es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tipo_concepto::text),'') = '' THEN
    RAISE EXCEPTION 'tipo_concepto es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.concepto_costo
     SET codigo = p_codigo,
         nombre = p_nombre,
         tipo_concepto = p_tipo_concepto,
         unidad_medida = p_unidad_medida,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_concepto = p_id_concepto AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'concepto_costo no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 563 (class 1255 OID 630877)
-- Name: fn_actualizar_cuenta(bigint, bigint, character varying, character varying, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_cuenta(p_id_actor bigint, p_id_cuenta bigint, p_codigo character varying, p_nombre_cuenta character varying, p_id_grupo_cuenta bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre_cuenta::text),'') = '' THEN
    RAISE EXCEPTION 'nombre_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_grupo_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_grupo_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.cuenta
     SET codigo = p_codigo,
         nombre_cuenta = p_nombre_cuenta,
         id_grupo_cuenta = p_id_grupo_cuenta,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_cuenta = p_id_cuenta AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'cuenta no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 512 (class 1255 OID 630893)
-- Name: fn_actualizar_cuenta_asignacion(bigint, bigint, text, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, smallint, date, date); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_cuenta_asignacion(p_id_actor bigint, p_id_cuenta_asignacion bigint, p_entidad_tipo text, p_id_empleado bigint, p_id_persona_estudiante bigint, p_id_persona_tutor bigint, p_id_sucursal bigint, p_id_edificio bigint, p_id_tienda bigint, p_id_bien bigint, p_id_deuda bigint, p_id_proveedor bigint, p_id_departamento bigint, p_id_cuenta bigint, p_prioridad smallint, p_vigente_desde date, p_vigente_hasta date) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_cuenta_asignacion IS NULL THEN
    RAISE EXCEPTION 'id_cuenta_asignacion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_entidad_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'entidad_tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.cuenta_asignacion
     SET entidad_tipo = p_entidad_tipo,
         id_empleado = p_id_empleado,
         id_persona_estudiante = p_id_persona_estudiante,
         id_persona_tutor = p_id_persona_tutor,
         id_sucursal = p_id_sucursal,
         id_edificio = p_id_edificio,
         id_tienda = p_id_tienda,
         id_bien = p_id_bien,
         id_deuda = p_id_deuda,
         id_proveedor = p_id_proveedor,
         id_departamento = p_id_departamento,
         id_cuenta = p_id_cuenta,
         prioridad = p_prioridad,
         vigente_desde = p_vigente_desde,
         vigente_hasta = p_vigente_hasta,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_cuenta_asignacion = p_id_cuenta_asignacion AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'cuenta_asignacion no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 571 (class 1255 OID 630873)
-- Name: fn_actualizar_grupo_cuenta(bigint, bigint, character varying, character varying, bigint, character varying, character varying, character varying, smallint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_grupo_cuenta(p_id_actor bigint, p_id_grupo_cuenta bigint, p_codigo character varying, p_nombre character varying, p_id_parent bigint, p_tipo character varying, p_sub_tipo character varying, p_sub_grupo character varying, p_orden_reporte smallint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_grupo_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_grupo_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_sub_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'sub_tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.grupo_cuenta
     SET codigo = p_codigo,
         nombre = p_nombre,
         id_parent = p_id_parent,
         tipo = p_tipo,
         sub_tipo = p_sub_tipo,
         sub_grupo = p_sub_grupo,
         orden_reporte = p_orden_reporte,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_grupo_cuenta = p_id_grupo_cuenta AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'grupo_cuenta no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 352 (class 1255 OID 630909)
-- Name: fn_actualizar_pago_tutor(bigint, bigint, bigint, timestamp with time zone, timestamp with time zone, text, numeric, numeric, numeric, timestamp without time zone, timestamp without time zone, text, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_pago_tutor(p_id_actor bigint, p_id_pago_tutor bigint, p_id_tutor bigint, p_periodo_inicio timestamp with time zone, p_periodo_fin timestamp with time zone, p_estado_pago text, p_subtotal numeric, p_ajustes numeric, p_total numeric, p_fecha_aprobacion timestamp without time zone, p_fecha_pago timestamp without time zone, p_referencia_pago text, p_observacion text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_pago_tutor IS NULL THEN
    RAISE EXCEPTION 'id_pago_tutor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_tutor IS NULL THEN
    RAISE EXCEPTION 'id_tutor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_periodo_inicio IS NULL THEN
    RAISE EXCEPTION 'periodo_inicio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.pago_tutor
     SET id_tutor = p_id_tutor,
         periodo_inicio = p_periodo_inicio,
         periodo_fin = p_periodo_fin,
         estado_pago = p_estado_pago,
         subtotal = p_subtotal,
         ajustes = p_ajustes,
         total = p_total,
         fecha_aprobacion = p_fecha_aprobacion,
         fecha_pago = p_fecha_pago,
         referencia_pago = p_referencia_pago,
         observacion = p_observacion,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1
   WHERE id_pago_tutor = p_id_pago_tutor AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'pago_tutor no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 419 (class 1255 OID 630913)
-- Name: fn_actualizar_pago_tutor_detalle(bigint, bigint, bigint, bigint, integer, numeric); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_pago_tutor_detalle(p_id_actor bigint, p_id_pago_tutor_detalle bigint, p_id_pago_tutor bigint, p_id_clase bigint, p_horas_pasadas integer, p_tarifa_hora_aplicada numeric) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_pago_tutor_detalle IS NULL THEN
    RAISE EXCEPTION 'id_pago_tutor_detalle es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_pago_tutor IS NULL THEN
    RAISE EXCEPTION 'id_pago_tutor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_clase IS NULL THEN
    RAISE EXCEPTION 'id_clase es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_horas_pasadas IS NULL THEN
    RAISE EXCEPTION 'horas_pasadas es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_tarifa_hora_aplicada IS NULL THEN
    RAISE EXCEPTION 'tarifa_hora_aplicada es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.pago_tutor_detalle
     SET id_pago_tutor = p_id_pago_tutor,
         id_clase = p_id_clase,
         horas_pasadas = p_horas_pasadas,
         tarifa_hora_aplicada = p_tarifa_hora_aplicada
   WHERE id_pago_tutor_detalle = p_id_pago_tutor_detalle;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'pago_tutor_detalle no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 573 (class 1255 OID 630897)
-- Name: fn_actualizar_transaccion(bigint, bigint, date, contabilidad.tipo_transaccion, text, character varying, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_transaccion(p_id_actor bigint, p_id_transaccion bigint, p_fecha_transaccion date, p_tipo_transaccion contabilidad.tipo_transaccion, p_sub_tipo_transaccion text, p_glosa character varying, p_id_centro_costo_mapa bigint, p_id_bien bigint, p_id_movimiento_detalle bigint, p_id_deuda bigint, p_id_pago_deuda bigint, p_id_empleado bigint, p_id_empleado_pago bigint, p_id_departamento bigint, p_id_clase_por_hora bigint, p_id_producto_educativo bigint, p_id_curso_version bigint, p_id_sucursal bigint, p_id_tienda bigint, p_id_proveedor bigint, p_id_dividendo_pago bigint, p_id_emision_titulo bigint, p_id_cliente integer, p_id_pago_tutor integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_transaccion IS NULL THEN
    RAISE EXCEPTION 'id_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_tipo_transaccion IS NULL THEN
    RAISE EXCEPTION 'tipo_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.transaccion
     SET fecha_transaccion = p_fecha_transaccion,
         tipo_transaccion = p_tipo_transaccion,
         sub_tipo_transaccion = p_sub_tipo_transaccion,
         glosa = p_glosa,
         id_centro_costo_mapa = p_id_centro_costo_mapa,
         id_bien = p_id_bien,
         id_movimiento_detalle = p_id_movimiento_detalle,
         id_deuda = p_id_deuda,
         id_pago_deuda = p_id_pago_deuda,
         id_empleado = p_id_empleado,
         id_empleado_pago = p_id_empleado_pago,
         id_departamento = p_id_departamento,
         id_clase_por_hora = p_id_clase_por_hora,
         id_producto_educativo = p_id_producto_educativo,
         id_curso_version = p_id_curso_version,
         id_sucursal = p_id_sucursal,
         id_tienda = p_id_tienda,
         id_proveedor = p_id_proveedor,
         id_dividendo_pago = p_id_dividendo_pago,
         id_emision_titulo = p_id_emision_titulo,
         id_cliente = p_id_cliente,
         id_pago_tutor = p_id_pago_tutor,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_transaccion = p_id_transaccion AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'transaccion no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 365 (class 1255 OID 630901)
-- Name: fn_actualizar_transaccion_movimiento_cuenta(bigint, bigint, integer, integer, double precision, double precision); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_actualizar_transaccion_movimiento_cuenta(p_id_actor bigint, p_id_movimiento bigint, p_id_transaccion integer, p_id_cuenta integer, p_debe double precision, p_haber double precision) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_movimiento IS NULL THEN
    RAISE EXCEPTION 'id_movimiento es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_transaccion IS NULL THEN
    RAISE EXCEPTION 'id_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  UPDATE contabilidad.transaccion_movimiento_cuenta
     SET id_transaccion = p_id_transaccion,
         id_cuenta = p_id_cuenta,
         debe = p_debe,
         haber = p_haber,
         fecha_modificacion = now(),
         version_registro = coalesce(version_registro,1) + 1,
         id_usuario_modificacion = p_id_actor
   WHERE id_movimiento = p_id_movimiento AND estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'transaccion_movimiento_cuenta no encontrado o inactivo' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 484 (class 1255 OID 393280)
-- Name: fn_aprobar_pago_tutor(bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_aprobar_pago_tutor(p_id_pago_tutor bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE contabilidad.pago_tutor
  SET estado = 'APROBADO', fecha_aprobacion = now(), actualizado_en = now()
  WHERE id_pago_tutor = p_id_pago_tutor
    AND estado = 'BORRADOR';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se pudo aprobar: el pago no existe o no está en BORRADOR.';
  END IF;
END $$;


--
-- TOC entry 359 (class 1255 OID 49152)
-- Name: fn_audit_bu_simple(); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_audit_bu_simple() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.fecha_modificacion := now();
  NEW.version_registro   := COALESCE(OLD.version_registro, 1) + 1;
  RETURN NEW;
END$$;


--
-- TOC entry 541 (class 1255 OID 630904)
-- Name: fn_crear_archivos_transaccion(bigint, integer, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_archivos_transaccion(p_id_actor bigint, p_id_transaccion integer, p_link_achivo text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_transaccion IS NULL THEN
    RAISE EXCEPTION 'id_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_link_achivo::text),'') = '' THEN
    RAISE EXCEPTION 'link_achivo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.archivos_transaccion (
    id_transaccion, link_achivo, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_id_transaccion, p_link_achivo, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_archivo INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 346 (class 1255 OID 630880)
-- Name: fn_crear_centro_costo(bigint, character varying, character varying, bigint, bigint, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_centro_costo(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_id_cuenta_ingreso bigint DEFAULT NULL::bigint, p_id_cuenta_costo bigint DEFAULT NULL::bigint, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.centro_costo (
    codigo, nombre, id_cuenta_ingreso, id_cuenta_costo, observaciones, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_codigo, p_nombre, p_id_cuenta_ingreso, p_id_cuenta_costo, p_observaciones, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_centro_costo INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 562 (class 1255 OID 630888)
-- Name: fn_crear_centro_costo_mapa(bigint, bigint, contabilidad.tipo_costo, contabilidad.naturaleza_costo, date, date, bigint, bigint, bigint, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_centro_costo_mapa(p_id_actor bigint, p_id_centro_costo bigint, p_tipo contabilidad.tipo_costo, p_naturaleza contabilidad.naturaleza_costo, p_vigente_desde date DEFAULT NULL::date, p_vigente_hasta date DEFAULT NULL::date, p_id_deuda bigint DEFAULT NULL::bigint, p_id_bien bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_tienda bigint DEFAULT NULL::bigint, p_id_empleado bigint DEFAULT NULL::bigint, p_id_posicion bigint DEFAULT NULL::bigint, p_id_departamento bigint DEFAULT NULL::bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_centro_costo IS NULL THEN
    RAISE EXCEPTION 'id_centro_costo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_tipo IS NULL THEN
    RAISE EXCEPTION 'tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_naturaleza IS NULL THEN
    RAISE EXCEPTION 'naturaleza es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.centro_costo_mapa (
    id_centro_costo, tipo, naturaleza, vigente_desde, vigente_hasta, id_deuda, id_bien, id_sucursal, id_tienda, id_empleado, id_posicion, id_departamento, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_id_centro_costo, p_tipo, p_naturaleza, coalesce(p_vigente_desde, CURRENT_DATE), p_vigente_hasta, p_id_deuda, p_id_bien, p_id_sucursal, p_id_tienda, p_id_empleado, p_id_posicion, p_id_departamento, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_cc_mapa INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 467 (class 1255 OID 630884)
-- Name: fn_crear_concepto_costo(bigint, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_concepto_costo(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_tipo_concepto character varying, p_unidad_medida character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tipo_concepto::text),'') = '' THEN
    RAISE EXCEPTION 'tipo_concepto es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.concepto_costo (
    codigo, nombre, tipo_concepto, unidad_medida, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_codigo, p_nombre, p_tipo_concepto, p_unidad_medida, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_concepto INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 416 (class 1255 OID 770048)
-- Name: fn_crear_cuenta(bigint, text, text, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_cuenta(p_actor_user_id bigint, p_codigo text, p_nombre_cuenta text, p_id_grupo_cuenta bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_cuenta bigint;
  v_codigo text;
  v_nombre text;
BEGIN
  -- normalizar/validar mínimos
  v_codigo := NULLIF(BTRIM(p_codigo), '');
  v_nombre := NULLIF(BTRIM(p_nombre_cuenta), '');

  IF v_codigo IS NULL THEN
    RAISE EXCEPTION 'El código es requerido';
  END IF;

  IF v_nombre IS NULL THEN
    RAISE EXCEPTION 'El nombre de cuenta es requerido';
  END IF;

  IF p_id_grupo_cuenta IS NULL THEN
    RAISE EXCEPTION 'El grupo de cuenta es requerido';
  END IF;

  -- validar que el grupo exista y esté activo (ajusta nombres si tu tabla usa otro campo)
  PERFORM 1
  FROM contabilidad.grupo_cuenta gc
  WHERE gc.id_grupo_cuenta = p_id_grupo_cuenta
    AND gc.estado_registro = 'Activo';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Grupo de cuenta inválido o inactivo (id_grupo_cuenta=%)', p_id_grupo_cuenta;
  END IF;

  -- evitar duplicados de código en activos (recomendado)
  PERFORM 1
  FROM contabilidad.cuenta c
  WHERE c.codigo = v_codigo
    AND c.estado_registro = 'Activo';

  IF FOUND THEN
    RAISE EXCEPTION 'Ya existe una cuenta activa con el código: %', v_codigo;
  END IF;

  -- insertar: solo setear los 3 campos + defaults del resto
  INSERT INTO contabilidad.cuenta (
    codigo,
    nombre_cuenta,
    id_grupo_cuenta,
    estado_registro,
    fecha_registro,
    fecha_modificacion,
    version_registro,
    id_usuario_creador,
    id_usuario_modificacion
  )
  VALUES (
    v_codigo,
    v_nombre,
    p_id_grupo_cuenta,
    'Activo',
    NOW(),
    NOW(),
    1,
    p_actor_user_id,
    NULL
  )
  RETURNING id_cuenta INTO v_id_cuenta;

  RETURN v_id_cuenta;
END;
$$;


--
-- TOC entry 623 (class 1255 OID 630876)
-- Name: fn_crear_cuenta(bigint, character varying, character varying, bigint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_cuenta(p_id_actor bigint, p_codigo character varying, p_nombre_cuenta character varying, p_id_grupo_cuenta bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre_cuenta::text),'') = '' THEN
    RAISE EXCEPTION 'nombre_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_grupo_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_grupo_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.cuenta (
    codigo, nombre_cuenta, id_grupo_cuenta, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_codigo, p_nombre_cuenta, p_id_grupo_cuenta, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_cuenta INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 626 (class 1255 OID 630892)
-- Name: fn_crear_cuenta_asignacion(bigint, text, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, smallint, date, date); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_cuenta_asignacion(p_id_actor bigint, p_entidad_tipo text, p_id_cuenta bigint, p_id_empleado bigint DEFAULT NULL::bigint, p_id_persona_estudiante bigint DEFAULT NULL::bigint, p_id_persona_tutor bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_edificio bigint DEFAULT NULL::bigint, p_id_tienda bigint DEFAULT NULL::bigint, p_id_bien bigint DEFAULT NULL::bigint, p_id_deuda bigint DEFAULT NULL::bigint, p_id_proveedor bigint DEFAULT NULL::bigint, p_id_departamento bigint DEFAULT NULL::bigint, p_prioridad smallint DEFAULT NULL::smallint, p_vigente_desde date DEFAULT NULL::date, p_vigente_hasta date DEFAULT NULL::date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_entidad_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'entidad_tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.cuenta_asignacion (
    entidad_tipo, id_cuenta, id_empleado, id_persona_estudiante, id_persona_tutor, id_sucursal, id_edificio, id_tienda, id_bien, id_deuda, id_proveedor, id_departamento, prioridad, vigente_desde, vigente_hasta, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_entidad_tipo, p_id_cuenta, p_id_empleado, p_id_persona_estudiante, p_id_persona_tutor, p_id_sucursal, p_id_edificio, p_id_tienda, p_id_bien, p_id_deuda, p_id_proveedor, p_id_departamento, coalesce(p_prioridad, 1), coalesce(p_vigente_desde, CURRENT_DATE), p_vigente_hasta, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_cuenta_asignacion INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 507 (class 1255 OID 630872)
-- Name: fn_crear_grupo_cuenta(bigint, character varying, character varying, character varying, character varying, bigint, character varying, smallint); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_grupo_cuenta(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_tipo character varying, p_sub_tipo character varying, p_id_parent bigint DEFAULT NULL::bigint, p_sub_grupo character varying DEFAULT NULL::character varying, p_orden_reporte smallint DEFAULT NULL::smallint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_sub_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'sub_tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.grupo_cuenta (
    codigo, nombre, tipo, sub_tipo, id_parent, sub_grupo, orden_reporte, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_codigo, p_nombre, p_tipo, p_sub_tipo, p_id_parent, p_sub_grupo, p_orden_reporte, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_grupo_cuenta INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 470 (class 1255 OID 638976)
-- Name: fn_crear_movimiento_cuenta_batch(bigint, bigint, jsonb, boolean); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_movimiento_cuenta_batch(p_id_usuario_creador bigint, p_id_transaccion bigint, p_lineas jsonb, p_validar_cuadre boolean DEFAULT true) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_total_debe  numeric := 0;
  v_total_haber numeric := 0;
  v_cant        int := 0;

  v_ids jsonb;
BEGIN
  -- -------------------------
  -- Validaciones base
  -- -------------------------
  IF p_id_usuario_creador IS NULL THEN
    RAISE EXCEPTION 'id_usuario_creador es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_id_transaccion IS NULL THEN
    RAISE EXCEPTION 'id_transaccion es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_lineas IS NULL OR jsonb_typeof(p_lineas) <> 'array' OR jsonb_array_length(p_lineas) = 0 THEN
    RAISE EXCEPTION 'p_lineas debe ser un JSON array no vacío'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- -------------------------
  -- Métricas: cant / totales
  -- -------------------------
  SELECT
    COUNT(*)::int,
    COALESCE(SUM(COALESCE(debe, 0)), 0),
    COALESCE(SUM(COALESCE(haber, 0)), 0)
  INTO
    v_cant,
    v_total_debe,
    v_total_haber
  FROM jsonb_to_recordset(p_lineas) AS x(
    id_cuenta bigint,
    debe      numeric,
    haber     numeric
  );

  IF v_cant = 0 THEN
    RAISE EXCEPTION 'p_lineas no contiene filas válidas'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- -------------------------
  -- Reglas por línea
  -- -------------------------

  -- id_cuenta obligatorio
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(id_cuenta bigint, debe numeric, haber numeric)
    WHERE id_cuenta IS NULL
  ) THEN
    RAISE EXCEPTION 'Todas las líneas deben tener id_cuenta'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- no negativos
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(id_cuenta bigint, debe numeric, haber numeric)
    WHERE COALESCE(debe,0) < 0 OR COALESCE(haber,0) < 0
  ) THEN
    RAISE EXCEPTION 'No se permiten montos negativos (debe/haber)'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- no debe y haber a la vez
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(id_cuenta bigint, debe numeric, haber numeric)
    WHERE COALESCE(debe,0) > 0 AND COALESCE(haber,0) > 0
  ) THEN
    RAISE EXCEPTION 'Una línea no puede tener debe y haber > 0 a la vez'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- al menos uno > 0
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(id_cuenta bigint, debe numeric, haber numeric)
    WHERE COALESCE(debe,0) = 0 AND COALESCE(haber,0) = 0
  ) THEN
    RAISE EXCEPTION 'Cada línea debe tener debe o haber > 0'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Cuadre contable (opcional)
  IF p_validar_cuadre AND v_total_debe <> v_total_haber THEN
    RAISE EXCEPTION 'Transacción no cuadra: total_debe=% total_haber=%',
      v_total_debe, v_total_haber
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- -------------------------
  -- Insert en bloque (atomic)
  -- -------------------------
  WITH items AS (
    SELECT
      x.id_cuenta::bigint                       AS id_cuenta,
      COALESCE(x.debe, 0)::float8               AS debe,
      COALESCE(x.haber, 0)::float8              AS haber
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_cuenta bigint,
      debe      numeric,
      haber     numeric
    )
  ),
  ins AS (
    INSERT INTO contabilidad.transaccion_movimiento_cuenta (
      id_transaccion,
      id_cuenta,
      debe,
      haber,
      estado_registro,
      fecha_registro,
      fecha_modificacion,
      version_registro,
      id_usuario_creador,
      id_usuario_modificacion
    )
    SELECT
      p_id_transaccion,
      i.id_cuenta,
      i.debe,
      i.haber,
      'ACTIVO',
      now(),
      NULL,
      1,
      p_id_usuario_creador,
      NULL
    FROM items i
    RETURNING id_movimiento
  )
  SELECT COALESCE(jsonb_agg(id_movimiento), '[]'::jsonb)
  INTO v_ids
  FROM ins;

  RETURN jsonb_build_object(
    'ok', true,
    'id_transaccion', p_id_transaccion,
    'insertados', jsonb_array_length(v_ids),
    'total_debe', v_total_debe,
    'total_haber', v_total_haber,
    'ids_movimiento', v_ids
  );
END;
$$;


--
-- TOC entry 518 (class 1255 OID 630908)
-- Name: fn_crear_pago_tutor(bigint, bigint, timestamp with time zone, timestamp with time zone, text, numeric, numeric, numeric, timestamp without time zone, timestamp without time zone, text, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_pago_tutor(p_id_actor bigint, p_id_tutor bigint, p_periodo_inicio timestamp with time zone, p_periodo_fin timestamp with time zone DEFAULT NULL::timestamp with time zone, p_estado_pago text DEFAULT NULL::text, p_subtotal numeric DEFAULT NULL::numeric, p_ajustes numeric DEFAULT NULL::numeric, p_total numeric DEFAULT NULL::numeric, p_fecha_aprobacion timestamp without time zone DEFAULT NULL::timestamp without time zone, p_fecha_pago timestamp without time zone DEFAULT NULL::timestamp without time zone, p_referencia_pago text DEFAULT NULL::text, p_observacion text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_tutor IS NULL THEN
    RAISE EXCEPTION 'id_tutor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_periodo_inicio IS NULL THEN
    RAISE EXCEPTION 'periodo_inicio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.pago_tutor (
    id_tutor, periodo_inicio, periodo_fin, estado_pago, subtotal, ajustes, total, fecha_aprobacion, fecha_pago, referencia_pago, observacion, estado_registro, fecha_registro, fecha_modificacion, version_registro
  ) VALUES (
    p_id_tutor, p_periodo_inicio, p_periodo_fin, coalesce(p_estado_pago, 'BORRADOR'::text), coalesce(p_subtotal, 0), coalesce(p_ajustes, 0), coalesce(p_total, 0), p_fecha_aprobacion, p_fecha_pago, p_referencia_pago, p_observacion, 'Activo', now(), now(), 1
  )
  RETURNING id_pago_tutor INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 465 (class 1255 OID 630912)
-- Name: fn_crear_pago_tutor_detalle(bigint, bigint, bigint, integer, numeric); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_pago_tutor_detalle(p_id_actor bigint, p_id_pago_tutor bigint, p_id_clase bigint, p_horas_pasadas integer, p_tarifa_hora_aplicada numeric) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_pago_tutor IS NULL THEN
    RAISE EXCEPTION 'id_pago_tutor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_clase IS NULL THEN
    RAISE EXCEPTION 'id_clase es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_horas_pasadas IS NULL THEN
    RAISE EXCEPTION 'horas_pasadas es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_tarifa_hora_aplicada IS NULL THEN
    RAISE EXCEPTION 'tarifa_hora_aplicada es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.pago_tutor_detalle (
    id_pago_tutor, id_clase, horas_pasadas, tarifa_hora_aplicada
  ) VALUES (
    p_id_pago_tutor, p_id_clase, p_horas_pasadas, p_tarifa_hora_aplicada
  )
  RETURNING id_pago_tutor_detalle INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 397 (class 1255 OID 630896)
-- Name: fn_crear_transaccion(bigint, contabilidad.tipo_transaccion, date, text, character varying, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_transaccion(p_id_actor bigint, p_tipo_transaccion contabilidad.tipo_transaccion, p_fecha_transaccion date DEFAULT NULL::date, p_sub_tipo_transaccion text DEFAULT NULL::text, p_glosa character varying DEFAULT NULL::character varying, p_id_centro_costo_mapa bigint DEFAULT NULL::bigint, p_id_bien bigint DEFAULT NULL::bigint, p_id_movimiento_detalle bigint DEFAULT NULL::bigint, p_id_deuda bigint DEFAULT NULL::bigint, p_id_pago_deuda bigint DEFAULT NULL::bigint, p_id_empleado bigint DEFAULT NULL::bigint, p_id_empleado_pago bigint DEFAULT NULL::bigint, p_id_departamento bigint DEFAULT NULL::bigint, p_id_clase_por_hora bigint DEFAULT NULL::bigint, p_id_producto_educativo bigint DEFAULT NULL::bigint, p_id_curso_version bigint DEFAULT NULL::bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_id_tienda bigint DEFAULT NULL::bigint, p_id_proveedor bigint DEFAULT NULL::bigint, p_id_dividendo_pago bigint DEFAULT NULL::bigint, p_id_emision_titulo bigint DEFAULT NULL::bigint, p_id_cliente integer DEFAULT NULL::integer, p_id_pago_tutor integer DEFAULT NULL::integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_tipo_transaccion IS NULL THEN
    RAISE EXCEPTION 'tipo_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.transaccion (
    tipo_transaccion, fecha_transaccion, sub_tipo_transaccion, glosa, id_centro_costo_mapa, id_bien, id_movimiento_detalle, id_deuda, id_pago_deuda, id_empleado, id_empleado_pago, id_departamento, id_clase_por_hora, id_producto_educativo, id_curso_version, id_sucursal, id_tienda, id_proveedor, id_dividendo_pago, id_emision_titulo, id_cliente, id_pago_tutor, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_tipo_transaccion, coalesce(p_fecha_transaccion, now()), p_sub_tipo_transaccion, p_glosa, p_id_centro_costo_mapa, p_id_bien, p_id_movimiento_detalle, p_id_deuda, p_id_pago_deuda, p_id_empleado, p_id_empleado_pago, p_id_departamento, p_id_clase_por_hora, p_id_producto_educativo, p_id_curso_version, p_id_sucursal, p_id_tienda, p_id_proveedor, p_id_dividendo_pago, p_id_emision_titulo, p_id_cliente, p_id_pago_tutor, 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_transaccion INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 548 (class 1255 OID 630900)
-- Name: fn_crear_transaccion_movimiento_cuenta(bigint, integer, integer, double precision, double precision); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_crear_transaccion_movimiento_cuenta(p_id_actor bigint, p_id_transaccion integer, p_id_cuenta integer, p_debe double precision DEFAULT NULL::double precision, p_haber double precision DEFAULT NULL::double precision) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_transaccion IS NULL THEN
    RAISE EXCEPTION 'id_transaccion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_cuenta IS NULL THEN
    RAISE EXCEPTION 'id_cuenta es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  INSERT INTO contabilidad.transaccion_movimiento_cuenta (
    id_transaccion, id_cuenta, debe, haber, estado_registro, fecha_registro, fecha_modificacion, version_registro, id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_id_transaccion, p_id_cuenta, coalesce(p_debe, 0), coalesce(p_haber, 0), 'Activo', now(), NULL, 1, p_id_actor, NULL
  )
  RETURNING id_movimiento INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 604 (class 1255 OID 393279)
-- Name: fn_generar_pago_tutor(bigint, date, date); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_generar_pago_tutor(p_id_tutor bigint, p_periodo_inicio date, p_periodo_fin date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_pago_tutor bigint;
BEGIN
  IF p_id_tutor IS NULL THEN
    RAISE EXCEPTION 'id_tutor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_periodo_inicio IS NULL OR p_periodo_fin IS NULL THEN
    RAISE EXCEPTION 'periodo_inicio y periodo_fin son obligatorios' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_periodo_fin < p_periodo_inicio THEN
    RAISE EXCEPTION 'periodo_fin no puede ser menor a periodo_inicio' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- Crear cabecera (estado por defecto: BORRADOR)
  INSERT INTO contabilidad.pago_tutor (
    id_tutor,
    periodo_inicio,
    periodo_fin,
    estado_pago,
    subtotal,
    ajustes,
    total,
    fecha_registro,
    fecha_modificacion,
    estado_registro,
    version_registro
  )
  VALUES (
    p_id_tutor,
    p_periodo_inicio::timestamptz,
    (p_periodo_fin::timestamp + interval '23:59:59')::timestamptz,
    'BORRADOR',
    0,
    0,
    0,
    now(),
    now(),
    'Activo',
    1
  )
  RETURNING id_pago_tutor INTO v_id_pago_tutor;

  -- Insert detalle por clases cerradas en el rango (si no están ya asignadas)
  INSERT INTO contabilidad.pago_tutor_detalle (
    id_pago_tutor,
    id_clase,
    horas_pasadas,
    tarifa_hora_aplicada
  )
  SELECT
    v_id_pago_tutor,
    cph.id_clase,
    GREATEST(
      1,
      CEIL(EXTRACT(EPOCH FROM (cph.hora_salida - cph.hora_llegada)) / 3600.0)
    )::int AS horas_pasadas,
    pt.pago_por_hora AS tarifa_hora_aplicada
  FROM servicios_educativos.clase_por_hora cph
  JOIN persona.persona_tutor pt
    ON pt.id_tutor = cph.id_tutor
  LEFT JOIN contabilidad.pago_tutor_detalle d
    ON d.id_clase = cph.id_clase
  WHERE
    cph.id_tutor = p_id_tutor
    AND cph.estado_operativo = 'CERRADA'
    AND d.id_pago_tutor_detalle IS NULL
    AND cph.hora_salida::date BETWEEN p_periodo_inicio AND p_periodo_fin;

  -- Recalcular totales
  UPDATE contabilidad.pago_tutor p
  SET
    subtotal = COALESCE(
      (
        SELECT SUM(d.horas_pasadas * d.tarifa_hora_aplicada)
        FROM contabilidad.pago_tutor_detalle d
        WHERE d.id_pago_tutor = p.id_pago_tutor
      ),
      0
    )::numeric(12,2),
    total = (
      COALESCE(
        (
          SELECT SUM(d.horas_pasadas * d.tarifa_hora_aplicada)
          FROM contabilidad.pago_tutor_detalle d
          WHERE d.id_pago_tutor = p.id_pago_tutor
        ),
        0
      ) + COALESCE(p.ajustes, 0)
    )::numeric(12,2),
    fecha_modificacion = now()
  WHERE p.id_pago_tutor = v_id_pago_tutor;

  RETURN v_id_pago_tutor;
END;
$$;


--
-- TOC entry 455 (class 1255 OID 786438)
-- Name: fn_listar_cuentas(bigint, bigint, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_listar_cuentas(p_actor_user_id bigint, p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS TABLE(id_cuenta bigint, codigo text, nombre_cuenta text, id_grupo_cuenta bigint, nombre_grupo_cuenta text, fecha_registro timestamp with time zone, fecha_modificacion timestamp with time zone, version_registro integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- 1) Validar sesión (tu tabla real usa id_persona + esta_activa)
  PERFORM 1
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.id_persona = p_actor_user_id
    AND s.esta_activa = true
    AND s.timestamp_logout IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sesión inválida o expirada';
  END IF;

  -- 2) Log (action_log real)
  INSERT INTO seguridad.action_log(
    id_sesion,
    id_usuario_creador,
    tipo_accion,
    metadata
  )
  VALUES (
    p_id_sesion,
    p_actor_user_id,
    'LISTAR_CUENTAS',
    jsonb_build_object('limit', p_limit, 'offset', p_offset)
  );

  -- 3) Query
  RETURN QUERY
  SELECT
    vc.id_cuenta::bigint,
    vc.codigo::text,
    vc.nombre_cuenta::text,
    vc.id_grupo_cuenta::bigint,
    vc.nombre_grupo_cuenta::text,
    vc.fecha_registro::timestamptz,
    vc.fecha_modificacion::timestamptz,
    vc.version_registro::int
  FROM contabilidad.v_cuenta vc
  ORDER BY vc.codigo ASC
  LIMIT p_limit
  OFFSET p_offset;

END;
$$;


--
-- TOC entry 551 (class 1255 OID 753670)
-- Name: fn_listar_grupos_cuenta(integer, integer, integer, integer); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_listar_grupos_cuenta(p_actor_user_id integer, p_id_sesion integer, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS TABLE(id_grupo_cuenta bigint, codigo text, nombre text, id_parent bigint, nombre_grupo_padre text, tipo text, sub_tipo text, sub_grupo text, orden_reporte integer, fecha_registro timestamp with time zone, fecha_modificacion timestamp with time zone, version_registro integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- 1. Validar sesión
  PERFORM 1
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.id_persona = p_actor_user_id
    AND s.esta_activa = true
    AND s.timestamp_logout IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sesión inválida o expirada';
  END IF;

  -- 2. Log de auditoría
  INSERT INTO seguridad.action_log(
    id_sesion,
    id_usuario_creador,
    tipo_accion,
    metadata
  )
  VALUES (
    p_id_sesion,
    p_actor_user_id,
    'OBTENER_GRUPO_CUENTA',
    jsonb_build_object('limit', p_limit, 'offset', p_offset)
  );

  -- 3. Retornar consulta
  RETURN QUERY
  SELECT
    vgc.id_grupo_cuenta::bigint,
    vgc.codigo::text,
    vgc.nombre::text,
    vgc.id_parent::bigint,
    vgc.nombre_grupo_padre::text,
    vgc.tipo::text,
    vgc.sub_tipo::text,
    vgc.sub_grupo::text,
    vgc.orden_reporte::int,          -- <-- ESTA es la corrección clave
    vgc.fecha_registro::timestamptz,
    vgc.fecha_modificacion::timestamptz,
    vgc.version_registro::int
  FROM contabilidad.v_grupo_cuenta AS vgc
  ORDER BY vgc.orden_reporte ASC, vgc.codigo ASC
  LIMIT p_limit
  OFFSET p_offset;

END;
$$;


--
-- TOC entry 619 (class 1255 OID 393281)
-- Name: fn_marcar_pagado_pago_tutor(bigint, text); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_marcar_pagado_pago_tutor(p_id_pago_tutor bigint, p_referencia text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE contabilidad.pago_tutor
  SET
    estado_pago = 'PAGADO',
    fecha_pago = now(),
    referencia_pago = p_referencia,
    fecha_modificacion = now()
  WHERE id_pago_tutor = p_id_pago_tutor
    AND estado_pago = 'APROBADO';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se pudo pagar: el pago no existe o no está en APROBADO.'
      USING ERRCODE='invalid_parameter_value';
  END IF;
END;
$$;


--
-- TOC entry 385 (class 1255 OID 720898)
-- Name: fn_obtener_centro_costo(integer, integer, integer, boolean); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_obtener_centro_costo(p_actor_user_id integer, p_id_sesion integer, p_id_centro_costo integer, p_incluir_inactivos boolean DEFAULT false) RETURNS TABLE(status text, type_error text, message text, data jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_row contabilidad.centro_costo%ROWTYPE;
BEGIN
  -- validar sesión
  PERFORM 1
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.user_id = p_actor_user_id
    AND s.register_status = 'Activo'
    AND s.timestamp_logout IS NULL;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'error','INVALID_SESSION','Sesión inválida o expirada',NULL::jsonb;
    RETURN;
  END IF;

  SELECT * INTO v_row
  FROM contabilidad.centro_costo cc
  WHERE cc.id_centro_costo = p_id_centro_costo
    AND (p_incluir_inactivos OR cc.register_status = 'Activo');

  IF v_row.id_centro_costo IS NULL THEN
    RETURN QUERY SELECT 'error','NOT_FOUND','Centro de costo no encontrado', jsonb_build_object('id_centro_costo', p_id_centro_costo);
    RETURN;
  END IF;

  INSERT INTO seguridad.action_log(id_sesion, user_id, tipo_accion, tipo_contenedor, id_contenedor, detalles)
  VALUES (
    p_id_sesion, p_actor_user_id,
    'OBTENER_CENTRO_COSTO','centro_costo', v_row.id_centro_costo,
    jsonb_build_object('id_centro_costo', v_row.id_centro_costo, 'incluir_inactivos', p_incluir_inactivos)
  );

  RETURN QUERY
  SELECT 'ok', NULL::text, 'OK', jsonb_build_object('centro_costo', to_jsonb(v_row));
  RETURN;

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 'error','INTERNAL_ERROR','Error interno al obtener centro de costo',
      jsonb_build_object('error_message',SQLERRM,'error_code',SQLSTATE);
    RETURN;
END;
$$;


--
-- TOC entry 450 (class 1255 OID 720897)
-- Name: fn_obtener_cuenta(integer, integer, integer, boolean); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_obtener_cuenta(p_actor_user_id integer, p_id_sesion integer, p_id_cuenta integer, p_incluir_inactivos boolean DEFAULT false) RETURNS TABLE(status text, type_error text, message text, data jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_row contabilidad.cuenta%ROWTYPE;
  v_grupo contabilidad.grupo_cuenta%ROWTYPE;
BEGIN
  -- validar sesión
  PERFORM 1
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.user_id = p_actor_user_id
    AND s.register_status = 'Activo'
    AND s.timestamp_logout IS NULL;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'error','INVALID_SESSION','Sesión inválida o expirada',NULL::jsonb;
    RETURN;
  END IF;

  SELECT * INTO v_row
  FROM contabilidad.cuenta c
  WHERE c.id_cuenta = p_id_cuenta
    AND (p_incluir_inactivos OR c.register_status = 'Activo');

  IF v_row.id_cuenta IS NULL THEN
    RETURN QUERY SELECT 'error','NOT_FOUND','Cuenta no encontrada', jsonb_build_object('id_cuenta', p_id_cuenta);
    RETURN;
  END IF;

  SELECT * INTO v_grupo
  FROM contabilidad.grupo_cuenta gc
  WHERE gc.id_grupo_cuenta = v_row.id_grupo_cuenta;

  INSERT INTO seguridad.action_log(id_sesion, user_id, tipo_accion, tipo_contenedor, id_contenedor, detalles)
  VALUES (
    p_id_sesion, p_actor_user_id,
    'OBTENER_CUENTA','cuenta', v_row.id_cuenta,
    jsonb_build_object('id_cuenta', v_row.id_cuenta, 'incluir_inactivos', p_incluir_inactivos)
  );

  RETURN QUERY
  SELECT 'ok', NULL::text, 'OK',
    jsonb_build_object(
      'cuenta', to_jsonb(v_row),
      'grupo_cuenta', CASE WHEN v_grupo.id_grupo_cuenta IS NULL THEN NULL ELSE to_jsonb(v_grupo) END
    );
  RETURN;

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 'error','INTERNAL_ERROR','Error interno al obtener cuenta',
      jsonb_build_object('error_message',SQLERRM,'error_code',SQLSTATE);
    RETURN;
END;
$$;


--
-- TOC entry 485 (class 1255 OID 720896)
-- Name: fn_obtener_grupo_cuenta(integer, integer, integer, boolean); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_obtener_grupo_cuenta(p_actor_user_id integer, p_id_sesion integer, p_id_grupo_cuenta integer, p_incluir_inactivos boolean DEFAULT false) RETURNS TABLE(status text, type_error text, message text, data jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_row contabilidad.grupo_cuenta%ROWTYPE;
  v_padre contabilidad.grupo_cuenta%ROWTYPE;
BEGIN
  -- validar sesión
  PERFORM 1
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.user_id = p_actor_user_id
    AND s.register_status = 'Activo'
    AND s.timestamp_logout IS NULL;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'error','INVALID_SESSION','Sesión inválida o expirada',NULL::jsonb;
    RETURN;
  END IF;

  SELECT * INTO v_row
  FROM contabilidad.grupo_cuenta gc
  WHERE gc.id_grupo_cuenta = p_id_grupo_cuenta
    AND (p_incluir_inactivos OR gc.register_status = 'Activo');

  IF v_row.id_grupo_cuenta IS NULL THEN
    RETURN QUERY SELECT 'error','NOT_FOUND','Grupo cuenta no encontrado', jsonb_build_object('id_grupo_cuenta', p_id_grupo_cuenta);
    RETURN;
  END IF;

  IF v_row.id_grupo_padre IS NOT NULL THEN
    SELECT * INTO v_padre
    FROM contabilidad.grupo_cuenta gp
    WHERE gp.id_grupo_cuenta = v_row.id_grupo_padre;
  END IF;

  INSERT INTO seguridad.action_log(id_sesion, user_id, tipo_accion, tipo_contenedor, id_contenedor, detalles)
  VALUES (
    p_id_sesion, p_actor_user_id,
    'OBTENER_GRUPO_CUENTA','grupo_cuenta', v_row.id_grupo_cuenta,
    jsonb_build_object('id_grupo_cuenta', v_row.id_grupo_cuenta, 'incluir_inactivos', p_incluir_inactivos)
  );

  RETURN QUERY
  SELECT 'ok', NULL::text, 'OK',
    jsonb_build_object(
      'grupo_cuenta', to_jsonb(v_row),
      'grupo_padre', CASE WHEN v_padre.id_grupo_cuenta IS NULL THEN NULL ELSE to_jsonb(v_padre) END
    );
  RETURN;

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 'error','INTERNAL_ERROR','Error interno al obtener grupo cuenta',
      jsonb_build_object('error_message',SQLERRM,'error_code',SQLSTATE);
    RETURN;
END;
$$;


--
-- TOC entry 482 (class 1255 OID 720899)
-- Name: fn_obtener_transaccion(integer, integer, integer, boolean); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.fn_obtener_transaccion(p_actor_user_id integer, p_id_sesion integer, p_id_transaccion integer, p_incluir_inactivos boolean DEFAULT false) RETURNS TABLE(status text, type_error text, message text, data jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_t contabilidad.transaccion%ROWTYPE;
  v_movs jsonb;
BEGIN
  -- validar sesión
  PERFORM 1
  FROM seguridad.sesion s
  WHERE s.id_sesion = p_id_sesion
    AND s.user_id = p_actor_user_id
    AND s.register_status = 'Activo'
    AND s.timestamp_logout IS NULL;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'error','INVALID_SESSION','Sesión inválida o expirada',NULL::jsonb;
    RETURN;
  END IF;

  SELECT * INTO v_t
  FROM contabilidad.transaccion t
  WHERE t.id_transaccion = p_id_transaccion
    AND (p_incluir_inactivos OR t.register_status = 'Activo');

  IF v_t.id_transaccion IS NULL THEN
    RETURN QUERY SELECT 'error','NOT_FOUND','Transacción no encontrada', jsonb_build_object('id_transaccion', p_id_transaccion);
    RETURN;
  END IF;

  SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id_movimiento', mc.id_movimiento,
          'id_cuenta', mc.id_cuenta,
          'cuenta_nombre', c.nombre,
          'cuenta_codigo', c.codigo,
          'debe', mc.debe,
          'haber', mc.haber,
          'descripcion', mc.descripcion
        )
        ORDER BY mc.id_movimiento
      ) FILTER (WHERE mc.id_movimiento IS NOT NULL),
      '[]'::jsonb
    )
    INTO v_movs
  FROM contabilidad.movimiento_cuenta mc
  LEFT JOIN contabilidad.cuenta c ON c.id_cuenta = mc.id_cuenta
  WHERE mc.id_transaccion = v_t.id_transaccion
    AND (p_incluir_inactivos OR mc.register_status = 'Activo');

  INSERT INTO seguridad.action_log(id_sesion, user_id, tipo_accion, tipo_contenedor, id_contenedor, detalles)
  VALUES (
    p_id_sesion, p_actor_user_id,
    'OBTENER_TRANSACCION','transaccion', v_t.id_transaccion,
    jsonb_build_object('id_transaccion', v_t.id_transaccion, 'incluir_inactivos', p_incluir_inactivos)
  );

  RETURN QUERY
  SELECT 'ok', NULL::text, 'OK',
    jsonb_build_object('transaccion', to_jsonb(v_t), 'movimientos', v_movs);
  RETURN;

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 'error','INTERNAL_ERROR','Error interno al obtener transacción',
      jsonb_build_object('error_message',SQLERRM,'error_code',SQLSTATE);
    RETURN;
END;
$$;


--
-- TOC entry 648 (class 1255 OID 745472)
-- Name: trg_sync_archivos_transaccion_links(); Type: FUNCTION; Schema: contabilidad; Owner: -
--

CREATE FUNCTION contabilidad.trg_sync_archivos_transaccion_links() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Si llega link_archivo y no llega link_achivo, copiar
  IF NEW.link_archivo IS NOT NULL AND (NEW.link_achivo IS NULL OR NEW.link_achivo = '') THEN
    NEW.link_achivo := NEW.link_archivo;
  END IF;

  -- Si llega link_achivo y no llega link_archivo, copiar
  IF NEW.link_achivo IS NOT NULL AND (NEW.link_archivo IS NULL OR NEW.link_archivo = '') THEN
    NEW.link_archivo := NEW.link_achivo;
  END IF;

  RETURN NEW;
END;
$$;


--
-- TOC entry 420 (class 1255 OID 581633)
-- Name: api_actualizar_deuda(bigint, bigint, bigint, numeric, numeric, character varying, integer, character varying, numeric, numeric, character varying, character varying, character varying, character varying, numeric, date, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.api_actualizar_deuda(p_id_sesion bigint, p_id_deuda bigint, p_id_proveedor bigint, p_monto_inicial numeric, p_tasa_anual numeric, p_tipo_tasa character varying, p_plazo_meses integer, p_capitalizacion character varying DEFAULT NULL::character varying, p_seguro_desgravamen_fijo numeric DEFAULT 0, p_seguro_desgravamen_variable numeric DEFAULT 0, p_tipo_calculo_cuotas character varying DEFAULT 'FRANCES'::character varying, p_frecuencia_cuotas character varying DEFAULT 'MENSUAL'::character varying, p_tipo_pago character varying DEFAULT 'VENCIDAS'::character varying, p_tipo_primer_pago character varying DEFAULT 'INMEDIATA'::character varying, p_anualidad_acordada numeric DEFAULT NULL::numeric, p_fecha_inicio date DEFAULT CURRENT_DATE, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CAJA.DEUDA.EDITAR',
    'ACTUALIZAR_DEUDA'
  );

  PERFORM deuda.fn_actualizar_deuda(
    v_id_usuario,
    p_id_deuda,
    p_id_proveedor,
    p_monto_inicial,
    p_tasa_anual,
    p_tipo_tasa,
    p_plazo_meses,
    p_capitalizacion,
    p_seguro_desgravamen_fijo,
    p_seguro_desgravamen_variable,
    p_tipo_calculo_cuotas,
    p_frecuencia_cuotas,
    p_tipo_pago,
    p_tipo_primer_pago,
    p_anualidad_acordada,
    p_fecha_inicio,
    p_observaciones
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_DEUDA',
    'INFO',
    'deuda',
    'deuda',
    jsonb_build_object('id_deuda', p_id_deuda),
    TRUE,
    jsonb_build_object(
      'id_proveedor', p_id_proveedor,
      'monto_inicial', p_monto_inicial,
      'tasa_anual', p_tasa_anual
    )
  );

  RETURN seguridad.fn_api_result(
    TRUE,
    'Deuda actualizada',
    jsonb_build_object('id_deuda', p_id_deuda)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 350 (class 1255 OID 589825)
-- Name: api_actualizar_pago(bigint, bigint, bigint, date, numeric, numeric, numeric, numeric, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.api_actualizar_pago(p_id_sesion bigint, p_id_pago bigint, p_id_deuda bigint, p_fecha_pago date, p_interes_pagado numeric, p_capital_amortizado numeric, p_seguro_desgravamen_pagado numeric DEFAULT 0, p_otros_recargos_pagados numeric DEFAULT 0, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'CAJA.PAGO.EDITAR',
    'ACTUALIZAR_PAGO'
  );

  PERFORM deuda.fn_actualizar_pago(
    v_id_usuario,
    p_id_pago,
    p_id_deuda,
    p_fecha_pago,
    p_interes_pagado,
    p_capital_amortizado,
    p_seguro_desgravamen_pagado,
    p_otros_recargos_pagados,
    p_observaciones
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_PAGO','INFO','deuda','pago',
    jsonb_build_object('id_pago', p_id_pago),
    TRUE,
    jsonb_build_object('id_deuda',p_id_deuda,'fecha_pago',p_fecha_pago)
  );

  RETURN seguridad.fn_api_result(TRUE,'Pago actualizado', jsonb_build_object('id_pago', p_id_pago));
EXCEPTION
  WHEN OTHERS THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 621 (class 1255 OID 548875)
-- Name: api_crear_deuda(bigint, bigint, numeric, numeric, character varying, integer, character varying, numeric, numeric, character varying, character varying, character varying, character varying, numeric, date, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.api_crear_deuda(p_id_sesion bigint, p_id_proveedor bigint, p_monto_inicial numeric, p_tasa_anual numeric, p_tipo_tasa character varying, p_plazo_meses integer, p_capitalizacion character varying DEFAULT NULL::character varying, p_seguro_desgravamen_fijo numeric DEFAULT NULL::numeric, p_seguro_desgravamen_variable numeric DEFAULT NULL::numeric, p_tipo_calculo_cuotas character varying DEFAULT 'FRANCES'::character varying, p_frecuencia_cuotas character varying DEFAULT 'MENSUAL'::character varying, p_tipo_pago character varying DEFAULT 'VENCIDAS'::character varying, p_tipo_primer_pago character varying DEFAULT 'INMEDIATA'::character varying, p_anualidad_acordada numeric DEFAULT NULL::numeric, p_fecha_inicio date DEFAULT CURRENT_DATE, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_deuda bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'CAJA.DEUDA.CREAR','CREAR_DEUDA');

  v_id_deuda := deuda.fn_crear_deuda(
    v_id_usuario,
    p_id_proveedor, p_monto_inicial, p_tasa_anual, p_tipo_tasa, p_plazo_meses,
    p_capitalizacion, p_seguro_desgravamen_fijo, p_seguro_desgravamen_variable,
    p_tipo_calculo_cuotas, p_frecuencia_cuotas, p_tipo_pago, p_tipo_primer_pago,
    p_anualidad_acordada, p_fecha_inicio, p_observaciones
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_DEUDA','INFO','deuda','deuda',
    jsonb_build_object('id_deuda', v_id_deuda),
    TRUE,
    jsonb_build_object('id_proveedor',p_id_proveedor,'monto_inicial',p_monto_inicial,'tipo_tasa',p_tipo_tasa)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Deuda creada', jsonb_build_object('id_deuda', v_id_deuda));
EXCEPTION
  WHEN OTHERS THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 591 (class 1255 OID 548877)
-- Name: api_crear_pago(bigint, bigint, date, numeric, numeric, numeric, numeric, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.api_crear_pago(p_id_sesion bigint, p_id_deuda bigint, p_fecha_pago date DEFAULT CURRENT_DATE, p_interes_pagado numeric DEFAULT 0, p_capital_amortizado numeric DEFAULT 0, p_seguro_desgravamen_pagado numeric DEFAULT 0, p_otros_recargos_pagados numeric DEFAULT 0, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_pago bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'CAJA.PAGO.REGISTRAR','CREAR_PAGO');

  v_id_pago := deuda.fn_crear_pago(
    v_id_usuario,
    p_id_deuda, p_fecha_pago,
    p_interes_pagado, p_capital_amortizado,
    p_seguro_desgravamen_pagado, p_otros_recargos_pagados,
    p_observaciones
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_PAGO','INFO','deuda','pago',
    jsonb_build_object('id_pago', v_id_pago),
    TRUE,
    jsonb_build_object('id_deuda',p_id_deuda,'fecha_pago',p_fecha_pago)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Pago registrado', jsonb_build_object('id_pago', v_id_pago));
EXCEPTION
  WHEN OTHERS THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 614 (class 1255 OID 581632)
-- Name: fn_actualizar_deuda(bigint, bigint, bigint, numeric, numeric, character varying, integer, character varying, numeric, numeric, character varying, character varying, character varying, character varying, numeric, date, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.fn_actualizar_deuda(p_id_actor bigint, p_id_deuda bigint, p_id_proveedor bigint, p_monto_inicial numeric, p_tasa_anual numeric, p_tipo_tasa character varying, p_plazo_meses integer, p_capitalizacion character varying DEFAULT NULL::character varying, p_seguro_desgravamen_fijo numeric DEFAULT 0, p_seguro_desgravamen_variable numeric DEFAULT 0, p_tipo_calculo_cuotas character varying DEFAULT 'FRANCES'::character varying, p_frecuencia_cuotas character varying DEFAULT 'MENSUAL'::character varying, p_tipo_pago character varying DEFAULT 'VENCIDAS'::character varying, p_tipo_primer_pago character varying DEFAULT 'INMEDIATA'::character varying, p_anualidad_acordada numeric DEFAULT NULL::numeric, p_fecha_inicio date DEFAULT CURRENT_DATE, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_deuda IS NULL THEN
    RAISE EXCEPTION 'id_deuda es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_id_proveedor IS NULL THEN
    RAISE EXCEPTION 'id_proveedor es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_monto_inicial IS NULL OR p_monto_inicial <= 0 THEN
    RAISE EXCEPTION 'monto_inicial debe ser > 0'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_tasa_anual IS NULL OR p_tasa_anual < 0 THEN
    RAISE EXCEPTION 'tasa_anual debe ser >= 0'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_plazo_meses IS NULL OR p_plazo_meses <= 0 THEN
    RAISE EXCEPTION 'plazo_meses debe ser > 0'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  UPDATE deuda.deuda
  SET
    id_proveedor = p_id_proveedor,
    monto_inicial = p_monto_inicial,
    tasa_anual = p_tasa_anual,
    tipo_tasa = upper(trim(p_tipo_tasa)),
    capitalizacion = p_capitalizacion,
    plazo_meses = p_plazo_meses,
    seguro_desgravamen_fijo = coalesce(p_seguro_desgravamen_fijo, 0),
    seguro_desgravamen_variable = coalesce(p_seguro_desgravamen_variable, 0),
    tipo_calculo_cuotas = upper(trim(p_tipo_calculo_cuotas)),
    frecuencia_cuotas = upper(trim(p_frecuencia_cuotas)),
    tipo_pago = upper(trim(p_tipo_pago)),
    tipo_primer_pago = upper(trim(p_tipo_primer_pago)),
    anualidad_acordada = p_anualidad_acordada,
    fecha_inicio = coalesce(p_fecha_inicio, fecha_inicio),
    observaciones = p_observaciones,
    fecha_modificacion = now(),
    version_registro = coalesce(version_registro, 1) + 1
  WHERE id_deuda = p_id_deuda;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'deuda no existe o no se pudo actualizar'
      USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 530 (class 1255 OID 589824)
-- Name: fn_actualizar_pago(bigint, bigint, bigint, date, numeric, numeric, numeric, numeric, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.fn_actualizar_pago(p_id_actor bigint, p_id_pago bigint, p_id_deuda bigint, p_fecha_pago date, p_interes_pagado numeric, p_capital_amortizado numeric, p_seguro_desgravamen_pagado numeric DEFAULT 0, p_otros_recargos_pagados numeric DEFAULT 0, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_total numeric;
BEGIN
  IF p_id_pago IS NULL THEN
    RAISE EXCEPTION 'id_pago es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_deuda IS NULL THEN
    RAISE EXCEPTION 'id_deuda es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_pago IS NULL THEN
    RAISE EXCEPTION 'fecha_pago es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_interes_pagado IS NULL THEN p_interes_pagado := 0; END IF;
  IF p_capital_amortizado IS NULL THEN p_capital_amortizado := 0; END IF;

  v_total :=
    coalesce(p_interes_pagado,0) +
    coalesce(p_capital_amortizado,0) +
    coalesce(p_seguro_desgravamen_pagado,0) +
    coalesce(p_otros_recargos_pagados,0);

  IF v_total <= 0 THEN
    RAISE EXCEPTION 'El pago debe tener al menos un componente > 0'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE deuda.pago
  SET
    id_deuda = p_id_deuda,
    fecha_pago = p_fecha_pago,
    interes_pagado = coalesce(p_interes_pagado,0),
    capital_amortizado = coalesce(p_capital_amortizado,0),
    seguro_desgravamen_pagado = coalesce(p_seguro_desgravamen_pagado,0),
    otros_recargos_pagados = coalesce(p_otros_recargos_pagados,0),
    observaciones = p_observaciones,
    fecha_modificacion = now(),
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_pago = p_id_pago;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'pago no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 380 (class 1255 OID 548874)
-- Name: fn_crear_deuda(bigint, bigint, numeric, numeric, character varying, integer, character varying, numeric, numeric, character varying, character varying, character varying, character varying, numeric, date, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.fn_crear_deuda(p_id_actor bigint, p_id_proveedor bigint, p_monto_inicial numeric, p_tasa_anual numeric, p_tipo_tasa character varying, p_plazo_meses integer, p_capitalizacion character varying DEFAULT NULL::character varying, p_seguro_desgravamen_fijo numeric DEFAULT NULL::numeric, p_seguro_desgravamen_variable numeric DEFAULT NULL::numeric, p_tipo_calculo_cuotas character varying DEFAULT 'FRANCES'::character varying, p_frecuencia_cuotas character varying DEFAULT 'MENSUAL'::character varying, p_tipo_pago character varying DEFAULT 'VENCIDAS'::character varying, p_tipo_primer_pago character varying DEFAULT 'INMEDIATA'::character varying, p_anualidad_acordada numeric DEFAULT NULL::numeric, p_fecha_inicio date DEFAULT CURRENT_DATE, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO deuda.deuda (
    id_proveedor, monto_inicial, tasa_anual, tipo_tasa, capitalizacion, plazo_meses,
    seguro_desgravamen_fijo, seguro_desgravamen_variable,
    tipo_calculo_cuotas, frecuencia_cuotas, tipo_pago, tipo_primer_pago,
    anualidad_acordada, fecha_inicio, observaciones, version_registro
  ) VALUES (
    p_id_proveedor, p_monto_inicial, p_tasa_anual, upper(trim(p_tipo_tasa)), NULLIF(upper(trim(coalesce(p_capitalizacion,''))),''), p_plazo_meses,
    p_seguro_desgravamen_fijo, p_seguro_desgravamen_variable,
    upper(trim(coalesce(p_tipo_calculo_cuotas,'FRANCES'))),
    upper(trim(coalesce(p_frecuencia_cuotas,'MENSUAL'))),
    upper(trim(coalesce(p_tipo_pago,'VENCIDAS'))),
    upper(trim(coalesce(p_tipo_primer_pago,'INMEDIATA'))),
    p_anualidad_acordada, coalesce(p_fecha_inicio, CURRENT_DATE), p_observaciones, 1
  )
  RETURNING id_deuda INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 486 (class 1255 OID 548876)
-- Name: fn_crear_pago(bigint, bigint, date, numeric, numeric, numeric, numeric, text); Type: FUNCTION; Schema: deuda; Owner: -
--

CREATE FUNCTION deuda.fn_crear_pago(p_id_actor bigint, p_id_deuda bigint, p_fecha_pago date DEFAULT CURRENT_DATE, p_interes_pagado numeric DEFAULT 0, p_capital_amortizado numeric DEFAULT 0, p_seguro_desgravamen_pagado numeric DEFAULT 0, p_otros_recargos_pagados numeric DEFAULT 0, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
  v_total numeric;
BEGIN
  IF p_id_deuda IS NULL THEN
    RAISE EXCEPTION 'id_deuda es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  v_total :=
    coalesce(p_interes_pagado,0) +
    coalesce(p_capital_amortizado,0) +
    coalesce(p_seguro_desgravamen_pagado,0) +
    coalesce(p_otros_recargos_pagados,0);

  IF v_total <= 0 THEN
    RAISE EXCEPTION 'El pago debe tener al menos un componente > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO deuda.pago (
    id_deuda, fecha_pago,
    interes_pagado, capital_amortizado,
    seguro_desgravamen_pagado, otros_recargos_pagados,
    observaciones,
    version_registro
  ) VALUES (
    p_id_deuda, coalesce(p_fecha_pago, CURRENT_DATE),
    coalesce(p_interes_pagado,0), coalesce(p_capital_amortizado,0),
    coalesce(p_seguro_desgravamen_pagado,0), coalesce(p_otros_recargos_pagados,0),
    p_observaciones,
    1
  )
  RETURNING id_pago INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 452 (class 1255 OID 671746)
-- Name: api_actualizar_aula(bigint, bigint, bigint, character varying, character varying, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_aula(p_id_sesion bigint, p_id_espacio bigint, p_id_edificio bigint, p_nombre character varying, p_tipo_aula character varying, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.EDITAR',
    'ACTUALIZAR_AULA'
  );

  PERFORM infraestructura.fn_actualizar_aula(
    v_id_usuario,
    p_id_espacio,
    p_id_edificio,
    p_nombre,
    p_tipo_aula::infraestructura.tipo_aula,
    p_es_privada,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones
  );

  v_msg := format('Aula actualizada (id_espacio=%s)', p_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_AULA',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', p_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_espacio', p_id_espacio,
      'id_edificio', p_id_edificio,
      'tipo', 'AULA',
      'nombre', p_nombre,
      'tipo_aula', p_tipo_aula,
      'es_privada', p_es_privada,
      'piso', p_piso,
      'capacidad', p_capacidad,
      'largo_m', p_largo_m,
      'ancho_m', p_ancho_m
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_espacio', p_id_espacio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_AULA',
      'ERROR',
      'infraestructura',
      'espacio',
      jsonb_build_object('id_espacio', p_id_espacio),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_espacio', p_id_espacio,
        'id_edificio', p_id_edificio,
        'tipo_aula', coalesce(p_tipo_aula, NULL)
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 605 (class 1255 OID 516112)
-- Name: api_actualizar_edificio(bigint, bigint, bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, smallint, double precision, double precision, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_edificio(p_id_sesion bigint, p_id_edificio bigint, p_id_sucursal bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_latitud numeric, p_longitud numeric, p_pisos smallint, p_largo_m double precision, p_ancho_m double precision, p_id_administrador bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.EDIFICIO.EDITAR',
    'ACTUALIZAR_EDIFICIO'
  );

  PERFORM infraestructura.fn_actualizar_edificio(
    v_id_usuario,
    p_id_edificio,
    p_id_sucursal, p_codigo, p_nombre, p_direccion_linea1, p_ciudad, p_departamento, p_pais,
    p_latitud, p_longitud, p_pisos, p_largo_m, p_ancho_m, p_id_administrador
  );

  v_msg := format('Edificio actualizado (id_edificio=%s)', p_id_edificio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_EDIFICIO',
    'INFO',
    'infraestructura',
    'edificio',
    jsonb_build_object('id_edificio', p_id_edificio),
    TRUE,
    jsonb_build_object(
      'id_sucursal', p_id_sucursal,
      'codigo', p_codigo,
      'nombre', p_nombre
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_edificio', p_id_edificio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_EDIFICIO',
      'ERROR',
      'infraestructura',
      'edificio',
      jsonb_build_object('id_edificio', p_id_edificio),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_edificio', p_id_edificio
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 437 (class 1255 OID 516118)
-- Name: api_actualizar_encargado(bigint, bigint, bigint, bigint, date, date); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_encargado(p_id_sesion bigint, p_id_asignacion bigint, p_id_sucursal bigint, p_id_empleado bigint, p_fecha_inicio date, p_fecha_fin date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ENCARGADO.EDITAR',
    'ACTUALIZAR_ENCARGADO'
  );

  PERFORM infraestructura.fn_actualizar_encargado(
    v_id_usuario,
    p_id_asignacion,
    p_id_sucursal, p_id_empleado, p_fecha_inicio, p_fecha_fin
  );

  v_msg := format('Encargado actualizado (id_asignacion=%s)', p_id_asignacion);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_ENCARGADO',
    'INFO',
    'infraestructura',
    'encargado',
    jsonb_build_object('id_asignacion', p_id_asignacion),
    TRUE,
    jsonb_build_object(
      'id_sucursal', p_id_sucursal,
      'id_empleado', p_id_empleado,
      'fecha_inicio', p_fecha_inicio,
      'fecha_fin', p_fecha_fin
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_asignacion', p_id_asignacion));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_ENCARGADO',
      'ERROR',
      'infraestructura',
      'encargado',
      jsonb_build_object('id_asignacion', p_id_asignacion),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_asignacion', p_id_asignacion
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 608 (class 1255 OID 516114)
-- Name: api_actualizar_espacio(bigint, bigint, bigint, character varying, character varying, character varying, smallint, smallint, double precision, double precision); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_espacio(p_id_sesion bigint, p_id_espacio bigint, p_id_edificio bigint, p_codigo character varying, p_nombre character varying, p_tipo character varying, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.EDITAR',
    'ACTUALIZAR_ESPACIO'
  );

  PERFORM infraestructura.fn_actualizar_espacio(
    v_id_usuario,
    p_id_espacio,
    p_id_edificio, p_codigo, p_nombre, p_tipo, p_piso, p_capacidad, p_largo_m, p_ancho_m
  );

  v_msg := format('Espacio actualizado (id_espacio=%s)', p_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_ESPACIO',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', p_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_edificio', p_id_edificio,
      'codigo', p_codigo,
      'nombre', p_nombre,
      'tipo', p_tipo
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_espacio', p_id_espacio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_ESPACIO',
      'ERROR',
      'infraestructura',
      'espacio',
      jsonb_build_object('id_espacio', p_id_espacio),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_espacio', p_id_espacio
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 663 (class 1255 OID 671748)
-- Name: api_actualizar_sala(bigint, bigint, bigint, character varying, character varying, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_sala(p_id_sesion bigint, p_id_espacio bigint, p_id_edificio bigint, p_nombre character varying, p_categoria_sala character varying, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.EDITAR',
    'ACTUALIZAR_SALA'
  );

  PERFORM infraestructura.fn_actualizar_sala(
    v_id_usuario,
    p_id_espacio,
    p_id_edificio,
    p_nombre,
    p_categoria_sala::infraestructura.categoria_sala,
    p_es_privada,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones
  );

  v_msg := format('Sala actualizada (id_espacio=%s)', p_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_SALA',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', p_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_espacio', p_id_espacio,
      'id_edificio', p_id_edificio,
      'tipo', 'SALA',
      'nombre', p_nombre,
      'categoria_sala', p_categoria_sala,
      'es_privada', p_es_privada,
      'piso', p_piso,
      'capacidad', p_capacidad,
      'largo_m', p_largo_m,
      'ancho_m', p_ancho_m
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_espacio', p_id_espacio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_SALA',
      'ERROR',
      'infraestructura',
      'espacio',
      jsonb_build_object('id_espacio', p_id_espacio),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_espacio', p_id_espacio,
        'id_edificio', p_id_edificio,
        'categoria_sala', coalesce(p_categoria_sala, NULL)
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 501 (class 1255 OID 516110)
-- Name: api_actualizar_sucursal(bigint, bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, character varying, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_sucursal(p_id_sesion bigint, p_id_sucursal bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_latitud numeric, p_longitud numeric, p_telefono character varying, p_email character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.SUCURSAL.EDITAR',
    'ACTUALIZAR_SUCURSAL'
  );

  PERFORM infraestructura.fn_actualizar_sucursal(
    v_id_usuario,
    p_id_sucursal,
    p_codigo, p_nombre, p_direccion_linea1, p_ciudad, p_departamento, p_pais,
    p_latitud, p_longitud, p_telefono, p_email
  );

  v_msg := format('Sucursal actualizada (id_sucursal=%s)', p_id_sucursal);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_SUCURSAL',
    'INFO',
    'infraestructura',
    'sucursal',
    jsonb_build_object('id_sucursal', p_id_sucursal),
    TRUE,
    jsonb_build_object(
      'codigo', p_codigo,
      'nombre', p_nombre
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_sucursal', p_id_sucursal));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_SUCURSAL',
      'ERROR',
      'infraestructura',
      'sucursal',
      jsonb_build_object('id_sucursal', p_id_sucursal),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_sucursal', p_id_sucursal
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 544 (class 1255 OID 516116)
-- Name: api_actualizar_tienda(bigint, bigint, bigint, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_actualizar_tienda(p_id_sesion bigint, p_id_tienda bigint, p_id_espacio bigint, p_codigo character varying, p_nombre character varying, p_horario_texto character varying, p_id_responsable bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.TIENDA.EDITAR',
    'ACTUALIZAR_TIENDA'
  );

  PERFORM infraestructura.fn_actualizar_tienda(
    v_id_usuario,
    p_id_tienda,
    p_id_espacio, p_codigo, p_nombre, p_horario_texto, p_id_responsable
  );

  v_msg := format('Tienda actualizada (id_tienda=%s)', p_id_tienda);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ACTUALIZAR_TIENDA',
    'INFO',
    'infraestructura',
    'tienda',
    jsonb_build_object('id_tienda', p_id_tienda),
    TRUE,
    jsonb_build_object(
      'id_espacio', p_id_espacio,
      'codigo', p_codigo,
      'nombre', p_nombre,
      'id_responsable', p_id_responsable
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_tienda', p_id_tienda));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ACTUALIZAR_TIENDA',
      'ERROR',
      'infraestructura',
      'tienda',
      jsonb_build_object('id_tienda', p_id_tienda),
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_tienda', p_id_tienda
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 506 (class 1255 OID 450578)
-- Name: api_crear_aula(bigint, bigint, character varying, smallint, smallint, double precision, double precision, character varying, infraestructura.tipo_aula, boolean); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_aula(p_id_sesion bigint, p_id_edificio bigint, p_nombre character varying, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying, p_tipo_aula infraestructura.tipo_aula, p_es_privada boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_espacio bigint;
  v_msg text;
BEGIN
  -- Permiso + (si falla, tu fn_guard_permiso_api debería loguear DENEGADO)
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.CREAR',
    'CREAR_AULA'
  );

  v_id_espacio := infraestructura.fn_crear_aula(
    p_id_edificio, p_nombre, p_piso, p_capacidad, p_largo_m, p_ancho_m,
    p_observaciones, p_tipo_aula, p_es_privada, v_id_usuario
  );

  v_msg := format('Aula creada (id_espacio=%s)', v_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_AULA',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', v_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_edificio', p_id_edificio,
      'nombre', p_nombre,
      'piso', p_piso,
      'capacidad', p_capacidad,
      'largo_m', p_largo_m,
      'ancho_m', p_ancho_m,
      'tipo_aula', p_tipo_aula::text,
      'es_privada', coalesce(p_es_privada,false)
    )
  );

  RETURN seguridad.fn_api_result(
    true,
    v_msg,
    jsonb_build_object('id_espacio', v_id_espacio)
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(false, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_AULA',
      'ERROR',
      'infraestructura',
      'espacio',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_edificio', p_id_edificio,
        'tipo_aula', coalesce(p_tipo_aula::text, NULL)
      )
    );

    RETURN seguridad.fn_api_result(false, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 637 (class 1255 OID 524298)
-- Name: api_crear_aula(bigint, bigint, character varying, character varying, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_aula(p_id_sesion bigint, p_id_edificio bigint, p_nombre character varying, p_tipo_aula character varying, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_espacio bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.CREAR',
    'CREAR_AULA'
  );

  v_id_espacio := infraestructura.fn_crear_aula(
    v_id_usuario,
    p_id_edificio,
    p_nombre,
    p_tipo_aula::infraestructura.tipo_aula,
    p_es_privada,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones
  );

  v_msg := format('Aula creada (id_espacio=%s)', v_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_AULA',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', v_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_edificio', p_id_edificio,
      'tipo', 'AULA',
      'nombre', p_nombre,
      'tipo_aula', p_tipo_aula,
      'es_privada', p_es_privada,
      'piso', p_piso,
      'capacidad', p_capacidad
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_espacio', v_id_espacio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_AULA',
      'ERROR',
      'infraestructura',
      'espacio',
      NULL,
      FALSE,
      jsonb_build_object('sqlstate', SQLSTATE, 'error', SQLERRM, 'id_edificio', p_id_edificio, 'nombre', p_nombre)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 649 (class 1255 OID 516111)
-- Name: api_crear_edificio(bigint, bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, smallint, double precision, double precision, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_edificio(p_id_sesion bigint, p_id_sucursal bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_latitud numeric, p_longitud numeric, p_pisos smallint, p_largo_m double precision, p_ancho_m double precision, p_id_administrador bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_edificio bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.EDIFICIO.CREAR',
    'CREAR_EDIFICIO'
  );

  v_id_edificio := infraestructura.fn_crear_edificio(
    v_id_usuario,
    p_id_sucursal, p_codigo, p_nombre, p_direccion_linea1, p_ciudad, p_departamento, p_pais,
    p_latitud, p_longitud, p_pisos, p_largo_m, p_ancho_m, p_id_administrador
  );

  v_msg := format('Edificio creado (id_edificio=%s)', v_id_edificio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_EDIFICIO',
    'INFO',
    'infraestructura',
    'edificio',
    jsonb_build_object('id_edificio', v_id_edificio),
    TRUE,
    jsonb_build_object(
      'id_sucursal', p_id_sucursal,
      'codigo', p_codigo,
      'nombre', p_nombre,
      'pisos', p_pisos
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_edificio', v_id_edificio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_EDIFICIO',
      'ERROR',
      'infraestructura',
      'edificio',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_sucursal', p_id_sucursal,
        'codigo', p_codigo
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 412 (class 1255 OID 516117)
-- Name: api_crear_encargado(bigint, bigint, bigint, date, date); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_encargado(p_id_sesion bigint, p_id_sucursal bigint, p_id_empleado bigint, p_fecha_inicio date, p_fecha_fin date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_asignacion bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ENCARGADO.CREAR',
    'CREAR_ENCARGADO'
  );

  v_id_asignacion := infraestructura.fn_crear_encargado(
    v_id_usuario,
    p_id_sucursal, p_id_empleado, p_fecha_inicio, p_fecha_fin
  );

  v_msg := format('Encargado asignado (id_asignacion=%s)', v_id_asignacion);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_ENCARGADO',
    'INFO',
    'infraestructura',
    'encargado',
    jsonb_build_object('id_asignacion', v_id_asignacion),
    TRUE,
    jsonb_build_object(
      'id_sucursal', p_id_sucursal,
      'id_empleado', p_id_empleado,
      'fecha_inicio', p_fecha_inicio,
      'fecha_fin', p_fecha_fin
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_asignacion', v_id_asignacion));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_ENCARGADO',
      'ERROR',
      'infraestructura',
      'encargado',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_sucursal', p_id_sucursal,
        'id_empleado', p_id_empleado
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 424 (class 1255 OID 524296)
-- Name: api_crear_espacio(bigint, bigint, character varying, character varying, smallint, smallint, double precision, double precision); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_espacio(p_id_sesion bigint, p_id_edificio bigint, p_nombre character varying, p_tipo character varying, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_espacio bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.CREAR',
    'CREAR_ESPACIO'
  );

  v_id_espacio := infraestructura.fn_crear_espacio(
    v_id_usuario,
    p_id_edificio,
    p_nombre,
    p_tipo,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m
  );

  v_msg := format('Espacio creado (id_espacio=%s)', v_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_ESPACIO',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', v_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_edificio', p_id_edificio,
      'nombre', p_nombre,
      'tipo', p_tipo,
      'piso', p_piso,
      'capacidad', p_capacidad
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_espacio', v_id_espacio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_ESPACIO',
      'ERROR',
      'infraestructura',
      'espacio',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_edificio', p_id_edificio,
        'nombre', p_nombre
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 431 (class 1255 OID 524300)
-- Name: api_crear_sala(bigint, bigint, character varying, character varying, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_sala(p_id_sesion bigint, p_id_edificio bigint, p_nombre character varying, p_categoria_sala character varying, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_espacio bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.ESPACIO.CREAR',
    'CREAR_SALA'
  );

  v_id_espacio := infraestructura.fn_crear_sala(
    v_id_usuario,
    p_id_edificio,
    p_nombre,
    p_categoria_sala::infraestructura.categoria_sala,
    p_es_privada,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones
  );

  v_msg := format('Sala creada (id_espacio=%s)', v_id_espacio);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_SALA',
    'INFO',
    'infraestructura',
    'espacio',
    jsonb_build_object('id_espacio', v_id_espacio),
    TRUE,
    jsonb_build_object(
      'id_edificio', p_id_edificio,
      'tipo', 'SALA',
      'nombre', p_nombre,
      'categoria_sala', p_categoria_sala,
      'es_privada', p_es_privada,
      'piso', p_piso,
      'capacidad', p_capacidad
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_espacio', v_id_espacio));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_SALA',
      'ERROR',
      'infraestructura',
      'espacio',
      NULL,
      FALSE,
      jsonb_build_object('sqlstate', SQLSTATE, 'error', SQLERRM, 'id_edificio', p_id_edificio, 'nombre', p_nombre)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 492 (class 1255 OID 524288)
-- Name: api_crear_sucursal(bigint, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, double precision, double precision); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_sucursal(p_id_sesion bigint, p_codigo character varying, p_nombre character varying, p_telefono character varying, p_email character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_horario_texto character varying, p_largo_m double precision, p_ancho_m double precision) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_sucursal bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.SUCURSAL.CREAR',
    'CREAR_SUCURSAL'
  );

  v_id_sucursal := infraestructura.fn_crear_sucursal(
    v_id_usuario,
    p_codigo,
    p_nombre,
    p_telefono,
    p_email,
    p_direccion_linea1,
    p_ciudad,
    p_departamento,
    p_pais,
    p_horario_texto,
    p_largo_m,
    p_ancho_m
  );

  v_msg := format('Sucursal creada (id_sucursal=%s)', v_id_sucursal);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_SUCURSAL',
    'INFO',
    'infraestructura',
    'sucursal',
    jsonb_build_object('id_sucursal', v_id_sucursal),
    TRUE,
    jsonb_build_object(
      'codigo', p_codigo,
      'nombre', p_nombre,
      'telefono', p_telefono,
      'email', p_email,
      'ciudad', p_ciudad,
      'departamento', p_departamento,
      'pais', p_pais,
      'horario_texto', p_horario_texto,
      'largo_m', p_largo_m,
      'ancho_m', p_ancho_m
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_sucursal', v_id_sucursal));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_SUCURSAL',
      'ERROR',
      'infraestructura',
      'sucursal',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'codigo', p_codigo
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 656 (class 1255 OID 516115)
-- Name: api_crear_tienda(bigint, bigint, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_tienda(p_id_sesion bigint, p_id_espacio bigint, p_codigo character varying, p_nombre character varying, p_horario_texto character varying, p_id_responsable bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_tienda bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.TIENDA.CREAR',
    'CREAR_TIENDA'
  );

  v_id_tienda := infraestructura.fn_crear_tienda(
    v_id_usuario,
    p_id_espacio, p_codigo, p_nombre, p_horario_texto, p_id_responsable
  );

  v_msg := format('Tienda creada (id_tienda=%s)', v_id_tienda);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_TIENDA',
    'INFO',
    'infraestructura',
    'tienda',
    jsonb_build_object('id_tienda', v_id_tienda),
    TRUE,
    jsonb_build_object(
      'id_espacio', p_id_espacio,
      'codigo', p_codigo,
      'nombre', p_nombre,
      'id_responsable', p_id_responsable
    )
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_tienda', v_id_tienda));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_TIENDA',
      'ERROR',
      'infraestructura',
      'tienda',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'codigo', p_codigo
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 634 (class 1255 OID 696320)
-- Name: api_crear_tienda_con_espacio(bigint, bigint, character varying, character varying, character varying, bigint, character varying, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_crear_tienda_con_espacio(p_id_sesion bigint, p_id_edificio bigint, p_codigo character varying, p_nombre character varying, p_horario_texto character varying DEFAULT NULL::character varying, p_id_responsable bigint DEFAULT NULL::bigint, p_espacio_nombre character varying DEFAULT NULL::character varying, p_es_privada boolean DEFAULT false, p_piso smallint DEFAULT NULL::smallint, p_capacidad smallint DEFAULT NULL::smallint, p_largo_m double precision DEFAULT NULL::double precision, p_ancho_m double precision DEFAULT NULL::double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_espacio bigint;
  v_id_tienda  bigint;

  v_id_persona_responsable bigint;
  v_created_space boolean := false;

  v_nombre_espacio character varying;
BEGIN
  -- Permiso
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INFRA.TIENDA.CREAR',
    'CREAR_TIENDA'
  );

  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- Resolver responsable (si viene):
  -- a) persona.id_persona
  -- b) administracion.empleado.id_empleado -> empleado.id_persona
  v_id_persona_responsable := NULL;

  IF p_id_responsable IS NOT NULL THEN
    SELECT p.id_persona
      INTO v_id_persona_responsable
    FROM persona.persona p
    WHERE p.id_persona = p_id_responsable;

    IF v_id_persona_responsable IS NULL THEN
      SELECT e.id_persona
        INTO v_id_persona_responsable
      FROM administracion.empleado e
      WHERE e.id_empleado = p_id_responsable;
    END IF;

    IF v_id_persona_responsable IS NULL THEN
      RAISE EXCEPTION
        'responsable inválido: no existe como persona.id_persona ni como administracion.empleado.id_empleado (valor=%)',
        p_id_responsable
      USING ERRCODE='foreign_key_violation';
    END IF;
  END IF;

  -- Crear espacio tipo SALA categoria TIENDA
  v_nombre_espacio := COALESCE(NULLIF(btrim(p_espacio_nombre), ''), p_nombre);

  v_id_espacio := infraestructura.fn_crear_sala(
    v_id_usuario,
    p_id_edificio,
    v_nombre_espacio,
    'TIENDA'::infraestructura.categoria_sala,
    coalesce(p_es_privada,false),
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones
  );
  v_created_space := true;

  -- Crear tienda apuntando al espacio creado
  v_id_tienda := infraestructura.fn_crear_tienda(
    v_id_usuario,
    v_id_espacio,
    p_codigo,
    p_nombre,
    p_horario_texto,
    v_id_persona_responsable
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_TIENDA',
    'INFO',
    'infraestructura',
    'tienda',
    jsonb_build_object('id_tienda', v_id_tienda),
    TRUE,
    jsonb_build_object(
      'id_espacio', v_id_espacio,
      'id_edificio', p_id_edificio,
      'codigo', p_codigo,
      'nombre', p_nombre,
      'horario_texto', p_horario_texto,
      'id_responsable_in', p_id_responsable,
      'id_responsable_persona', v_id_persona_responsable
    )
  );

  RETURN seguridad.fn_api_result(
    TRUE,
    format('Tienda creada (id_tienda=%s)', v_id_tienda),
    jsonb_build_object('id_tienda', v_id_tienda, 'id_espacio', v_id_espacio)
  );

EXCEPTION
  WHEN OTHERS THEN
    -- rollback lógico: si el espacio fue creado y la tienda falló, eliminamos el espacio
    IF v_created_space AND v_id_espacio IS NOT NULL THEN
      BEGIN
        DELETE FROM infraestructura.espacio WHERE id_espacio = v_id_espacio;
      EXCEPTION WHEN OTHERS THEN
        -- no ocultar el error original; solo evitar que el delete rompa el handler
        NULL;
      END;
    END IF;

    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_TIENDA',
      'ERROR',
      'infraestructura',
      'tienda',
      NULL,
      FALSE,
      jsonb_build_object('sqlstate', SQLSTATE, 'error', SQLERRM)
    );

    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 451 (class 1255 OID 679936)
-- Name: api_health(); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_health() RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN seguridad.fn_api_result(TRUE, 'OK', jsonb_build_object('module','infraestructura'));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 585 (class 1255 OID 679939)
-- Name: api_listar_edificios(bigint, bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_listar_edificios(p_id_sesion bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INFRA.EDIFICIO.VER','LISTAR_EDIFICIO');

  SELECT COUNT(*)
    INTO v_total
  FROM infraestructura.edificio e
  JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
  WHERE
    (NOT COALESCE(p_only_activos,true) OR e.estado_registro='Activo')
    AND (p_id_sucursal IS NULL OR e.id_sucursal = p_id_sucursal)
    AND (
      v_q IS NULL
      OR lower(e.codigo) LIKE '%'||lower(v_q)||'%'
      OR lower(e.nombre) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(e.ciudad,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(s.nombre,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      e.id_edificio,
      e.id_sucursal,
      s.codigo AS sucursal_codigo,
      s.nombre AS sucursal_nombre,
      e.codigo,
      e.nombre,
      e.direccion_linea1,
      e.ciudad,
      e.departamento,
      e.pais,
      e.latitud,
      e.longitud,
      e.pisos,
      e.largo_m,
      e.ancho_m,
      e.id_administrador,
      e.estado_registro,
      e.fecha_registro,
      e.fecha_modificacion,
      e.version_registro
    FROM infraestructura.edificio e
    JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
    WHERE
      (NOT COALESCE(p_only_activos,true) OR e.estado_registro='Activo')
      AND (p_id_sucursal IS NULL OR e.id_sucursal = p_id_sucursal)
      AND (
        v_q IS NULL
        OR lower(e.codigo) LIKE '%'||lower(v_q)||'%'
        OR lower(e.nombre) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(e.ciudad,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(s.nombre,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY e.id_edificio DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 547 (class 1255 OID 679942)
-- Name: api_listar_encargados(bigint, bigint, integer, integer, boolean); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_listar_encargados(p_id_sesion bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INFRA.ENCARGADO.VER','LISTAR_ENCARGADO');

  SELECT COUNT(*)
    INTO v_total
  FROM infraestructura.encargado ec
  JOIN infraestructura.sucursal s ON s.id_sucursal = ec.id_sucursal::bigint
  WHERE
    (NOT COALESCE(p_only_activos,true) OR ec.estado_registro='Activo')
    AND (p_id_sucursal IS NULL OR s.id_sucursal = p_id_sucursal);

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      ec.id_asignacion,
      ec.id_sucursal,
      s.codigo AS sucursal_codigo,
      s.nombre AS sucursal_nombre,
      ec.id_empleado,
      ec.fecha_inicio,
      ec.fecha_fin,
      ec.estado_registro,
      ec.fecha_registro,
      ec.fecha_modificacion,
      ec.version_registro
    FROM infraestructura.encargado ec
    JOIN infraestructura.sucursal s ON s.id_sucursal = ec.id_sucursal::bigint
    WHERE
      (NOT COALESCE(p_only_activos,true) OR ec.estado_registro='Activo')
      AND (p_id_sucursal IS NULL OR s.id_sucursal = p_id_sucursal)
    ORDER BY ec.id_asignacion DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 503 (class 1255 OID 679940)
-- Name: api_listar_espacios(bigint, bigint, text, integer, integer, boolean, text); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_listar_espacios(p_id_sesion bigint, p_id_edificio bigint DEFAULT NULL::bigint, p_tipo text DEFAULT NULL::text, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_tipo   text := infraestructura.fn_norm_q(p_tipo);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INFRA.ESPACIO.VER','LISTAR_ESPACIO');

  SELECT COUNT(*)
    INTO v_total
  FROM infraestructura.espacio es
  JOIN infraestructura.edificio e ON e.id_edificio = es.id_edificio
  JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
  WHERE
    (NOT COALESCE(p_only_activos,true) OR es.estado_registro='Activo')
    AND (p_id_edificio IS NULL OR es.id_edificio = p_id_edificio)
    AND (v_tipo IS NULL OR es.tipo::text = v_tipo)
    AND (
      v_q IS NULL
      OR lower(es.nombre) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(es.observaciones,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(e.nombre,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(s.nombre,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      es.id_espacio,
      es.id_edificio,
      e.codigo AS edificio_codigo,
      e.nombre AS edificio_nombre,
      e.id_sucursal,
      s.codigo AS sucursal_codigo,
      s.nombre AS sucursal_nombre,
      es.tipo,
      es.categoria_sala,
      es.tipo_aula,
      es.es_privada,
      es.nombre,
      es.piso,
      es.capacidad,
      es.largo_m,
      es.ancho_m,
      es.observaciones,
      es.estado_registro,
      es.fecha_registro,
      es.fecha_modificacion,
      es.version_registro
    FROM infraestructura.espacio es
    JOIN infraestructura.edificio e ON e.id_edificio = es.id_edificio
    JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
    WHERE
      (NOT COALESCE(p_only_activos,true) OR es.estado_registro='Activo')
      AND (p_id_edificio IS NULL OR es.id_edificio = p_id_edificio)
      AND (v_tipo IS NULL OR es.tipo::text = v_tipo)
      AND (
        v_q IS NULL
        OR lower(es.nombre) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(es.observaciones,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(e.nombre,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(s.nombre,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY es.id_espacio DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 415 (class 1255 OID 679938)
-- Name: api_listar_sucursales(bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_listar_sucursales(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INFRA.SUCURSAL.VER','LISTAR_SUCURSAL');

  SELECT COUNT(*)
    INTO v_total
  FROM infraestructura.sucursal s
  WHERE
    (NOT COALESCE(p_only_activos,true) OR s.estado_registro='Activo')
    AND (
      v_q IS NULL
      OR lower(s.codigo) LIKE '%'||lower(v_q)||'%'
      OR lower(s.nombre) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(s.ciudad,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(s.departamento,'')) LIKE '%'||lower(v_q)||'%'
      OR lower(coalesce(s.pais,'')) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      s.id_sucursal,
      s.codigo,
      s.nombre,
      s.telefono,
      s.email,
      s.direccion_linea1,
      s.ciudad,
      s.departamento,
      s.pais,
      s.horario_texto,
      s.largo_m,
      s.ancho_m,
      s.estado_registro,
      s.fecha_registro,
      s.fecha_modificacion,
      s.version_registro
    FROM infraestructura.sucursal s
    WHERE
      (NOT COALESCE(p_only_activos,true) OR s.estado_registro='Activo')
      AND (
        v_q IS NULL
        OR lower(s.codigo) LIKE '%'||lower(v_q)||'%'
        OR lower(s.nombre) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(s.ciudad,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(s.departamento,'')) LIKE '%'||lower(v_q)||'%'
        OR lower(coalesce(s.pais,'')) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY s.id_sucursal DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 378 (class 1255 OID 679941)
-- Name: api_listar_tiendas(bigint, bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.api_listar_tiendas(p_id_sesion bigint, p_id_sucursal bigint DEFAULT NULL::bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_limit  integer := GREATEST(1, LEAST(500, COALESCE(p_limit,50)));
  v_offset integer := GREATEST(0, COALESCE(p_offset,0));
  v_q      text := infraestructura.fn_norm_q(p_q);
  v_total  bigint;
  v_rows   jsonb;
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INFRA.TIENDA.VER','LISTAR_TIENDA');

  SELECT COUNT(*)
    INTO v_total
  FROM infraestructura.tienda t
  LEFT JOIN infraestructura.espacio es ON es.id_espacio = t.id_espacio
  LEFT JOIN infraestructura.edificio e ON e.id_edificio = es.id_edificio
  LEFT JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
  WHERE
    (NOT COALESCE(p_only_activos,true) OR t.estado_registro='Activo')
    AND (p_id_sucursal IS NULL OR s.id_sucursal = p_id_sucursal)
    AND (
      v_q IS NULL
      OR lower(t.codigo) LIKE '%'||lower(v_q)||'%'
      OR lower(t.nombre) LIKE '%'||lower(v_q)||'%'
    );

  SELECT COALESCE(jsonb_agg(to_jsonb(t2)),'[]'::jsonb)
    INTO v_rows
  FROM (
    SELECT
      t.id_tienda,
      t.id_espacio,
      es.nombre AS espacio_nombre,
      e.id_edificio,
      e.codigo AS edificio_codigo,
      e.nombre AS edificio_nombre,
      s.id_sucursal,
      s.codigo AS sucursal_codigo,
      s.nombre AS sucursal_nombre,
      t.codigo,
      t.nombre,
      t.horario_texto,
      t.id_responsable,
      t.estado_registro,
      t.fecha_registro,
      t.fecha_modificacion,
      t.version_registro
    FROM infraestructura.tienda t
    LEFT JOIN infraestructura.espacio es ON es.id_espacio = t.id_espacio
    LEFT JOIN infraestructura.edificio e ON e.id_edificio = es.id_edificio
    LEFT JOIN infraestructura.sucursal s ON s.id_sucursal = e.id_sucursal
    WHERE
      (NOT COALESCE(p_only_activos,true) OR t.estado_registro='Activo')
      AND (p_id_sucursal IS NULL OR s.id_sucursal = p_id_sucursal)
      AND (
        v_q IS NULL
        OR lower(t.codigo) LIKE '%'||lower(v_q)||'%'
        OR lower(t.nombre) LIKE '%'||lower(v_q)||'%'
      )
    ORDER BY t.id_tienda DESC
    LIMIT v_limit OFFSET v_offset
  ) t2;

  RETURN seguridad.fn_api_result(TRUE,'OK',jsonb_build_object(
    'rows', v_rows,
    'paging', jsonb_build_object('limit',v_limit,'offset',v_offset,'total',v_total)
  ));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 513 (class 1255 OID 671745)
-- Name: fn_actualizar_aula(bigint, bigint, bigint, character varying, infraestructura.tipo_aula, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_aula(p_id_actor bigint, p_id_espacio bigint, p_id_edificio bigint, p_nombre character varying, p_tipo_aula infraestructura.tipo_aula, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_tipo infraestructura.tipo_espacio;
BEGIN
  IF p_id_espacio IS NULL THEN
    RAISE EXCEPTION 'id_espacio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_tipo_aula IS NULL THEN
    RAISE EXCEPTION 'tipo_aula es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  SELECT e.tipo
    INTO v_tipo
  FROM infraestructura.espacio e
  WHERE e.id_espacio = p_id_espacio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'aula no existe' USING ERRCODE='no_data_found';
  END IF;

  IF v_tipo <> 'AULA'::infraestructura.tipo_espacio THEN
    RAISE EXCEPTION 'El espacio % no es AULA (tipo actual=%)', p_id_espacio, v_tipo::text
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE infraestructura.espacio
     SET id_edificio         = p_id_edificio,
         tipo                = 'AULA'::infraestructura.tipo_espacio,
         tipo_aula           = p_tipo_aula,
         categoria_sala      = NULL,
         es_privada          = coalesce(p_es_privada,false),
         nombre              = p_nombre,
         piso                = p_piso,
         capacidad           = p_capacidad,
         largo_m             = p_largo_m,
         ancho_m             = p_ancho_m,
         observaciones       = p_observaciones,
         fecha_modificacion  = now(),
         id_usuario_modificacion = p_id_actor,
         version_registro    = version_registro + 1
   WHERE id_espacio = p_id_espacio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'aula no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 475 (class 1255 OID 516099)
-- Name: fn_actualizar_edificio(bigint, bigint, bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, smallint, double precision, double precision, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_edificio(p_id_actor bigint, p_id_edificio bigint, p_id_sucursal bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_latitud numeric, p_longitud numeric, p_pisos smallint, p_largo_m double precision, p_ancho_m double precision, p_id_administrador bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_edificio IS NULL THEN RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF NOT EXISTS (SELECT 1 FROM infraestructura.edificio WHERE id_edificio = p_id_edificio AND coalesce(estado_registro,'Activo') <> 'Eliminado') THEN
    RAISE EXCEPTION 'edificio no existe' USING ERRCODE='no_data_found';
  END IF;

  IF p_id_sucursal IS NULL THEN RAISE EXCEPTION 'id_sucursal es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_codigo::text),'') = '' THEN RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  UPDATE infraestructura.edificio
  SET
    id_sucursal = p_id_sucursal,
    codigo = p_codigo,
    nombre = p_nombre,
    direccion_linea1 = p_direccion_linea1,
    ciudad = p_ciudad,
    departamento = p_departamento,
    pais = p_pais,
    latitud = p_latitud,
    longitud = p_longitud,
    pisos = p_pisos,
    largo_m = p_largo_m,
    ancho_m = p_ancho_m,
    id_administrador = p_id_administrador,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = version_registro + 1
  WHERE id_edificio = p_id_edificio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'edificio no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 520 (class 1255 OID 516101)
-- Name: fn_actualizar_encargado(bigint, bigint, bigint, bigint, date, date); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_encargado(p_id_actor bigint, p_id_asignacion bigint, p_id_sucursal bigint, p_id_empleado bigint, p_fecha_inicio date, p_fecha_fin date) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_asignacion IS NULL THEN RAISE EXCEPTION 'id_asignacion es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF NOT EXISTS (SELECT 1 FROM infraestructura.encargado WHERE id_asignacion = p_id_asignacion AND coalesce(estado_registro,'Activo') <> 'Eliminado') THEN
    RAISE EXCEPTION 'encargado no existe' USING ERRCODE='no_data_found';
  END IF;

  IF p_id_sucursal IS NULL THEN RAISE EXCEPTION 'id_sucursal es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_id_empleado IS NULL THEN RAISE EXCEPTION 'id_empleado es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_fecha_inicio IS NULL THEN RAISE EXCEPTION 'fecha_inicio es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_fecha_fin IS NULL THEN RAISE EXCEPTION 'fecha_fin es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  UPDATE infraestructura.encargado
  SET
    id_sucursal = p_id_sucursal,
    id_empleado = p_id_empleado,
    fecha_inicio = p_fecha_inicio,
    fecha_fin = p_fecha_fin,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = version_registro + 1
  WHERE id_asignacion = p_id_asignacion;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'encargado no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 444 (class 1255 OID 671744)
-- Name: fn_actualizar_espacio(bigint, bigint, bigint, character varying, character varying, character varying, smallint, smallint, double precision, double precision); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_espacio(p_id_actor bigint, p_id_espacio bigint, p_id_edificio bigint, p_codigo character varying, p_nombre character varying, p_tipo character varying, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_tipo infraestructura.tipo_espacio;
BEGIN
  IF p_id_espacio IS NULL THEN
    RAISE EXCEPTION 'id_espacio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  SELECT e.tipo
    INTO v_tipo
  FROM infraestructura.espacio e
  WHERE e.id_espacio = p_id_espacio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'espacio no existe' USING ERRCODE='no_data_found';
  END IF;

  IF p_tipo IS NOT NULL AND upper(trim(p_tipo)) <> v_tipo::text THEN
    RAISE EXCEPTION 'No se permite cambiar tipo de espacio (actual=% , recibido=%)',
      v_tipo::text, p_tipo
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE infraestructura.espacio
     SET id_edificio         = p_id_edificio,
         nombre              = p_nombre,
         piso                = p_piso,
         capacidad           = p_capacidad,
         largo_m             = p_largo_m,
         ancho_m             = p_ancho_m,
         fecha_modificacion  = now(),
         id_usuario_modificacion = p_id_actor,
         version_registro    = version_registro + 1
   WHERE id_espacio = p_id_espacio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'espacio no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 360 (class 1255 OID 671747)
-- Name: fn_actualizar_sala(bigint, bigint, bigint, character varying, infraestructura.categoria_sala, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_sala(p_id_actor bigint, p_id_espacio bigint, p_id_edificio bigint, p_nombre character varying, p_categoria_sala infraestructura.categoria_sala, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_tipo infraestructura.tipo_espacio;
BEGIN
  IF p_id_espacio IS NULL THEN
    RAISE EXCEPTION 'id_espacio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_categoria_sala IS NULL THEN
    RAISE EXCEPTION 'categoria_sala es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  SELECT e.tipo
    INTO v_tipo
  FROM infraestructura.espacio e
  WHERE e.id_espacio = p_id_espacio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'sala no existe' USING ERRCODE='no_data_found';
  END IF;

  IF v_tipo <> 'SALA'::infraestructura.tipo_espacio THEN
    RAISE EXCEPTION 'El espacio % no es SALA (tipo actual=%)', p_id_espacio, v_tipo::text
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE infraestructura.espacio
     SET id_edificio         = p_id_edificio,
         tipo                = 'SALA'::infraestructura.tipo_espacio,
         categoria_sala      = p_categoria_sala,
         tipo_aula           = NULL,
         es_privada          = coalesce(p_es_privada,false),
         nombre              = p_nombre,
         piso                = p_piso,
         capacidad           = p_capacidad,
         largo_m             = p_largo_m,
         ancho_m             = p_ancho_m,
         observaciones       = p_observaciones,
         fecha_modificacion  = now(),
         id_usuario_modificacion = p_id_actor,
         version_registro    = version_registro + 1
   WHERE id_espacio = p_id_espacio;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'sala no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 549 (class 1255 OID 516105)
-- Name: fn_actualizar_sucursal(bigint, bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, character varying, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_sucursal(p_id_actor bigint, p_id_sucursal bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_latitud numeric, p_longitud numeric, p_telefono character varying, p_email character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_sucursal IS NULL THEN
    RAISE EXCEPTION 'id_sucursal es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE infraestructura.sucursal
     SET codigo              = p_codigo,
         nombre              = p_nombre,
         telefono            = p_telefono,
         email               = p_email,
         direccion_linea1    = p_direccion_linea1,
         ciudad              = p_ciudad,
         departamento        = p_departamento,
         pais                = p_pais,
         fecha_modificacion  = now(),
         id_usuario_modificacion = p_id_actor,
         version_registro    = version_registro + 1
   WHERE id_sucursal = p_id_sucursal;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'sucursal no existe o no se pudo actualizar'
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 552 (class 1255 OID 516108)
-- Name: fn_actualizar_tienda(bigint, bigint, bigint, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_actualizar_tienda(p_id_actor bigint, p_id_tienda bigint, p_id_espacio bigint, p_codigo character varying, p_nombre character varying, p_horario_texto character varying, p_id_responsable bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_tienda IS NULL THEN RAISE EXCEPTION 'id_tienda es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF NOT EXISTS (SELECT 1 FROM infraestructura.tienda WHERE id_tienda = p_id_tienda AND coalesce(estado_registro,'Activo') <> 'Eliminado') THEN
    RAISE EXCEPTION 'tienda no existe' USING ERRCODE='no_data_found';
  END IF;

  IF coalesce(trim(p_codigo::text),'') = '' THEN RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  UPDATE infraestructura.tienda
  SET
    id_espacio = p_id_espacio,
    codigo = p_codigo,
    nombre = p_nombre,
    horario_texto = p_horario_texto,
    id_responsable = p_id_responsable,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = version_registro + 1
  WHERE id_tienda = p_id_tienda;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'tienda no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 655 (class 1255 OID 524297)
-- Name: fn_crear_aula(bigint, bigint, character varying, infraestructura.tipo_aula, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_aula(p_id_actor bigint, p_id_edificio bigint, p_nombre character varying, p_tipo_aula infraestructura.tipo_aula, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_tipo_aula IS NULL THEN
    RAISE EXCEPTION 'tipo_aula es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO infraestructura.espacio (
    id_edificio,
    tipo,
    categoria_sala,
    tipo_aula,
    es_privada,
    nombre,
    piso,
    capacidad,
    largo_m,
    ancho_m,
    observaciones,
    estado_registro,
    fecha_registro,
    version_registro,
    id_usuario_creador
  ) VALUES (
    p_id_edificio,
    'AULA'::infraestructura.tipo_espacio,
    NULL,
    p_tipo_aula,
    coalesce(p_es_privada,false),
    p_nombre,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_espacio INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 639 (class 1255 OID 155674)
-- Name: fn_crear_aula(bigint, character varying, smallint, smallint, double precision, double precision, character varying, infraestructura.tipo_aula, boolean, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_aula(p_id_edificio bigint, p_nombre character varying, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying, p_tipo_aula infraestructura.tipo_aula, p_es_privada boolean DEFAULT false, p_id_usuario_creador bigint DEFAULT NULL::bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_espacio bigint;
BEGIN
  -- Validaciones mínimas
  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'p_id_edificio es obligatorio';
  END IF;
  IF p_tipo_aula IS NULL THEN
    RAISE EXCEPTION 'p_tipo_aula es obligatorio';
  END IF;
  IF p_largo_m IS NOT NULL AND p_largo_m <= 0 THEN
    RAISE EXCEPTION 'p_largo_m debe ser > 0';
  END IF;
  IF p_ancho_m IS NOT NULL AND p_ancho_m <= 0 THEN
    RAISE EXCEPTION 'p_ancho_m debe ser > 0';
  END IF;

  INSERT INTO infraestructura.espacio(
    id_edificio,
    tipo,
    categoria_sala,
    tipo_aula,
    es_privada,
    nombre,
    piso,
    capacidad,
    largo_m,
    ancho_m,
    observaciones,
    id_usuario_creador
  )
  VALUES (
    p_id_edificio,
    'AULA'::infraestructura.tipo_espacio,
    NULL,
    p_tipo_aula,
    COALESCE(p_es_privada,false),
    p_nombre,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones,
    p_id_usuario_creador
  )
  RETURNING id_espacio INTO v_id_espacio;

  RETURN v_id_espacio;
END;
$$;


--
-- TOC entry 446 (class 1255 OID 516096)
-- Name: fn_crear_edificio(bigint, bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, smallint, double precision, double precision, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_edificio(p_id_actor bigint, p_id_sucursal bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_latitud numeric, p_longitud numeric, p_pisos smallint, p_largo_m double precision, p_ancho_m double precision, p_id_administrador bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_sucursal IS NULL THEN RAISE EXCEPTION 'id_sucursal es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_codigo::text),'') = '' THEN RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  INSERT INTO infraestructura.edificio (
    id_sucursal, codigo, nombre, direccion_linea1, ciudad, departamento, pais, latitud, longitud, pisos, largo_m, ancho_m, id_administrador,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_sucursal, p_codigo, p_nombre, p_direccion_linea1, p_ciudad, p_departamento, p_pais, p_latitud, p_longitud, p_pisos, p_largo_m, p_ancho_m, p_id_administrador,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_edificio INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 638 (class 1255 OID 516100)
-- Name: fn_crear_encargado(bigint, bigint, bigint, date, date); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_encargado(p_id_actor bigint, p_id_sucursal bigint, p_id_empleado bigint, p_fecha_inicio date, p_fecha_fin date DEFAULT NULL::date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_sucursal IS NULL THEN RAISE EXCEPTION 'id_sucursal es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_id_empleado IS NULL THEN RAISE EXCEPTION 'id_empleado es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_fecha_inicio IS NULL THEN RAISE EXCEPTION 'fecha_inicio es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  INSERT INTO infraestructura.encargado (
    id_sucursal, id_empleado, fecha_inicio, fecha_fin,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_sucursal, p_id_empleado, p_fecha_inicio, p_fecha_fin,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_asignacion INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 579 (class 1255 OID 524295)
-- Name: fn_crear_espacio(bigint, bigint, character varying, character varying, smallint, smallint, double precision, double precision); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_espacio(p_id_actor bigint, p_id_edificio bigint, p_nombre character varying, p_tipo character varying, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_tipo::text),'') = '' THEN
    RAISE EXCEPTION 'tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO infraestructura.espacio (
    id_edificio,
    tipo,
    categoria_sala,
    tipo_aula,
    es_privada,
    nombre,
    piso,
    capacidad,
    largo_m,
    ancho_m,
    observaciones,
    estado_registro,
    fecha_registro,
    version_registro,
    id_usuario_creador
  ) VALUES (
    p_id_edificio,
    p_tipo::infraestructura.tipo_espacio,
    NULL,
    NULL,
    FALSE,
    p_nombre,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    NULL,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_espacio INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 496 (class 1255 OID 524299)
-- Name: fn_crear_sala(bigint, bigint, character varying, infraestructura.categoria_sala, boolean, smallint, smallint, double precision, double precision, character varying); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_sala(p_id_actor bigint, p_id_edificio bigint, p_nombre character varying, p_categoria_sala infraestructura.categoria_sala, p_es_privada boolean, p_piso smallint, p_capacidad smallint, p_largo_m double precision, p_ancho_m double precision, p_observaciones character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_edificio IS NULL THEN
    RAISE EXCEPTION 'id_edificio es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_categoria_sala IS NULL THEN
    RAISE EXCEPTION 'categoria_sala es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO infraestructura.espacio (
    id_edificio,
    tipo,
    categoria_sala,
    tipo_aula,
    es_privada,
    nombre,
    piso,
    capacidad,
    largo_m,
    ancho_m,
    observaciones,
    estado_registro,
    fecha_registro,
    version_registro,
    id_usuario_creador
  ) VALUES (
    p_id_edificio,
    'SALA'::infraestructura.tipo_espacio,
    p_categoria_sala,
    NULL,
    coalesce(p_es_privada,false),
    p_nombre,
    p_piso,
    p_capacidad,
    p_largo_m,
    p_ancho_m,
    p_observaciones,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_espacio INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 519 (class 1255 OID 524293)
-- Name: fn_crear_sucursal(bigint, character varying, character varying, character varying, character varying, character varying, character varying, numeric, numeric, character varying, character varying, character); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_sucursal(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_largo_m numeric, p_ancho_m numeric, p_telefono character varying, p_email character varying, p_horario_texto character) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  INSERT INTO infraestructura.sucursal (
    codigo, 
	nombre, 
	direccion_linea1, 
	ciudad, 
	departamento, 
	pais, 
	largo_m, 
	ancho_m, 
	telefono, 
	email,
    estado_registro, 
	fecha_registro, version_registro, id_usuario_creador,
	horario_texto
  ) VALUES (
    p_codigo, p_nombre, p_direccion_linea1, p_ciudad, p_departamento, p_pais, p_largo_m, p_ancho_m, p_telefono, p_email,
    'Activo', now(), 1, p_id_actor, p_horario_texto
  )
  RETURNING id_sucursal INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 466 (class 1255 OID 524294)
-- Name: fn_crear_sucursal(bigint, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, double precision, double precision); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_sucursal(p_id_actor bigint, p_codigo character varying, p_nombre character varying, p_telefono character varying, p_email character varying, p_direccion_linea1 character varying, p_ciudad character varying, p_departamento character varying, p_pais character varying, p_horario_texto character varying, p_largo_m double precision, p_ancho_m double precision) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN
    RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre::text),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO infraestructura.sucursal (
    codigo,
    nombre,
    telefono,
    email,
    direccion_linea1,
    ciudad,
    departamento,
    pais,
    horario_texto,
    largo_m,
    ancho_m,
    estado_registro,
    fecha_registro,
    version_registro,
    id_usuario_creador
  ) VALUES (
    p_codigo,
    p_nombre,
    p_telefono,
    p_email,
    p_direccion_linea1,
    p_ciudad,
    p_departamento,
    p_pais,
    p_horario_texto,
    p_largo_m,
    p_ancho_m,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_sucursal INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 514 (class 1255 OID 516107)
-- Name: fn_crear_tienda(bigint, bigint, character varying, character varying, character varying, bigint); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_crear_tienda(p_id_actor bigint, p_id_espacio bigint, p_codigo character varying, p_nombre character varying, p_horario_texto character varying, p_id_responsable bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF coalesce(trim(p_codigo::text),'') = '' THEN RAISE EXCEPTION 'codigo es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_nombre::text),'') = '' THEN RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  INSERT INTO infraestructura.tienda (
    id_espacio, codigo, nombre, horario_texto, id_responsable,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_espacio, p_codigo, p_nombre, p_horario_texto, p_id_responsable,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_tienda INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 426 (class 1255 OID 679937)
-- Name: fn_norm_q(text); Type: FUNCTION; Schema: infraestructura; Owner: -
--

CREATE FUNCTION infraestructura.fn_norm_q(p_q text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT NULLIF(btrim(COALESCE(p_q,'')), '')
$$;


--
-- TOC entry 553 (class 1255 OID 557060)
-- Name: api_actualizar_bien(bigint, bigint, character varying, character varying, character varying, text, character varying, character varying, character varying, character varying, numeric, boolean, boolean, character varying, numeric, numeric, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, bigint, bigint, bigint, bigint, bigint, numeric, integer, numeric, character varying, boolean); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_actualizar_bien(p_id_sesion bigint, p_id_bien bigint, p_sku character varying, p_nombre character varying, p_tipo character varying, p_descripcion text DEFAULT NULL::text, p_categoria character varying DEFAULT NULL::character varying, p_subcategoria character varying DEFAULT NULL::character varying, p_unidad_compra character varying DEFAULT 'unidad'::character varying, p_unidad_venta character varying DEFAULT 'unidad'::character varying, p_factor_conversion numeric DEFAULT 1, p_controla_inventario_loteable boolean DEFAULT false, p_controla_inventario_no_loteable boolean DEFAULT false, p_metodo_valuacion character varying DEFAULT 'PROM'::character varying, p_costo_referencia numeric DEFAULT NULL::numeric, p_precio_referencia numeric DEFAULT NULL::numeric, p_moneda_referencia character varying DEFAULT 'BOB'::character varying, p_marca character varying DEFAULT NULL::character varying, p_modelo character varying DEFAULT NULL::character varying, p_codigo_barras character varying DEFAULT NULL::character varying, p_peso_kg numeric DEFAULT NULL::numeric, p_largo_m numeric DEFAULT NULL::numeric, p_ancho_m numeric DEFAULT NULL::numeric, p_profundidad_m numeric DEFAULT NULL::numeric, p_volumen_m3 numeric DEFAULT NULL::numeric, p_id_cuenta_existencias bigint DEFAULT NULL::bigint, p_id_cuenta_costo_venta bigint DEFAULT NULL::bigint, p_id_cuenta_ingreso bigint DEFAULT NULL::bigint, p_id_cuenta_depreciacion bigint DEFAULT NULL::bigint, p_id_cuenta_depreciacion_acumulada bigint DEFAULT NULL::bigint, p_valor_origen numeric DEFAULT NULL::numeric, p_vida_util_meses integer DEFAULT NULL::integer, p_valor_residual numeric DEFAULT NULL::numeric, p_metodo_depreciacion character varying DEFAULT NULL::character varying, p_es_producto_tienda boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.BIEN.GESTIONAR','ACTUALIZAR_BIEN');

  PERFORM inventario.fn_actualizar_bien(
    v_id_usuario,
    p_id_bien,
    p_sku, p_nombre,
    p_tipo::inventario.tipo_bien,
    p_descripcion, p_categoria, p_subcategoria,
    p_unidad_compra, p_unidad_venta, p_factor_conversion,
    p_controla_inventario_loteable, p_controla_inventario_no_loteable,
    p_metodo_valuacion::inventario.metodo_valuacion,
    p_costo_referencia, p_precio_referencia, p_moneda_referencia,
    p_marca, p_modelo, p_codigo_barras,
    p_peso_kg, p_largo_m, p_ancho_m, p_profundidad_m, p_volumen_m3,
    p_id_cuenta_existencias, p_id_cuenta_costo_venta, p_id_cuenta_ingreso,
    p_id_cuenta_depreciacion, p_id_cuenta_depreciacion_acumulada,
    p_valor_origen, p_vida_util_meses, p_valor_residual,
    CASE WHEN p_metodo_depreciacion IS NULL THEN NULL ELSE p_metodo_depreciacion::inventario.metodo_depreciacion END,
    p_es_producto_tienda
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_BIEN','INFO','inventario','bien',
    jsonb_build_object('id_bien', p_id_bien), TRUE,
    jsonb_build_object('sku',p_sku,'tipo',p_tipo)
  );

  RETURN seguridad.fn_api_result(TRUE,'Bien actualizado', jsonb_build_object('id_bien', p_id_bien));
EXCEPTION
  WHEN OTHERS THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 521 (class 1255 OID 548869)
-- Name: api_actualizar_bien_instancia(bigint, bigint, bigint, text, date, integer, numeric, numeric, character varying, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_actualizar_bien_instancia(p_id_sesion bigint, p_id_bien_instancia bigint, p_id_bien bigint, p_descripcion_especificaciones text, p_fecha_compra date, p_id_proveedor_compra integer DEFAULT NULL::integer, p_costo_compra numeric DEFAULT NULL::numeric, p_precio_compra numeric DEFAULT NULL::numeric, p_serial_unico character varying DEFAULT NULL::character varying, p_fecha_fabricacion date DEFAULT NULL::date, p_fecha_vencimiento date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.BIEN.GESTIONAR','ACTUALIZAR_BIEN_INSTANCIA');

  PERFORM inventario.fn_actualizar_bien_instancia(
    v_id_usuario,
    p_id_bien_instancia, p_id_bien, p_descripcion_especificaciones, p_fecha_compra,
    p_id_proveedor_compra, p_costo_compra, p_precio_compra,
    p_serial_unico, p_fecha_fabricacion, p_fecha_vencimiento
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_BIEN_INSTANCIA','INFO','inventario','bien_instancia',
    jsonb_build_object('id_bien_instancia', p_id_bien_instancia), TRUE,
    jsonb_build_object('id_bien',p_id_bien,'fecha_compra',p_fecha_compra)
  );

  RETURN seguridad.fn_api_result(TRUE,'Bien instancia actualizada', jsonb_build_object('id_bien_instancia', p_id_bien_instancia));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_BIEN_INSTANCIA','ERROR','inventario','bien_instancia',
      jsonb_build_object('id_bien_instancia',p_id_bien_instancia),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 622 (class 1255 OID 548871)
-- Name: api_actualizar_bien_lote(bigint, bigint, bigint, character varying, date, integer, integer, numeric, numeric, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_actualizar_bien_lote(p_id_sesion bigint, p_id_lote bigint, p_id_bien bigint, p_lote_codigo character varying, p_fecha_compra date, p_cantidad_compra integer, p_id_proveedor_compra integer DEFAULT NULL::integer, p_costo_compra_unitario numeric DEFAULT NULL::numeric, p_precio_compra_unitario numeric DEFAULT NULL::numeric, p_fecha_fabricacion date DEFAULT NULL::date, p_fecha_vencimiento date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.BIEN.GESTIONAR','ACTUALIZAR_BIEN_LOTE');

  -- ✅ ORDEN CORRECTO: ... p_id_proveedor_compra, p_cantidad_compra ...
  PERFORM inventario.fn_actualizar_bien_lote(
    v_id_usuario,
    p_id_lote,
    p_id_bien,
    p_lote_codigo,
    p_fecha_compra,
    p_id_proveedor_compra,
    p_cantidad_compra,
    p_costo_compra_unitario,
    p_precio_compra_unitario,
    p_fecha_fabricacion,
    p_fecha_vencimiento
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_BIEN_LOTE','INFO','inventario','bien_lote',
    jsonb_build_object('id_lote', p_id_lote), TRUE,
    jsonb_build_object(
      'id_bien',p_id_bien,
      'lote_codigo',p_lote_codigo,
      'cantidad_compra',p_cantidad_compra,
      'id_proveedor_compra',p_id_proveedor_compra
    )
  );

  RETURN seguridad.fn_api_result(TRUE,'Lote actualizado', jsonb_build_object('id_lote', p_id_lote));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_BIEN_LOTE','ERROR','inventario','bien_lote',
      jsonb_build_object('id_lote',p_id_lote),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 560 (class 1255 OID 548873)
-- Name: api_actualizar_movimiento_detalle(bigint, bigint, bigint, numeric, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_actualizar_movimiento_detalle(p_id_sesion bigint, p_id_movimiento bigint, p_id_bien bigint, p_cantidad numeric DEFAULT 1, p_id_lote bigint DEFAULT NULL::bigint, p_id_bien_instancia bigint DEFAULT NULL::bigint, p_id_espacio_entrada bigint DEFAULT NULL::bigint, p_id_espacio_salida bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.MOVIMIENTO.REGISTRAR','ACTUALIZAR_MOVIMIENTO_DETALLE');

  PERFORM inventario.fn_actualizar_movimiento_detalle(
    v_id_usuario,
    p_id_movimiento, p_id_bien, p_cantidad, p_id_lote, p_id_bien_instancia, p_id_espacio_entrada, p_id_espacio_salida
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_MOVIMIENTO_DETALLE','INFO','inventario','movimiento_detalle',
    jsonb_build_object('id_movimiento', p_id_movimiento), TRUE,
    jsonb_build_object('id_bien',p_id_bien,'cantidad',p_cantidad,'id_lote',p_id_lote,'id_bien_instancia',p_id_bien_instancia)
  );

  RETURN seguridad.fn_api_result(TRUE,'Movimiento detalle actualizado', jsonb_build_object('id_movimiento', p_id_movimiento));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_MOVIMIENTO_DETALLE','ERROR','inventario','movimiento_detalle',
      jsonb_build_object('id_movimiento',p_id_movimiento),FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 665 (class 1255 OID 557065)
-- Name: api_crear_bien(bigint, character varying, character varying, character varying, text, character varying, character varying, character varying, character varying, numeric, boolean, boolean, character varying, numeric, numeric, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, bigint, bigint, bigint, bigint, bigint, numeric, integer, numeric, character varying, boolean); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_crear_bien(p_id_sesion bigint, p_sku character varying, p_nombre character varying, p_tipo character varying, p_descripcion text DEFAULT NULL::text, p_categoria character varying DEFAULT NULL::character varying, p_subcategoria character varying DEFAULT NULL::character varying, p_unidad_compra character varying DEFAULT 'unidad'::character varying, p_unidad_venta character varying DEFAULT 'unidad'::character varying, p_factor_conversion numeric DEFAULT 1, p_controla_inventario_loteable boolean DEFAULT false, p_controla_inventario_no_loteable boolean DEFAULT false, p_metodo_valuacion character varying DEFAULT 'PROM'::character varying, p_costo_referencia numeric DEFAULT NULL::numeric, p_precio_referencia numeric DEFAULT NULL::numeric, p_moneda_referencia character varying DEFAULT 'BOB'::character varying, p_marca character varying DEFAULT NULL::character varying, p_modelo character varying DEFAULT NULL::character varying, p_codigo_barras character varying DEFAULT NULL::character varying, p_peso_kg numeric DEFAULT NULL::numeric, p_largo_m numeric DEFAULT NULL::numeric, p_ancho_m numeric DEFAULT NULL::numeric, p_profundidad_m numeric DEFAULT NULL::numeric, p_volumen_m3 numeric DEFAULT NULL::numeric, p_id_cuenta_existencias bigint DEFAULT NULL::bigint, p_id_cuenta_costo_venta bigint DEFAULT NULL::bigint, p_id_cuenta_ingreso bigint DEFAULT NULL::bigint, p_id_cuenta_depreciacion bigint DEFAULT NULL::bigint, p_id_cuenta_depreciacion_acumulada bigint DEFAULT NULL::bigint, p_valor_origen numeric DEFAULT NULL::numeric, p_vida_util_meses integer DEFAULT NULL::integer, p_valor_residual numeric DEFAULT NULL::numeric, p_metodo_depreciacion character varying DEFAULT NULL::character varying, p_es_producto_tienda boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_bien bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.BIEN.GESTIONAR','CREAR_BIEN');

  v_id_bien := inventario.fn_crear_bien(
    v_id_usuario,
    p_sku,
    p_nombre,
    p_tipo::inventario.tipo_bien,
    p_descripcion,
    p_categoria,
    p_subcategoria,
    p_unidad_compra,
    p_unidad_venta,
    p_factor_conversion,
    p_controla_inventario_loteable,
    p_controla_inventario_no_loteable,
    p_metodo_valuacion::inventario.metodo_valuacion,
    p_costo_referencia,
    p_precio_referencia,
    p_moneda_referencia,
    p_marca,
    p_modelo,
    p_codigo_barras,
    p_peso_kg,
    p_largo_m,
    p_ancho_m,
    p_profundidad_m,
    p_volumen_m3,
    p_id_cuenta_existencias,
    p_id_cuenta_costo_venta,
    p_id_cuenta_ingreso,
    p_id_cuenta_depreciacion,
    p_id_cuenta_depreciacion_acumulada,
    p_valor_origen,
    p_vida_util_meses,
    p_valor_residual,
    CASE
      WHEN p_metodo_depreciacion IS NULL THEN NULL
      ELSE p_metodo_depreciacion::inventario.metodo_depreciacion
    END,
    p_es_producto_tienda
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_BIEN','INFO','inventario','bien',
    jsonb_build_object('id_bien', v_id_bien), TRUE,
    jsonb_build_object('sku',p_sku,'tipo',p_tipo)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Bien creado', jsonb_build_object('id_bien', v_id_bien));

EXCEPTION
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_BIEN','ERROR','inventario','bien',
      NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'sku',p_sku,'tipo',p_tipo)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 652 (class 1255 OID 548868)
-- Name: api_crear_bien_instancia(bigint, bigint, text, date, integer, numeric, numeric, character varying, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_crear_bien_instancia(p_id_sesion bigint, p_id_bien bigint, p_descripcion_especificaciones text, p_fecha_compra date, p_id_proveedor_compra integer DEFAULT NULL::integer, p_costo_compra numeric DEFAULT NULL::numeric, p_precio_compra numeric DEFAULT NULL::numeric, p_serial_unico character varying DEFAULT NULL::character varying, p_fecha_fabricacion date DEFAULT NULL::date, p_fecha_vencimiento date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.BIEN.GESTIONAR','CREAR_BIEN_INSTANCIA');

  v_id := inventario.fn_crear_bien_instancia(
    v_id_usuario,
    p_id_bien, p_descripcion_especificaciones, p_fecha_compra,
    p_id_proveedor_compra, p_costo_compra, p_precio_compra,
    p_serial_unico, p_fecha_fabricacion, p_fecha_vencimiento
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_BIEN_INSTANCIA','INFO','inventario','bien_instancia',
    jsonb_build_object('id_bien_instancia', v_id), TRUE,
    jsonb_build_object('id_bien',p_id_bien,'fecha_compra',p_fecha_compra)
  );

  RETURN seguridad.fn_api_result(TRUE,'Bien instancia creada', jsonb_build_object('id_bien_instancia', v_id));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_BIEN_INSTANCIA','ERROR','inventario','bien_instancia',
      NULL,FALSE, jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_bien',p_id_bien)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 370 (class 1255 OID 548870)
-- Name: api_crear_bien_lote(bigint, bigint, character varying, date, integer, integer, numeric, numeric, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_crear_bien_lote(p_id_sesion bigint, p_id_bien bigint, p_lote_codigo character varying, p_fecha_compra date, p_cantidad_compra integer, p_id_proveedor_compra integer DEFAULT NULL::integer, p_costo_compra_unitario numeric DEFAULT NULL::numeric, p_precio_compra_unitario numeric DEFAULT NULL::numeric, p_fecha_fabricacion date DEFAULT NULL::date, p_fecha_vencimiento date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.BIEN.GESTIONAR','CREAR_BIEN_LOTE');

  -- ✅ ORDEN CORRECTO: ... p_id_proveedor_compra, p_cantidad_compra ...
  v_id := inventario.fn_crear_bien_lote(
    v_id_usuario,
    p_id_bien,
    p_lote_codigo,
    p_fecha_compra,
    p_id_proveedor_compra,
    p_cantidad_compra,
    p_costo_compra_unitario,
    p_precio_compra_unitario,
    p_fecha_fabricacion,
    p_fecha_vencimiento
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_BIEN_LOTE','INFO','inventario','bien_lote',
    jsonb_build_object('id_lote', v_id), TRUE,
    jsonb_build_object(
      'id_bien',p_id_bien,
      'lote_codigo',p_lote_codigo,
      'cantidad_compra',p_cantidad_compra,
      'id_proveedor_compra',p_id_proveedor_compra
    )
  );

  RETURN seguridad.fn_api_result(TRUE,'Lote creado', jsonb_build_object('id_lote', v_id));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_BIEN_LOTE','ERROR','inventario','bien_lote',
      NULL,FALSE,
      jsonb_build_object(
        'sqlstate',SQLSTATE,'error',SQLERRM,
        'id_bien',p_id_bien,'lote_codigo',p_lote_codigo,
        'cantidad_compra',p_cantidad_compra,
        'id_proveedor_compra',p_id_proveedor_compra
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 493 (class 1255 OID 548872)
-- Name: api_crear_movimiento_detalle(bigint, bigint, numeric, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_crear_movimiento_detalle(p_id_sesion bigint, p_id_bien bigint, p_cantidad numeric DEFAULT 1, p_id_lote bigint DEFAULT NULL::bigint, p_id_bien_instancia bigint DEFAULT NULL::bigint, p_id_espacio_entrada bigint DEFAULT NULL::bigint, p_id_espacio_salida bigint DEFAULT NULL::bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(p_id_sesion,'INV.MOVIMIENTO.REGISTRAR','CREAR_MOVIMIENTO_DETALLE');

  v_id := inventario.fn_crear_movimiento_detalle(
    v_id_usuario,
    p_id_bien, p_cantidad, p_id_lote, p_id_bien_instancia, p_id_espacio_entrada, p_id_espacio_salida
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_MOVIMIENTO_DETALLE','INFO','inventario','movimiento_detalle',
    jsonb_build_object('id_movimiento', v_id), TRUE,
    jsonb_build_object('id_bien',p_id_bien,'cantidad',p_cantidad,'id_lote',p_id_lote,'id_bien_instancia',p_id_bien_instancia)
  );

  RETURN seguridad.fn_api_result(TRUE,'Movimiento detalle creado', jsonb_build_object('id_movimiento', v_id));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_MOVIMIENTO_DETALLE','ERROR','inventario','movimiento_detalle',
      NULL,FALSE, jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_bien',p_id_bien)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 555 (class 1255 OID 655361)
-- Name: api_crear_movimiento_detalle_batch(bigint, jsonb); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.api_crear_movimiento_detalle_batch(p_id_sesion bigint, p_lineas jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_res jsonb;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'INV.MOVIMIENTO.REGISTRAR',
    'CREAR_MOVIMIENTO_DETALLE_BATCH'
  );

  v_res := inventario.fn_crear_movimiento_detalle_batch(v_id_usuario, p_lineas);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'CREAR_MOVIMIENTO_DETALLE_BATCH',
    'INFO',
    'inventario',
    'movimiento_detalle',
    (v_res->'ids_movimiento'),
    TRUE,
    jsonb_build_object('insertados', v_res->'insertados')
  );

  RETURN seguridad.fn_api_result(TRUE, 'Movimientos detalle creados', v_res);

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'CREAR_MOVIMIENTO_DETALLE_BATCH',
      'ERROR',
      'inventario',
      'movimiento_detalle',
      NULL,
      FALSE,
      jsonb_build_object('sqlstate', SQLSTATE, 'error', SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 408 (class 1255 OID 278528)
-- Name: check_es_producto_tienda(); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.check_es_producto_tienda() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_es_producto_tienda boolean;
BEGIN
    SELECT b.es_producto_tienda
      INTO v_es_producto_tienda
      FROM inventario.bien b
     WHERE b.id_bien = NEW.id_bien;

    IF v_es_producto_tienda THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'El bien % no es producto de tienda', NEW.id_bien
            USING ERRCODE = 'check_violation';
    END IF;
END;
$$;


--
-- TOC entry 371 (class 1255 OID 557058)
-- Name: fn_actualizar_bien(bigint, bigint, character varying, character varying, inventario.tipo_bien, text, character varying, character varying, character varying, character varying, numeric, boolean, boolean, inventario.metodo_valuacion, numeric, numeric, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, bigint, bigint, bigint, bigint, bigint, numeric, integer, numeric, inventario.metodo_depreciacion, boolean); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_actualizar_bien(p_id_actor bigint, p_id_bien bigint, p_sku character varying, p_nombre character varying, p_tipo inventario.tipo_bien, p_descripcion text, p_categoria character varying, p_subcategoria character varying, p_unidad_compra character varying, p_unidad_venta character varying, p_factor_conversion numeric, p_controla_inventario_loteable boolean, p_controla_inventario_no_loteable boolean, p_metodo_valuacion inventario.metodo_valuacion, p_costo_referencia numeric, p_precio_referencia numeric, p_moneda_referencia character varying, p_marca character varying, p_modelo character varying, p_codigo_barras character varying, p_peso_kg numeric, p_largo_m numeric, p_ancho_m numeric, p_profundidad_m numeric, p_volumen_m3 numeric, p_id_cuenta_existencias bigint, p_id_cuenta_costo_venta bigint, p_id_cuenta_ingreso bigint, p_id_cuenta_depreciacion bigint, p_id_cuenta_depreciacion_acumulada bigint, p_valor_origen numeric, p_vida_util_meses integer, p_valor_residual numeric, p_metodo_depreciacion inventario.metodo_depreciacion, p_es_producto_tienda boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_flags_sum int;
BEGIN
  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_sku),'') = '' THEN
    RAISE EXCEPTION 'sku es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_tipo IS NULL THEN
    RAISE EXCEPTION 'tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_factor_conversion IS NULL OR p_factor_conversion <= 0 THEN
    RAISE EXCEPTION 'factor_conversion debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- flags XOR para mercadería (y restricciones para otros tipos)
  v_flags_sum :=
    (CASE WHEN coalesce(p_controla_inventario_loteable,false) THEN 1 ELSE 0 END) +
    (CASE WHEN coalesce(p_controla_inventario_no_loteable,false) THEN 1 ELSE 0 END);

  IF p_tipo = 'MERCADERIA'::inventario.tipo_bien THEN
    IF v_flags_sum <> 1 THEN
      RAISE EXCEPTION 'Para MERCADERIA exactamente uno de (loteable|no_loteable) debe ser true'
      USING ERRCODE='invalid_parameter_value';
    END IF;
  ELSIF p_tipo IN ('ACTIVO_FIJO','SERVICIO') THEN
    IF coalesce(p_controla_inventario_loteable,false) OR coalesce(p_controla_inventario_no_loteable,false) THEN
      RAISE EXCEPTION 'Para ACTIVO_FIJO/SERVICIO los flags inventario deben ser false'
      USING ERRCODE='invalid_parameter_value';
    END IF;
  END IF;

  -- ACTIVO_FIJO: obligatorios de depreciación
  IF p_tipo = 'ACTIVO_FIJO'::inventario.tipo_bien THEN
    IF p_valor_origen IS NULL OR p_vida_util_meses IS NULL OR p_metodo_depreciacion IS NULL THEN
      RAISE EXCEPTION 'ACTIVO_FIJO requiere valor_origen, vida_util_meses y metodo_depreciacion'
      USING ERRCODE='invalid_parameter_value';
    END IF;
    IF p_vida_util_meses <= 0 THEN
      RAISE EXCEPTION 'vida_util_meses debe ser > 0' USING ERRCODE='invalid_parameter_value';
    END IF;
    IF p_valor_origen < 0 THEN
      RAISE EXCEPTION 'valor_origen debe ser >= 0' USING ERRCODE='invalid_parameter_value';
    END IF;
    IF p_valor_residual IS NOT NULL AND p_valor_residual < 0 THEN
      RAISE EXCEPTION 'valor_residual debe ser >= 0' USING ERRCODE='invalid_parameter_value';
    END IF;
  END IF;

  UPDATE inventario.bien
  SET
    sku = p_sku,
    nombre = p_nombre,
    descripcion = p_descripcion,
    tipo = p_tipo,
    categoria = p_categoria,
    subcategoria = p_subcategoria,
    unidad_compra = coalesce(p_unidad_compra,'unidad'),
    unidad_venta  = coalesce(p_unidad_venta,'unidad'),
    factor_conversion = p_factor_conversion,
    controla_inventario_loteable = coalesce(p_controla_inventario_loteable,false),
    controla_inventario_no_loteable = coalesce(p_controla_inventario_no_loteable,false),
    metodo_valuacion = coalesce(p_metodo_valuacion,'PROM'::inventario.metodo_valuacion),
    costo_referencia = p_costo_referencia,
    precio_referencia = p_precio_referencia,
    moneda_referencia = coalesce(p_moneda_referencia,'BOB'),
    marca = p_marca,
    modelo = p_modelo,
    codigo_barras = p_codigo_barras,
    peso_kg = p_peso_kg,
    largo_m = p_largo_m,
    ancho_m = p_ancho_m,
    profundidad_m = p_profundidad_m,
    volumen_m3 = p_volumen_m3,
    id_cuenta_existencias = p_id_cuenta_existencias,
    id_cuenta_costo_venta = p_id_cuenta_costo_venta,
    id_cuenta_ingreso = p_id_cuenta_ingreso,
    id_cuenta_depreciacion = p_id_cuenta_depreciacion,
    id_cuenta_depreciacion_acumulada = p_id_cuenta_depreciacion_acumulada,
    valor_origen = p_valor_origen,
    vida_util_meses = p_vida_util_meses,
    valor_residual = p_valor_residual,
    metodo_depreciacion = p_metodo_depreciacion,
    es_producto_tienda = coalesce(p_es_producto_tienda,false),

    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_bien = p_id_bien
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'bien no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 478 (class 1255 OID 573443)
-- Name: fn_actualizar_bien_instancia(bigint, bigint, bigint, text, date, integer, numeric, numeric, character varying, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_actualizar_bien_instancia(p_id_actor bigint, p_id_bien_instancia bigint, p_id_bien bigint, p_descripcion text, p_fecha_compra date, p_id_proveedor_compra integer, p_costo_compra numeric, p_precio_compra numeric, p_serial_codigo character varying, p_fecha_fabricacion date, p_fecha_vencimiento date) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_bien_instancia IS NULL THEN
    RAISE EXCEPTION 'id_bien_instancia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_compra IS NULL THEN
    RAISE EXCEPTION 'fecha_compra es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_serial_codigo),'') = '' THEN
    RAISE EXCEPTION 'serial_unico es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_costo_compra IS NOT NULL AND p_costo_compra < 0 THEN
    RAISE EXCEPTION 'costo_compra debe ser >= 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_compra IS NOT NULL AND p_precio_compra < 0 THEN
    RAISE EXCEPTION 'precio_compra debe ser >= 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_vencimiento IS NOT NULL
     AND p_fecha_vencimiento < coalesce(p_fecha_fabricacion, p_fecha_compra) THEN
    RAISE EXCEPTION 'fecha_vencimiento no puede ser menor a fecha_fabricacion/fecha_compra'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE inventario.bien_instancia
  SET
    id_bien = p_id_bien,
    descripcion_especificaciones = p_descripcion,
    fecha_compra = p_fecha_compra,
    id_proveedor_compra = p_id_proveedor_compra,
    costo_compra = p_costo_compra,
    precio_compra = p_precio_compra,
    serial_unico = p_serial_codigo,
    fecha_fabricacion = p_fecha_fabricacion,
    fecha_vencimiento = p_fecha_vencimiento,

    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_bien_instancia = p_id_bien_instancia
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'instancia no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 407 (class 1255 OID 565249)
-- Name: fn_actualizar_bien_lote(bigint, bigint, bigint, character varying, date, integer, integer, numeric, numeric, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_actualizar_bien_lote(p_id_actor bigint, p_id_lote bigint, p_id_bien bigint, p_lote_codigo character varying, p_fecha_compra date, p_id_proveedor_compra integer, p_cantidad_compra integer, p_costo_compra_unitario numeric, p_precio_compra_unitario numeric, p_fecha_fabricacion date, p_fecha_vencimiento date) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_lote IS NULL THEN
    RAISE EXCEPTION 'id_lote es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_lote_codigo),'') = '' THEN
    RAISE EXCEPTION 'lote_codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_compra IS NULL THEN
    RAISE EXCEPTION 'fecha_compra es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_compra IS NULL OR p_cantidad_compra <= 0 THEN
    RAISE EXCEPTION 'cantidad_compra debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_vencimiento IS NOT NULL
     AND p_fecha_vencimiento < coalesce(p_fecha_fabricacion, p_fecha_compra) THEN
    RAISE EXCEPTION 'fecha_vencimiento no puede ser menor a fecha_fabricacion/fecha_compra'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_costo_compra_unitario IS NOT NULL AND p_costo_compra_unitario < 0 THEN
    RAISE EXCEPTION 'costo_compra_unitario debe ser >= 0'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_compra_unitario IS NOT NULL AND p_precio_compra_unitario < 0 THEN
    RAISE EXCEPTION 'precio_compra_unitario debe ser >= 0'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE inventario.bien_lote
  SET
    id_bien = p_id_bien,
    lote_codigo = p_lote_codigo,
    fecha_compra = p_fecha_compra,
    id_proveedor_compra = p_id_proveedor_compra,
    cantidad_compra = p_cantidad_compra,
    costo_compra_unitario = p_costo_compra_unitario,
    precio_compra_unitario = p_precio_compra_unitario,
    fecha_fabricacion = p_fecha_fabricacion,
    fecha_vencimiento = p_fecha_vencimiento,

    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_lote = p_id_lote
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'lote no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 384 (class 1255 OID 573445)
-- Name: fn_actualizar_movimiento_detalle(bigint, bigint, bigint, numeric, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_actualizar_movimiento_detalle(p_id_actor bigint, p_id_movimiento bigint, p_id_bien bigint, p_cantidad numeric, p_id_lote bigint, p_id_bien_instancia bigint, p_id_espacio_entrada bigint, p_id_espacio_salida bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_movimiento IS NULL THEN
    RAISE EXCEPTION 'id_movimiento es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'cantidad debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_lote IS NOT NULL AND p_id_bien_instancia IS NOT NULL THEN
    RAISE EXCEPTION 'No se permite id_lote e id_bien_instancia simultáneamente'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_bien_instancia IS NOT NULL AND p_cantidad <> 1 THEN
    RAISE EXCEPTION 'Si hay id_bien_instancia, cantidad debe ser 1'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE inventario.movimiento_detalle
  SET
    id_bien = p_id_bien,
    id_lote = p_id_lote,
    id_bien_instancia = p_id_bien_instancia,
    cantidad = p_cantidad,
    id_espacio_entrada = p_id_espacio_entrada,
    id_espacio_salida = p_id_espacio_salida
  WHERE id_movimiento = p_id_movimiento;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'movimiento_detalle no existe o no se pudo actualizar' USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 425 (class 1255 OID 557056)
-- Name: fn_crear_bien(bigint, character varying, character varying, inventario.tipo_bien, text, character varying, character varying, character varying, character varying, numeric, boolean, boolean, inventario.metodo_valuacion, numeric, numeric, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, bigint, bigint, bigint, bigint, bigint, numeric, integer, numeric, inventario.metodo_depreciacion, boolean); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_crear_bien(p_id_actor bigint, p_sku character varying, p_nombre character varying, p_tipo inventario.tipo_bien, p_descripcion text, p_categoria character varying, p_subcategoria character varying, p_unidad_compra character varying, p_unidad_venta character varying, p_factor_conversion numeric, p_controla_inventario_loteable boolean, p_controla_inventario_no_loteable boolean, p_metodo_valuacion inventario.metodo_valuacion, p_costo_referencia numeric, p_precio_referencia numeric, p_moneda_referencia character varying, p_marca character varying, p_modelo character varying, p_codigo_barras character varying, p_peso_kg numeric, p_largo_m numeric, p_ancho_m numeric, p_profundidad_m numeric, p_volumen_m3 numeric, p_id_cuenta_existencias bigint, p_id_cuenta_costo_venta bigint, p_id_cuenta_ingreso bigint, p_id_cuenta_depreciacion bigint, p_id_cuenta_depreciacion_acumulada bigint, p_valor_origen numeric, p_vida_util_meses integer, p_valor_residual numeric, p_metodo_depreciacion inventario.metodo_depreciacion, p_es_producto_tienda boolean) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
  v_flags_sum int;
BEGIN
  IF coalesce(trim(p_sku),'') = '' THEN
    RAISE EXCEPTION 'sku es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_factor_conversion IS NULL OR p_factor_conversion <= 0 THEN
    RAISE EXCEPTION 'factor_conversion debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- flags XOR para mercadería (tu tabla lo exige)
  v_flags_sum :=
    (CASE WHEN coalesce(p_controla_inventario_loteable,false) THEN 1 ELSE 0 END) +
    (CASE WHEN coalesce(p_controla_inventario_no_loteable,false) THEN 1 ELSE 0 END);

  IF p_tipo = 'MERCADERIA'::inventario.tipo_bien THEN
    IF v_flags_sum <> 1 THEN
      RAISE EXCEPTION 'Para MERCADERIA exactamente uno de (loteable|no_loteable) debe ser true'
      USING ERRCODE='invalid_parameter_value';
    END IF;
  ELSIF p_tipo IN ('ACTIVO_FIJO','SERVICIO') THEN
    IF coalesce(p_controla_inventario_loteable,false) OR coalesce(p_controla_inventario_no_loteable,false) THEN
      RAISE EXCEPTION 'Para ACTIVO_FIJO/SERVICIO los flags inventario deben ser false'
      USING ERRCODE='invalid_parameter_value';
    END IF;
  END IF;

  -- ACTIVO_FIJO: obligatorios de depreciación
  IF p_tipo = 'ACTIVO_FIJO'::inventario.tipo_bien THEN
    IF p_valor_origen IS NULL OR p_vida_util_meses IS NULL OR p_metodo_depreciacion IS NULL THEN
      RAISE EXCEPTION 'ACTIVO_FIJO requiere valor_origen, vida_util_meses y metodo_depreciacion'
      USING ERRCODE='invalid_parameter_value';
    END IF;
  END IF;

  INSERT INTO inventario.bien (
    sku, nombre, descripcion, tipo, categoria, subcategoria,
    unidad_compra, unidad_venta, factor_conversion,
    controla_inventario_loteable, controla_inventario_no_loteable,
    metodo_valuacion, costo_referencia, precio_referencia, moneda_referencia,
    marca, modelo, codigo_barras,
    peso_kg, largo_m, ancho_m, profundidad_m, volumen_m3,
    id_cuenta_existencias, id_cuenta_costo_venta, id_cuenta_ingreso,
    id_cuenta_depreciacion, id_cuenta_depreciacion_acumulada,
    valor_origen, vida_util_meses, valor_residual, metodo_depreciacion,
    es_producto_tienda,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_sku, p_nombre, p_descripcion, p_tipo, p_categoria, p_subcategoria,
    coalesce(p_unidad_compra,'unidad'), coalesce(p_unidad_venta,'unidad'), p_factor_conversion,
    coalesce(p_controla_inventario_loteable,false), coalesce(p_controla_inventario_no_loteable,false),
    coalesce(p_metodo_valuacion,'PROM'::inventario.metodo_valuacion),
    p_costo_referencia, p_precio_referencia, coalesce(p_moneda_referencia,'BOB'),
    p_marca, p_modelo, p_codigo_barras,
    p_peso_kg, p_largo_m, p_ancho_m, p_profundidad_m, p_volumen_m3,
    p_id_cuenta_existencias, p_id_cuenta_costo_venta, p_id_cuenta_ingreso,
    p_id_cuenta_depreciacion, p_id_cuenta_depreciacion_acumulada,
    p_valor_origen, p_vida_util_meses, p_valor_residual, p_metodo_depreciacion,
    coalesce(p_es_producto_tienda,false),
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_bien INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 536 (class 1255 OID 573442)
-- Name: fn_crear_bien_instancia(bigint, bigint, text, date, integer, numeric, numeric, character varying, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_crear_bien_instancia(p_id_actor bigint, p_id_bien bigint, p_descripcion text, p_fecha_compra date, p_id_proveedor_compra integer, p_costo_compra numeric, p_precio_compra numeric, p_serial_codigo character varying, p_fecha_fabricacion date, p_fecha_vencimiento date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_inst bigint;
BEGIN
  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_compra IS NULL THEN
    RAISE EXCEPTION 'fecha_compra es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_serial_codigo),'') = '' THEN
    RAISE EXCEPTION 'serial_unico es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_costo_compra IS NOT NULL AND p_costo_compra < 0 THEN
    RAISE EXCEPTION 'costo_compra debe ser >= 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_compra IS NOT NULL AND p_precio_compra < 0 THEN
    RAISE EXCEPTION 'precio_compra debe ser >= 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- coherencia fechas: vencimiento >= coalesce(fabricacion, compra)
  IF p_fecha_vencimiento IS NOT NULL
     AND p_fecha_vencimiento < coalesce(p_fecha_fabricacion, p_fecha_compra) THEN
    RAISE EXCEPTION 'fecha_vencimiento no puede ser menor a fecha_fabricacion/fecha_compra'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO inventario.bien_instancia (
    id_bien,
    descripcion_especificaciones,
    fecha_compra,
    id_proveedor_compra,
    costo_compra,
    precio_compra,
    serial_unico,
    fecha_fabricacion,
    fecha_vencimiento,
    estado_registro,
    fecha_registro,
    version_registro,
    id_usuario_creador
  ) VALUES (
    p_id_bien,
    p_descripcion,
    p_fecha_compra,
    p_id_proveedor_compra,
    p_costo_compra,
    p_precio_compra,
    p_serial_codigo,
    p_fecha_fabricacion,
    p_fecha_vencimiento,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_bien_instancia INTO v_id_inst;

  RETURN v_id_inst;
END;
$$;


--
-- TOC entry 584 (class 1255 OID 565248)
-- Name: fn_crear_bien_lote(bigint, bigint, character varying, date, integer, integer, numeric, numeric, date, date); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_crear_bien_lote(p_id_actor bigint, p_id_bien bigint, p_lote_codigo character varying, p_fecha_compra date, p_id_proveedor_compra integer, p_cantidad_compra integer, p_costo_compra_unitario numeric, p_precio_compra_unitario numeric, p_fecha_fabricacion date, p_fecha_vencimiento date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_lote bigint;
BEGIN
  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_lote_codigo),'') = '' THEN
    RAISE EXCEPTION 'lote_codigo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_compra IS NULL THEN
    RAISE EXCEPTION 'fecha_compra es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_compra IS NULL OR p_cantidad_compra <= 0 THEN
    RAISE EXCEPTION 'cantidad_compra debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- Respeta chk_lote_fechas del DDL:
  -- fecha_vencimiento >= coalesce(fecha_fabricacion, fecha_compra)
  IF p_fecha_vencimiento IS NOT NULL
     AND p_fecha_vencimiento < coalesce(p_fecha_fabricacion, p_fecha_compra) THEN
    RAISE EXCEPTION 'fecha_vencimiento no puede ser menor a fecha_fabricacion/fecha_compra'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_costo_compra_unitario IS NOT NULL AND p_costo_compra_unitario < 0 THEN
    RAISE EXCEPTION 'costo_compra_unitario debe ser >= 0'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_compra_unitario IS NOT NULL AND p_precio_compra_unitario < 0 THEN
    RAISE EXCEPTION 'precio_compra_unitario debe ser >= 0'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO inventario.bien_lote (
    id_bien,
    lote_codigo,
    fecha_compra,
    id_proveedor_compra,
    cantidad_compra,
    costo_compra_unitario,
    precio_compra_unitario,
    fecha_fabricacion,
    fecha_vencimiento,
    estado_registro,
    fecha_registro,
    version_registro,
    id_usuario_creador
  ) VALUES (
    p_id_bien,
    p_lote_codigo,
    p_fecha_compra,
    p_id_proveedor_compra,
    p_cantidad_compra,
    p_costo_compra_unitario,
    p_precio_compra_unitario,
    p_fecha_fabricacion,
    p_fecha_vencimiento,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_lote INTO v_id_lote;

  RETURN v_id_lote;
END;
$$;


--
-- TOC entry 659 (class 1255 OID 573444)
-- Name: fn_crear_movimiento_detalle(bigint, bigint, numeric, bigint, bigint, bigint, bigint); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_crear_movimiento_detalle(p_id_actor bigint, p_id_bien bigint, p_cantidad numeric, p_id_lote bigint, p_id_bien_instancia bigint, p_id_espacio_entrada bigint, p_id_espacio_salida bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_movimiento bigint;
BEGIN
  IF p_id_bien IS NULL THEN
    RAISE EXCEPTION 'id_bien es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'cantidad debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- no pueden venir ambos
  IF p_id_lote IS NOT NULL AND p_id_bien_instancia IS NOT NULL THEN
    RAISE EXCEPTION 'No se permite id_lote e id_bien_instancia simultáneamente'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  -- si hay instancia, cantidad debe ser 1
  IF p_id_bien_instancia IS NOT NULL AND p_cantidad <> 1 THEN
    RAISE EXCEPTION 'Si hay id_bien_instancia, cantidad debe ser 1'
      USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO inventario.movimiento_detalle (
    id_bien,
    id_lote,
    id_bien_instancia,
    cantidad,
    id_espacio_entrada,
    id_espacio_salida
  ) VALUES (
    p_id_bien,
    p_id_lote,
    p_id_bien_instancia,
    p_cantidad,
    p_id_espacio_entrada,
    p_id_espacio_salida
  )
  RETURNING id_movimiento INTO v_id_movimiento;

  RETURN v_id_movimiento;
END;
$$;


--
-- TOC entry 628 (class 1255 OID 655360)
-- Name: fn_crear_movimiento_detalle_batch(bigint, jsonb); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_crear_movimiento_detalle_batch(p_id_actor bigint, p_lineas jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_total int := 0;
  v_ids jsonb := '[]'::jsonb;
BEGIN
  -- Validaciones base
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_lineas IS NULL OR jsonb_typeof(p_lineas) <> 'array' OR jsonb_array_length(p_lineas) = 0 THEN
    RAISE EXCEPTION 'p_lineas debe ser un JSON array no vacío'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Validaciones por línea (repitiendo recordset para evitar el bug de CTE fuera de scope)
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_bien bigint,
      cantidad numeric,
      id_lote bigint,
      id_bien_instancia bigint,
      id_espacio_entrada bigint,
      id_espacio_salida bigint
    )
    WHERE id_bien IS NULL
  ) THEN
    RAISE EXCEPTION 'Todas las líneas deben tener id_bien'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_bien bigint,
      cantidad numeric,
      id_lote bigint,
      id_bien_instancia bigint,
      id_espacio_entrada bigint,
      id_espacio_salida bigint
    )
    WHERE cantidad IS NULL OR cantidad <= 0
  ) THEN
    RAISE EXCEPTION 'cantidad debe ser > 0 en todas las líneas'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_bien bigint,
      cantidad numeric,
      id_lote bigint,
      id_bien_instancia bigint,
      id_espacio_entrada bigint,
      id_espacio_salida bigint
    )
    WHERE id_lote IS NOT NULL AND id_bien_instancia IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'No se permite id_lote e id_bien_instancia simultáneamente (por línea)'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_bien bigint,
      cantidad numeric,
      id_lote bigint,
      id_bien_instancia bigint,
      id_espacio_entrada bigint,
      id_espacio_salida bigint
    )
    WHERE id_bien_instancia IS NOT NULL AND cantidad <> 1
  ) THEN
    RAISE EXCEPTION 'Si hay id_bien_instancia, cantidad debe ser 1 (por línea)'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Insert masivo
  WITH items AS (
    SELECT
      x.id_bien::bigint                   AS id_bien,
      x.id_lote::bigint                   AS id_lote,
      x.id_bien_instancia::bigint         AS id_bien_instancia,
      x.cantidad::numeric                 AS cantidad,
      x.id_espacio_entrada::bigint        AS id_espacio_entrada,
      x.id_espacio_salida::bigint         AS id_espacio_salida
    FROM jsonb_to_recordset(p_lineas) AS x(
      id_bien bigint,
      cantidad numeric,
      id_lote bigint,
      id_bien_instancia bigint,
      id_espacio_entrada bigint,
      id_espacio_salida bigint
    )
  ),
  ins AS (
    INSERT INTO inventario.movimiento_detalle (
      id_bien,
      id_lote,
      id_bien_instancia,
      cantidad,
      id_espacio_entrada,
      id_espacio_salida
    )
    SELECT
      i.id_bien,
      i.id_lote,
      i.id_bien_instancia,
      i.cantidad,
      i.id_espacio_entrada,
      i.id_espacio_salida
    FROM items i
    RETURNING id_movimiento
  )
  SELECT
    COUNT(*)::int,
    COALESCE(jsonb_agg(id_movimiento), '[]'::jsonb)
  INTO
    v_total,
    v_ids
  FROM ins;

  RETURN jsonb_build_object(
    'ok', true,
    'insertados', v_total,
    'ids_movimiento', v_ids
  );
END;
$$;


--
-- TOC entry 600 (class 1255 OID 499719)
-- Name: api_asignar_padre_estudiante(bigint, bigint, bigint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_asignar_padre_estudiante(p_id_sesion bigint, p_id_padre bigint, p_id_estudiante bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_asociacion bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.ESTUDIANTES.EDITAR', 'ASIGNAR_PADRE_ESTUDIANTE');

  v_id_asociacion := persona.fn_asignar_padre_estudiante(v_id_actor, p_id_padre, p_id_estudiante);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ASIGNAR_PADRE_ESTUDIANTE','INFO','persona','estudiante_padre',
    jsonb_build_object('id_asociacion', v_id_asociacion), TRUE,
    jsonb_build_object('id_actor', v_id_actor, 'id_padre', p_id_padre, 'id_estudiante', p_id_estudiante)
  );

  RETURN seguridad.fn_api_result(TRUE,'Padre asignado a estudiante', jsonb_build_object('id_asociacion', v_id_asociacion));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ASIGNAR_PADRE_ESTUDIANTE','ERROR','persona','estudiante_padre',
      NULL, FALSE, jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 351 (class 1255 OID 614436)
-- Name: api_crear_estudiante(bigint, character varying, character varying, date, character varying, bigint, character varying, character varying, character varying, character varying, character varying, character varying, character varying, smallint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_crear_estudiante(p_id_sesion bigint, p_nombres character varying, p_apellidos character varying, p_fecha_nacimiento date, p_codigo_estudiante character varying, p_id_unidad_educativa bigint, p_tipo character varying, p_nivel_actual character varying, p_curso_actual character varying, p_turno_actual character varying, p_email character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_carrera character varying DEFAULT NULL::character varying, p_anio_ingreso smallint DEFAULT NULL::smallint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_persona_est bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'PERSONA.ESTUDIANTE.CREAR',
    'CREAR_ESTUDIANTE'
  );

  v_id_persona_est := persona.fn_crear_estudiante(
    v_id_usuario,
    p_nombres,
    p_apellidos,
    p_fecha_nacimiento,
    p_codigo_estudiante,
    p_id_unidad_educativa,
    p_tipo,
    p_nivel_actual,
    p_curso_actual,
    p_turno_actual,
    p_email,
    p_telefono,
    p_carrera,
    p_anio_ingreso
  );

  RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('id_persona', v_id_persona_est));
END;
$$;


--
-- TOC entry 448 (class 1255 OID 614438)
-- Name: api_crear_padre(bigint, character varying, character varying, date, character varying, character varying, boolean, jsonb); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_crear_padre(p_id_sesion bigint, p_nombres character varying, p_apellidos character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_email character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_es_embajador boolean DEFAULT false, p_metadata jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_padre   bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'PERSONA.PADRE.CREAR',
    'CREAR_PADRE'
  );

  v_id_padre := persona.fn_crear_padre(
    v_id_usuario,
    p_nombres,
    p_apellidos,
    p_fecha_nacimiento,
    p_email,
    p_telefono,
    p_es_embajador,
    p_metadata
  );

  RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('id_padre', v_id_padre));
END;
$$;


--
-- TOC entry 556 (class 1255 OID 499713)
-- Name: api_crear_proveedor(bigint, character varying, character varying, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_crear_proveedor(p_id_sesion bigint, p_nombre_proveedor character varying, p_categoria character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_proveedor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.PROVEEDORES.CREAR', 'CREAR_PROVEEDOR');

  v_id_proveedor := persona.fn_crear_proveedor(v_id_actor, p_nombre_proveedor, p_categoria, p_telefono);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_PROVEEDOR','INFO','persona','proveedor',
    jsonb_build_object('id_proveedor', v_id_proveedor), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE,'Proveedor creado', jsonb_build_object('id_proveedor', v_id_proveedor));

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_PROVEEDOR','ERROR','persona','proveedor',
      NULL, FALSE, jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 495 (class 1255 OID 614437)
-- Name: api_crear_tutor(bigint, character varying, character varying, date, character varying, character varying, numeric, character varying, character varying, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_crear_tutor(p_id_sesion bigint, p_nombres character varying, p_apellidos character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_email character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_pago_por_hora numeric DEFAULT NULL::numeric, p_nivel_experiencia character varying DEFAULT NULL::character varying, p_tipo_estudiante_especialidad character varying DEFAULT NULL::character varying, p_nivel_estudiante_especialidad character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id_tutor   bigint;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'PERSONA.TUTOR.CREAR',
    'CREAR_TUTOR'
  );

  v_id_tutor := persona.fn_crear_tutor(
    v_id_usuario,
    p_nombres,
    p_apellidos,
    p_fecha_nacimiento,
    p_email,
    p_telefono,
    p_pago_por_hora,
    p_nivel_experiencia,
    p_tipo_estudiante_especialidad,
    p_nivel_estudiante_especialidad
  );

  RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('id_tutor', v_id_tutor));
END;
$$;


--
-- TOC entry 565 (class 1255 OID 475148)
-- Name: api_crear_unidad_educativa(bigint, character varying, character varying, numeric, numeric); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_crear_unidad_educativa(p_id_sesion bigint, p_nombre character varying, p_categoria character varying, p_latitud numeric DEFAULT NULL::numeric, p_longitud numeric DEFAULT NULL::numeric) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_unidad bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.UNIDAD_EDUCATIVA.CREAR', 'CREAR_UNIDAD_EDUCATIVA');

  v_id_unidad := persona.fn_crear_unidad_educativa(p_nombre, p_categoria, v_id_actor, p_latitud, p_longitud);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_UNIDAD_EDUCATIVA','INFO','persona','unidad_educativa',
    jsonb_build_object('id_unidad_educativa', v_id_unidad), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Unidad educativa creada', jsonb_build_object('id_unidad_educativa', v_id_unidad));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_UNIDAD_EDUCATIVA','ERROR','persona','unidad_educativa',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 522 (class 1255 OID 475145)
-- Name: api_editar_estudiante(bigint, bigint, character varying, character varying, character varying, date, character varying, character varying, bigint, character varying, character varying, character varying, character varying, character varying, smallint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_editar_estudiante(p_id_sesion bigint, p_id_persona bigint, p_nombres character varying DEFAULT NULL::character varying, p_apellidos character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_email character varying DEFAULT NULL::character varying, p_codigo_estudiante character varying DEFAULT NULL::character varying, p_id_unidad_educativa bigint DEFAULT NULL::bigint, p_tipo character varying DEFAULT NULL::character varying, p_nivel_actual character varying DEFAULT NULL::character varying, p_curso_actual character varying DEFAULT NULL::character varying, p_turno_actual character varying DEFAULT NULL::character varying, p_carrera character varying DEFAULT NULL::character varying, p_anio_ingreso smallint DEFAULT NULL::smallint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_ok boolean;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.ESTUDIANTES.EDITAR', 'EDITAR_ESTUDIANTE');

  v_ok := persona.fn_editar_estudiante(
    p_id_persona,
    v_id_actor,
    p_nombres, p_apellidos, p_telefono, p_fecha_nacimiento, p_email,
    p_codigo_estudiante, p_id_unidad_educativa, p_tipo, p_nivel_actual, p_curso_actual, p_turno_actual, p_carrera,
    p_anio_ingreso
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'EDITAR_ESTUDIANTE','INFO','persona','persona_estudiante',
    jsonb_build_object('id_persona', p_id_persona), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Estudiante actualizado', jsonb_build_object('id_persona', p_id_persona));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'EDITAR_ESTUDIANTE','ERROR','persona','persona_estudiante',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor,'id_persona',p_id_persona)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 616 (class 1255 OID 475144)
-- Name: api_editar_padre(bigint, bigint, boolean, jsonb, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_editar_padre(p_id_sesion bigint, p_id_padre bigint, p_es_embajador boolean DEFAULT NULL::boolean, p_metadata jsonb DEFAULT NULL::jsonb, p_estado_registro character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_ok boolean;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.PADRES.EDITAR', 'EDITAR_PADRE');

  v_ok := persona.fn_editar_padre(p_id_padre, v_id_actor, p_es_embajador, p_metadata, p_estado_registro);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'EDITAR_PADRE','INFO','persona','persona_padre',
    jsonb_build_object('id_padre', p_id_padre), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Padre actualizado', jsonb_build_object('id_padre', p_id_padre));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'EDITAR_PADRE','ERROR','persona','persona_padre',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor,'id_padre',p_id_padre)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 642 (class 1255 OID 475147)
-- Name: api_editar_proveedor(bigint, bigint, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_editar_proveedor(p_id_sesion bigint, p_id_proveedor bigint, p_nombre_proveedor character varying DEFAULT NULL::character varying, p_categoria character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_estado_registro character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_ok boolean;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.PROVEEDORES.EDITAR', 'EDITAR_PROVEEDOR');

  v_ok := persona.fn_editar_proveedor(
    p_id_proveedor,
    v_id_actor,
    p_nombre_proveedor, p_categoria, p_telefono, p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'EDITAR_PROVEEDOR','INFO','persona','proveedor',
    jsonb_build_object('id_proveedor', p_id_proveedor), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Proveedor actualizado', jsonb_build_object('id_proveedor', p_id_proveedor));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'EDITAR_PROVEEDOR','ERROR','persona','proveedor',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor,'id_proveedor',p_id_proveedor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 377 (class 1255 OID 475146)
-- Name: api_editar_tutor(bigint, bigint, numeric, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_editar_tutor(p_id_sesion bigint, p_id_tutor bigint, p_pago_por_hora numeric DEFAULT NULL::numeric, p_nivel_experiencia character varying DEFAULT NULL::character varying, p_tipo_estudiante_especialidad character varying DEFAULT NULL::character varying, p_nivel_estudiante_especialidad character varying DEFAULT NULL::character varying, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_ok boolean;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.TUTORES.EDITAR', 'EDITAR_TUTOR');

  v_ok := persona.fn_editar_tutor(
    p_id_tutor,
    v_id_actor,
    p_pago_por_hora, p_nivel_experiencia,
    p_tipo_estudiante_especialidad, p_nivel_estudiante_especialidad,
    p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'EDITAR_TUTOR','INFO','persona','persona_tutor',
    jsonb_build_object('id_tutor', p_id_tutor), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Tutor actualizado', jsonb_build_object('id_tutor', p_id_tutor));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'EDITAR_TUTOR','ERROR','persona','persona_tutor',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor,'id_tutor',p_id_tutor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 561 (class 1255 OID 475149)
-- Name: api_editar_unidad_educativa(bigint, bigint, character varying, character varying, numeric, numeric, boolean); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_editar_unidad_educativa(p_id_sesion bigint, p_id_unidad_educativa bigint, p_nombre character varying DEFAULT NULL::character varying, p_categoria character varying DEFAULT NULL::character varying, p_latitud numeric DEFAULT NULL::numeric, p_longitud numeric DEFAULT NULL::numeric, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_ok boolean;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'PERSONA.UNIDAD_EDUCATIVA.EDITAR', 'EDITAR_UNIDAD_EDUCATIVA');

  v_ok := persona.fn_editar_unidad_educativa(
    p_id_unidad_educativa,
    v_id_actor,
    p_nombre, p_categoria, p_latitud, p_longitud, p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'EDITAR_UNIDAD_EDUCATIVA','INFO','persona','unidad_educativa',
    jsonb_build_object('id_unidad_educativa', p_id_unidad_educativa), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Unidad educativa actualizada', jsonb_build_object('id_unidad_educativa', p_id_unidad_educativa));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'EDITAR_UNIDAD_EDUCATIVA','ERROR','persona','unidad_educativa',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor,'id_unidad_educativa',p_id_unidad_educativa)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 463 (class 1255 OID 688141)
-- Name: api_editar_usuario(bigint, bigint, character varying, character varying, character varying, character varying, date, character varying, character varying, boolean); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_editar_usuario(p_id_sesion bigint, p_id_persona bigint, p_nombres character varying DEFAULT NULL::character varying, p_apellidos character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_email character varying DEFAULT NULL::character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_nombre_usuario character varying DEFAULT NULL::character varying, p_tipo_usuario character varying DEFAULT NULL::character varying, p_es_super_usuario boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.USUARIOS.EDITAR', 'EDITAR_USUARIO');

  UPDATE persona.persona
  SET
    nombres = COALESCE(p_nombres, nombres),
    apellidos = COALESCE(p_apellidos, apellidos),
    telefono = COALESCE(p_telefono, telefono),
    email = COALESCE(p_email, email),
    fecha_nacimiento = COALESCE(p_fecha_nacimiento, fecha_nacimiento),
    fecha_modificacion = now(),
    version_registro = COALESCE(version_registro, 0) + 1,
    id_usuario_modificacion = v_id_actor
  WHERE id_persona = p_id_persona;

  UPDATE persona.persona_usuario
  SET
    nombre_usuario = COALESCE(p_nombre_usuario, nombre_usuario),
    tipo_usuario = COALESCE(p_tipo_usuario, tipo_usuario),
    es_super_usuario = COALESCE(p_es_super_usuario, es_super_usuario),
    fecha_modificacion = now(),
    version_registro = COALESCE(version_registro, 0) + 1,
    id_usuario_modificacion = v_id_actor
  WHERE id_persona = p_id_persona;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'EDITAR_USUARIO','INFO','persona','persona_usuario',
    jsonb_build_object('id_persona', p_id_persona), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Usuario actualizado', jsonb_build_object('id_persona', p_id_persona));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'EDITAR_USUARIO','ERROR','persona','persona_usuario',
      jsonb_build_object('id_persona', p_id_persona), FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 650 (class 1255 OID 688142)
-- Name: api_set_usuario_estado(bigint, bigint, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_set_usuario_estado(p_id_sesion bigint, p_id_persona bigint, p_estado_registro character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.USUARIOS.DESACTIVAR', 'USUARIO_SET_ESTADO');

  UPDATE persona.persona_usuario
  SET
    estado_registro = p_estado_registro,
    fecha_modificacion = now(),
    version_registro = COALESCE(version_registro, 0) + 1,
    id_usuario_modificacion = v_id_actor
  WHERE id_persona = p_id_persona;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'USUARIO_SET_ESTADO','SECURITY','persona','persona_usuario',
    jsonb_build_object('id_persona', p_id_persona), TRUE,
    jsonb_build_object('estado_registro', p_estado_registro, 'id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Estado actualizado', jsonb_build_object('id_persona', p_id_persona, 'estado_registro', p_estado_registro));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'USUARIO_SET_ESTADO','ERROR','persona','persona_usuario',
      jsonb_build_object('id_persona', p_id_persona), FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 632 (class 1255 OID 450575)
-- Name: api_signup_usuario(bigint, character varying, character varying, character varying, date, character varying, character varying, text, character varying, boolean); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.api_signup_usuario(p_id_sesion bigint, p_nombres character varying, p_apellidos character varying, p_telefono character varying, p_fecha_nacimiento date, p_email character varying, p_nombre_usuario character varying, p_contrasena_plana text, p_tipo_usuario character varying, p_es_super_usuario boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_actor_is_super boolean;

  v_id_persona bigint;
  v_user_creado text;

  v_msg text;
BEGIN
  -- 1) Sesión + permiso
  v_id_actor := seguridad.fn_assert_permiso(p_id_sesion, 'SISTEMA.USUARIOS.CREAR');
  v_actor_is_super := seguridad.fn_es_super_usuario(v_id_actor);

  -- 2) Regla extra: solo superusuario crea superusuarios
  IF coalesce(p_es_super_usuario,false) = true AND v_actor_is_super IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'No autorizado: solo superusuario puede crear superusuarios'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- 3) Core
  SELECT o_id_persona, o_nombre_usuario
    INTO v_id_persona, v_user_creado
    FROM persona.fn_crear_persona_y_usuario(
      p_nombres, p_apellidos, p_telefono, p_fecha_nacimiento, p_email,
      p_nombre_usuario, p_contrasena_plana, p_tipo_usuario,
      p_es_super_usuario,
      v_id_actor
    );

  -- 4) Log
  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'SIGNUP_USUARIO',
    'INFO',
    'persona',
    'persona_usuario',
    jsonb_build_object('id_persona', v_id_persona),
    TRUE,
    jsonb_build_object(
      'creado_por', v_id_actor,
      'nombre_usuario', v_user_creado,
      'tipo_usuario', p_tipo_usuario,
      'es_super_usuario', coalesce(p_es_super_usuario,false)
    )
  );

  v_msg := format('Usuario creado (id_persona=%s, username=%s)', v_id_persona, v_user_creado);

  RETURN seguridad.fn_api_result(
    true,
    v_msg,
    jsonb_build_object(
      'id_persona', v_id_persona,
      'nombre_usuario', v_user_creado,
      'tipo_usuario', p_tipo_usuario,
      'es_super_usuario', coalesce(p_es_super_usuario,false)
    )
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    -- log de denegado (si tu fn_assert_permiso ya loguea, esto igual está ok)
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'SIGNUP_USUARIO',
      'DENEGADO',
      'persona',
      'persona_usuario',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'intentado_por', v_id_actor,
        'nombre_usuario', p_nombre_usuario
      )
    );

    RETURN seguridad.fn_api_result(false, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'SIGNUP_USUARIO',
      'ERROR',
      'persona',
      'persona_usuario',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'intentado_por', v_id_actor,
        'nombre_usuario', p_nombre_usuario
      )
    );

    RETURN seguridad.fn_api_result(false, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 587 (class 1255 OID 499718)
-- Name: fn_asignar_padre_estudiante(bigint, bigint, bigint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_asignar_padre_estudiante(p_id_actor bigint, p_id_padre bigint, p_id_estudiante bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_asociacion bigint;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM persona.persona_padre pa
    WHERE pa.id_padre = p_id_padre AND pa.estado_registro = 'Activo'
  ) THEN
    RAISE EXCEPTION 'Padre no existe o está inactivo (id_padre=%)', p_id_padre
      USING ERRCODE='invalid_parameter_value';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM persona.persona_estudiante e
    JOIN persona.persona p ON p.id_persona = e.id_persona
    WHERE e.id_persona = p_id_estudiante
      AND e.estado_registro = true
      AND p.estado_registro = 'Activo'
  ) THEN
    RAISE EXCEPTION 'Estudiante no existe o está inactivo (id_estudiante=%)', p_id_estudiante
      USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO persona.estudiante_padre(id_padre, id_estudiante, estado_registro, id_usuario_creador)
  VALUES(p_id_padre, p_id_estudiante, 'Activo', p_id_actor)
  ON CONFLICT (id_padre, id_estudiante)
  DO UPDATE SET
    estado_registro         = 'Activo',
    fecha_modificacion      = now(),
    version_registro        = COALESCE(persona.estudiante_padre.version_registro,1) + 1,
    id_usuario_modificacion = p_id_actor
  RETURNING id_asociacion INTO v_id_asociacion;

  RETURN v_id_asociacion;
END;
$$;


--
-- TOC entry 592 (class 1255 OID 450573)
-- Name: fn_autenticar_usuario(character varying, text); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_autenticar_usuario(p_nombre_usuario character varying, p_contrasena_plana text) RETURNS TABLE(ok boolean, id_persona bigint, nombres character varying, apellidos character varying, nombre_usuario character varying, tipo_usuario character varying, es_super_usuario boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_hash_db text;
  v_id_persona bigint;
  v_tipo varchar;
  v_user_norm varchar;
  v_estado_u varchar(20);
  v_estado_p varchar(20);
  v_is_super boolean;
BEGIN
  SELECT u.contrasena_hash,
         u.id_persona,
         u.tipo_usuario,
         u.nombre_usuario,
         u.estado_registro,
         u.es_super_usuario
    INTO v_hash_db, v_id_persona, v_tipo, v_user_norm, v_estado_u, v_is_super
    FROM persona.persona_usuario u
   WHERE lower(u.nombre_usuario) = lower(p_nombre_usuario)
   LIMIT 1;

  IF v_hash_db IS NULL THEN
    PERFORM crypt(p_contrasena_plana, gen_salt('bf'));
    RETURN QUERY SELECT FALSE, NULL::bigint, NULL::varchar, NULL::varchar, NULL::varchar, NULL::varchar, NULL::boolean;
    RETURN;
  END IF;

  IF v_hash_db <> crypt(p_contrasena_plana, v_hash_db) THEN
    RETURN QUERY SELECT FALSE, NULL::bigint, NULL::varchar, NULL::varchar, NULL::varchar, NULL::varchar, NULL::boolean;
    RETURN;
  END IF;

  SELECT p.estado_registro, p.nombres, p.apellidos
    INTO v_estado_p, nombres, apellidos
    FROM persona.persona p
   WHERE p.id_persona = v_id_persona;

  IF v_estado_u IS DISTINCT FROM 'Activo' OR v_estado_p IS DISTINCT FROM 'Activo' THEN
    RETURN QUERY SELECT FALSE, NULL::bigint, NULL::varchar, NULL::varchar, NULL::varchar, NULL::varchar, NULL::boolean;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT TRUE,
         v_id_persona,
         nombres,
         apellidos,
         v_user_norm,
         v_tipo,
         coalesce(v_is_super,false);
END;
$$;


--
-- TOC entry 610 (class 1255 OID 614433)
-- Name: fn_crear_estudiante(bigint, character varying, character varying, date, character varying, bigint, character varying, character varying, character varying, character varying, character varying, character varying, character varying, smallint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_estudiante(p_id_actor bigint, p_nombres character varying, p_apellidos character varying, p_fecha_nacimiento date, p_codigo_estudiante character varying, p_id_unidad_educativa bigint, p_tipo character varying, p_nivel_actual character varying, p_curso_actual character varying, p_turno_actual character varying, p_email character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_carrera character varying DEFAULT NULL::character varying, p_anio_ingreso smallint DEFAULT NULL::smallint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
BEGIN
  IF coalesce(trim(p_codigo_estudiante), '') = '' THEN
    RAISE EXCEPTION 'codigo_estudiante es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_unidad_educativa IS NULL THEN
    RAISE EXCEPTION 'id_unidad_educativa es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  v_id_persona := persona.fn_crear_persona(
    p_id_actor,
    p_nombres::varchar,
    p_apellidos::varchar,
    p_telefono::varchar,
    p_email::varchar,
    p_fecha_nacimiento::date
  );

  INSERT INTO persona.persona_estudiante (
    id_persona,
    codigo_estudiante,
    id_unidad_educativa,
    tipo,
    nivel_actual,
    curso_actual,
    turno_actual,
    carrera,
    anio_ingreso,

    -- auditoría REAL de la tabla
    id_usuario,
    id_usuario_modificacion,
    version_registro,
    estado_registro,
    fecha_registro,
    fecha_modificacion
  )
  VALUES (
    v_id_persona,
    trim(p_codigo_estudiante),
    p_id_unidad_educativa,
    trim(p_tipo),
    p_nivel_actual,
    p_curso_actual,
    p_turno_actual,
    p_carrera,
    p_anio_ingreso,

    p_id_actor,
    NULL,
    1,
    true,
    now(),
    now()
  );

  RETURN v_id_persona; -- <-- en tu DDL, estudiante se identifica por id_persona
END;
$$;


--
-- TOC entry 574 (class 1255 OID 614435)
-- Name: fn_crear_padre(bigint, character varying, character varying, date, character varying, character varying, boolean, jsonb); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_padre(p_id_actor bigint, p_nombres character varying, p_apellidos character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_email character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_es_embajador boolean DEFAULT false, p_metadata jsonb DEFAULT NULL::jsonb) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
BEGIN
  v_id_persona := persona.fn_crear_persona(
    p_id_actor,
    p_nombres::varchar,
    p_apellidos::varchar,
    p_telefono::varchar,
    p_email::varchar,
    p_fecha_nacimiento::date
  );

  -- id_padre = id_persona para mantener relación 1:1 sin cambiar DDL
  INSERT INTO persona.persona_padre (
    id_padre,
    es_embajador,
    metadata,
    estado_registro,
    fecha_registro,
    fecha_modificacion,
    version_registro,
    id_usuario_creador,
    id_usuario_modificacion
  )
  VALUES (
    v_id_persona,
    coalesce(p_es_embajador,false),
    p_metadata,
    'Activo',
    now(),
    NULL,
    1,
    p_id_actor,
    NULL
  );

  RETURN v_id_persona; -- id_padre (mismo valor)
END;
$$;


--
-- TOC entry 662 (class 1255 OID 614432)
-- Name: fn_crear_persona(bigint, character varying, character varying, character varying, character varying, date); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_persona(p_id_actor bigint, p_nombres character varying, p_apellidos character varying, p_telefono character varying DEFAULT NULL::character varying, p_email character varying DEFAULT NULL::character varying, p_fecha_nacimiento date DEFAULT NULL::date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
BEGIN
  IF coalesce(trim(p_nombres), '') = '' THEN
    RAISE EXCEPTION 'nombres es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_apellidos), '') = '' THEN
    RAISE EXCEPTION 'apellidos es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO persona.persona (
    nombres, apellidos, telefono, fecha_nacimiento, email,
    estado_registro, fecha_registro, fecha_modificacion, version_registro,
    id_usuario_creador, id_usuario_modificacion
  )
  VALUES (
    trim(p_nombres),
    trim(p_apellidos),
    nullif(trim(p_telefono), ''),
    p_fecha_nacimiento,
    nullif(trim(p_email), ''),
    'Activo',
    now(),
    NULL,
    1,
    p_id_actor,
    NULL
  )
  RETURNING id_persona INTO v_id_persona;

  RETURN v_id_persona;
END;
$$;


--
-- TOC entry 527 (class 1255 OID 450572)
-- Name: fn_crear_persona_y_usuario(character varying, character varying, character varying, date, character varying, character varying, text, character varying, boolean, bigint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_persona_y_usuario(p_nombres character varying, p_apellidos character varying, p_telefono character varying, p_fecha_nacimiento date, p_email character varying, p_nombre_usuario character varying, p_contrasena_plana text, p_tipo_usuario character varying, p_es_super_usuario boolean DEFAULT false, p_id_usuario_creador bigint DEFAULT NULL::bigint) RETURNS TABLE(o_id_persona bigint, o_nombre_usuario character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_hash text;
BEGIN
  -- Validaciones
  IF p_contrasena_plana IS NULL THEN
    RAISE EXCEPTION 'La contraseña es obligatoria';
  END IF;

  IF length(p_contrasena_plana) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
  END IF;

  -- al menos una letra (A-Z / a-z)
  IF p_contrasena_plana !~ '[A-Za-z]' THEN
    RAISE EXCEPTION 'La contraseña debe contener al menos una letra';
  END IF;

  -- al menos un número
  IF p_contrasena_plana !~ '[0-9]' THEN
    RAISE EXCEPTION 'La contraseña debe contener al menos un número';
  END IF;

  -- al menos un caracter especial (no alfanumérico)
  IF p_contrasena_plana !~ '[^A-Za-z0-9]' THEN
    RAISE EXCEPTION 'La contraseña debe contener al menos un caracter especial';
  END IF;

  -- Unicidad case-insensitive (tu índice uq lower(nombre_usuario) debería cubrir esto)
  IF EXISTS (
    SELECT 1
      FROM persona.persona_usuario u
     WHERE lower(u.nombre_usuario) = lower(p_nombre_usuario)
  ) THEN
    RAISE EXCEPTION 'El nombre de usuario "%" ya está en uso', p_nombre_usuario;
  END IF;

  -- 1) Crear PERSONA
  INSERT INTO persona.persona(
    nombres, apellidos, telefono, fecha_nacimiento, email,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  )
  VALUES (
    p_nombres, p_apellidos, p_telefono, p_fecha_nacimiento, p_email,
    'Activo', now(), 1, p_id_usuario_creador
  )
  RETURNING id_persona INTO o_id_persona;

  -- 2) Hash password (bcrypt)
  v_hash := crypt(p_contrasena_plana, gen_salt('bf', 12));

  -- 3) Crear USUARIO
  INSERT INTO persona.persona_usuario(
    id_persona, nombre_usuario, contrasena_hash, tipo_usuario,
    es_super_usuario,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  )
  VALUES (
    o_id_persona, p_nombre_usuario, v_hash, p_tipo_usuario,
    coalesce(p_es_super_usuario,false),
    'Activo', now(), 1, p_id_usuario_creador
  );

  o_nombre_usuario := p_nombre_usuario;

  RETURN QUERY SELECT o_id_persona, o_nombre_usuario;
END;
$$;


--
-- TOC entry 586 (class 1255 OID 499716)
-- Name: fn_crear_proveedor(bigint, character varying, character varying, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_proveedor(p_id_actor bigint, p_nombre_proveedor character varying, p_categoria character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_proveedor bigint;
BEGIN
  IF coalesce(trim(p_nombre_proveedor),'') = '' THEN
    RAISE EXCEPTION 'nombre_proveedor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO persona.proveedor(nombre_proveedor, categoria, telefono, id_usuario_creador)
  VALUES(trim(p_nombre_proveedor), nullif(trim(p_categoria),''), nullif(trim(p_telefono),''), p_id_actor)
  RETURNING id_proveedor INTO v_id_proveedor;

  RETURN v_id_proveedor;
END;
$$;


--
-- TOC entry 361 (class 1255 OID 614434)
-- Name: fn_crear_tutor(bigint, character varying, character varying, date, character varying, character varying, numeric, character varying, character varying, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_tutor(p_id_actor bigint, p_nombres character varying, p_apellidos character varying, p_fecha_nacimiento date, p_email character varying, p_telefono character varying, p_pago_por_hora numeric, p_nivel_experiencia character varying, p_tipo_estudiante_especialidad character varying, p_nivel_estudiante_especialidad character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
  v_id_tutor   bigint;
BEGIN
  IF p_pago_por_hora IS NULL OR p_pago_por_hora < 0 THEN
    RAISE EXCEPTION 'pago_por_hora inválido' USING ERRCODE='invalid_parameter_value';
  END IF;
  
  p_nivel_experiencia := upper(trim(p_nivel_experiencia));
  p_tipo_estudiante_especialidad := upper(trim(p_tipo_estudiante_especialidad));
  p_nivel_estudiante_especialidad :=
  CASE WHEN p_nivel_estudiante_especialidad IS NULL THEN NULL
       ELSE upper(trim(p_nivel_estudiante_especialidad))
  END;

  v_id_persona := persona.fn_crear_persona(
    p_id_actor,
    p_nombres::varchar,
    p_apellidos::varchar,
    p_telefono::varchar,
    p_email::varchar,
    p_fecha_nacimiento::date
  );

  INSERT INTO persona.persona_tutor (
    id_persona,
    pago_por_hora,
    nivel_experiencia,
    tipo_estudiante_especialidad,
    nivel_estudiante_especialidad,

    -- auditoría REAL de la tabla
    id_usuario,
    id_usuario_modificacion,
    version_registro,
    estado_registro,
    fecha_registro
  )
  VALUES (
    v_id_persona,
    p_pago_por_hora,
    trim(p_nivel_experiencia),
    trim(p_tipo_estudiante_especialidad),
    p_nivel_estudiante_especialidad,

    p_id_actor,
    NULL,
    1,
    true,
    now()
  )
  RETURNING id_tutor INTO v_id_tutor;

  RETURN v_id_tutor;
END;
$$;


--
-- TOC entry 510 (class 1255 OID 475141)
-- Name: fn_crear_unidad_educativa(character varying, character varying, bigint, numeric, numeric); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_crear_unidad_educativa(p_nombre character varying, p_categoria character varying, p_id_actor bigint, p_latitud numeric DEFAULT NULL::numeric, p_longitud numeric DEFAULT NULL::numeric) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
  v_categoria text;
BEGIN
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio';
  END IF;

  v_categoria := lower(trim(coalesce(p_categoria,'')));

  IF v_categoria = '' THEN
    RAISE EXCEPTION 'categoria es obligatorio';
  END IF;

  IF v_categoria NOT IN ('privada','convenio','fiscal') THEN
    RAISE EXCEPTION 'categoria inválida (%). Valores permitidos: privada, convenio, fiscal', v_categoria
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  INSERT INTO persona.unidad_educativa(
    nombre, categoria, latitud, longitud, id_usuario
  )
  VALUES(
    trim(p_nombre), v_categoria, p_latitud, p_longitud, p_id_actor
  )
  RETURNING id_unidad_educativa INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 459 (class 1255 OID 475138)
-- Name: fn_editar_estudiante(bigint, bigint, character varying, character varying, character varying, date, character varying, character varying, bigint, character varying, character varying, character varying, character varying, character varying, smallint); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_editar_estudiante(p_id_persona bigint, p_id_actor bigint, p_nombres character varying DEFAULT NULL::character varying, p_apellidos character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_email character varying DEFAULT NULL::character varying, p_codigo_estudiante character varying DEFAULT NULL::character varying, p_id_unidad_educativa bigint DEFAULT NULL::bigint, p_tipo character varying DEFAULT NULL::character varying, p_nivel_actual character varying DEFAULT NULL::character varying, p_curso_actual character varying DEFAULT NULL::character varying, p_turno_actual character varying DEFAULT NULL::character varying, p_carrera character varying DEFAULT NULL::character varying, p_anio_ingreso smallint DEFAULT NULL::smallint) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM persona.persona_estudiante e WHERE e.id_persona = p_id_persona) THEN
    RAISE EXCEPTION 'Estudiante no existe (id_persona=%)', p_id_persona;
  END IF;

  UPDATE persona.persona p
     SET nombres                 = COALESCE(NULLIF(trim(p_nombres),''), p.nombres),
         apellidos               = COALESCE(NULLIF(trim(p_apellidos),''), p.apellidos),
         telefono                = COALESCE(NULLIF(trim(p_telefono),''), p.telefono),
         fecha_nacimiento        = COALESCE(p_fecha_nacimiento, p.fecha_nacimiento),
         email                   = COALESCE(NULLIF(trim(p_email),''), p.email),
         id_usuario_modificacion = p_id_actor
   WHERE p.id_persona = p_id_persona;

  UPDATE persona.persona_estudiante e
     SET codigo_estudiante       = COALESCE(NULLIF(trim(p_codigo_estudiante),''), e.codigo_estudiante),
         id_unidad_educativa     = COALESCE(p_id_unidad_educativa, e.id_unidad_educativa),
         tipo                    = COALESCE(NULLIF(trim(p_tipo),''), e.tipo),
         nivel_actual            = COALESCE(NULLIF(trim(p_nivel_actual),''), e.nivel_actual),
         curso_actual            = COALESCE(NULLIF(trim(p_curso_actual),''), e.curso_actual),
         turno_actual            = COALESCE(NULLIF(trim(p_turno_actual),''), e.turno_actual),
         carrera                 = COALESCE(NULLIF(trim(p_carrera),''), e.carrera),
         anio_ingreso            = COALESCE(p_anio_ingreso, e.anio_ingreso),
         id_usuario_modificacion = p_id_actor
   WHERE e.id_persona = p_id_persona;

  RETURN TRUE;
END;
$$;


--
-- TOC entry 517 (class 1255 OID 475137)
-- Name: fn_editar_padre(bigint, bigint, boolean, jsonb, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_editar_padre(p_id_padre bigint, p_id_actor bigint, p_es_embajador boolean DEFAULT NULL::boolean, p_metadata jsonb DEFAULT NULL::jsonb, p_estado_registro character varying DEFAULT NULL::character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM persona.persona_padre x WHERE x.id_padre = p_id_padre) THEN
    RAISE EXCEPTION 'Padre no existe (id_padre=%)', p_id_padre;
  END IF;

  UPDATE persona.persona_padre x
     SET es_embajador            = COALESCE(p_es_embajador, x.es_embajador),
         metadata                = COALESCE(p_metadata, x.metadata),
         estado_registro         = COALESCE(NULLIF(trim(p_estado_registro),''), x.estado_registro),
         id_usuario_modificacion = p_id_actor
   WHERE x.id_padre = p_id_padre;

  RETURN TRUE;
END;
$$;


--
-- TOC entry 567 (class 1255 OID 475140)
-- Name: fn_editar_proveedor(bigint, bigint, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_editar_proveedor(p_id_proveedor bigint, p_id_actor bigint, p_nombre_proveedor character varying DEFAULT NULL::character varying, p_categoria character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_estado_registro character varying DEFAULT NULL::character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM persona.proveedor pr WHERE pr.id_proveedor = p_id_proveedor) THEN
    RAISE EXCEPTION 'Proveedor no existe (id_proveedor=%)', p_id_proveedor;
  END IF;

  UPDATE persona.proveedor pr
     SET nombre_proveedor         = COALESCE(NULLIF(trim(p_nombre_proveedor),''), pr.nombre_proveedor),
         categoria                = COALESCE(NULLIF(trim(p_categoria),''), pr.categoria),
         telefono                 = COALESCE(NULLIF(trim(p_telefono),''), pr.telefono),
         estado_registro          = COALESCE(NULLIF(trim(p_estado_registro),''), pr.estado_registro),
         id_usuario_modificacion  = p_id_actor
   WHERE pr.id_proveedor = p_id_proveedor;

  RETURN TRUE;
END;
$$;


--
-- TOC entry 528 (class 1255 OID 475139)
-- Name: fn_editar_tutor(bigint, bigint, numeric, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_editar_tutor(p_id_tutor bigint, p_id_actor bigint, p_pago_por_hora numeric DEFAULT NULL::numeric, p_nivel_experiencia character varying DEFAULT NULL::character varying, p_tipo_estudiante_especialidad character varying DEFAULT NULL::character varying, p_nivel_estudiante_especialidad character varying DEFAULT NULL::character varying, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM persona.persona_tutor t WHERE t.id_tutor = p_id_tutor) THEN
    RAISE EXCEPTION 'Tutor no existe (id_tutor=%)', p_id_tutor;
  END IF;

  UPDATE persona.persona_tutor t
     SET pago_por_hora                 = COALESCE(p_pago_por_hora, t.pago_por_hora),
         nivel_experiencia             = COALESCE(NULLIF(trim(p_nivel_experiencia),''), t.nivel_experiencia),
         tipo_estudiante_especialidad  = COALESCE(NULLIF(trim(p_tipo_estudiante_especialidad),''), t.tipo_estudiante_especialidad),
         nivel_estudiante_especialidad = COALESCE(NULLIF(trim(p_nivel_estudiante_especialidad),''), t.nivel_estudiante_especialidad),
         estado_registro               = COALESCE(p_estado_registro, t.estado_registro),
         id_usuario_modificacion       = p_id_actor
   WHERE t.id_tutor = p_id_tutor;

  RETURN TRUE;
END;
$$;


--
-- TOC entry 593 (class 1255 OID 475142)
-- Name: fn_editar_unidad_educativa(bigint, bigint, character varying, character varying, numeric, numeric, boolean); Type: FUNCTION; Schema: persona; Owner: -
--

CREATE FUNCTION persona.fn_editar_unidad_educativa(p_id_unidad_educativa bigint, p_id_actor bigint, p_nombre character varying DEFAULT NULL::character varying, p_categoria character varying DEFAULT NULL::character varying, p_latitud numeric DEFAULT NULL::numeric, p_longitud numeric DEFAULT NULL::numeric, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_categoria text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM persona.unidad_educativa u
    WHERE u.id_unidad_educativa = p_id_unidad_educativa
  ) THEN
    RAISE EXCEPTION 'Unidad educativa no existe (id_unidad_educativa=%)', p_id_unidad_educativa;
  END IF;

  v_categoria := NULLIF(lower(trim(coalesce(p_categoria,''))), '');

  IF v_categoria IS NOT NULL AND v_categoria NOT IN ('privada','convenio','fiscal') THEN
    RAISE EXCEPTION 'categoria inválida (%). Valores permitidos: privada, convenio, fiscal', v_categoria
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  UPDATE persona.unidad_educativa u
     SET nombre                  = COALESCE(NULLIF(trim(p_nombre),''), u.nombre),
         categoria               = COALESCE(v_categoria, u.categoria),
         latitud                 = COALESCE(p_latitud, u.latitud),
         longitud                = COALESCE(p_longitud, u.longitud),
         estado_registro         = COALESCE(p_estado_registro, u.estado_registro),
         id_usuario_modificacion = p_id_actor
   WHERE u.id_unidad_educativa = p_id_unidad_educativa;

  RETURN TRUE;
END;
$$;


--
-- TOC entry 578 (class 1255 OID 483329)
-- Name: api_asignar_rol_usuario(bigint, bigint, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_asignar_rol_usuario(p_id_sesion bigint, p_id_persona bigint, p_codigo_rol text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_rol bigint;
  v_codigo_rol text;
BEGIN
  v_codigo_rol := upper(trim(coalesce(p_codigo_rol,'')));

  IF v_codigo_rol = '' THEN
    RETURN seguridad.fn_api_result(FALSE, 'codigo_rol es obligatorio', NULL);
  END IF;

  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SISTEMA.USUARIOS.ASIGNAR_ROL',
    'ASIGNAR_ROL_USUARIO'
  );

  v_id_rol := seguridad.fn_asignar_rol_usuario_core(p_id_persona, v_codigo_rol, v_id_actor);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,
    'ASIGNAR_ROL_USUARIO',
    'INFO',
    'seguridad',
    'usuario_rol',
    jsonb_build_object('id_persona', p_id_persona, 'id_rol', v_id_rol),
    TRUE,
    jsonb_build_object('codigo_rol', v_codigo_rol, 'id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(
    TRUE,
    format('Rol asignado: %s', v_codigo_rol),
    jsonb_build_object('id_persona', p_id_persona, 'id_rol', v_id_rol, 'codigo_rol', v_codigo_rol)
  );

EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);

  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      'ASIGNAR_ROL_USUARIO',
      'ERROR',
      'seguridad',
      'usuario_rol',
      NULL,
      FALSE,
      jsonb_build_object(
        'sqlstate', SQLSTATE,
        'error', SQLERRM,
        'id_actor', v_id_actor,
        'id_persona', p_id_persona,
        'codigo_rol', v_codigo_rol
      )
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 516 (class 1255 OID 688150)
-- Name: api_cerrar_sesion(bigint, bigint, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_cerrar_sesion(p_id_sesion bigint, p_id_sesion_objetivo bigint, p_tipo_logout text DEFAULT 'workflow'::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_ok boolean;
  v_tipo text;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.SESIONES.CERRAR', 'CERRAR_SESION');
  v_tipo := COALESCE(NULLIF(btrim(p_tipo_logout), ''), 'workflow');

  SELECT seguridad.fn_cerrar_sesion(p_id_sesion_objetivo, v_tipo)
    INTO v_ok;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CERRAR_SESION','SECURITY','seguridad','sesion',
    jsonb_build_object('id_sesion_objetivo', p_id_sesion_objetivo), TRUE,
    jsonb_build_object('id_actor', v_id_actor, 'ok', v_ok, 'tipo_logout', v_tipo)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Sesión cerrada', jsonb_build_object('id_sesion_objetivo', p_id_sesion_objetivo, 'ok', v_ok));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CERRAR_SESION','ERROR','seguridad','sesion',
      jsonb_build_object('id_sesion_objetivo', p_id_sesion_objetivo), FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 471 (class 1255 OID 688144)
-- Name: api_crear_rol(bigint, text, text, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_crear_rol(p_id_sesion bigint, p_codigo text, p_nombre text, p_descripcion text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_codigo text;
  v_id_rol bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.ROLES.GESTIONAR', 'ROL_CREAR_O_UPDATE');

  v_codigo := upper(btrim(p_codigo));

  INSERT INTO seguridad.rol (codigo, nombre, descripcion, id_usuario_creador)
  VALUES (v_codigo, p_nombre, p_descripcion, v_id_actor)
  ON CONFLICT (codigo) DO UPDATE
  SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    fecha_modificacion = now(),
    version_registro = COALESCE(seguridad.rol.version_registro, 0) + 1,
    id_usuario_modificacion = v_id_actor
  RETURNING id_rol INTO v_id_rol;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ROL_CREAR_O_UPDATE','INFO','seguridad','rol',
    jsonb_build_object('id_rol', v_id_rol), TRUE,
    jsonb_build_object('codigo', v_codigo, 'id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Rol creado/actualizado', jsonb_build_object('id_rol', v_id_rol, 'codigo', v_codigo));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ROL_CREAR_O_UPDATE','ERROR','seguridad','rol',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 406 (class 1255 OID 688145)
-- Name: api_editar_rol(bigint, bigint, text, text, text, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_editar_rol(p_id_sesion bigint, p_id_rol bigint, p_codigo text DEFAULT NULL::text, p_nombre text DEFAULT NULL::text, p_descripcion text DEFAULT NULL::text, p_estado_registro text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_codigo text;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.ROLES.GESTIONAR', 'ROL_EDITAR');
  v_codigo := CASE WHEN p_codigo IS NULL THEN NULL ELSE upper(btrim(p_codigo)) END;

  UPDATE seguridad.rol
  SET
    codigo = COALESCE(v_codigo, codigo),
    nombre = COALESCE(p_nombre, nombre),
    descripcion = COALESCE(p_descripcion, descripcion),
    estado_registro = COALESCE(p_estado_registro, estado_registro),
    fecha_modificacion = now(),
    version_registro = COALESCE(version_registro, 0) + 1,
    id_usuario_modificacion = v_id_actor
  WHERE id_rol = p_id_rol;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ROL_EDITAR','INFO','seguridad','rol',
    jsonb_build_object('id_rol', p_id_rol), TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Rol actualizado', jsonb_build_object('id_rol', p_id_rol));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ROL_EDITAR','ERROR','seguridad','rol',
      jsonb_build_object('id_rol', p_id_rol), FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 511 (class 1255 OID 688148)
-- Name: api_listar_logs(bigint, integer, integer, text, text, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_listar_logs(p_id_sesion bigint, p_limit integer DEFAULT 100, p_offset integer DEFAULT 0, p_severidad text DEFAULT NULL::text, p_tipo_accion text DEFAULT NULL::text, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_limit integer;
  v_offset integer;
  v_sev text;
  v_tipo text;
  v_q text;
  v_data jsonb;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.LOGS.VER', 'LISTAR_LOGS');

  v_limit := GREATEST(1, LEAST(500, COALESCE(p_limit, 100)));
  v_offset := GREATEST(0, COALESCE(p_offset, 0));
  v_sev := NULLIF(upper(btrim(COALESCE(p_severidad, ''))), '');
  v_tipo := NULLIF(btrim(COALESCE(p_tipo_accion, '')), '');
  v_q := NULLIF(btrim(COALESCE(p_q, '')), '');

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    INTO v_data
  FROM (
    SELECT
      l.id_action,
      l.id_sesion,
      l.tipo_accion,
      l.severidad,
      l.entity_schema,
      l.entity_table,
      l.entity_pk,
      l.success,
      l.fecha_registro,
      s.id_persona,
      pu.nombre_usuario,
      p.nombres,
      p.apellidos,
      l.metadata
    FROM seguridad.action_log l
    LEFT JOIN seguridad.sesion s ON s.id_sesion = l.id_sesion
    LEFT JOIN persona.persona_usuario pu ON pu.id_persona = s.id_persona
    LEFT JOIN persona.persona p ON p.id_persona = s.id_persona
    WHERE
      (v_sev IS NULL OR l.severidad = v_sev)
      AND (v_tipo IS NULL OR l.tipo_accion = v_tipo)
      AND (
        v_q IS NULL
        OR lower(coalesce(pu.nombre_usuario,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.nombres,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.apellidos,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(l.tipo_accion,'')) LIKE '%' || lower(v_q) || '%'
      )
    ORDER BY l.id_action DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'LISTAR_LOGS','INFO','seguridad','action_log',NULL,TRUE,
    jsonb_build_object('id_actor', v_id_actor, 'limit', v_limit, 'offset', v_offset)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Logs', v_data);
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'LISTAR_LOGS','ERROR','seguridad','action_log',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 453 (class 1255 OID 688147)
-- Name: api_listar_permisos(bigint, text, boolean); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_listar_permisos(p_id_sesion bigint, p_modulo text DEFAULT NULL::text, p_only_activos boolean DEFAULT true) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_only boolean;
  v_mod text;
  v_data jsonb;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.ROLES.VER', 'LISTAR_PERMISOS');
  v_only := COALESCE(p_only_activos, TRUE);
  v_mod := NULLIF(upper(btrim(COALESCE(p_modulo,''))), '');

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    INTO v_data
  FROM (
    SELECT id_permiso, codigo, descripcion, modulo, estado_registro
    FROM seguridad.permiso
    WHERE (NOT v_only OR estado_registro = 'Activo')
      AND (v_mod IS NULL OR upper(coalesce(modulo,'')) = v_mod)
    ORDER BY modulo NULLS LAST, codigo ASC
  ) t;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'LISTAR_PERMISOS','INFO','seguridad','permiso',NULL,TRUE,
    jsonb_build_object('id_actor', v_id_actor, 'modulo', v_mod)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Permisos', v_data);
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'LISTAR_PERMISOS','ERROR','seguridad','permiso',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 494 (class 1255 OID 688143)
-- Name: api_listar_roles(bigint, boolean); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_listar_roles(p_id_sesion bigint, p_only_activos boolean DEFAULT true) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_only boolean;
  v_data jsonb;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.ROLES.VER', 'LISTAR_ROLES');
  v_only := COALESCE(p_only_activos, TRUE);

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    INTO v_data
  FROM (
    SELECT
      r.id_rol,
      r.codigo,
      r.nombre,
      r.descripcion,
      r.estado_registro,
      COALESCE(
        jsonb_agg(DISTINCT p.codigo) FILTER (WHERE p.codigo IS NOT NULL),
        '[]'::jsonb
      ) AS permisos
    FROM seguridad.rol r
    LEFT JOIN seguridad.rol_permiso rp
      ON rp.id_rol = r.id_rol
    LEFT JOIN seguridad.permiso p
      ON p.id_permiso = rp.id_permiso
     AND p.estado_registro = 'Activo'
    WHERE (NOT v_only OR r.estado_registro = 'Activo')
    GROUP BY r.id_rol, r.codigo, r.nombre, r.descripcion, r.estado_registro
    ORDER BY r.codigo ASC
  ) t;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'LISTAR_ROLES','INFO','seguridad','rol',NULL,TRUE,
    jsonb_build_object('id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Roles', v_data);
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'LISTAR_ROLES','ERROR','seguridad','rol',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 612 (class 1255 OID 688149)
-- Name: api_listar_sesiones(bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_listar_sesiones(p_id_sesion bigint, p_limit integer DEFAULT 100, p_offset integer DEFAULT 0, p_only_activas boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_limit integer;
  v_offset integer;
  v_only boolean;
  v_q text;
  v_data jsonb;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.SESIONES.VER', 'LISTAR_SESIONES');

  v_limit := GREATEST(1, LEAST(500, COALESCE(p_limit, 100)));
  v_offset := GREATEST(0, COALESCE(p_offset, 0));
  v_only := COALESCE(p_only_activas, TRUE);
  v_q := NULLIF(btrim(COALESCE(p_q, '')), '');

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    INTO v_data
  FROM (
    SELECT
      s.id_sesion,
      s.id_persona,
      pu.nombre_usuario,
      p.nombres,
      p.apellidos,
      s.ip_acceso,
      s.user_agent,
      s.tipo_login,
      s.tipo_logout,
      s.timestamp_login,
      s.timestamp_logout,
      s.esta_activa,
      s.metadata
    FROM seguridad.sesion s
    LEFT JOIN persona.persona_usuario pu ON pu.id_persona = s.id_persona
    LEFT JOIN persona.persona p ON p.id_persona = s.id_persona
    WHERE
      (NOT v_only OR s.esta_activa = TRUE)
      AND (
        v_q IS NULL
        OR lower(coalesce(pu.nombre_usuario,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.nombres,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.apellidos,'')) LIKE '%' || lower(v_q) || '%'
      )
    ORDER BY s.id_sesion DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'LISTAR_SESIONES','INFO','seguridad','sesion',NULL,TRUE,
    jsonb_build_object('id_actor', v_id_actor, 'limit', v_limit, 'offset', v_offset)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Sesiones', v_data);
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'LISTAR_SESIONES','ERROR','seguridad','sesion',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 489 (class 1255 OID 688140)
-- Name: api_listar_usuarios(bigint, integer, integer, boolean, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_listar_usuarios(p_id_sesion bigint, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_only_activos boolean DEFAULT true, p_q text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_limit integer;
  v_offset integer;
  v_only boolean;
  v_q text;
  v_data jsonb;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.USUARIOS.VER', 'LISTAR_USUARIOS');

  v_limit := GREATEST(1, LEAST(500, COALESCE(p_limit, 50)));
  v_offset := GREATEST(0, COALESCE(p_offset, 0));
  v_only := COALESCE(p_only_activos, TRUE);
  v_q := NULLIF(btrim(COALESCE(p_q, '')), '');

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    INTO v_data
  FROM (
    SELECT
      u.id_persona,
      u.nombre_usuario,
      u.tipo_usuario,
      u.es_super_usuario,
      u.estado_registro AS estado_usuario,
      u.fecha_registro AS usuario_fecha_registro,
      u.fecha_modificacion AS usuario_fecha_modificacion,

      p.nombres,
      p.apellidos,
      p.telefono,
      p.email,
      p.fecha_nacimiento,
      p.estado_registro AS estado_persona,

      COALESCE(
        jsonb_agg(DISTINCT r.codigo) FILTER (WHERE r.codigo IS NOT NULL),
        '[]'::jsonb
      ) AS roles
    FROM persona.persona_usuario u
    JOIN persona.persona p
      ON p.id_persona = u.id_persona
    LEFT JOIN seguridad.usuario_rol ur
      ON ur.id_persona = u.id_persona
     AND ur.estado_registro = 'Activo'
    LEFT JOIN seguridad.rol r
      ON r.id_rol = ur.id_rol
     AND r.estado_registro = 'Activo'
    WHERE
      (NOT v_only OR u.estado_registro = 'Activo')
      AND (
        v_q IS NULL
        OR lower(u.nombre_usuario) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.nombres,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.apellidos,'')) LIKE '%' || lower(v_q) || '%'
        OR lower(coalesce(p.email,'')) LIKE '%' || lower(v_q) || '%'
      )
    GROUP BY
      u.id_persona, u.nombre_usuario, u.tipo_usuario, u.es_super_usuario,
      u.estado_registro, u.fecha_registro, u.fecha_modificacion,
      p.nombres, p.apellidos, p.telefono, p.email, p.fecha_nacimiento, p.estado_registro
    ORDER BY u.id_persona DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'LISTAR_USUARIOS','INFO','persona','persona_usuario',NULL, TRUE,
    jsonb_build_object('id_actor', v_id_actor, 'limit', v_limit, 'offset', v_offset, 'q', v_q)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Usuarios', v_data);
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'LISTAR_USUARIOS','ERROR','persona','persona_usuario',NULL,FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 375 (class 1255 OID 450576)
-- Name: api_login(character varying, text, text, text, text, jsonb); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_login(p_nombre_usuario character varying, p_contrasena_plana text, p_ip_acceso text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text, p_tipo_login text DEFAULT 'password'::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_ok boolean;
  v_id_persona bigint;
  v_nombres varchar;
  v_apellidos varchar;
  v_nombre_usuario varchar;
  v_tipo_usuario varchar;
  v_is_super boolean;

  v_id_sesion bigint;

  v_roles text[];
BEGIN
  SELECT a.ok, a.id_persona, a.nombres, a.apellidos, a.nombre_usuario, a.tipo_usuario, a.es_super_usuario
    INTO v_ok, v_id_persona, v_nombres, v_apellidos, v_nombre_usuario, v_tipo_usuario, v_is_super
    FROM persona.fn_autenticar_usuario(p_nombre_usuario, p_contrasena_plana) a;

  IF NOT coalesce(v_ok,false) THEN
    RETURN seguridad.fn_api_result(false, 'Credenciales inválidas', NULL);
  END IF;

  v_id_sesion := seguridad.fn_crear_sesion(v_id_persona, p_ip_acceso, p_user_agent, p_tipo_login, p_metadata);

  SELECT coalesce(array_agg(r.codigo ORDER BY r.codigo), ARRAY[]::text[])
    INTO v_roles
    FROM seguridad.usuario_rol ur
    JOIN seguridad.rol r ON r.id_rol = ur.id_rol
   WHERE ur.id_persona = v_id_persona
     AND ur.estado_registro = 'Activo'
     AND r.estado_registro = 'Activo';

  RETURN seguridad.fn_api_result(
    true,
    'Login exitoso',
    jsonb_build_object(
      'id_sesion', v_id_sesion,
      'id_persona', v_id_persona,
      'nombres', v_nombres,
      'apellidos', v_apellidos,
      'nombre_usuario', v_nombre_usuario,
      'tipo_usuario', v_tipo_usuario,
      'es_super_usuario', coalesce(v_is_super,false),
      'roles', v_roles
    )
  );

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(false, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 387 (class 1255 OID 450577)
-- Name: api_logout(bigint, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_logout(p_id_sesion bigint, p_tipo_logout text DEFAULT 'usuario'::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_ok boolean;
BEGIN
  v_ok := seguridad.fn_cerrar_sesion(p_id_sesion, p_tipo_logout);

  IF v_ok THEN
    RETURN seguridad.fn_api_result(true, 'Sesión cerrada', jsonb_build_object('id_sesion', p_id_sesion));
  END IF;

  RETURN seguridad.fn_api_result(false, 'Sesión no encontrada o ya cerrada', jsonb_build_object('id_sesion', p_id_sesion));
END;
$$;


--
-- TOC entry 580 (class 1255 OID 688128)
-- Name: api_ping(); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_ping() RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN seguridad.fn_api_result(TRUE, 'pong', jsonb_build_object('pong', TRUE));
END;
$$;


--
-- TOC entry 477 (class 1255 OID 688146)
-- Name: api_set_permisos_rol(bigint, bigint, text[]); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.api_set_permisos_rol(p_id_sesion bigint, p_id_rol bigint, p_permisos text[]) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_codes text[];
  v_count integer := 0;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(p_id_sesion, 'SISTEMA.ROLES.GESTIONAR', 'ROL_SET_PERMISOS');

  SELECT COALESCE(array_agg(DISTINCT upper(btrim(x))), ARRAY[]::text[])
    INTO v_codes
  FROM unnest(COALESCE(p_permisos, ARRAY[]::text[])) x
  WHERE btrim(COALESCE(x,'')) <> '';

  DELETE FROM seguridad.rol_permiso WHERE id_rol = p_id_rol;

  IF array_length(v_codes, 1) IS NOT NULL AND array_length(v_codes, 1) > 0 THEN
    INSERT INTO seguridad.rol_permiso (id_rol, id_permiso, id_usuario_creador)
    SELECT p_id_rol, p.id_permiso, v_id_actor
    FROM seguridad.permiso p
    WHERE p.codigo = ANY(v_codes)
      AND p.estado_registro = 'Activo'
    ON CONFLICT DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
  END IF;

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ROL_SET_PERMISOS','SECURITY','seguridad','rol_permiso',
    jsonb_build_object('id_rol', p_id_rol), TRUE,
    jsonb_build_object('count', v_count, 'id_actor', v_id_actor)
  );

  RETURN seguridad.fn_api_result(TRUE, 'Permisos actualizados', jsonb_build_object('id_rol', p_id_rol, 'permisos', v_codes));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ROL_SET_PERMISOS','ERROR','seguridad','rol_permiso',
      jsonb_build_object('id_rol', p_id_rol), FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM,'id_actor',v_id_actor)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 660 (class 1255 OID 450571)
-- Name: fn_api_result(boolean, text, jsonb); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_api_result(p_ok boolean, p_message text, p_data jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT jsonb_build_object(
    'ok',      coalesce(p_ok,false),
    'message', coalesce(p_message,''),
    'data',    p_data
  );
$$;


--
-- TOC entry 537 (class 1255 OID 483328)
-- Name: fn_asignar_rol_usuario_core(bigint, text, bigint); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_asignar_rol_usuario_core(p_id_persona bigint, p_codigo_rol text, p_id_actor bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_rol bigint;
  v_codigo_rol text;
BEGIN
  v_codigo_rol := upper(trim(coalesce(p_codigo_rol,'')));

  IF v_codigo_rol = '' THEN
    RAISE EXCEPTION 'codigo_rol es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Validar persona existe y está activa
  IF NOT EXISTS (
    SELECT 1
    FROM persona.persona p
    WHERE p.id_persona = p_id_persona
      AND p.estado_registro = 'Activo'
  ) THEN
    RAISE EXCEPTION 'Persona no existe o está inactiva (id_persona=%)', p_id_persona
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Validar rol existe y está activo
  SELECT r.id_rol
    INTO v_id_rol
    FROM seguridad.rol r
   WHERE upper(trim(r.codigo)) = v_codigo_rol
     AND r.estado_registro = 'Activo'
   LIMIT 1;

  IF v_id_rol IS NULL THEN
    RAISE EXCEPTION 'Rol no existe o está inactivo (codigo=%)', v_codigo_rol
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Insert/reactivar + auditoría
  INSERT INTO seguridad.usuario_rol (
    id_persona, id_rol, estado_registro, id_usuario_creador
  )
  VALUES (
    p_id_persona, v_id_rol, 'Activo', p_id_actor
  )
  ON CONFLICT (id_persona, id_rol)
  DO UPDATE SET
    estado_registro        = 'Activo',
    fecha_modificacion     = now(),
    version_registro       = COALESCE(seguridad.usuario_rol.version_registro,1) + 1,
    id_usuario_modificacion= p_id_actor;

  RETURN v_id_rol;
END;
$$;


--
-- TOC entry 661 (class 1255 OID 491520)
-- Name: fn_assert_permiso(bigint, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_assert_permiso(p_id_sesion bigint, p_codigo_permiso text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
  v_perm text;
BEGIN
  v_perm := upper(trim(coalesce(p_codigo_permiso,'')));

  IF v_perm = '' THEN
    RAISE EXCEPTION 'permiso es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  SELECT s.id_persona
    INTO v_id_persona
    FROM seguridad.sesion s
   WHERE s.id_sesion = p_id_sesion
     AND s.esta_activa = true
   LIMIT 1;

  IF v_id_persona IS NULL THEN
    RAISE EXCEPTION 'Sesión inválida o expirada'
      USING ERRCODE = 'invalid_authorization_specification';
  END IF;

  IF NOT seguridad.fn_tiene_permiso(v_id_persona, v_perm) THEN
    RAISE EXCEPTION 'No autorizado (permiso=%)', v_perm
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN v_id_persona;
END;
$$;


--
-- TOC entry 447 (class 1255 OID 647168)
-- Name: fn_cerrar_sesion(bigint, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_cerrar_sesion(p_id_sesion bigint, p_tipo_logout text DEFAULT 'usuario'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
  v_updated int := 0;
  v_tabla text;
BEGIN
  IF p_id_sesion IS NULL THEN
    RAISE EXCEPTION 'id_sesion es obligatorio'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Preferimos seguridad.sesion si existe, sino otra alternativa común
  IF to_regclass('seguridad.sesion') IS NOT NULL THEN
    v_tabla := 'seguridad.sesion';
  ELSIF to_regclass('seguridad.sesion_usuario') IS NOT NULL THEN
    v_tabla := 'seguridad.sesion_usuario';
  ELSE
    RAISE EXCEPTION 'No se encontró tabla de sesiones (esperado seguridad.sesion o seguridad.sesion_usuario)';
  END IF;

  -- Actualización flexible (solo columnas que existan)
  IF v_tabla = 'seguridad.sesion' THEN
    EXECUTE format($sql$
      UPDATE seguridad.sesion s
      SET
        -- set logout timestamp si existe
        %s
        %s
        %s
      WHERE s.id_sesion = $1
    $sql$,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion' AND column_name='timestamp_logout'
        )
        THEN 'timestamp_logout = COALESCE(timestamp_logout, now()),'
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion' AND column_name='fecha_logout'
        )
        THEN 'fecha_logout = COALESCE(fecha_logout, now()),'
        ELSE ''
      END,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion' AND column_name='tipo_logout'
        )
        THEN 'tipo_logout = $2,'
        ELSE ''
      END,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion' AND column_name IN ('updated_at','fecha_modificacion')
        )
        THEN (
          CASE
            WHEN EXISTS (
              SELECT 1 FROM information_schema.columns
              WHERE table_schema='seguridad' AND table_name='sesion' AND column_name='updated_at'
            )
            THEN 'updated_at = now()'
            ELSE 'fecha_modificacion = now()'
          END
        )
        ELSE 'id_sesion = id_sesion'  -- noop final para evitar coma colgante
      END
    )
    USING p_id_sesion, p_tipo_logout;

    GET DIAGNOSTICS v_updated = ROW_COUNT;

  ELSE
    -- seguridad.sesion_usuario (si tu proyecto usara ese nombre)
    EXECUTE format($sql$
      UPDATE seguridad.sesion_usuario s
      SET
        %s
        %s
        %s
      WHERE s.id_sesion = $1
    $sql$,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion_usuario' AND column_name='timestamp_logout'
        )
        THEN 'timestamp_logout = COALESCE(timestamp_logout, now()),'
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion_usuario' AND column_name='fecha_logout'
        )
        THEN 'fecha_logout = COALESCE(fecha_logout, now()),'
        ELSE ''
      END,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion_usuario' AND column_name='tipo_logout'
        )
        THEN 'tipo_logout = $2,'
        ELSE ''
      END,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='seguridad' AND table_name='sesion_usuario' AND column_name IN ('updated_at','fecha_modificacion')
        )
        THEN (
          CASE
            WHEN EXISTS (
              SELECT 1 FROM information_schema.columns
              WHERE table_schema='seguridad' AND table_name='sesion_usuario' AND column_name='updated_at'
            )
            THEN 'updated_at = now()'
            ELSE 'fecha_modificacion = now()'
          END
        )
        ELSE 'id_sesion = id_sesion'
      END
    )
    USING p_id_sesion, p_tipo_logout;

    GET DIAGNOSTICS v_updated = ROW_COUNT;
  END IF;

  RETURN v_updated > 0;
END;
$_$;


--
-- TOC entry 664 (class 1255 OID 450574)
-- Name: fn_crear_sesion(bigint, text, text, text, jsonb); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_crear_sesion(p_id_persona bigint, p_ip_acceso text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text, p_tipo_login text DEFAULT 'password'::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_sesion bigint;
BEGIN
  INSERT INTO seguridad.sesion(
    id_persona, ip_acceso, user_agent, tipo_login, metadata
  )
  VALUES(
    p_id_persona, p_ip_acceso, p_user_agent, p_tipo_login, coalesce(p_metadata,'{}'::jsonb)
  )
  RETURNING id_sesion INTO v_id_sesion;

  RETURN v_id_sesion;
END;
$$;


--
-- TOC entry 633 (class 1255 OID 450568)
-- Name: fn_es_super_usuario(bigint); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_es_super_usuario(p_id_persona bigint) RETURNS boolean
    LANGUAGE sql
    AS $$
  SELECT COALESCE(u.es_super_usuario, false)
  FROM persona.persona_usuario u
  WHERE u.id_persona = p_id_persona
    AND u.estado_registro = 'Activo'
  LIMIT 1;
$$;


--
-- TOC entry 609 (class 1255 OID 450566)
-- Name: fn_get_sesion_persona(bigint); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_get_sesion_persona(p_id_sesion bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
BEGIN
  SELECT s.id_persona
    INTO v_id_persona
    FROM seguridad.sesion s
   WHERE s.id_sesion = p_id_sesion
     AND s.esta_activa = TRUE;

  IF v_id_persona IS NULL THEN
    RAISE EXCEPTION 'Sesión inválida o inactiva (id_sesion=%)', p_id_sesion
      USING ERRCODE = 'invalid_authorization_specification';
  END IF;

  RETURN v_id_persona;
END;
$$;


--
-- TOC entry 386 (class 1255 OID 450570)
-- Name: fn_guard_permiso_api(bigint, text, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_guard_permiso_api(p_id_sesion bigint, p_codigo_permiso text, p_tipo_accion text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_persona bigint;
BEGIN
  -- valida sesión (si es inválida, lanza excepción)
  v_id_persona := seguridad.fn_get_sesion_persona(p_id_sesion);

  -- valida permiso
  IF NOT seguridad.fn_tiene_permiso(v_id_persona, p_codigo_permiso) THEN
    -- log de intento denegado (best-effort)
    PERFORM seguridad.fn_log_action(
      p_id_sesion,
      p_tipo_accion,
      'SECURITY',
      NULL,
      NULL,
      NULL,
      FALSE,
      jsonb_build_object(
        'motivo', 'PERMISO_DENEGADO',
        'permiso_requerido', p_codigo_permiso,
        'id_persona', v_id_persona
      )
    );

    RAISE EXCEPTION 'No autorizado: requiere permiso % (id_persona=%)', p_codigo_permiso, v_id_persona
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN v_id_persona;
END;
$$;


--
-- TOC entry 404 (class 1255 OID 450567)
-- Name: fn_log_action(bigint, text, text, text, text, jsonb, boolean, jsonb); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_log_action(p_id_sesion bigint, p_tipo_accion text, p_severidad text DEFAULT 'INFO'::text, p_entity_schema text DEFAULT NULL::text, p_entity_table text DEFAULT NULL::text, p_entity_pk jsonb DEFAULT NULL::jsonb, p_success boolean DEFAULT true, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_user_agent text;
  v_id_persona bigint;
BEGIN
  -- Best-effort: if log function fails, the core operation will not be stopped
  BEGIN
    SELECT s.user_agent, s.id_persona
      INTO v_user_agent, v_id_persona
      FROM seguridad.sesion s
     WHERE s.id_sesion = p_id_sesion;

    INSERT INTO seguridad.action_log(
      id_sesion,
      tipo_accion,
      severidad,
      entity_schema,
      entity_table,
      entity_pk,
      user_agent,
      metadata,
      success,
      id_usuario_creador
    )
    VALUES (
      p_id_sesion,
      p_tipo_accion,
      COALESCE(p_severidad,'INFO'),
      p_entity_schema,
      p_entity_table,
      p_entity_pk,
      v_user_agent,
      COALESCE(p_metadata,'{}'::jsonb),
      COALESCE(p_success, TRUE),
      v_id_persona
    );
  EXCEPTION WHEN OTHERS THEN
    -- swallow
    NULL;
  END;
END;
$$;


--
-- TOC entry 390 (class 1255 OID 450565)
-- Name: fn_permisos_efectivos(bigint); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_permisos_efectivos(p_id_persona bigint) RETURNS TABLE(codigo_permiso text)
    LANGUAGE sql
    AS $$
  WITH base AS (
    -- Permisos por roles activos
    SELECT rp.id_permiso
    FROM seguridad.usuario_rol ur
    JOIN seguridad.rol r
      ON r.id_rol = ur.id_rol
     AND r.estado_registro = 'Activo'
    JOIN seguridad.rol_permiso rp
      ON rp.id_rol = r.id_rol
    WHERE ur.id_persona = p_id_persona
      AND ur.estado_registro = 'Activo'

    UNION

    -- Permisos directos permitidos
    SELECT up.id_permiso
    FROM seguridad.usuario_permiso up
    WHERE up.id_persona = p_id_persona
      AND up.permitido = true
  )
  SELECT DISTINCT p.codigo
  FROM base b
  JOIN seguridad.permiso p
    ON p.id_permiso = b.id_permiso
   AND p.estado_registro = 'Activo'
  WHERE NOT EXISTS (
    SELECT 1
    FROM seguridad.usuario_permiso up2
    WHERE up2.id_persona = p_id_persona
      AND up2.id_permiso = p.id_permiso
      AND up2.permitido = false
  )
  ORDER BY p.codigo;
$$;


--
-- TOC entry 554 (class 1255 OID 450569)
-- Name: fn_tiene_permiso(bigint, text); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_tiene_permiso(p_id_persona bigint, p_codigo_permiso text) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
  v_id_permiso bigint;
  v_perm_directo boolean;
BEGIN
  -- Parametros mínimos
  IF p_id_persona IS NULL OR coalesce(btrim(p_codigo_permiso), '') = '' THEN
    RETURN FALSE;
  END IF;

  -- Superusuario = bypass
  IF seguridad.fn_es_super_usuario(p_id_persona) THEN
    RETURN TRUE;
  END IF;

  -- Permiso debe existir y estar activo
  SELECT p.id_permiso
    INTO v_id_permiso
    FROM seguridad.permiso p
   WHERE p.codigo = p_codigo_permiso
     AND p.estado_registro = 'Activo'
   LIMIT 1;

  IF v_id_permiso IS NULL THEN
    RETURN FALSE; -- deny by default
  END IF;

  -- Override directo (grant/revoke) tiene prioridad
  SELECT up.permitido
    INTO v_perm_directo
    FROM seguridad.usuario_permiso up
   WHERE up.id_persona = p_id_persona
     AND up.id_permiso = v_id_permiso;

  IF FOUND THEN
    RETURN v_perm_directo; -- TRUE = grant directo, FALSE = revoke directo
  END IF;

  -- Permiso por rol (solo roles activos y asignación activa)
  RETURN EXISTS (
    SELECT 1
      FROM seguridad.usuario_rol ur
      JOIN seguridad.rol r
        ON r.id_rol = ur.id_rol
       AND r.estado_registro = 'Activo'
      JOIN seguridad.rol_permiso rp
        ON rp.id_rol = r.id_rol
     WHERE ur.id_persona = p_id_persona
       AND ur.estado_registro = 'Activo'
       AND rp.id_permiso = v_id_permiso
  );
END;
$$;


--
-- TOC entry 590 (class 1255 OID 606267)
-- Name: api_actualizar_asistencia_clase_curso(bigint, bigint, bigint, bigint, character varying, timestamp without time zone, character varying, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_asistencia_clase_curso(p_id_sesion bigint, p_id_asistencia bigint, p_id_clase_curso bigint, p_id_estudiante bigint, p_estado_asistencia character varying, p_hora_marcacion timestamp without time zone DEFAULT NULL::timestamp without time zone, p_observaciones character varying DEFAULT NULL::character varying, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.ASISTENCIA.REGISTRAR','ACTUALIZAR_ASISTENCIA'
  );

  PERFORM servicios_educativos.fn_actualizar_asistencia_clase_curso(
    v_id_actor, p_id_asistencia, p_id_clase_curso, p_id_estudiante, p_estado_asistencia, p_hora_marcacion, p_observaciones, p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_ASISTENCIA','INFO','servicios_educativos','asistencia_clase_curso',
    jsonb_build_object('id_asistencia', p_id_asistencia), TRUE,
    jsonb_build_object('estado_asistencia',p_estado_asistencia,'estado_registro',p_estado_registro)
  );

  RETURN seguridad.fn_api_result(TRUE,'Asistencia actualizada', jsonb_build_object('id_asistencia', p_id_asistencia));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 355 (class 1255 OID 606263)
-- Name: api_actualizar_clase_curso(bigint, bigint, bigint, date, time without time zone, time without time zone, bigint, bigint, character varying, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_clase_curso(p_id_sesion bigint, p_id_clase_curso bigint, p_id_curso_version bigint, p_fecha date, p_hora_inicio_real time without time zone, p_hora_fin_real time without time zone, p_id_aula bigint DEFAULT NULL::bigint, p_id_tutor bigint DEFAULT NULL::bigint, p_estado character varying DEFAULT NULL::character varying, p_modalidad character varying DEFAULT NULL::character varying, p_detalle_temas_revisados character varying DEFAULT NULL::character varying, p_observaciones character varying DEFAULT NULL::character varying, p_motivo_cancelacion character varying DEFAULT NULL::character varying, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.CLASES.EDITAR','ACTUALIZAR_CLASE_CURSO'
  );

  PERFORM servicios_educativos.fn_actualizar_clase_curso(
    v_id_actor,
    p_id_clase_curso, p_id_curso_version,
    p_fecha, p_hora_inicio_real, p_hora_fin_real,
    p_id_aula, p_id_tutor,
    p_estado, p_modalidad,
    p_detalle_temas_revisados, p_observaciones, p_motivo_cancelacion,
    p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_CLASE_CURSO','INFO','servicios_educativos','clase_curso',
    jsonb_build_object('id_clase_curso', p_id_clase_curso), TRUE,
    jsonb_build_object('estado',p_estado,'modalidad',p_modalidad,'estado_registro',p_estado_registro)
  );

  RETURN seguridad.fn_api_result(TRUE,'Clase de curso actualizada', jsonb_build_object('id_clase_curso', p_id_clase_curso));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 490 (class 1255 OID 606271)
-- Name: api_actualizar_clase_por_hora(bigint, bigint, integer, integer, integer, integer, timestamp without time zone, text, text, text, timestamp with time zone); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_clase_por_hora(p_id_sesion bigint, p_id_clase bigint, p_id_aula integer, p_id_estudiante integer, p_id_tutor integer, p_id_materia_tree integer, p_hora_llegada timestamp without time zone, p_motivo text, p_modalidad text DEFAULT NULL::text, p_estado_operativo text DEFAULT NULL::text, p_hora_salida timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.CLASES.EDITAR','ACTUALIZAR_CLASE_POR_HORA'
  );

  PERFORM servicios_educativos.fn_actualizar_clase_por_hora(
    v_id_actor,
    p_id_clase,
    p_id_aula, p_id_estudiante, p_id_tutor, p_id_materia_tree,
    p_hora_llegada, p_motivo,
    p_modalidad, p_estado_operativo, p_hora_salida
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_CLASE_POR_HORA','INFO','servicios_educativos','clase_por_hora',
    jsonb_build_object('id_clase', p_id_clase), TRUE,
    jsonb_build_object('estado_operativo',p_estado_operativo,'hora_salida',p_hora_salida)
  );

  RETURN seguridad.fn_api_result(TRUE,'Clase por hora actualizada', jsonb_build_object('id_clase', p_id_clase));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 442 (class 1255 OID 606259)
-- Name: api_actualizar_curso_version(bigint, bigint, bigint, character varying, text, date, date, numeric, integer, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_curso_version(p_id_sesion bigint, p_id_curso_version bigint, p_id_producto_educativo bigint, p_nombre_version character varying, p_descripcion_version text DEFAULT NULL::text, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date, p_precio_version numeric DEFAULT NULL::numeric, p_id_horario integer DEFAULT NULL::integer, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.CURSOS.GESTIONAR','ACTUALIZAR_CURSO_VERSION'
  );

  PERFORM servicios_educativos.fn_actualizar_curso_version(
    v_id_actor,
    p_id_curso_version, p_id_producto_educativo, p_nombre_version,
    p_descripcion_version, p_fecha_inicio, p_fecha_fin,
    p_precio_version, p_id_horario, p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_CURSO_VERSION','INFO','servicios_educativos','curso_version',
    jsonb_build_object('id_curso_version', p_id_curso_version), TRUE,
    jsonb_build_object('id_producto_educativo',p_id_producto_educativo,'nombre_version',p_nombre_version,'estado_registro',p_estado_registro)
  );

  RETURN seguridad.fn_api_result(TRUE,'Curso versión actualizada', jsonb_build_object('id_curso_version', p_id_curso_version));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 461 (class 1255 OID 606247)
-- Name: api_actualizar_horarios(bigint, bigint, text, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_horarios(p_id_sesion bigint, p_id_horario bigint, p_repeticion text DEFAULT NULL::text, p_hora_inicio_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_martes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_sabado time without time zone DEFAULT NULL::time without time zone, p_hora_fin_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_martes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_fin_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_fin_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_sabado time without time zone DEFAULT NULL::time without time zone, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ACADEMICO.HORARIOS.GESTIONAR',
    'ACTUALIZAR_HORARIOS'
  );

  PERFORM servicios_educativos.fn_actualizar_horarios(
    v_id_actor,
    p_id_horario,
    p_repeticion,
    p_hora_inicio_lunes, p_hora_inicio_martes, p_hora_inicio_miercoles, p_hora_inicio_jueves, p_hora_inicio_viernes, p_hora_inicio_sabado,
    p_hora_fin_lunes,    p_hora_fin_martes,    p_hora_fin_miercoles,    p_hora_fin_jueves,    p_hora_fin_viernes,    p_hora_fin_sabado,
    p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_HORARIOS','INFO','servicios_educativos','horarios',
    jsonb_build_object('id_horario', p_id_horario), TRUE,
    jsonb_build_object('repeticion',p_repeticion,'estado_registro',p_estado_registro)
  );

  RETURN seguridad.fn_api_result(TRUE,'Horario actualizado', jsonb_build_object('id_horario', p_id_horario));

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 508 (class 1255 OID 606243)
-- Name: api_actualizar_materia_tree(bigint, bigint, character varying, character varying, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_materia_tree(p_id_sesion bigint, p_id_tree bigint, p_nombre character varying, p_tema character varying, p_subtema character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ACADEMICO.MATERIA_TREE.EDITAR',
    'ACTUALIZAR_MATERIA_TREE'
  );

  PERFORM servicios_educativos.fn_actualizar_materia_tree(
    v_id_actor, p_id_tree, p_nombre, p_tema, p_subtema
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_MATERIA_TREE','INFO','servicios_educativos','materia_tree',
    jsonb_build_object('id_tree', p_id_tree), TRUE,
    jsonb_build_object('nombre',p_nombre,'tema',p_tema,'subtema',p_subtema)
  );

  RETURN seguridad.fn_api_result(TRUE,'Materia actualizada', jsonb_build_object('id_tree', p_id_tree));

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 434 (class 1255 OID 606255)
-- Name: api_actualizar_paquete_producto_educativo(bigint, bigint, character varying, numeric, integer, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_paquete_producto_educativo(p_id_sesion bigint, p_id_paquete bigint, p_nombre_paquete character varying, p_precio_paquete numeric, p_cantidad_horas_paquete integer DEFAULT NULL::integer, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.PAQUETES.GESTIONAR','ACTUALIZAR_PAQUETE'
  );

  PERFORM servicios_educativos.fn_actualizar_paquete_producto_educativo(
    v_id_actor, p_id_paquete, p_nombre_paquete, p_precio_paquete, p_cantidad_horas_paquete, p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_PAQUETE','INFO','servicios_educativos','paquetes_producto_educativo',
    jsonb_build_object('id_paquete', p_id_paquete), TRUE,
    jsonb_build_object('nombre_paquete',p_nombre_paquete,'precio_paquete',p_precio_paquete,'estado_registro',p_estado_registro)
  );

  RETURN seguridad.fn_api_result(TRUE,'Paquete actualizado', jsonb_build_object('id_paquete', p_id_paquete));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 532 (class 1255 OID 606251)
-- Name: api_actualizar_producto_educativo(bigint, bigint, character varying, character varying, text, numeric, integer, integer, integer, text, text, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_actualizar_producto_educativo(p_id_sesion bigint, p_id_producto_educativo bigint, p_nombre character varying, p_tipo_producto character varying, p_descripcion text DEFAULT NULL::text, p_precio_base numeric DEFAULT NULL::numeric, p_lim_sup_estudiantes integer DEFAULT NULL::integer, p_lim_inf_estudiantes integer DEFAULT NULL::integer, p_id_producto_tienda integer DEFAULT NULL::integer, p_link_bibliografia text DEFAULT NULL::text, p_link_publicidad text DEFAULT NULL::text, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ACADEMICO.PRODUCTO.GESTIONAR',
    'ACTUALIZAR_PRODUCTO_EDUCATIVO'
  );

  PERFORM servicios_educativos.fn_actualizar_producto_educativo(
    v_id_actor,
    p_id_producto_educativo,
    p_nombre, p_tipo_producto,
    p_descripcion, p_precio_base,
    p_lim_sup_estudiantes, p_lim_inf_estudiantes,
    p_id_producto_tienda, p_link_bibliografia, p_link_publicidad,
    p_estado_registro
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_PRODUCTO_EDUCATIVO','INFO','servicios_educativos','producto_educativo',
    jsonb_build_object('id_producto_educativo', p_id_producto_educativo), TRUE,
    jsonb_build_object('nombre',p_nombre,'tipo_producto',p_tipo_producto,'estado_registro',p_estado_registro)
  );

  RETURN seguridad.fn_api_result(TRUE,'Producto educativo actualizado', jsonb_build_object('id_producto_educativo', p_id_producto_educativo));

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 357 (class 1255 OID 606266)
-- Name: api_crear_asistencia_clase_curso(bigint, bigint, bigint, character varying, timestamp without time zone, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_asistencia_clase_curso(p_id_sesion bigint, p_id_clase_curso bigint, p_id_estudiante bigint, p_estado_asistencia character varying, p_hora_marcacion timestamp without time zone DEFAULT NULL::timestamp without time zone, p_observaciones character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_asistencia bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.ASISTENCIA.REGISTRAR','CREAR_ASISTENCIA'
  );

  v_id_asistencia := servicios_educativos.fn_crear_asistencia_clase_curso(
    v_id_actor, p_id_clase_curso, p_id_estudiante, p_estado_asistencia, p_hora_marcacion, p_observaciones
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_ASISTENCIA','INFO','servicios_educativos','asistencia_clase_curso',
    jsonb_build_object('id_asistencia', v_id_asistencia), TRUE,
    jsonb_build_object('id_clase_curso',p_id_clase_curso,'id_estudiante',p_id_estudiante,'estado_asistencia',p_estado_asistencia)
  );

  RETURN seguridad.fn_api_result(TRUE,'Asistencia registrada', jsonb_build_object('id_asistencia', v_id_asistencia));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 611 (class 1255 OID 606262)
-- Name: api_crear_clase_curso(bigint, bigint, date, time without time zone, time without time zone, bigint, bigint, character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_clase_curso(p_id_sesion bigint, p_id_curso_version bigint, p_fecha date, p_hora_inicio_real time without time zone, p_hora_fin_real time without time zone, p_id_aula bigint DEFAULT NULL::bigint, p_id_tutor bigint DEFAULT NULL::bigint, p_estado character varying DEFAULT 'Programada'::character varying, p_modalidad character varying DEFAULT 'Presencial'::character varying, p_detalle_temas_revisados character varying DEFAULT NULL::character varying, p_observaciones character varying DEFAULT NULL::character varying, p_motivo_cancelacion character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_clase_curso bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.CLASES.REGISTRAR','CREAR_CLASE_CURSO'
  );

  v_id_clase_curso := servicios_educativos.fn_crear_clase_curso(
    v_id_actor,
    p_id_curso_version, p_fecha, p_hora_inicio_real, p_hora_fin_real,
    p_id_aula, p_id_tutor,
    p_estado, p_modalidad,
    p_detalle_temas_revisados, p_observaciones, p_motivo_cancelacion
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_CLASE_CURSO','INFO','servicios_educativos','clase_curso',
    jsonb_build_object('id_clase_curso', v_id_clase_curso), TRUE,
    jsonb_build_object('id_curso_version',p_id_curso_version,'fecha',p_fecha)
  );

  RETURN seguridad.fn_api_result(TRUE,'Clase de curso creada', jsonb_build_object('id_clase_curso', v_id_clase_curso));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 376 (class 1255 OID 606270)
-- Name: api_crear_clase_por_hora(bigint, integer, integer, integer, integer, timestamp without time zone, text, text, text, timestamp with time zone); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_clase_por_hora(p_id_sesion bigint, p_id_aula integer, p_id_estudiante integer, p_id_tutor integer, p_id_materia_tree integer, p_hora_llegada timestamp without time zone, p_motivo text, p_modalidad text DEFAULT 'PRESENCIAL'::text, p_estado_operativo text DEFAULT 'ABIERTA'::text, p_hora_salida timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_clase bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.CLASES.REGISTRAR','CREAR_CLASE_POR_HORA'
  );

  v_id_clase := servicios_educativos.fn_crear_clase_por_hora(
    v_id_actor,
    p_id_aula, p_id_estudiante, p_id_tutor, p_id_materia_tree,
    p_hora_llegada, p_motivo,
    p_modalidad, p_estado_operativo, p_hora_salida
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_CLASE_POR_HORA','INFO','servicios_educativos','clase_por_hora',
    jsonb_build_object('id_clase', v_id_clase), TRUE,
    jsonb_build_object('id_tutor',p_id_tutor,'id_estudiante',p_id_estudiante,'motivo',p_motivo)
  );

  RETURN seguridad.fn_api_result(TRUE,'Clase por hora creada', jsonb_build_object('id_clase', v_id_clase));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 460 (class 1255 OID 606258)
-- Name: api_crear_curso_version(bigint, bigint, character varying, text, date, date, numeric, integer); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_curso_version(p_id_sesion bigint, p_id_producto_educativo bigint, p_nombre_version character varying, p_descripcion_version text DEFAULT NULL::text, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date, p_precio_version numeric DEFAULT NULL::numeric, p_id_horario integer DEFAULT NULL::integer) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_curso_version bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.CURSOS.GESTIONAR','CREAR_CURSO_VERSION'
  );

  v_id_curso_version := servicios_educativos.fn_crear_curso_version(
    v_id_actor,
    p_id_producto_educativo, p_nombre_version,
    p_descripcion_version, p_fecha_inicio, p_fecha_fin,
    p_precio_version, p_id_horario
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_CURSO_VERSION','INFO','servicios_educativos','curso_version',
    jsonb_build_object('id_curso_version', v_id_curso_version), TRUE,
    jsonb_build_object('id_producto_educativo',p_id_producto_educativo,'nombre_version',p_nombre_version)
  );

  RETURN seguridad.fn_api_result(TRUE,'Curso versión creada', jsonb_build_object('id_curso_version', v_id_curso_version));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 367 (class 1255 OID 606246)
-- Name: api_crear_horarios(bigint, text, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_horarios(p_id_sesion bigint, p_repeticion text DEFAULT NULL::text, p_hora_inicio_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_martes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_sabado time without time zone DEFAULT NULL::time without time zone, p_hora_fin_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_martes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_fin_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_fin_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_sabado time without time zone DEFAULT NULL::time without time zone) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_horario bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ACADEMICO.HORARIOS.GESTIONAR',
    'CREAR_HORARIOS'
  );

  v_id_horario := servicios_educativos.fn_crear_horarios(
    v_id_actor,
    p_repeticion,
    p_hora_inicio_lunes, p_hora_inicio_martes, p_hora_inicio_miercoles, p_hora_inicio_jueves, p_hora_inicio_viernes, p_hora_inicio_sabado,
    p_hora_fin_lunes,    p_hora_fin_martes,    p_hora_fin_miercoles,    p_hora_fin_jueves,    p_hora_fin_viernes,    p_hora_fin_sabado
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_HORARIOS','INFO','servicios_educativos','horarios',
    jsonb_build_object('id_horario', v_id_horario), TRUE,
    jsonb_build_object('repeticion',p_repeticion)
  );

  RETURN seguridad.fn_api_result(TRUE,'Horario creado', jsonb_build_object('id_horario', v_id_horario));

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 577 (class 1255 OID 606242)
-- Name: api_crear_materia_tree(bigint, character varying, character varying, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_materia_tree(p_id_sesion bigint, p_nombre character varying, p_tema character varying, p_subtema character varying) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_tree bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ACADEMICO.MATERIA_TREE.EDITAR',
    'CREAR_MATERIA_TREE'
  );

  v_id_tree := servicios_educativos.fn_crear_materia_tree(
    v_id_actor, p_nombre, p_tema, p_subtema
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_MATERIA_TREE','INFO','servicios_educativos','materia_tree',
    jsonb_build_object('id_tree', v_id_tree), TRUE,
    jsonb_build_object('nombre',p_nombre,'tema',p_tema,'subtema',p_subtema)
  );

  RETURN seguridad.fn_api_result(TRUE,'Materia creada', jsonb_build_object('id_tree', v_id_tree));

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 499 (class 1255 OID 606254)
-- Name: api_crear_paquete_producto_educativo(bigint, character varying, numeric, integer); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_paquete_producto_educativo(p_id_sesion bigint, p_nombre_paquete character varying, p_precio_paquete numeric, p_cantidad_horas_paquete integer DEFAULT 1) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_paquete bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,'ACADEMICO.PAQUETES.GESTIONAR','CREAR_PAQUETE'
  );

  v_id_paquete := servicios_educativos.fn_crear_paquete_producto_educativo(
    v_id_actor, p_nombre_paquete, p_precio_paquete, p_cantidad_horas_paquete
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_PAQUETE','INFO','servicios_educativos','paquetes_producto_educativo',
    jsonb_build_object('id_paquete', v_id_paquete), TRUE,
    jsonb_build_object('nombre_paquete',p_nombre_paquete,'precio_paquete',p_precio_paquete)
  );

  RETURN seguridad.fn_api_result(TRUE,'Paquete creado', jsonb_build_object('id_paquete', v_id_paquete));
EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 373 (class 1255 OID 606250)
-- Name: api_crear_producto_educativo(bigint, character varying, character varying, text, numeric, integer, integer, integer, text, text); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.api_crear_producto_educativo(p_id_sesion bigint, p_nombre character varying, p_tipo_producto character varying, p_descripcion text DEFAULT NULL::text, p_precio_base numeric DEFAULT NULL::numeric, p_lim_sup_estudiantes integer DEFAULT 30, p_lim_inf_estudiantes integer DEFAULT 1, p_id_producto_tienda integer DEFAULT NULL::integer, p_link_bibliografia text DEFAULT NULL::text, p_link_publicidad text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_actor bigint;
  v_id_producto bigint;
BEGIN
  v_id_actor := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'ACADEMICO.PRODUCTO.GESTIONAR',
    'CREAR_PRODUCTO_EDUCATIVO'
  );

  v_id_producto := servicios_educativos.fn_crear_producto_educativo(
    v_id_actor,
    p_nombre, p_tipo_producto,
    p_descripcion, p_precio_base,
    p_lim_sup_estudiantes, p_lim_inf_estudiantes,
    p_id_producto_tienda, p_link_bibliografia, p_link_publicidad
  );

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_PRODUCTO_EDUCATIVO','INFO','servicios_educativos','producto_educativo',
    jsonb_build_object('id_producto_educativo', v_id_producto), TRUE,
    jsonb_build_object('nombre',p_nombre,'tipo_producto',p_tipo_producto)
  );

  RETURN seguridad.fn_api_result(TRUE,'Producto educativo creado', jsonb_build_object('id_producto_educativo', v_id_producto));

EXCEPTION WHEN OTHERS THEN
  RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 440 (class 1255 OID 606265)
-- Name: fn_actualizar_asistencia_clase_curso(bigint, bigint, bigint, bigint, character varying, timestamp without time zone, character varying, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_asistencia_clase_curso(p_id_actor bigint, p_id_asistencia bigint, p_id_clase_curso bigint, p_id_estudiante bigint, p_estado_asistencia character varying, p_hora_marcacion timestamp without time zone DEFAULT NULL::timestamp without time zone, p_observaciones character varying DEFAULT NULL::character varying, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_asistencia IS NULL THEN
    RAISE EXCEPTION 'id_asistencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_clase_curso IS NULL THEN
    RAISE EXCEPTION 'id_clase_curso es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_estudiante IS NULL THEN
    RAISE EXCEPTION 'id_estudiante es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_estado_asistencia),'') = '' THEN
    RAISE EXCEPTION 'estado_asistencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.asistencia_clase_curso a
     SET id_clase_curso = p_id_clase_curso,
         id_estudiante  = p_id_estudiante,
         estado_asistencia = trim(p_estado_asistencia),
         hora_marcacion = p_hora_marcacion,
         observaciones  = p_observaciones,
         estado_registro = COALESCE(p_estado_registro, a.estado_registro),
         id_usuario_modificacion = p_id_actor,
         version_registro = coalesce(a.version_registro,1) + 1
   WHERE a.id_asistencia = p_id_asistencia;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'asistencia no existe (id_asistencia=%)', p_id_asistencia USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 348 (class 1255 OID 606261)
-- Name: fn_actualizar_clase_curso(bigint, bigint, bigint, date, time without time zone, time without time zone, bigint, bigint, character varying, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_clase_curso(p_id_actor bigint, p_id_clase_curso bigint, p_id_curso_version bigint, p_fecha date, p_hora_inicio_real time without time zone, p_hora_fin_real time without time zone, p_id_aula bigint DEFAULT NULL::bigint, p_id_tutor bigint DEFAULT NULL::bigint, p_estado character varying DEFAULT NULL::character varying, p_modalidad character varying DEFAULT NULL::character varying, p_detalle_temas_revisados character varying DEFAULT NULL::character varying, p_observaciones character varying DEFAULT NULL::character varying, p_motivo_cancelacion character varying DEFAULT NULL::character varying, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_clase_curso IS NULL THEN
    RAISE EXCEPTION 'id_clase_curso es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_curso_version IS NULL THEN
    RAISE EXCEPTION 'id_curso_version es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_fecha IS NULL THEN
    RAISE EXCEPTION 'fecha es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_hora_inicio_real IS NULL OR p_hora_fin_real IS NULL OR p_hora_fin_real <= p_hora_inicio_real THEN
    RAISE EXCEPTION 'hora_fin_real debe ser > hora_inicio_real' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.clase_curso cc
     SET id_curso_version = p_id_curso_version,
         id_aula          = p_id_aula,
         id_tutor         = p_id_tutor,
         fecha            = p_fecha,
         hora_inicio_real = p_hora_inicio_real,
         hora_fin_real    = p_hora_fin_real,
         estado           = COALESCE(p_estado, cc.estado),
         modalidad        = COALESCE(p_modalidad, cc.modalidad),
         detalle_temas_revisados = p_detalle_temas_revisados,
         observaciones    = p_observaciones,
         motivo_cancelacion = p_motivo_cancelacion,
         estado_registro  = COALESCE(p_estado_registro, cc.estado_registro),
         id_usuario_modificacion = p_id_actor,
         fecha_modificacion = now(),
         version_registro = coalesce(cc.version_registro,1) + 1
   WHERE cc.id_clase_curso = p_id_clase_curso;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'clase_curso no existe (id_clase_curso=%)', p_id_clase_curso USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 423 (class 1255 OID 606269)
-- Name: fn_actualizar_clase_por_hora(bigint, bigint, integer, integer, integer, integer, timestamp without time zone, text, text, text, timestamp with time zone); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_clase_por_hora(p_id_actor bigint, p_id_clase bigint, p_id_aula integer, p_id_estudiante integer, p_id_tutor integer, p_id_materia_tree integer, p_hora_llegada timestamp without time zone, p_motivo text, p_modalidad text DEFAULT NULL::text, p_estado_operativo text DEFAULT NULL::text, p_hora_salida timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_clase IS NULL THEN RAISE EXCEPTION 'id_clase es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  UPDATE servicios_educativos.clase_por_hora c
     SET id_aula         = p_id_aula,
         id_estudiante   = p_id_estudiante,
         id_tutor        = p_id_tutor,
         id_materia_tree = p_id_materia_tree,
         hora_llegada    = p_hora_llegada,
         motivo          = trim(p_motivo),
         modalidad       = COALESCE(p_modalidad, c.modalidad),
         estado_operativo= COALESCE(p_estado_operativo, c.estado_operativo),
         hora_salida     = p_hora_salida,
         fecha_modificacion = now(),
         id_usuario_modificacion = p_id_actor,
         version_registro = coalesce(c.version_registro,1) + 1
   WHERE c.id_clase = p_id_clase;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'clase_por_hora no existe (id_clase=%)', p_id_clase USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 405 (class 1255 OID 606257)
-- Name: fn_actualizar_curso_version(bigint, bigint, bigint, character varying, text, date, date, numeric, integer, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_curso_version(p_id_actor bigint, p_id_curso_version bigint, p_id_producto_educativo bigint, p_nombre_version character varying, p_descripcion_version text DEFAULT NULL::text, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date, p_precio_version numeric DEFAULT NULL::numeric, p_id_horario integer DEFAULT NULL::integer, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_curso_version IS NULL THEN
    RAISE EXCEPTION 'id_curso_version es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_producto_educativo IS NULL THEN
    RAISE EXCEPTION 'id_producto_educativo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre_version),'') = '' THEN
    RAISE EXCEPTION 'nombre_version es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.curso_version cv
     SET id_producto_educativo = p_id_producto_educativo,
         nombre_version        = trim(p_nombre_version),
         descripcion_version   = p_descripcion_version,
         fecha_inicio          = p_fecha_inicio,
         fecha_fin             = p_fecha_fin,
         precio_version        = p_precio_version,
         id_horario            = p_id_horario,
         estado_registro       = COALESCE(p_estado_registro, cv.estado_registro),
         id_usuario_modificacion = p_id_actor,
         version_registro      = coalesce(cv.version_registro,1) + 1
   WHERE cv.id_curso_version = p_id_curso_version;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'curso_version no existe (id_curso_version=%)', p_id_curso_version USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 618 (class 1255 OID 606245)
-- Name: fn_actualizar_horarios(bigint, bigint, text, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_horarios(p_id_actor bigint, p_id_horario bigint, p_repeticion text DEFAULT NULL::text, p_hora_inicio_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_martes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_sabado time without time zone DEFAULT NULL::time without time zone, p_hora_fin_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_martes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_fin_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_fin_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_sabado time without time zone DEFAULT NULL::time without time zone, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_horario IS NULL THEN
    RAISE EXCEPTION 'id_horario es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.horarios h
     SET repeticion          = COALESCE(p_repeticion, h.repeticion),
         hora_inicio_lunes   = COALESCE(p_hora_inicio_lunes, h.hora_inicio_lunes),
         hora_inicio_martes  = COALESCE(p_hora_inicio_martes, h.hora_inicio_martes),
         hora_inicio_miercoles = COALESCE(p_hora_inicio_miercoles, h.hora_inicio_miercoles),
         hora_inicio_jueves  = COALESCE(p_hora_inicio_jueves, h.hora_inicio_jueves),
         hora_inicio_viernes = COALESCE(p_hora_inicio_viernes, h.hora_inicio_viernes),
         hora_inicio_sabado  = COALESCE(p_hora_inicio_sabado, h.hora_inicio_sabado),
         hora_fin_lunes      = COALESCE(p_hora_fin_lunes, h.hora_fin_lunes),
         hora_fin_martes     = COALESCE(p_hora_fin_martes, h.hora_fin_martes),
         hora_fin_miercoles  = COALESCE(p_hora_fin_miercoles, h.hora_fin_miercoles),
         hora_fin_jueves     = COALESCE(p_hora_fin_jueves, h.hora_fin_jueves),
         hora_fin_viernes    = COALESCE(p_hora_fin_viernes, h.hora_fin_viernes),
         hora_fin_sabado     = COALESCE(p_hora_fin_sabado, h.hora_fin_sabado),
         estado_registro     = COALESCE(p_estado_registro, h.estado_registro),
         id_usuario_modificacion = p_id_actor,
         version_registro    = COALESCE(h.version_registro,1) + 1
   WHERE h.id_horario = p_id_horario;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'horario no existe (id_horario=%)', p_id_horario USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 543 (class 1255 OID 606241)
-- Name: fn_actualizar_materia_tree(bigint, bigint, character varying, character varying, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_materia_tree(p_id_actor bigint, p_id_tree bigint, p_nombre character varying, p_tema character varying, p_subtema character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_tree IS NULL THEN
    RAISE EXCEPTION 'id_tree es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tema),'') = '' THEN
    RAISE EXCEPTION 'tema es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_subtema),'') = '' THEN
    RAISE EXCEPTION 'subtema es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.materia_tree
     SET nombre             = trim(p_nombre),
         tema               = trim(p_tema),
         subtema            = trim(p_subtema),
         id_usuario_modificacion = p_id_actor,
         fecha_modificacion = now(),
         version_registro   = coalesce(version_registro,1) + 1
   WHERE id_tree = p_id_tree;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'materia_tree no existe (id_tree=%)', p_id_tree USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 347 (class 1255 OID 606253)
-- Name: fn_actualizar_paquete_producto_educativo(bigint, bigint, character varying, numeric, integer, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_paquete_producto_educativo(p_id_actor bigint, p_id_paquete bigint, p_nombre_paquete character varying, p_precio_paquete numeric, p_cantidad_horas_paquete integer DEFAULT NULL::integer, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_paquete IS NULL THEN
    RAISE EXCEPTION 'id_paquete es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre_paquete),'') = '' THEN
    RAISE EXCEPTION 'nombre_paquete es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_precio_paquete IS NULL OR p_precio_paquete < 0 THEN
    RAISE EXCEPTION 'precio_paquete debe ser >= 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.paquetes_producto_educativo p
     SET nombre_paquete        = trim(p_nombre_paquete),
         precio_paquete        = p_precio_paquete,
         cantidad_horas_paquete = COALESCE(p_cantidad_horas_paquete, p.cantidad_horas_paquete),
         estado_registro       = COALESCE(p_estado_registro, p.estado_registro),
         id_usuario_modificacion = p_id_actor,
         fecha_modificacion    = now(),
         version_registro      = coalesce(p.version_registro,1) + 1
   WHERE p.id_paquete = p_id_paquete;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'paquete no existe (id_paquete=%)', p_id_paquete USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 479 (class 1255 OID 606249)
-- Name: fn_actualizar_producto_educativo(bigint, bigint, character varying, character varying, text, numeric, integer, integer, integer, text, text, boolean); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_actualizar_producto_educativo(p_id_actor bigint, p_id_producto_educativo bigint, p_nombre character varying, p_tipo_producto character varying, p_descripcion text DEFAULT NULL::text, p_precio_base numeric DEFAULT NULL::numeric, p_lim_sup_estudiantes integer DEFAULT NULL::integer, p_lim_inf_estudiantes integer DEFAULT NULL::integer, p_id_producto_tienda integer DEFAULT NULL::integer, p_link_bibliografia text DEFAULT NULL::text, p_link_publicidad text DEFAULT NULL::text, p_estado_registro boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_producto_educativo IS NULL THEN
    RAISE EXCEPTION 'id_producto_educativo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tipo_producto),'') = '' THEN
    RAISE EXCEPTION 'tipo_producto es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE servicios_educativos.producto_educativo pe
     SET nombre              = trim(p_nombre),
         tipo_producto       = trim(p_tipo_producto),
         descripcion         = p_descripcion,
         precio_base         = p_precio_base,
         lim_sup_estudiantes = COALESCE(p_lim_sup_estudiantes, pe.lim_sup_estudiantes),
         lim_inf_estudiantes = COALESCE(p_lim_inf_estudiantes, pe.lim_inf_estudiantes),
         id_producto_tienda  = p_id_producto_tienda,
         link_bibliografia   = p_link_bibliografia,
         link_publicidad     = p_link_publicidad,
         estado_registro     = COALESCE(p_estado_registro, pe.estado_registro),
         id_usuario_modificacion = p_id_actor,
         fecha_modificacion  = now(),
         version_registro    = COALESCE(pe.version_registro,1) + 1
   WHERE pe.id_producto_educativo = p_id_producto_educativo;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'producto_educativo no existe (id_producto_educativo=%)', p_id_producto_educativo
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 389 (class 1255 OID 606264)
-- Name: fn_crear_asistencia_clase_curso(bigint, bigint, bigint, character varying, timestamp without time zone, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_asistencia_clase_curso(p_id_actor bigint, p_id_clase_curso bigint, p_id_estudiante bigint, p_estado_asistencia character varying, p_hora_marcacion timestamp without time zone DEFAULT NULL::timestamp without time zone, p_observaciones character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_asistencia bigint;
BEGIN
  IF p_id_clase_curso IS NULL THEN
    RAISE EXCEPTION 'id_clase_curso es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_id_estudiante IS NULL THEN
    RAISE EXCEPTION 'id_estudiante es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_estado_asistencia),'') = '' THEN
    RAISE EXCEPTION 'estado_asistencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO servicios_educativos.asistencia_clase_curso(
    id_clase_curso, id_estudiante, estado_asistencia,
    hora_marcacion, observaciones,
    fecha_registro, estado_registro,
    id_usuario, id_usuario_modificacion, version_registro
  ) VALUES (
    p_id_clase_curso, p_id_estudiante, trim(p_estado_asistencia),
    p_hora_marcacion, p_observaciones,
    now(), true,
    p_id_actor, p_id_actor, 1
  )
  RETURNING id_asistencia INTO v_id_asistencia;

  RETURN v_id_asistencia;
END;
$$;


--
-- TOC entry 581 (class 1255 OID 606260)
-- Name: fn_crear_clase_curso(bigint, bigint, date, time without time zone, time without time zone, bigint, bigint, character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_clase_curso(p_id_actor bigint, p_id_curso_version bigint, p_fecha date, p_hora_inicio_real time without time zone, p_hora_fin_real time without time zone, p_id_aula bigint DEFAULT NULL::bigint, p_id_tutor bigint DEFAULT NULL::bigint, p_estado character varying DEFAULT 'Programada'::character varying, p_modalidad character varying DEFAULT 'Presencial'::character varying, p_detalle_temas_revisados character varying DEFAULT NULL::character varying, p_observaciones character varying DEFAULT NULL::character varying, p_motivo_cancelacion character varying DEFAULT NULL::character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_clase_curso bigint;
BEGIN
  IF p_id_curso_version IS NULL THEN
    RAISE EXCEPTION 'id_curso_version es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_fecha IS NULL THEN
    RAISE EXCEPTION 'fecha es obligatoria' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_hora_inicio_real IS NULL OR p_hora_fin_real IS NULL OR p_hora_fin_real <= p_hora_inicio_real THEN
    RAISE EXCEPTION 'hora_fin_real debe ser > hora_inicio_real' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO servicios_educativos.clase_curso(
    id_curso_version, id_aula, id_tutor,
    fecha, hora_inicio_real, hora_fin_real,
    estado, modalidad, detalle_temas_revisados, observaciones, motivo_cancelacion,
    fecha_registro, estado_registro,
    id_usuario, id_usuario_modificacion,
    version_registro, fecha_modificacion
  ) VALUES (
    p_id_curso_version, p_id_aula, p_id_tutor,
    p_fecha, p_hora_inicio_real, p_hora_fin_real,
    coalesce(p_estado,'Programada'), coalesce(p_modalidad,'Presencial'),
    p_detalle_temas_revisados, p_observaciones, p_motivo_cancelacion,
    now(), true,
    p_id_actor, p_id_actor,
    1, now()
  )
  RETURNING id_clase_curso INTO v_id_clase_curso;

  RETURN v_id_clase_curso;
END;
$$;


--
-- TOC entry 564 (class 1255 OID 606268)
-- Name: fn_crear_clase_por_hora(bigint, integer, integer, integer, integer, timestamp without time zone, text, text, text, timestamp with time zone); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_clase_por_hora(p_id_actor bigint, p_id_aula integer, p_id_estudiante integer, p_id_tutor integer, p_id_materia_tree integer, p_hora_llegada timestamp without time zone, p_motivo text, p_modalidad text DEFAULT 'PRESENCIAL'::text, p_estado_operativo text DEFAULT 'ABIERTA'::text, p_hora_salida timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_clase bigint;
BEGIN
  IF p_id_aula IS NULL THEN RAISE EXCEPTION 'id_aula es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_id_estudiante IS NULL THEN RAISE EXCEPTION 'id_estudiante es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_id_tutor IS NULL THEN RAISE EXCEPTION 'id_tutor es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_id_materia_tree IS NULL THEN RAISE EXCEPTION 'id_materia_tree es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;
  IF p_hora_llegada IS NULL THEN RAISE EXCEPTION 'hora_llegada es obligatoria' USING ERRCODE='invalid_parameter_value'; END IF;
  IF coalesce(trim(p_motivo),'') = '' THEN RAISE EXCEPTION 'motivo es obligatorio' USING ERRCODE='invalid_parameter_value'; END IF;

  INSERT INTO servicios_educativos.clase_por_hora(
    id_aula, id_estudiante, id_tutor, id_materia_tree,
    hora_llegada, motivo, modalidad,
    estado_operativo, hora_salida,
    fecha_registro, estado_registro,
    version_registro,
    id_usuario_creador, id_usuario_modificacion
  ) VALUES (
    p_id_aula, p_id_estudiante, p_id_tutor, p_id_materia_tree,
    p_hora_llegada, trim(p_motivo), coalesce(p_modalidad,'PRESENCIAL'),
    coalesce(p_estado_operativo,'ABIERTA'), p_hora_salida,
    now(), 'Activo',
    1,
    p_id_actor, p_id_actor
  )
  RETURNING id_clase INTO v_id_clase;

  RETURN v_id_clase;
END;
$$;


--
-- TOC entry 535 (class 1255 OID 606256)
-- Name: fn_crear_curso_version(bigint, bigint, character varying, text, date, date, numeric, integer); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_curso_version(p_id_actor bigint, p_id_producto_educativo bigint, p_nombre_version character varying, p_descripcion_version text DEFAULT NULL::text, p_fecha_inicio date DEFAULT NULL::date, p_fecha_fin date DEFAULT NULL::date, p_precio_version numeric DEFAULT NULL::numeric, p_id_horario integer DEFAULT NULL::integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_curso_version bigint;
BEGIN
  IF p_id_producto_educativo IS NULL THEN
    RAISE EXCEPTION 'id_producto_educativo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_nombre_version),'') = '' THEN
    RAISE EXCEPTION 'nombre_version es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO servicios_educativos.curso_version(
    id_producto_educativo, nombre_version, descripcion_version,
    fecha_inicio, fecha_fin, precio_version, id_horario,
    fecha_registro, estado_registro,
    id_usuario, id_usuario_modificacion,
    version_registro
  ) VALUES (
    p_id_producto_educativo, trim(p_nombre_version), p_descripcion_version,
    p_fecha_inicio, p_fecha_fin, p_precio_version, p_id_horario,
    now(), true,
    p_id_actor, p_id_actor,
    1
  )
  RETURNING id_curso_version INTO v_id_curso_version;

  RETURN v_id_curso_version;
END;
$$;


--
-- TOC entry 364 (class 1255 OID 606244)
-- Name: fn_crear_horarios(bigint, text, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone, time without time zone); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_horarios(p_id_actor bigint, p_repeticion text DEFAULT NULL::text, p_hora_inicio_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_martes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_inicio_sabado time without time zone DEFAULT NULL::time without time zone, p_hora_fin_lunes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_martes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_miercoles time without time zone DEFAULT NULL::time without time zone, p_hora_fin_jueves time without time zone DEFAULT NULL::time without time zone, p_hora_fin_viernes time without time zone DEFAULT NULL::time without time zone, p_hora_fin_sabado time without time zone DEFAULT NULL::time without time zone) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_horario bigint;
BEGIN
  INSERT INTO servicios_educativos.horarios(
    repeticion,
    hora_inicio_lunes, hora_inicio_martes, hora_inicio_miercoles, hora_inicio_jueves, hora_inicio_viernes, hora_inicio_sabado,
    hora_fin_lunes,    hora_fin_martes,    hora_fin_miercoles,    hora_fin_jueves,    hora_fin_viernes,    hora_fin_sabado,
    fecha_registro, estado_registro, id_usuario, id_usuario_modificacion, version_registro
  ) VALUES (
    p_repeticion,
    p_hora_inicio_lunes, p_hora_inicio_martes, p_hora_inicio_miercoles, p_hora_inicio_jueves, p_hora_inicio_viernes, p_hora_inicio_sabado,
    p_hora_fin_lunes,    p_hora_fin_martes,    p_hora_fin_miercoles,    p_hora_fin_jueves,    p_hora_fin_viernes,    p_hora_fin_sabado,
    now(), true, p_id_actor, p_id_actor, 1
  )
  RETURNING id_horario INTO v_id_horario;

  RETURN v_id_horario;
END;
$$;


--
-- TOC entry 428 (class 1255 OID 606240)
-- Name: fn_crear_materia_tree(bigint, character varying, character varying, character varying); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_materia_tree(p_id_actor bigint, p_nombre character varying, p_tema character varying, p_subtema character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_tree bigint;
BEGIN
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tema),'') = '' THEN
    RAISE EXCEPTION 'tema es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_subtema),'') = '' THEN
    RAISE EXCEPTION 'subtema es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO servicios_educativos.materia_tree(
    nombre, tema, subtema,
    id_usuario, id_usuario_modificacion,
    version_registro, estado_registro,
    fecha_registro, fecha_modificacion
  )
  VALUES(
    trim(p_nombre), trim(p_tema), trim(p_subtema),
    p_id_actor, p_id_actor,
    1, true,
    now(), now()
  )
  RETURNING id_tree INTO v_id_tree;

  RETURN v_id_tree;
END;
$$;


--
-- TOC entry 399 (class 1255 OID 606252)
-- Name: fn_crear_paquete_producto_educativo(bigint, character varying, numeric, integer); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_paquete_producto_educativo(p_id_actor bigint, p_nombre_paquete character varying, p_precio_paquete numeric, p_cantidad_horas_paquete integer DEFAULT 1) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_paquete bigint;
BEGIN
  IF coalesce(trim(p_nombre_paquete),'') = '' THEN
    RAISE EXCEPTION 'nombre_paquete es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF p_precio_paquete IS NULL OR p_precio_paquete < 0 THEN
    RAISE EXCEPTION 'precio_paquete debe ser >= 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO servicios_educativos.paquetes_producto_educativo(
    nombre_paquete, cantidad_horas_paquete, precio_paquete,
    fecha_registro, estado_registro,
    id_usuario, id_usuario_modificacion,
    version_registro, fecha_modificacion
  ) VALUES (
    trim(p_nombre_paquete),
    coalesce(p_cantidad_horas_paquete,1),
    p_precio_paquete,
    now(), true,
    p_id_actor, p_id_actor,
    1, now()
  )
  RETURNING id_paquete INTO v_id_paquete;

  RETURN v_id_paquete;
END;
$$;


--
-- TOC entry 575 (class 1255 OID 606248)
-- Name: fn_crear_producto_educativo(bigint, character varying, character varying, text, numeric, integer, integer, integer, text, text); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.fn_crear_producto_educativo(p_id_actor bigint, p_nombre character varying, p_tipo_producto character varying, p_descripcion text DEFAULT NULL::text, p_precio_base numeric DEFAULT NULL::numeric, p_lim_sup_estudiantes integer DEFAULT 30, p_lim_inf_estudiantes integer DEFAULT 1, p_id_producto_tienda integer DEFAULT NULL::integer, p_link_bibliografia text DEFAULT NULL::text, p_link_publicidad text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_producto bigint;
BEGIN
  IF coalesce(trim(p_nombre),'') = '' THEN
    RAISE EXCEPTION 'nombre es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;
  IF coalesce(trim(p_tipo_producto),'') = '' THEN
    RAISE EXCEPTION 'tipo_producto es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO servicios_educativos.producto_educativo(
    nombre, descripcion, tipo_producto,
    precio_base, lim_sup_estudiantes, lim_inf_estudiantes,
    id_producto_tienda, link_bibliografia, link_publicidad,
    fecha_registro, estado_registro,
    id_usuario, id_usuario_modificacion,
    version_registro, fecha_modificacion
  ) VALUES (
    trim(p_nombre), p_descripcion, trim(p_tipo_producto),
    p_precio_base, coalesce(p_lim_sup_estudiantes,30), coalesce(p_lim_inf_estudiantes,1),
    p_id_producto_tienda, p_link_bibliografia, p_link_publicidad,
    now(), true,
    p_id_actor, p_id_actor,
    1, now()
  )
  RETURNING id_producto_educativo INTO v_id_producto;

  RETURN v_id_producto;
END;
$$;


--
-- TOC entry 576 (class 1255 OID 393282)
-- Name: trg_bloquear_edicion_clase_pagada(); Type: FUNCTION; Schema: servicios_educativos; Owner: -
--

CREATE FUNCTION servicios_educativos.trg_bloquear_edicion_clase_pagada() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_bloqueada boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM contabilidad.pago_tutor_detalle d
    JOIN contabilidad.pago_tutor p
      ON p.id_pago_tutor = d.id_pago_tutor
    WHERE d.id_clase = OLD.id_clase
      AND p.estado IN ('APROBADO','PAGADO')
  ) INTO v_bloqueada;

  IF v_bloqueada THEN
    RAISE EXCEPTION 'No se puede modificar/eliminar una clase incluida en una planilla APROBADA o PAGADA.';
  END IF;

  RETURN NEW;
END $$;


--
-- TOC entry 572 (class 1255 OID 622607)
-- Name: api_actualizar_clase_titulo(bigint, bigint, character varying, societario.tipo_titulo_societario, text, numeric, numeric, integer, numeric, boolean, boolean); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_clase_titulo(p_id_sesion bigint, p_id_clase_titulo bigint, p_sub_tipo character varying, p_tipo societario.tipo_titulo_societario DEFAULT NULL::societario.tipo_titulo_societario, p_descripcion text DEFAULT NULL::text, p_valor_nominal numeric DEFAULT NULL::numeric, p_derechos_voto_por_titulo numeric DEFAULT NULL::numeric, p_prioridad_dividendo_bp integer DEFAULT NULL::integer, p_pref_liquidacion_x numeric DEFAULT NULL::numeric, p_es_convertible boolean DEFAULT NULL::boolean, p_es_participante boolean DEFAULT NULL::boolean) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_CLASE_TITULO'
  );

  PERFORM societario.fn_actualizar_clase_titulo(
    v_id_usuario,
    p_id_clase_titulo,
    p_sub_tipo,
    p_tipo,
    p_descripcion,
    p_valor_nominal,
    p_derechos_voto_por_titulo,
    p_prioridad_dividendo_bp,
    p_pref_liquidacion_x,
    p_es_convertible,
    p_es_participante
  );

  v_msg := format('Clase título actualizada (id_clase_titulo=%s)', p_id_clase_titulo);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_CLASE_TITULO','INFO','societario','clase_titulo',
    jsonb_build_object('id_clase_titulo', p_id_clase_titulo),
    TRUE,
    jsonb_build_object('tipo',p_tipo,'sub_tipo',p_sub_tipo)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_clase_titulo', p_id_clase_titulo));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_CLASE_TITULO','ERROR','societario','clase_titulo',
      jsonb_build_object('id_clase_titulo', p_id_clase_titulo),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 606 (class 1255 OID 622615)
-- Name: api_actualizar_dividendo(bigint, bigint, bigint, date, numeric, date, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_dividendo(p_id_sesion bigint, p_id_dividendo bigint, p_id_clase_titulo bigint, p_fecha_declaracion date, p_monto_total numeric, p_fecha_pago date DEFAULT NULL::date, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_DIVIDENDO'
  );

  PERFORM societario.fn_actualizar_dividendo(
    v_id_usuario,
    p_id_dividendo,
    p_id_clase_titulo,
    p_fecha_declaracion,
    p_monto_total,
    p_fecha_pago,
    p_observaciones
  );

  v_msg := format('Dividendo actualizado (id_dividendo=%s)', p_id_dividendo);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_DIVIDENDO','INFO','societario','dividendo',
    jsonb_build_object('id_dividendo', p_id_dividendo),
    TRUE,
    jsonb_build_object('id_clase_titulo',p_id_clase_titulo,'monto_total',p_monto_total)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_dividendo', p_id_dividendo));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_DIVIDENDO','ERROR','societario','dividendo',
      jsonb_build_object('id_dividendo', p_id_dividendo),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 500 (class 1255 OID 622617)
-- Name: api_actualizar_dividendo_pago(bigint, bigint, bigint, bigint, numeric, date); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_dividendo_pago(p_id_sesion bigint, p_id_dividendo_pago bigint, p_id_dividendo bigint, p_id_titular bigint, p_monto_pagado numeric, p_fecha_pago_real date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_DIVIDENDO_PAGO'
  );

  PERFORM societario.fn_actualizar_dividendo_pago(
    v_id_usuario,
    p_id_dividendo_pago,
    p_id_dividendo,
    p_id_titular,
    p_monto_pagado,
    p_fecha_pago_real
  );

  v_msg := format('Dividendo pago actualizado (id_dividendo_pago=%s)', p_id_dividendo_pago);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_DIVIDENDO_PAGO','INFO','societario','dividendo_pago',
    jsonb_build_object('id_dividendo_pago', p_id_dividendo_pago),
    TRUE,
    jsonb_build_object('id_dividendo',p_id_dividendo,'id_titular',p_id_titular,'monto_pagado',p_monto_pagado)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_dividendo_pago', p_id_dividendo_pago));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_DIVIDENDO_PAGO','ERROR','societario','dividendo_pago',
      jsonb_build_object('id_dividendo_pago', p_id_dividendo_pago),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 372 (class 1255 OID 622609)
-- Name: api_actualizar_emision_titulo(bigint, bigint, bigint, date, numeric, numeric, societario.instrumento_emision, societario.tipo_ronda, character varying, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_emision_titulo(p_id_sesion bigint, p_id_emision bigint, p_id_clase_titulo bigint, p_fecha_emision date, p_cantidad_autorizada numeric, p_cantidad_emitida numeric, p_instrumento societario.instrumento_emision DEFAULT NULL::societario.instrumento_emision, p_ronda societario.tipo_ronda DEFAULT NULL::societario.tipo_ronda, p_serie character varying DEFAULT NULL::character varying, p_precio_emision numeric DEFAULT NULL::numeric, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_EMISION_TITULO'
  );

  PERFORM societario.fn_actualizar_emision_titulo(
    v_id_usuario,
    p_id_emision,
    p_id_clase_titulo,
    p_fecha_emision,
    p_cantidad_autorizada,
    p_cantidad_emitida,
    p_instrumento,
    p_ronda,
    p_serie,
    p_precio_emision,
    p_observaciones
  );

  v_msg := format('Emisión actualizada (id_emision=%s)', p_id_emision);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_EMISION_TITULO','INFO','societario','emision_titulo',
    jsonb_build_object('id_emision', p_id_emision),
    TRUE,
    jsonb_build_object('id_clase_titulo',p_id_clase_titulo,'instrumento',p_instrumento,'ronda',p_ronda)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_emision', p_id_emision));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_EMISION_TITULO','ERROR','societario','emision_titulo',
      jsonb_build_object('id_emision', p_id_emision),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 653 (class 1255 OID 622613)
-- Name: api_actualizar_tenencia(bigint, bigint, bigint, bigint, numeric, date, societario.tipo_origen_tenencia, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_tenencia(p_id_sesion bigint, p_id_tenencia bigint, p_id_emision bigint, p_id_titular bigint, p_cantidad numeric, p_fecha_adquisicion date, p_origen societario.tipo_origen_tenencia DEFAULT NULL::societario.tipo_origen_tenencia, p_es_nominativa boolean DEFAULT NULL::boolean, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_TENENCIA'
  );

  PERFORM societario.fn_actualizar_tenencia(
    v_id_usuario,
    p_id_tenencia,
    p_id_emision,
    p_id_titular,
    p_cantidad,
    p_fecha_adquisicion,
    p_origen,
    p_es_nominativa,
    p_observaciones
  );

  v_msg := format('Tenencia actualizada (id_tenencia=%s)', p_id_tenencia);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_TENENCIA','INFO','societario','tenencia',
    jsonb_build_object('id_tenencia', p_id_tenencia),
    TRUE,
    jsonb_build_object('id_emision',p_id_emision,'id_titular',p_id_titular,'cantidad',p_cantidad)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_tenencia', p_id_tenencia));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_TENENCIA','ERROR','societario','tenencia',
      jsonb_build_object('id_tenencia', p_id_tenencia),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 523 (class 1255 OID 622611)
-- Name: api_actualizar_titular(bigint, bigint, bigint, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_titular(p_id_sesion bigint, p_id_titular bigint, p_id_persona bigint, p_es_beneficial_owner boolean DEFAULT NULL::boolean, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_TITULAR'
  );

  PERFORM societario.fn_actualizar_titular(
    v_id_usuario,
    p_id_titular,
    p_id_persona,
    p_es_beneficial_owner,
    p_observaciones
  );

  v_msg := format('Titular actualizado (id_titular=%s)', p_id_titular);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_TITULAR','INFO','societario','titular',
    jsonb_build_object('id_titular', p_id_titular),
    TRUE,
    jsonb_build_object('id_persona',p_id_persona,'es_beneficial_owner',p_es_beneficial_owner)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_titular', p_id_titular));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_TITULAR','ERROR','societario','titular',
      jsonb_build_object('id_titular', p_id_titular),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 462 (class 1255 OID 622619)
-- Name: api_actualizar_transferencia_titulo(bigint, bigint, bigint, bigint, bigint, numeric, date, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_actualizar_transferencia_titulo(p_id_sesion bigint, p_id_transferencia bigint, p_id_emision bigint, p_id_titular_origen bigint, p_id_titular_destino bigint, p_cantidad numeric, p_fecha_transferencia date, p_precio_unitario numeric DEFAULT NULL::numeric, p_motivo text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'ACTUALIZAR_TRANSFERENCIA_TITULO'
  );

  PERFORM societario.fn_actualizar_transferencia_titulo(
    v_id_usuario,
    p_id_transferencia,
    p_id_emision,
    p_id_titular_origen,
    p_id_titular_destino,
    p_cantidad,
    p_fecha_transferencia,
    p_precio_unitario,
    p_motivo
  );

  v_msg := format('Transferencia actualizada (id_transferencia=%s)', p_id_transferencia);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'ACTUALIZAR_TRANSFERENCIA_TITULO','INFO','societario','transferencia_titulo',
    jsonb_build_object('id_transferencia', p_id_transferencia),
    TRUE,
    jsonb_build_object('id_emision',p_id_emision,'origen',p_id_titular_origen,'destino',p_id_titular_destino,'cantidad',p_cantidad)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_transferencia', p_id_transferencia));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'ACTUALIZAR_TRANSFERENCIA_TITULO','ERROR','societario','transferencia_titulo',
      jsonb_build_object('id_transferencia', p_id_transferencia),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 529 (class 1255 OID 622606)
-- Name: api_crear_clase_titulo(bigint, character varying, societario.tipo_titulo_societario, text, numeric, numeric, integer, numeric, boolean, boolean); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_clase_titulo(p_id_sesion bigint, p_sub_tipo character varying, p_tipo societario.tipo_titulo_societario DEFAULT 'ACCION'::societario.tipo_titulo_societario, p_descripcion text DEFAULT NULL::text, p_valor_nominal numeric DEFAULT NULL::numeric, p_derechos_voto_por_titulo numeric DEFAULT 1.0, p_prioridad_dividendo_bp integer DEFAULT NULL::integer, p_pref_liquidacion_x numeric DEFAULT NULL::numeric, p_es_convertible boolean DEFAULT false, p_es_participante boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_CLASE_TITULO'
  );

  v_id := societario.fn_crear_clase_titulo(
    v_id_usuario,
    p_sub_tipo,
    p_tipo,
    p_descripcion,
    p_valor_nominal,
    p_derechos_voto_por_titulo,
    p_prioridad_dividendo_bp,
    p_pref_liquidacion_x,
    p_es_convertible,
    p_es_participante
  );

  v_msg := format('Clase título creada (id_clase_titulo=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_CLASE_TITULO','INFO','societario','clase_titulo',
    jsonb_build_object('id_clase_titulo', v_id),
    TRUE,
    jsonb_build_object('tipo',p_tipo,'sub_tipo',p_sub_tipo)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_clase_titulo', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_CLASE_TITULO','ERROR','societario','clase_titulo',
      jsonb_build_object('id_clase_titulo', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 345 (class 1255 OID 622614)
-- Name: api_crear_dividendo(bigint, bigint, date, numeric, date, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_dividendo(p_id_sesion bigint, p_id_clase_titulo bigint, p_fecha_declaracion date, p_monto_total numeric, p_fecha_pago date DEFAULT NULL::date, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_DIVIDENDO'
  );

  v_id := societario.fn_crear_dividendo(
    v_id_usuario,
    p_id_clase_titulo,
    p_fecha_declaracion,
    p_monto_total,
    p_fecha_pago,
    p_observaciones
  );

  v_msg := format('Dividendo creado (id_dividendo=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_DIVIDENDO','INFO','societario','dividendo',
    jsonb_build_object('id_dividendo', v_id),
    TRUE,
    jsonb_build_object('id_clase_titulo',p_id_clase_titulo,'monto_total',p_monto_total)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_dividendo', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_DIVIDENDO','ERROR','societario','dividendo',
      jsonb_build_object('id_dividendo', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 454 (class 1255 OID 622616)
-- Name: api_crear_dividendo_pago(bigint, bigint, bigint, numeric, date); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_dividendo_pago(p_id_sesion bigint, p_id_dividendo bigint, p_id_titular bigint, p_monto_pagado numeric, p_fecha_pago_real date DEFAULT NULL::date) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_DIVIDENDO_PAGO'
  );

  v_id := societario.fn_crear_dividendo_pago(
    v_id_usuario,
    p_id_dividendo,
    p_id_titular,
    p_monto_pagado,
    p_fecha_pago_real
  );

  v_msg := format('Dividendo pago creado (id_dividendo_pago=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_DIVIDENDO_PAGO','INFO','societario','dividendo_pago',
    jsonb_build_object('id_dividendo_pago', v_id),
    TRUE,
    jsonb_build_object('id_dividendo',p_id_dividendo,'id_titular',p_id_titular,'monto_pagado',p_monto_pagado)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_dividendo_pago', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_DIVIDENDO_PAGO','ERROR','societario','dividendo_pago',
      jsonb_build_object('id_dividendo_pago', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 603 (class 1255 OID 622608)
-- Name: api_crear_emision_titulo(bigint, bigint, date, numeric, numeric, societario.instrumento_emision, societario.tipo_ronda, character varying, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_emision_titulo(p_id_sesion bigint, p_id_clase_titulo bigint, p_fecha_emision date, p_cantidad_autorizada numeric, p_cantidad_emitida numeric, p_instrumento societario.instrumento_emision DEFAULT 'AUMENTO_CAPITAL'::societario.instrumento_emision, p_ronda societario.tipo_ronda DEFAULT 'OTRA'::societario.tipo_ronda, p_serie character varying DEFAULT NULL::character varying, p_precio_emision numeric DEFAULT NULL::numeric, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_EMISION_TITULO'
  );

  v_id := societario.fn_crear_emision_titulo(
    v_id_usuario,
    p_id_clase_titulo,
    p_fecha_emision,
    p_cantidad_autorizada,
    p_cantidad_emitida,
    p_instrumento,
    p_ronda,
    p_serie,
    p_precio_emision,
    p_observaciones
  );

  v_msg := format('Emisión creada (id_emision=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_EMISION_TITULO','INFO','societario','emision_titulo',
    jsonb_build_object('id_emision', v_id),
    TRUE,
    jsonb_build_object('id_clase_titulo',p_id_clase_titulo,'instrumento',p_instrumento,'ronda',p_ronda)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_emision', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_EMISION_TITULO','ERROR','societario','emision_titulo',
      jsonb_build_object('id_emision', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 487 (class 1255 OID 622612)
-- Name: api_crear_tenencia(bigint, bigint, bigint, numeric, date, societario.tipo_origen_tenencia, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_tenencia(p_id_sesion bigint, p_id_emision bigint, p_id_titular bigint, p_cantidad numeric, p_fecha_adquisicion date, p_origen societario.tipo_origen_tenencia DEFAULT 'EMISION'::societario.tipo_origen_tenencia, p_es_nominativa boolean DEFAULT true, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_TENENCIA'
  );

  v_id := societario.fn_crear_tenencia(
    v_id_usuario,
    p_id_emision,
    p_id_titular,
    p_cantidad,
    p_fecha_adquisicion,
    p_origen,
    p_es_nominativa,
    p_observaciones
  );

  v_msg := format('Tenencia creada (id_tenencia=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_TENENCIA','INFO','societario','tenencia',
    jsonb_build_object('id_tenencia', v_id),
    TRUE,
    jsonb_build_object('id_emision',p_id_emision,'id_titular',p_id_titular,'cantidad',p_cantidad)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_tenencia', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_TENENCIA','ERROR','societario','tenencia',
      jsonb_build_object('id_tenencia', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 636 (class 1255 OID 622610)
-- Name: api_crear_titular(bigint, bigint, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_titular(p_id_sesion bigint, p_id_persona bigint, p_es_beneficial_owner boolean DEFAULT true, p_observaciones text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_TITULAR'
  );

  v_id := societario.fn_crear_titular(
    v_id_usuario,
    p_id_persona,
    p_es_beneficial_owner,
    p_observaciones
  );

  v_msg := format('Titular creado (id_titular=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_TITULAR','INFO','societario','titular',
    jsonb_build_object('id_titular', v_id),
    TRUE,
    jsonb_build_object('id_persona',p_id_persona,'es_beneficial_owner',p_es_beneficial_owner)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_titular', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_TITULAR','ERROR','societario','titular',
      jsonb_build_object('id_titular', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 658 (class 1255 OID 622618)
-- Name: api_crear_transferencia_titulo(bigint, bigint, bigint, bigint, numeric, date, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.api_crear_transferencia_titulo(p_id_sesion bigint, p_id_emision bigint, p_id_titular_origen bigint, p_id_titular_destino bigint, p_cantidad numeric, p_fecha_transferencia date, p_precio_unitario numeric DEFAULT NULL::numeric, p_motivo text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_usuario bigint;
  v_id bigint;
  v_msg text;
BEGIN
  v_id_usuario := seguridad.fn_guard_permiso_api(
    p_id_sesion,
    'SOC.TITULOS.GESTIONAR',
    'CREAR_TRANSFERENCIA_TITULO'
  );

  v_id := societario.fn_crear_transferencia_titulo(
    v_id_usuario,
    p_id_emision,
    p_id_titular_origen,
    p_id_titular_destino,
    p_cantidad,
    p_fecha_transferencia,
    p_precio_unitario,
    p_motivo
  );

  v_msg := format('Transferencia creada (id_transferencia=%s)', v_id);

  PERFORM seguridad.fn_log_action(
    p_id_sesion,'CREAR_TRANSFERENCIA_TITULO','INFO','societario','transferencia_titulo',
    jsonb_build_object('id_transferencia', v_id),
    TRUE,
    jsonb_build_object('id_emision',p_id_emision,'origen',p_id_titular_origen,'destino',p_id_titular_destino,'cantidad',p_cantidad)
  );

  RETURN seguridad.fn_api_result(TRUE, v_msg, jsonb_build_object('id_transferencia', v_id));
EXCEPTION
  WHEN insufficient_privilege THEN
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
  WHEN OTHERS THEN
    PERFORM seguridad.fn_log_action(
      p_id_sesion,'CREAR_TRANSFERENCIA_TITULO','ERROR','societario','transferencia_titulo',
      jsonb_build_object('id_transferencia', NULL),
      FALSE,
      jsonb_build_object('sqlstate',SQLSTATE,'error',SQLERRM)
    );
    RETURN seguridad.fn_api_result(FALSE, SQLERRM, NULL);
END;
$$;


--
-- TOC entry 369 (class 1255 OID 622593)
-- Name: fn_actualizar_clase_titulo(bigint, bigint, character varying, societario.tipo_titulo_societario, text, numeric, numeric, integer, numeric, boolean, boolean); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_clase_titulo(p_id_actor bigint, p_id_clase_titulo bigint, p_sub_tipo character varying, p_tipo societario.tipo_titulo_societario DEFAULT NULL::societario.tipo_titulo_societario, p_descripcion text DEFAULT NULL::text, p_valor_nominal numeric DEFAULT NULL::numeric, p_derechos_voto_por_titulo numeric DEFAULT NULL::numeric, p_prioridad_dividendo_bp integer DEFAULT NULL::integer, p_pref_liquidacion_x numeric DEFAULT NULL::numeric, p_es_convertible boolean DEFAULT NULL::boolean, p_es_participante boolean DEFAULT NULL::boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_clase_titulo IS NULL THEN
    RAISE EXCEPTION 'id_clase_titulo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_sub_tipo),'') = '' THEN
    RAISE EXCEPTION 'sub_tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_valor_nominal IS NOT NULL AND p_valor_nominal < 0 THEN
    RAISE EXCEPTION 'valor_nominal no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_derechos_voto_por_titulo IS NOT NULL AND p_derechos_voto_por_titulo < 0 THEN
    RAISE EXCEPTION 'derechos_voto_por_titulo no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.clase_titulo
  SET
    tipo = coalesce(p_tipo, tipo),
    sub_tipo = p_sub_tipo,
    descripcion = p_descripcion,
    valor_nominal = p_valor_nominal,
    derechos_voto_por_titulo = coalesce(p_derechos_voto_por_titulo, derechos_voto_por_titulo),
    prioridad_dividendo_bp = p_prioridad_dividendo_bp,
    pref_liquidacion_x = p_pref_liquidacion_x,
    es_convertible = coalesce(p_es_convertible, es_convertible),
    es_participante = coalesce(p_es_participante, es_participante),
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_clase_titulo = p_id_clase_titulo
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'clase_titulo no existe o no se pudo actualizar (id_clase_titulo=%)', p_id_clase_titulo
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 613 (class 1255 OID 622601)
-- Name: fn_actualizar_dividendo(bigint, bigint, bigint, date, numeric, date, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_dividendo(p_id_actor bigint, p_id_dividendo bigint, p_id_clase_titulo bigint, p_fecha_declaracion date, p_monto_total numeric, p_fecha_pago date DEFAULT NULL::date, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_dividendo IS NULL THEN
    RAISE EXCEPTION 'id_dividendo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_clase_titulo IS NULL THEN
    RAISE EXCEPTION 'id_clase_titulo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_declaracion IS NULL THEN
    RAISE EXCEPTION 'fecha_declaracion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_monto_total IS NULL OR p_monto_total < 0 THEN
    RAISE EXCEPTION 'monto_total no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.dividendo
  SET
    id_clase_titulo = p_id_clase_titulo,
    fecha_declaracion = p_fecha_declaracion,
    fecha_pago = p_fecha_pago,
    monto_total = p_monto_total,
    observaciones = p_observaciones,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_dividendo = p_id_dividendo
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'dividendo no existe o no se pudo actualizar (id_dividendo=%)', p_id_dividendo
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 439 (class 1255 OID 622603)
-- Name: fn_actualizar_dividendo_pago(bigint, bigint, bigint, bigint, numeric, date); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_dividendo_pago(p_id_actor bigint, p_id_dividendo_pago bigint, p_id_dividendo bigint, p_id_titular bigint, p_monto_pagado numeric, p_fecha_pago_real date DEFAULT NULL::date) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_dividendo_pago IS NULL THEN
    RAISE EXCEPTION 'id_dividendo_pago es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_dividendo IS NULL THEN
    RAISE EXCEPTION 'id_dividendo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular IS NULL THEN
    RAISE EXCEPTION 'id_titular es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_monto_pagado IS NULL OR p_monto_pagado < 0 THEN
    RAISE EXCEPTION 'monto_pagado no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.dividendo_pago
  SET
    id_dividendo = p_id_dividendo,
    id_titular = p_id_titular,
    monto_pagado = p_monto_pagado,
    fecha_pago_real = p_fecha_pago_real,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_dividendo_pago = p_id_dividendo_pago
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'dividendo_pago no existe o no se pudo actualizar (id_dividendo_pago=%)', p_id_dividendo_pago
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 630 (class 1255 OID 622595)
-- Name: fn_actualizar_emision_titulo(bigint, bigint, bigint, date, numeric, numeric, societario.instrumento_emision, societario.tipo_ronda, character varying, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_emision_titulo(p_id_actor bigint, p_id_emision bigint, p_id_clase_titulo bigint, p_fecha_emision date, p_cantidad_autorizada numeric, p_cantidad_emitida numeric, p_instrumento societario.instrumento_emision DEFAULT NULL::societario.instrumento_emision, p_ronda societario.tipo_ronda DEFAULT NULL::societario.tipo_ronda, p_serie character varying DEFAULT NULL::character varying, p_precio_emision numeric DEFAULT NULL::numeric, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_emision IS NULL THEN
    RAISE EXCEPTION 'id_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_clase_titulo IS NULL THEN
    RAISE EXCEPTION 'id_clase_titulo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_emision IS NULL THEN
    RAISE EXCEPTION 'fecha_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_autorizada IS NULL OR p_cantidad_autorizada <= 0 THEN
    RAISE EXCEPTION 'cantidad_autorizada debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_emitida IS NULL OR p_cantidad_emitida < 0 THEN
    RAISE EXCEPTION 'cantidad_emitida no puede ser negativa' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_emitida > p_cantidad_autorizada THEN
    RAISE EXCEPTION 'cantidad_emitida no puede ser mayor a cantidad_autorizada' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_emision IS NOT NULL AND p_precio_emision < 0 THEN
    RAISE EXCEPTION 'precio_emision no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.emision_titulo
  SET
    id_clase_titulo = p_id_clase_titulo,
    ronda = coalesce(p_ronda, ronda),
    instrumento = coalesce(p_instrumento, instrumento),
    serie = p_serie,
    fecha_emision = p_fecha_emision,
    cantidad_autorizada = p_cantidad_autorizada,
    cantidad_emitida = p_cantidad_emitida,
    precio_emision = p_precio_emision,
    observaciones = p_observaciones,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_emision = p_id_emision
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'emision_titulo no existe o no se pudo actualizar (id_emision=%)', p_id_emision
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 394 (class 1255 OID 622599)
-- Name: fn_actualizar_tenencia(bigint, bigint, bigint, bigint, numeric, date, societario.tipo_origen_tenencia, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_tenencia(p_id_actor bigint, p_id_tenencia bigint, p_id_emision bigint, p_id_titular bigint, p_cantidad numeric, p_fecha_adquisicion date, p_origen societario.tipo_origen_tenencia DEFAULT NULL::societario.tipo_origen_tenencia, p_es_nominativa boolean DEFAULT NULL::boolean, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_tenencia IS NULL THEN
    RAISE EXCEPTION 'id_tenencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_emision IS NULL THEN
    RAISE EXCEPTION 'id_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular IS NULL THEN
    RAISE EXCEPTION 'id_titular es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad IS NULL OR p_cantidad < 0 THEN
    RAISE EXCEPTION 'cantidad no puede ser negativa' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_adquisicion IS NULL THEN
    RAISE EXCEPTION 'fecha_adquisicion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.tenencia
  SET
    id_emision = p_id_emision,
    id_titular = p_id_titular,
    cantidad = p_cantidad,
    fecha_adquisicion = p_fecha_adquisicion,
    origen = coalesce(p_origen, origen),
    es_nominativa = coalesce(p_es_nominativa, es_nominativa),
    observaciones = p_observaciones,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_tenencia = p_id_tenencia
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'tenencia no existe o no se pudo actualizar (id_tenencia=%)', p_id_tenencia
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 602 (class 1255 OID 622597)
-- Name: fn_actualizar_titular(bigint, bigint, bigint, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_titular(p_id_actor bigint, p_id_titular bigint, p_id_persona bigint, p_es_beneficial_owner boolean DEFAULT NULL::boolean, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_titular IS NULL THEN
    RAISE EXCEPTION 'id_titular es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_persona IS NULL THEN
    RAISE EXCEPTION 'id_persona es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- Validar persona existe y está activa
  IF NOT EXISTS (
    SELECT 1 FROM persona.persona p
    WHERE p.id_persona = p_id_persona
      AND coalesce(p.estado_registro,'Activo') = 'Activo'
  ) THEN
    RAISE EXCEPTION 'persona no existe o no está activa (id_persona=%)', p_id_persona
      USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.titular
  SET
    id_persona = p_id_persona,
    es_beneficial_owner = coalesce(p_es_beneficial_owner, es_beneficial_owner),
    observaciones = p_observaciones,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_titular = p_id_titular
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'titular no existe o no se pudo actualizar (id_titular=%)', p_id_titular
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 464 (class 1255 OID 622605)
-- Name: fn_actualizar_transferencia_titulo(bigint, bigint, bigint, bigint, bigint, numeric, date, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_actualizar_transferencia_titulo(p_id_actor bigint, p_id_transferencia bigint, p_id_emision bigint, p_id_titular_origen bigint, p_id_titular_destino bigint, p_cantidad numeric, p_fecha_transferencia date, p_precio_unitario numeric DEFAULT NULL::numeric, p_motivo text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF p_id_transferencia IS NULL THEN
    RAISE EXCEPTION 'id_transferencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_emision IS NULL THEN
    RAISE EXCEPTION 'id_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular_origen IS NULL THEN
    RAISE EXCEPTION 'id_titular_origen es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular_destino IS NULL THEN
    RAISE EXCEPTION 'id_titular_destino es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular_origen = p_id_titular_destino THEN
    RAISE EXCEPTION 'id_titular_origen debe ser distinto a id_titular_destino' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'cantidad debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_transferencia IS NULL THEN
    RAISE EXCEPTION 'fecha_transferencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_unitario IS NOT NULL AND p_precio_unitario < 0 THEN
    RAISE EXCEPTION 'precio_unitario no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  UPDATE societario.transferencia_titulo
  SET
    id_emision = p_id_emision,
    id_titular_origen = p_id_titular_origen,
    id_titular_destino = p_id_titular_destino,
    cantidad = p_cantidad,
    precio_unitario = p_precio_unitario,
    fecha_transferencia = p_fecha_transferencia,
    motivo = p_motivo,
    fecha_modificacion = now(),
    id_usuario_modificacion = p_id_actor,
    version_registro = coalesce(version_registro,1) + 1
  WHERE id_transferencia = p_id_transferencia
    AND coalesce(estado_registro,'Activo') <> 'Eliminado';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'transferencia_titulo no existe o no se pudo actualizar (id_transferencia=%)', p_id_transferencia
      USING ERRCODE='no_data_found';
  END IF;
END;
$$;


--
-- TOC entry 456 (class 1255 OID 622592)
-- Name: fn_crear_clase_titulo(bigint, character varying, societario.tipo_titulo_societario, text, numeric, numeric, integer, numeric, boolean, boolean); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_clase_titulo(p_id_actor bigint, p_sub_tipo character varying, p_tipo societario.tipo_titulo_societario DEFAULT 'ACCION'::societario.tipo_titulo_societario, p_descripcion text DEFAULT NULL::text, p_valor_nominal numeric DEFAULT NULL::numeric, p_derechos_voto_por_titulo numeric DEFAULT 1.0, p_prioridad_dividendo_bp integer DEFAULT NULL::integer, p_pref_liquidacion_x numeric DEFAULT NULL::numeric, p_es_convertible boolean DEFAULT false, p_es_participante boolean DEFAULT false) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF coalesce(trim(p_sub_tipo),'') = '' THEN
    RAISE EXCEPTION 'sub_tipo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_valor_nominal IS NOT NULL AND p_valor_nominal < 0 THEN
    RAISE EXCEPTION 'valor_nominal no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_derechos_voto_por_titulo IS NOT NULL AND p_derechos_voto_por_titulo < 0 THEN
    RAISE EXCEPTION 'derechos_voto_por_titulo no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.clase_titulo (
    tipo, sub_tipo, descripcion,
    valor_nominal, derechos_voto_por_titulo,
    prioridad_dividendo_bp, pref_liquidacion_x,
    es_convertible, es_participante,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    coalesce(p_tipo,'ACCION'::societario.tipo_titulo_societario),
    p_sub_tipo,
    p_descripcion,
    p_valor_nominal,
    coalesce(p_derechos_voto_por_titulo, 1.0),
    p_prioridad_dividendo_bp,
    p_pref_liquidacion_x,
    coalesce(p_es_convertible,false),
    coalesce(p_es_participante,false),
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_clase_titulo INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 469 (class 1255 OID 622600)
-- Name: fn_crear_dividendo(bigint, bigint, date, numeric, date, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_dividendo(p_id_actor bigint, p_id_clase_titulo bigint, p_fecha_declaracion date, p_monto_total numeric, p_fecha_pago date DEFAULT NULL::date, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_clase_titulo IS NULL THEN
    RAISE EXCEPTION 'id_clase_titulo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_declaracion IS NULL THEN
    RAISE EXCEPTION 'fecha_declaracion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_monto_total IS NULL OR p_monto_total < 0 THEN
    RAISE EXCEPTION 'monto_total no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.dividendo (
    id_clase_titulo, fecha_declaracion, fecha_pago, monto_total, observaciones,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_clase_titulo, p_fecha_declaracion, p_fecha_pago, p_monto_total, p_observaciones,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_dividendo INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 570 (class 1255 OID 622602)
-- Name: fn_crear_dividendo_pago(bigint, bigint, bigint, numeric, date); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_dividendo_pago(p_id_actor bigint, p_id_dividendo bigint, p_id_titular bigint, p_monto_pagado numeric, p_fecha_pago_real date DEFAULT NULL::date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_dividendo IS NULL THEN
    RAISE EXCEPTION 'id_dividendo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular IS NULL THEN
    RAISE EXCEPTION 'id_titular es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_monto_pagado IS NULL OR p_monto_pagado < 0 THEN
    RAISE EXCEPTION 'monto_pagado no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.dividendo_pago (
    id_dividendo, id_titular, monto_pagado, fecha_pago_real,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_dividendo, p_id_titular, p_monto_pagado, p_fecha_pago_real,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_dividendo_pago INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 538 (class 1255 OID 622594)
-- Name: fn_crear_emision_titulo(bigint, bigint, date, numeric, numeric, societario.instrumento_emision, societario.tipo_ronda, character varying, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_emision_titulo(p_id_actor bigint, p_id_clase_titulo bigint, p_fecha_emision date, p_cantidad_autorizada numeric, p_cantidad_emitida numeric, p_instrumento societario.instrumento_emision DEFAULT 'AUMENTO_CAPITAL'::societario.instrumento_emision, p_ronda societario.tipo_ronda DEFAULT 'OTRA'::societario.tipo_ronda, p_serie character varying DEFAULT NULL::character varying, p_precio_emision numeric DEFAULT NULL::numeric, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_clase_titulo IS NULL THEN
    RAISE EXCEPTION 'id_clase_titulo es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_emision IS NULL THEN
    RAISE EXCEPTION 'fecha_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_autorizada IS NULL OR p_cantidad_autorizada <= 0 THEN
    RAISE EXCEPTION 'cantidad_autorizada debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_emitida IS NULL OR p_cantidad_emitida < 0 THEN
    RAISE EXCEPTION 'cantidad_emitida no puede ser negativa' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad_emitida > p_cantidad_autorizada THEN
    RAISE EXCEPTION 'cantidad_emitida no puede ser mayor a cantidad_autorizada' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_emision IS NOT NULL AND p_precio_emision < 0 THEN
    RAISE EXCEPTION 'precio_emision no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.emision_titulo (
    id_clase_titulo, ronda, instrumento, serie,
    fecha_emision, cantidad_autorizada, cantidad_emitida, precio_emision,
    observaciones,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_clase_titulo,
    coalesce(p_ronda,'OTRA'::societario.tipo_ronda),
    coalesce(p_instrumento,'AUMENTO_CAPITAL'::societario.instrumento_emision),
    p_serie,
    p_fecha_emision,
    p_cantidad_autorizada,
    p_cantidad_emitida,
    p_precio_emision,
    p_observaciones,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_emision INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 472 (class 1255 OID 622598)
-- Name: fn_crear_tenencia(bigint, bigint, bigint, numeric, date, societario.tipo_origen_tenencia, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_tenencia(p_id_actor bigint, p_id_emision bigint, p_id_titular bigint, p_cantidad numeric, p_fecha_adquisicion date, p_origen societario.tipo_origen_tenencia DEFAULT 'EMISION'::societario.tipo_origen_tenencia, p_es_nominativa boolean DEFAULT true, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_emision IS NULL THEN
    RAISE EXCEPTION 'id_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular IS NULL THEN
    RAISE EXCEPTION 'id_titular es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad IS NULL OR p_cantidad < 0 THEN
    RAISE EXCEPTION 'cantidad no puede ser negativa' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_adquisicion IS NULL THEN
    RAISE EXCEPTION 'fecha_adquisicion es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.tenencia (
    id_emision, id_titular, cantidad, fecha_adquisicion,
    origen, es_nominativa, observaciones,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_emision, p_id_titular, p_cantidad, p_fecha_adquisicion,
    coalesce(p_origen,'EMISION'::societario.tipo_origen_tenencia),
    coalesce(p_es_nominativa,true),
    p_observaciones,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_tenencia INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 657 (class 1255 OID 622596)
-- Name: fn_crear_titular(bigint, bigint, boolean, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_titular(p_id_actor bigint, p_id_persona bigint, p_es_beneficial_owner boolean DEFAULT true, p_observaciones text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_persona IS NULL THEN
    RAISE EXCEPTION 'id_persona es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  -- Validar persona existe y está activa
  IF NOT EXISTS (
    SELECT 1 FROM persona.persona p
    WHERE p.id_persona = p_id_persona
      AND coalesce(p.estado_registro,'Activo') = 'Activo'
  ) THEN
    RAISE EXCEPTION 'persona no existe o no está activa (id_persona=%)', p_id_persona
      USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.titular (
    id_persona, es_beneficial_owner, observaciones,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_persona,
    coalesce(p_es_beneficial_owner,true),
    p_observaciones,
    'Activo',
    now(),
    1,
    p_id_actor
  )
  RETURNING id_titular INTO v_id;

  RETURN v_id;
END;
$$;


--
-- TOC entry 647 (class 1255 OID 622604)
-- Name: fn_crear_transferencia_titulo(bigint, bigint, bigint, bigint, numeric, date, numeric, text); Type: FUNCTION; Schema: societario; Owner: -
--

CREATE FUNCTION societario.fn_crear_transferencia_titulo(p_id_actor bigint, p_id_emision bigint, p_id_titular_origen bigint, p_id_titular_destino bigint, p_cantidad numeric, p_fecha_transferencia date, p_precio_unitario numeric DEFAULT NULL::numeric, p_motivo text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id bigint;
BEGIN
  IF p_id_actor IS NULL THEN
    RAISE EXCEPTION 'id_actor es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_emision IS NULL THEN
    RAISE EXCEPTION 'id_emision es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular_origen IS NULL THEN
    RAISE EXCEPTION 'id_titular_origen es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular_destino IS NULL THEN
    RAISE EXCEPTION 'id_titular_destino es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_id_titular_origen = p_id_titular_destino THEN
    RAISE EXCEPTION 'id_titular_origen debe ser distinto a id_titular_destino' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'cantidad debe ser > 0' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_fecha_transferencia IS NULL THEN
    RAISE EXCEPTION 'fecha_transferencia es obligatorio' USING ERRCODE='invalid_parameter_value';
  END IF;

  IF p_precio_unitario IS NOT NULL AND p_precio_unitario < 0 THEN
    RAISE EXCEPTION 'precio_unitario no puede ser negativo' USING ERRCODE='invalid_parameter_value';
  END IF;

  INSERT INTO societario.transferencia_titulo (
    id_emision, id_titular_origen, id_titular_destino,
    cantidad, precio_unitario, fecha_transferencia, motivo,
    estado_registro, fecha_registro, version_registro, id_usuario_creador
  ) VALUES (
    p_id_emision, p_id_titular_origen, p_id_titular_destino,
    p_cantidad, p_precio_unitario, p_fecha_transferencia, p_motivo,
    'Activo', now(), 1, p_id_actor
  )
  RETURNING id_transferencia INTO v_id;

  RETURN v_id;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 312 (class 1259 OID 327681)
-- Name: departamento; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.departamento (
    id_departamento bigint NOT NULL,
    codigo character varying(30) NOT NULL,
    nombre character varying(120) NOT NULL,
    descripcion_funciones character varying(240),
    id_departamento_padre bigint,
    id_sucursal bigint,
    id_jefe_empleado bigint,
    es_activo boolean DEFAULT true NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT ck_dep_vigencia CHECK (((fecha_fin IS NULL) OR (fecha_fin >= fecha_inicio)))
);


--
-- TOC entry 311 (class 1259 OID 327680)
-- Name: departamento_id_departamento_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.departamento_id_departamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 311
-- Name: departamento_id_departamento_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.departamento_id_departamento_seq OWNED BY administracion.departamento.id_departamento;


--
-- TOC entry 243 (class 1259 OID 98325)
-- Name: empleado; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.empleado (
    id_empleado bigint NOT NULL,
    id_persona bigint NOT NULL,
    fecha_ingreso date NOT NULL,
    fecha_salida date,
    tipo_contrato administracion.tipo_contrato DEFAULT 'INDEFINIDO'::administracion.tipo_contrato NOT NULL,
    jornada administracion.jornada_laboral DEFAULT 'FULL_TIME'::administracion.jornada_laboral NOT NULL,
    email_corporativo character varying(200),
    telefono_corporativo character varying(100),
    id_sucursal bigint,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT ck_empleado_fechas CHECK (((fecha_salida IS NULL) OR (fecha_salida >= fecha_ingreso)))
);


--
-- TOC entry 242 (class 1259 OID 98324)
-- Name: empleado_id_empleado_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.empleado_id_empleado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 242
-- Name: empleado_id_empleado_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.empleado_id_empleado_seq OWNED BY administracion.empleado.id_empleado;


--
-- TOC entry 245 (class 1259 OID 106530)
-- Name: empleado_posicion_pago; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.empleado_posicion_pago (
    id_empleado_posicion bigint NOT NULL,
    id_empleado bigint NOT NULL,
    id_posicion bigint NOT NULL,
    vigente_desde date DEFAULT CURRENT_DATE NOT NULL,
    vigente_hasta date,
    tipo_esquema_pago administracion.tipo_esquema_pago NOT NULL,
    frecuencia_pago administracion.frecuencia_pago DEFAULT 'MENSUAL'::administracion.frecuencia_pago NOT NULL,
    moneda character varying(3) DEFAULT 'BOB'::character varying,
    pago_por_hora numeric(18,2),
    sueldo_mensual numeric(18,2),
    porcentaje_comision numeric(5,2),
    comision_fija numeric(18,2),
    tipo_comisionable text,
    tipo_calculo_comisionable text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT ck_esquema_pago_valores CHECK ((((tipo_esquema_pago = 'SUELDO'::administracion.tipo_esquema_pago) AND (sueldo_mensual IS NOT NULL) AND (pago_por_hora IS NULL) AND (porcentaje_comision IS NULL)) OR ((tipo_esquema_pago = 'POR_HORA'::administracion.tipo_esquema_pago) AND (pago_por_hora IS NOT NULL) AND (sueldo_mensual IS NULL) AND (porcentaje_comision IS NULL)) OR ((tipo_esquema_pago = 'COMISION'::administracion.tipo_esquema_pago) AND (porcentaje_comision IS NOT NULL) AND (sueldo_mensual IS NULL) AND (pago_por_hora IS NULL)) OR ((tipo_esquema_pago = 'MIXTO'::administracion.tipo_esquema_pago) AND (((sueldo_mensual IS NOT NULL) AND (porcentaje_comision IS NOT NULL)) OR ((pago_por_hora IS NOT NULL) AND (porcentaje_comision IS NOT NULL)))))),
    CONSTRAINT ck_periodo_vigente CHECK (((vigente_hasta IS NULL) OR (vigente_hasta >= vigente_desde))),
    CONSTRAINT empleado_posicion_pago_comision_fija_check CHECK ((comision_fija >= (0)::numeric)),
    CONSTRAINT empleado_posicion_pago_pago_por_hora_check CHECK ((pago_por_hora > (0)::numeric)),
    CONSTRAINT empleado_posicion_pago_porcentaje_comision_check CHECK (((porcentaje_comision IS NULL) OR ((porcentaje_comision >= (0)::numeric) AND (porcentaje_comision <= (100)::numeric)))),
    CONSTRAINT empleado_posicion_pago_sueldo_mensual_check CHECK (((sueldo_mensual IS NULL) OR (sueldo_mensual >= (0)::numeric))),
    CONSTRAINT empleado_posicion_pago_tipo_comisionable_check CHECK ((tipo_comisionable = ANY (ARRAY['Fija'::text, 'Variable'::text]))),
    CONSTRAINT empleado_posicion_pago_tipo_comisionable_check1 CHECK ((tipo_comisionable = ANY (ARRAY['Directa'::text, 'Indirecta'::text])))
);


--
-- TOC entry 244 (class 1259 OID 106529)
-- Name: empleado_posicion_pago_id_empleado_posicion_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.empleado_posicion_pago_id_empleado_posicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 244
-- Name: empleado_posicion_pago_id_empleado_posicion_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.empleado_posicion_pago_id_empleado_posicion_seq OWNED BY administracion.empleado_posicion_pago.id_empleado_posicion;


--
-- TOC entry 296 (class 1259 OID 303105)
-- Name: empleado_registro_pago; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.empleado_registro_pago (
    id_pago bigint NOT NULL,
    fecha_pago date NOT NULL,
    haber_basico_pagado double precision DEFAULT 0 NOT NULL,
    comisiones_totales_pagadas double precision DEFAULT 0 NOT NULL,
    aguinaldos_totales_pagados double precision DEFAULT 0 NOT NULL,
    indemnizacion_total_pagada double precision DEFAULT 0 NOT NULL,
    otros_cargos_pagados double precision DEFAULT 0 NOT NULL,
    descripcion_otros_cargos_pagados text,
    notas_pago text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 295 (class 1259 OID 303104)
-- Name: empleado_registro_pago_id_pago_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.empleado_registro_pago_id_pago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 295
-- Name: empleado_registro_pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.empleado_registro_pago_id_pago_seq OWNED BY administracion.empleado_registro_pago.id_pago;


--
-- TOC entry 263 (class 1259 OID 188417)
-- Name: kpi; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.kpi (
    id_kpi bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    unidad_medida character varying(50) NOT NULL,
    frecuencia character varying(30),
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 262 (class 1259 OID 188416)
-- Name: kpi_id_kpi_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.kpi_id_kpi_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 262
-- Name: kpi_id_kpi_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.kpi_id_kpi_seq OWNED BY administracion.kpi.id_kpi;


--
-- TOC entry 292 (class 1259 OID 270338)
-- Name: objetivo_kpi; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.objetivo_kpi (
    id_objetivo_kpi bigint NOT NULL,
    id_kpi bigint NOT NULL,
    periodo character varying(30) NOT NULL,
    valor_meta numeric(18,4) NOT NULL,
    valor_minimo numeric(18,4),
    valor_maximo numeric(18,4),
    responsable integer,
    id_sucursal integer,
    id_tienda integer,
    id_producto integer,
    id_producto_tienda integer,
    cumplido boolean DEFAULT false,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 291 (class 1259 OID 270337)
-- Name: objetivo_kpi_id_objetivo_kpi_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.objetivo_kpi_id_objetivo_kpi_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 291
-- Name: objetivo_kpi_id_objetivo_kpi_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.objetivo_kpi_id_objetivo_kpi_seq OWNED BY administracion.objetivo_kpi.id_objetivo_kpi;


--
-- TOC entry 241 (class 1259 OID 90199)
-- Name: posicion; Type: TABLE; Schema: administracion; Owner: -
--

CREATE TABLE administracion.posicion (
    id_posicion bigint NOT NULL,
    codigo character varying(40) NOT NULL,
    nombre character varying(150) NOT NULL,
    id_posicion_parent bigint,
    descripcion text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 240 (class 1259 OID 90198)
-- Name: posicion_id_posicion_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE administracion.posicion_id_posicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 240
-- Name: posicion_id_posicion_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE administracion.posicion_id_posicion_seq OWNED BY administracion.posicion.id_posicion;


--
-- TOC entry 318 (class 1259 OID 336070)
-- Name: archivos_transaccion; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.archivos_transaccion (
    id_archivo bigint NOT NULL,
    id_transaccion bigint NOT NULL,
    link_achivo text NOT NULL,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    link_archivo text
);


--
-- TOC entry 317 (class 1259 OID 336069)
-- Name: archivos_transaccion_id_archivo_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.archivos_transaccion_id_archivo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 317
-- Name: archivos_transaccion_id_archivo_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.archivos_transaccion_id_archivo_seq OWNED BY contabilidad.archivos_transaccion.id_archivo;


--
-- TOC entry 239 (class 1259 OID 57355)
-- Name: centro_costo; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.centro_costo (
    id_centro_costo bigint NOT NULL,
    codigo character varying(40) NOT NULL,
    nombre character varying(150) NOT NULL,
    id_cuenta_ingreso bigint,
    id_cuenta_costo bigint,
    observaciones text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 238 (class 1259 OID 57354)
-- Name: centro_costo_id_centro_costo_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.centro_costo_id_centro_costo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 238
-- Name: centro_costo_id_centro_costo_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.centro_costo_id_centro_costo_seq OWNED BY contabilidad.centro_costo.id_centro_costo;


--
-- TOC entry 294 (class 1259 OID 294924)
-- Name: centro_costo_mapa; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.centro_costo_mapa (
    id_cc_mapa bigint NOT NULL,
    id_centro_costo bigint NOT NULL,
    tipo contabilidad.tipo_costo NOT NULL,
    naturaleza contabilidad.naturaleza_costo NOT NULL,
    vigente_desde date DEFAULT CURRENT_DATE NOT NULL,
    vigente_hasta date,
    id_deuda bigint,
    id_bien bigint,
    id_sucursal bigint,
    id_tienda bigint,
    id_empleado bigint,
    id_posicion bigint,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    id_departamento bigint,
    CONSTRAINT ck_ccm_periodo CHECK (((vigente_hasta IS NULL) OR (vigente_hasta >= vigente_desde))),
    CONSTRAINT ck_ccm_un_solo_destino CHECK ((num_nonnulls(id_deuda, id_bien, id_sucursal, id_tienda, id_empleado, id_posicion) = 1))
);


--
-- TOC entry 293 (class 1259 OID 294923)
-- Name: centro_costo_mapa_id_cc_mapa_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.centro_costo_mapa_id_cc_mapa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 293
-- Name: centro_costo_mapa_id_cc_mapa_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.centro_costo_mapa_id_cc_mapa_seq OWNED BY contabilidad.centro_costo_mapa.id_cc_mapa;


--
-- TOC entry 237 (class 1259 OID 49237)
-- Name: concepto_costo; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.concepto_costo (
    id_concepto bigint NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(160) NOT NULL,
    tipo_concepto character varying(15) NOT NULL,
    unidad_medida character varying(20),
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT concepto_costo_tipo_concepto_check CHECK (((tipo_concepto)::text = ANY ((ARRAY['BIEN'::character varying, 'SERVICIO'::character varying, 'OTRO'::character varying])::text[])))
);


--
-- TOC entry 236 (class 1259 OID 49236)
-- Name: concepto_costo_id_concepto_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.concepto_costo_id_concepto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 236
-- Name: concepto_costo_id_concepto_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.concepto_costo_id_concepto_seq OWNED BY contabilidad.concepto_costo.id_concepto;


--
-- TOC entry 235 (class 1259 OID 49219)
-- Name: cuenta; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.cuenta (
    id_cuenta bigint NOT NULL,
    codigo character varying(40) NOT NULL,
    nombre_cuenta character varying(180) NOT NULL,
    id_grupo_cuenta bigint NOT NULL,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 316 (class 1259 OID 335999)
-- Name: cuenta_asignacion; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.cuenta_asignacion (
    id_cuenta_asignacion bigint NOT NULL,
    entidad_tipo text NOT NULL,
    id_empleado bigint,
    id_persona_estudiante bigint,
    id_persona_tutor bigint,
    id_sucursal bigint,
    id_edificio bigint,
    id_tienda bigint,
    id_bien bigint,
    id_deuda bigint,
    id_proveedor bigint,
    id_departamento bigint,
    id_cuenta bigint NOT NULL,
    prioridad smallint DEFAULT 1 NOT NULL,
    vigente_desde date DEFAULT CURRENT_DATE NOT NULL,
    vigente_hasta date,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT ck_cta_asig_periodo CHECK (((vigente_hasta IS NULL) OR (vigente_hasta >= vigente_desde)))
);


--
-- TOC entry 315 (class 1259 OID 335998)
-- Name: cuenta_asignacion_id_cuenta_asignacion_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.cuenta_asignacion_id_cuenta_asignacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 315
-- Name: cuenta_asignacion_id_cuenta_asignacion_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.cuenta_asignacion_id_cuenta_asignacion_seq OWNED BY contabilidad.cuenta_asignacion.id_cuenta_asignacion;


--
-- TOC entry 234 (class 1259 OID 49218)
-- Name: cuenta_id_cuenta_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.cuenta_id_cuenta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 234
-- Name: cuenta_id_cuenta_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.cuenta_id_cuenta_seq OWNED BY contabilidad.cuenta.id_cuenta;


--
-- TOC entry 233 (class 1259 OID 49197)
-- Name: grupo_cuenta; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.grupo_cuenta (
    id_grupo_cuenta bigint NOT NULL,
    codigo character varying(30) NOT NULL,
    nombre character varying(150) NOT NULL,
    id_parent bigint,
    tipo character varying(15) NOT NULL,
    sub_tipo character varying(15) NOT NULL,
    sub_grupo character varying(20),
    orden_reporte smallint,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT ck_sub_grupo_por_clase CHECK (((sub_grupo IS NULL) OR (((tipo)::text = 'BALANCE'::text) AND ((sub_tipo)::text = ANY ((ARRAY['ACTIVO'::character varying, 'PASIVO'::character varying])::text[])) AND ((sub_grupo)::text = ANY ((ARRAY['CORRIENTE'::character varying, 'NO_CORRIENTE'::character varying])::text[]))) OR (((tipo)::text = 'RESULTADOS'::text) AND ((sub_tipo)::text = ANY ((ARRAY['INGRESO'::character varying, 'GASTO'::character varying])::text[])) AND ((sub_grupo)::text = ANY ((ARRAY['ORDINARIO'::character varying, 'EXTRAORDINARIO'::character varying])::text[]))))),
    CONSTRAINT ck_sub_tipo_por_tipo CHECK (((((tipo)::text = 'BALANCE'::text) AND ((sub_tipo)::text = ANY ((ARRAY['ACTIVO'::character varying, 'PASIVO'::character varying, 'PATRIMONIO'::character varying])::text[]))) OR (((tipo)::text = 'RESULTADOS'::text) AND ((sub_tipo)::text = ANY ((ARRAY['INGRESO'::character varying, 'GASTO'::character varying])::text[]))))),
    CONSTRAINT ck_tipo CHECK (((tipo)::text = ANY ((ARRAY['BALANCE'::character varying, 'RESULTADOS'::character varying])::text[])))
);


--
-- TOC entry 232 (class 1259 OID 49196)
-- Name: grupo_cuenta_id_grupo_cuenta_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.grupo_cuenta_id_grupo_cuenta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 232
-- Name: grupo_cuenta_id_grupo_cuenta_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.grupo_cuenta_id_grupo_cuenta_seq OWNED BY contabilidad.grupo_cuenta.id_grupo_cuenta;


--
-- TOC entry 324 (class 1259 OID 393223)
-- Name: pago_tutor; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.pago_tutor (
    id_pago_tutor bigint NOT NULL,
    id_tutor bigint NOT NULL,
    periodo_inicio timestamp with time zone NOT NULL,
    periodo_fin timestamp with time zone,
    estado_pago text DEFAULT 'BORRADOR'::text NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    ajustes numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    fecha_aprobacion timestamp without time zone,
    fecha_pago timestamp without time zone,
    referencia_pago text,
    observacion text,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp without time zone DEFAULT now() NOT NULL,
    estado_registro text DEFAULT 'Activo'::text,
    version_registro integer DEFAULT 1,
    CONSTRAINT ck_pago_tutor_estado CHECK ((estado_pago = ANY (ARRAY['BORRADOR'::text, 'APROBADO'::text, 'PAGADO'::text, 'ANULADO'::text]))),
    CONSTRAINT ck_pago_tutor_periodo CHECK ((periodo_fin >= periodo_inicio))
);


--
-- TOC entry 326 (class 1259 OID 393248)
-- Name: pago_tutor_detalle; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.pago_tutor_detalle (
    id_pago_tutor_detalle bigint NOT NULL,
    id_pago_tutor bigint NOT NULL,
    id_clase bigint NOT NULL,
    horas_pasadas integer NOT NULL,
    tarifa_hora_aplicada numeric(12,2) NOT NULL,
    CONSTRAINT ck_detalle_minutos CHECK ((horas_pasadas > 0))
);


--
-- TOC entry 325 (class 1259 OID 393247)
-- Name: pago_tutor_detalle_id_pago_tutor_detalle_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.pago_tutor_detalle_id_pago_tutor_detalle_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 325
-- Name: pago_tutor_detalle_id_pago_tutor_detalle_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.pago_tutor_detalle_id_pago_tutor_detalle_seq OWNED BY contabilidad.pago_tutor_detalle.id_pago_tutor_detalle;


--
-- TOC entry 323 (class 1259 OID 393222)
-- Name: pago_tutor_id_pago_tutor_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.pago_tutor_id_pago_tutor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 323
-- Name: pago_tutor_id_pago_tutor_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.pago_tutor_id_pago_tutor_seq OWNED BY contabilidad.pago_tutor.id_pago_tutor;


--
-- TOC entry 314 (class 1259 OID 335873)
-- Name: transaccion; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.transaccion (
    id_transaccion bigint NOT NULL,
    fecha_transaccion date DEFAULT now() NOT NULL,
    tipo_transaccion contabilidad.tipo_transaccion NOT NULL,
    sub_tipo_transaccion text,
    glosa character varying(300),
    id_centro_costo_mapa bigint,
    id_bien bigint,
    id_movimiento_detalle bigint,
    id_deuda bigint,
    id_pago_deuda bigint,
    id_empleado bigint,
    id_empleado_pago bigint,
    id_departamento bigint,
    id_clase_por_hora bigint,
    id_producto_educativo bigint,
    id_curso_version bigint,
    id_sucursal bigint,
    id_tienda bigint,
    id_proveedor bigint,
    id_dividendo_pago bigint,
    id_emision_titulo bigint,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    id_cliente integer,
    id_pago_tutor bigint
);


--
-- TOC entry 313 (class 1259 OID 335872)
-- Name: transaccion_id_transaccion_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.transaccion_id_transaccion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 313
-- Name: transaccion_id_transaccion_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.transaccion_id_transaccion_seq OWNED BY contabilidad.transaccion.id_transaccion;


--
-- TOC entry 322 (class 1259 OID 344093)
-- Name: transaccion_movimiento_cuenta; Type: TABLE; Schema: contabilidad; Owner: -
--

CREATE TABLE contabilidad.transaccion_movimiento_cuenta (
    id_movimiento bigint NOT NULL,
    id_transaccion bigint NOT NULL,
    id_cuenta bigint NOT NULL,
    debe double precision DEFAULT 0 NOT NULL,
    haber double precision DEFAULT 0 NOT NULL,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 321 (class 1259 OID 344092)
-- Name: transaccion_movimiento_cuenta_id_movimiento_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE contabilidad.transaccion_movimiento_cuenta_id_movimiento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 321
-- Name: transaccion_movimiento_cuenta_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE contabilidad.transaccion_movimiento_cuenta_id_movimiento_seq OWNED BY contabilidad.transaccion_movimiento_cuenta.id_movimiento;


--
-- TOC entry 342 (class 1259 OID 786432)
-- Name: v_cuenta; Type: VIEW; Schema: contabilidad; Owner: -
--

CREATE VIEW contabilidad.v_cuenta AS
 SELECT c.id_cuenta,
    c.codigo,
    c.nombre_cuenta,
    c.id_grupo_cuenta,
    gc.nombre AS nombre_grupo_cuenta,
    c.estado_registro,
    c.fecha_registro,
    c.fecha_modificacion,
    c.version_registro
   FROM (contabilidad.cuenta c
     LEFT JOIN contabilidad.grupo_cuenta gc ON ((gc.id_grupo_cuenta = c.id_grupo_cuenta)))
  WHERE ((c.estado_registro)::text = 'Activo'::text);


--
-- TOC entry 341 (class 1259 OID 737285)
-- Name: v_grupo_cuenta; Type: VIEW; Schema: contabilidad; Owner: -
--

CREATE VIEW contabilidad.v_grupo_cuenta AS
 SELECT gc.id_grupo_cuenta,
    gc.codigo,
    gc.nombre,
    gc.id_parent,
    gc2.nombre AS nombre_grupo_padre,
    gc.tipo,
    gc.sub_tipo,
    gc.sub_grupo,
    gc.orden_reporte,
    gc.fecha_registro,
    gc.fecha_modificacion,
    gc.version_registro
   FROM (contabilidad.grupo_cuenta gc
     LEFT JOIN contabilidad.grupo_cuenta gc2 ON ((gc.id_parent = gc2.id_grupo_cuenta)))
  WHERE ((gc.estado_registro)::text = 'Activo'::text);


--
-- TOC entry 280 (class 1259 OID 229377)
-- Name: persona_tutor; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.persona_tutor (
    id_tutor bigint NOT NULL,
    id_persona bigint NOT NULL,
    pago_por_hora numeric(12,2) NOT NULL,
    nivel_experiencia character varying(20) NOT NULL,
    tipo_estudiante_especialidad character varying(20) NOT NULL,
    nivel_estudiante_especialidad character varying(20),
    fecha_registro timestamp without time zone DEFAULT now(),
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    estado_registro boolean DEFAULT true,
    fecha_modificacion timestamp with time zone,
    CONSTRAINT chk_tipo_vs_nivel CHECK (((((tipo_estudiante_especialidad)::text = 'UNIVERSITARIO'::text) AND (nivel_estudiante_especialidad IS NULL)) OR (((tipo_estudiante_especialidad)::text = 'COLEGIAL'::text) AND (nivel_estudiante_especialidad IS NOT NULL)))),
    CONSTRAINT persona_tutor_nivel_estudiante_especialidad_check CHECK (((nivel_estudiante_especialidad)::text = ANY ((ARRAY['PRIMARIA'::character varying, 'SECUNDARIA'::character varying])::text[]))),
    CONSTRAINT persona_tutor_nivel_experiencia_check CHECK (((nivel_experiencia)::text = ANY ((ARRAY['RECLUTA'::character varying, 'EXPERIMENTADO'::character varying, 'SENIOR'::character varying])::text[]))),
    CONSTRAINT persona_tutor_pago_por_hora_check CHECK ((pago_por_hora >= (0)::numeric)),
    CONSTRAINT persona_tutor_tipo_estudiante_especialidad_check CHECK (((tipo_estudiante_especialidad)::text = ANY ((ARRAY['UNIVERSITARIO'::character varying, 'COLEGIAL'::character varying])::text[])))
);


--
-- TOC entry 282 (class 1259 OID 229510)
-- Name: clase_por_hora; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.clase_por_hora (
    id_clase bigint NOT NULL,
    id_aula integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_tutor integer NOT NULL,
    id_materia_tree integer NOT NULL,
    hora_llegada timestamp without time zone NOT NULL,
    motivo text NOT NULL,
    modalidad text DEFAULT 'PRESENCIAL'::text NOT NULL,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    hora_salida timestamp with time zone,
    estado_operativo text DEFAULT 'ABIERTA'::text NOT NULL,
    CONSTRAINT ck_cph_estado_vs_horas CHECK ((((estado_operativo = 'ABIERTA'::text) AND (hora_salida IS NULL)) OR ((estado_operativo = ANY (ARRAY['CERRADA'::text, 'ANULADA'::text])) AND (hora_salida IS NOT NULL)))),
    CONSTRAINT ck_cph_horas_validas CHECK (((hora_salida IS NULL) OR (hora_salida > hora_llegada))),
    CONSTRAINT clase_por_hora_modalidad_check CHECK ((modalidad = ANY (ARRAY['PRESENCIAL'::text, 'VIRTUAL'::text]))),
    CONSTRAINT clase_por_hora_motivo_check CHECK ((motivo = ANY (ARRAY['EXAMEN'::text, 'NIVELACIÓN'::text, 'PRÁCTICO'::text])))
);


--
-- TOC entry 327 (class 1259 OID 393314)
-- Name: v_pendientes_pago_tutor; Type: VIEW; Schema: contabilidad; Owner: -
--

CREATE VIEW contabilidad.v_pendientes_pago_tutor AS
 SELECT cph.id_clase,
    cph.id_tutor,
    cph.hora_llegada,
    cph.hora_salida,
    (EXTRACT(epoch FROM (cph.hora_salida - (cph.hora_llegada)::timestamp with time zone)) / 60.0) AS minutos_real,
    pt.pago_por_hora AS tarifa_hora_actual
   FROM ((servicios_educativos.clase_por_hora cph
     JOIN persona.persona_tutor pt ON ((pt.id_tutor = cph.id_tutor)))
     LEFT JOIN contabilidad.pago_tutor_detalle d ON ((d.id_clase = cph.id_clase)))
  WHERE ((cph.estado_operativo = 'CERRADA'::text) AND (d.id_pago_tutor_detalle IS NULL));


--
-- TOC entry 267 (class 1259 OID 204826)
-- Name: deuda; Type: TABLE; Schema: deuda; Owner: -
--

CREATE TABLE deuda.deuda (
    id_deuda bigint NOT NULL,
    id_proveedor bigint NOT NULL,
    monto_inicial numeric(18,2) NOT NULL,
    tasa_anual numeric(6,4) NOT NULL,
    tipo_tasa character varying(20) NOT NULL,
    capitalizacion character varying(20),
    plazo_meses integer NOT NULL,
    seguro_desgravamen_fijo numeric(18,2),
    seguro_desgravamen_variable numeric(18,2),
    tipo_calculo_cuotas character varying(10) DEFAULT 'FRANCES'::character varying NOT NULL,
    frecuencia_cuotas character varying DEFAULT 'MENSUAL'::character varying NOT NULL,
    tipo_pago character varying(20) DEFAULT 'VENCIDAS'::character varying NOT NULL,
    tipo_primer_pago character varying(20) DEFAULT 'INMEDIATA'::character varying NOT NULL,
    anualidad_acordada numeric(18,2),
    fecha_inicio date DEFAULT CURRENT_DATE NOT NULL,
    observaciones text,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    CONSTRAINT chk_capitalizacion_vs_tipo_tasa CHECK (((((tipo_tasa)::text = 'COMPUESTA'::text) AND (capitalizacion IS NOT NULL)) OR (((tipo_tasa)::text = 'SIMPLE'::text) AND (capitalizacion IS NULL)))),
    CONSTRAINT deuda_capitalizacion_check CHECK (((capitalizacion)::text = ANY ((ARRAY['ANUAL'::character varying, 'SEMESTRAL'::character varying, 'TRIMESTRAL'::character varying, 'BIMESTRAL'::character varying, 'MENSUAL'::character varying])::text[]))),
    CONSTRAINT deuda_frecuencia_cuotas_check CHECK (((frecuencia_cuotas)::text = ANY ((ARRAY['ANUAL'::character varying, 'SEMESTRAL'::character varying, 'TRIMESTRAL'::character varying, 'BIMESTRAL'::character varying, 'MENSUAL'::character varying])::text[]))),
    CONSTRAINT deuda_monto_inicial_check CHECK ((monto_inicial > (0)::numeric)),
    CONSTRAINT deuda_plazo_meses_check CHECK ((plazo_meses > 0)),
    CONSTRAINT deuda_seguro_desgravamen_fijo_check CHECK ((seguro_desgravamen_fijo >= (0)::numeric)),
    CONSTRAINT deuda_seguro_desgravamen_variable_check CHECK ((seguro_desgravamen_variable >= (0)::numeric)),
    CONSTRAINT deuda_tasa_anual_check CHECK ((tasa_anual >= (0)::numeric)),
    CONSTRAINT deuda_tipo_calculo_cuotas_check CHECK (((tipo_calculo_cuotas)::text = ANY ((ARRAY['FRANCES'::character varying, 'ALEMAN'::character varying, 'AMERICANO'::character varying])::text[]))),
    CONSTRAINT deuda_tipo_pago_check CHECK (((tipo_pago)::text = ANY ((ARRAY['VENCIDAS'::character varying, 'ANTICIPADAS'::character varying])::text[]))),
    CONSTRAINT deuda_tipo_primer_pago_check CHECK (((tipo_primer_pago)::text = ANY ((ARRAY['INMEDIATA'::character varying, 'DIFERIDA'::character varying])::text[]))),
    CONSTRAINT deuda_tipo_tasa_check CHECK (((tipo_tasa)::text = ANY ((ARRAY['SIMPLE'::character varying, 'COMPUESTA'::character varying])::text[])))
);


--
-- TOC entry 266 (class 1259 OID 204825)
-- Name: deuda_id_deuda_seq; Type: SEQUENCE; Schema: deuda; Owner: -
--

CREATE SEQUENCE deuda.deuda_id_deuda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 266
-- Name: deuda_id_deuda_seq; Type: SEQUENCE OWNED BY; Schema: deuda; Owner: -
--

ALTER SEQUENCE deuda.deuda_id_deuda_seq OWNED BY deuda.deuda.id_deuda;


--
-- TOC entry 269 (class 1259 OID 204856)
-- Name: pago; Type: TABLE; Schema: deuda; Owner: -
--

CREATE TABLE deuda.pago (
    id_pago bigint NOT NULL,
    id_deuda bigint NOT NULL,
    fecha_pago date DEFAULT CURRENT_DATE NOT NULL,
    interes_pagado numeric(18,2) DEFAULT 0,
    capital_amortizado numeric(18,2) DEFAULT 0,
    seguro_desgravamen_pagado numeric(18,2) DEFAULT 0,
    otros_recargos_pagados numeric(18,2) DEFAULT 0,
    observaciones text,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    CONSTRAINT chk_pago_tiene_movimiento CHECK (((((COALESCE(interes_pagado, (0)::numeric) + COALESCE(capital_amortizado, (0)::numeric)) + COALESCE(seguro_desgravamen_pagado, (0)::numeric)) + COALESCE(otros_recargos_pagados, (0)::numeric)) > (0)::numeric)),
    CONSTRAINT pago_capital_amortizado_check CHECK ((capital_amortizado >= (0)::numeric)),
    CONSTRAINT pago_interes_pagado_check CHECK ((interes_pagado >= (0)::numeric)),
    CONSTRAINT pago_otros_recargos_pagados_check CHECK ((otros_recargos_pagados >= (0)::numeric)),
    CONSTRAINT pago_seguro_desgravamen_pagado_check CHECK ((seguro_desgravamen_pagado >= (0)::numeric))
);


--
-- TOC entry 268 (class 1259 OID 204855)
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: deuda; Owner: -
--

CREATE SEQUENCE deuda.pago_id_pago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 268
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: deuda; Owner: -
--

ALTER SEQUENCE deuda.pago_id_pago_seq OWNED BY deuda.pago.id_pago;


--
-- TOC entry 251 (class 1259 OID 114783)
-- Name: edificio; Type: TABLE; Schema: infraestructura; Owner: -
--

CREATE TABLE infraestructura.edificio (
    id_edificio bigint NOT NULL,
    id_sucursal bigint NOT NULL,
    codigo character varying(40) NOT NULL,
    nombre character varying(150) NOT NULL,
    direccion_linea1 character varying(180),
    ciudad character varying(80),
    departamento character varying(80),
    pais character varying(80),
    latitud numeric(9,6),
    longitud numeric(9,6),
    pisos smallint,
    largo_m double precision,
    ancho_m double precision,
    id_administrador bigint,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT edificio_ancho_m_check CHECK ((ancho_m > (0)::double precision)),
    CONSTRAINT edificio_largo_m_check CHECK ((largo_m > (0)::double precision)),
    CONSTRAINT edificio_latitud_check CHECK (((latitud IS NULL) OR ((latitud >= ('-90'::integer)::numeric) AND (latitud <= (90)::numeric)))),
    CONSTRAINT edificio_longitud_check CHECK (((longitud IS NULL) OR ((longitud >= ('-180'::integer)::numeric) AND (longitud <= (180)::numeric)))),
    CONSTRAINT edificio_pisos_check CHECK (((pisos IS NULL) OR (pisos > 0)))
);


--
-- TOC entry 250 (class 1259 OID 114782)
-- Name: edificio_id_edificio_seq; Type: SEQUENCE; Schema: infraestructura; Owner: -
--

CREATE SEQUENCE infraestructura.edificio_id_edificio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 250
-- Name: edificio_id_edificio_seq; Type: SEQUENCE OWNED BY; Schema: infraestructura; Owner: -
--

ALTER SEQUENCE infraestructura.edificio_id_edificio_seq OWNED BY infraestructura.edificio.id_edificio;


--
-- TOC entry 249 (class 1259 OID 114762)
-- Name: encargado; Type: TABLE; Schema: infraestructura; Owner: -
--

CREATE TABLE infraestructura.encargado (
    id_asignacion bigint NOT NULL,
    id_sucursal integer NOT NULL,
    id_empleado integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 248 (class 1259 OID 114761)
-- Name: encargado_id_asignacion_seq; Type: SEQUENCE; Schema: infraestructura; Owner: -
--

CREATE SEQUENCE infraestructura.encargado_id_asignacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 248
-- Name: encargado_id_asignacion_seq; Type: SEQUENCE OWNED BY; Schema: infraestructura; Owner: -
--

ALTER SEQUENCE infraestructura.encargado_id_asignacion_seq OWNED BY infraestructura.encargado.id_asignacion;


--
-- TOC entry 261 (class 1259 OID 180225)
-- Name: espacio; Type: TABLE; Schema: infraestructura; Owner: -
--

CREATE TABLE infraestructura.espacio (
    id_espacio bigint NOT NULL,
    id_edificio bigint NOT NULL,
    tipo infraestructura.tipo_espacio NOT NULL,
    categoria_sala infraestructura.categoria_sala,
    tipo_aula infraestructura.tipo_aula,
    es_privada boolean DEFAULT false,
    nombre character varying(150),
    piso smallint,
    capacidad smallint,
    largo_m double precision,
    ancho_m double precision,
    observaciones character varying(240),
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT ck_espacio_coherencia_tipo CHECK ((((tipo = 'AULA'::infraestructura.tipo_espacio) AND (tipo_aula IS NOT NULL) AND (categoria_sala IS NULL)) OR ((tipo = 'SALA'::infraestructura.tipo_espacio) AND (categoria_sala IS NOT NULL) AND (tipo_aula IS NULL)))),
    CONSTRAINT ck_espacio_no_aula CHECK ((((tipo <> 'AULA'::infraestructura.tipo_espacio) AND (tipo_aula IS NULL)) OR (tipo = 'AULA'::infraestructura.tipo_espacio))),
    CONSTRAINT ck_espacio_no_sala CHECK ((((tipo <> 'SALA'::infraestructura.tipo_espacio) AND (categoria_sala IS NULL)) OR (tipo = 'SALA'::infraestructura.tipo_espacio))),
    CONSTRAINT ck_espacio_sala_categoria CHECK (((tipo <> 'SALA'::infraestructura.tipo_espacio) OR (categoria_sala IS NOT NULL))),
    CONSTRAINT espacio_ancho_m_check CHECK (((ancho_m IS NULL) OR (ancho_m > (0)::double precision))),
    CONSTRAINT espacio_capacidad_check CHECK (((capacidad IS NULL) OR (capacidad >= 0))),
    CONSTRAINT espacio_largo_m_check CHECK (((largo_m IS NULL) OR (largo_m > (0)::double precision)))
);


--
-- TOC entry 260 (class 1259 OID 180224)
-- Name: espacio_id_espacio_seq; Type: SEQUENCE; Schema: infraestructura; Owner: -
--

CREATE SEQUENCE infraestructura.espacio_id_espacio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 260
-- Name: espacio_id_espacio_seq; Type: SEQUENCE OWNED BY; Schema: infraestructura; Owner: -
--

ALTER SEQUENCE infraestructura.espacio_id_espacio_seq OWNED BY infraestructura.espacio.id_espacio;


--
-- TOC entry 247 (class 1259 OID 114747)
-- Name: sucursal; Type: TABLE; Schema: infraestructura; Owner: -
--

CREATE TABLE infraestructura.sucursal (
    id_sucursal bigint NOT NULL,
    codigo character varying(40) NOT NULL,
    nombre character varying(150) NOT NULL,
    telefono character varying(100),
    email character varying(200),
    direccion_linea1 character varying(180),
    ciudad character varying(80),
    departamento character varying(80),
    pais character varying(80),
    horario_texto character varying(240),
    largo_m double precision,
    ancho_m double precision,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 246 (class 1259 OID 114746)
-- Name: sucursal_id_sucursal_seq; Type: SEQUENCE; Schema: infraestructura; Owner: -
--

CREATE SEQUENCE infraestructura.sucursal_id_sucursal_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 246
-- Name: sucursal_id_sucursal_seq; Type: SEQUENCE OWNED BY; Schema: infraestructura; Owner: -
--

ALTER SEQUENCE infraestructura.sucursal_id_sucursal_seq OWNED BY infraestructura.sucursal.id_sucursal;


--
-- TOC entry 265 (class 1259 OID 196609)
-- Name: tienda; Type: TABLE; Schema: infraestructura; Owner: -
--

CREATE TABLE infraestructura.tienda (
    id_tienda bigint NOT NULL,
    id_espacio bigint,
    codigo character varying(40) NOT NULL,
    nombre character varying(150) NOT NULL,
    horario_texto character varying(240),
    id_responsable bigint,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 264 (class 1259 OID 196608)
-- Name: tienda_id_tienda_seq; Type: SEQUENCE; Schema: infraestructura; Owner: -
--

CREATE SEQUENCE infraestructura.tienda_id_tienda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 264
-- Name: tienda_id_tienda_seq; Type: SEQUENCE OWNED BY; Schema: infraestructura; Owner: -
--

ALTER SEQUENCE infraestructura.tienda_id_tienda_seq OWNED BY infraestructura.tienda.id_tienda;


--
-- TOC entry 253 (class 1259 OID 122938)
-- Name: bien; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.bien (
    id_bien bigint NOT NULL,
    sku character varying(60) NOT NULL,
    nombre character varying(180) NOT NULL,
    descripcion text,
    tipo inventario.tipo_bien NOT NULL,
    categoria character varying(100),
    subcategoria character varying(100),
    unidad_compra character varying(20) DEFAULT 'unidad'::character varying,
    unidad_venta character varying(20) DEFAULT 'unidad'::character varying,
    factor_conversion numeric(18,6) DEFAULT 1,
    controla_inventario_loteable boolean DEFAULT false NOT NULL,
    controla_inventario_no_loteable boolean DEFAULT false NOT NULL,
    metodo_valuacion inventario.metodo_valuacion DEFAULT 'PROM'::inventario.metodo_valuacion,
    costo_referencia numeric(18,4),
    precio_referencia numeric(18,2),
    moneda_referencia character varying(3) DEFAULT 'BOB'::character varying,
    marca character varying(80),
    modelo character varying(80),
    codigo_barras character varying(80),
    peso_kg numeric(18,3),
    largo_m numeric(18,4),
    ancho_m numeric(18,4),
    profundidad_m numeric(18,4),
    volumen_m3 numeric(18,4),
    id_cuenta_existencias bigint,
    id_cuenta_costo_venta bigint,
    id_cuenta_ingreso bigint,
    id_cuenta_depreciacion bigint,
    id_cuenta_depreciacion_acumulada bigint,
    valor_origen numeric(18,2),
    vida_util_meses integer,
    valor_residual numeric(18,2),
    metodo_depreciacion inventario.metodo_depreciacion,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    es_producto_tienda boolean DEFAULT false NOT NULL,
    CONSTRAINT bien_ancho_m_check CHECK (((ancho_m IS NULL) OR (ancho_m >= (0)::numeric))),
    CONSTRAINT bien_costo_referencia_check CHECK (((costo_referencia IS NULL) OR (costo_referencia >= (0)::numeric))),
    CONSTRAINT bien_factor_conversion_check CHECK ((factor_conversion > (0)::numeric)),
    CONSTRAINT bien_largo_m_check CHECK (((largo_m IS NULL) OR (largo_m >= (0)::numeric))),
    CONSTRAINT bien_peso_kg_check CHECK (((peso_kg IS NULL) OR (peso_kg >= (0)::numeric))),
    CONSTRAINT bien_precio_referencia_check CHECK (((precio_referencia IS NULL) OR (precio_referencia >= (0)::numeric))),
    CONSTRAINT bien_profundidad_m_check CHECK (((profundidad_m IS NULL) OR (profundidad_m >= (0)::numeric))),
    CONSTRAINT bien_valor_origen_check CHECK (((valor_origen IS NULL) OR (valor_origen >= (0)::numeric))),
    CONSTRAINT bien_valor_residual_check CHECK (((valor_residual IS NULL) OR (valor_residual >= (0)::numeric))),
    CONSTRAINT bien_vida_util_meses_check CHECK (((vida_util_meses IS NULL) OR (vida_util_meses > 0))),
    CONSTRAINT bien_volumen_m3_check CHECK (((volumen_m3 IS NULL) OR (volumen_m3 >= (0)::numeric))),
    CONSTRAINT ck_bien_activo_fijo_dep CHECK (((tipo <> 'ACTIVO_FIJO'::inventario.tipo_bien) OR ((valor_origen IS NOT NULL) AND (vida_util_meses IS NOT NULL) AND (metodo_depreciacion IS NOT NULL)))),
    CONSTRAINT ck_bien_flags_xor CHECK ((((tipo = 'MERCADERIA'::inventario.tipo_bien) AND (((controla_inventario_loteable)::integer + (controla_inventario_no_loteable)::integer) = 1)) OR ((tipo = ANY (ARRAY['ACTIVO_FIJO'::inventario.tipo_bien, 'SERVICIO'::inventario.tipo_bien])) AND (controla_inventario_loteable = false) AND (controla_inventario_no_loteable = false)) OR (tipo <> ALL (ARRAY['MERCADERIA'::inventario.tipo_bien, 'ACTIVO_FIJO'::inventario.tipo_bien, 'SERVICIO'::inventario.tipo_bien])))),
    CONSTRAINT ck_bien_servicio_no_dep_no_inv CHECK (((tipo <> 'SERVICIO'::inventario.tipo_bien) OR ((controla_inventario_loteable = false) AND (controla_inventario_no_loteable = false) AND (valor_origen IS NULL) AND (vida_util_meses IS NULL) AND (valor_residual IS NULL) AND (metodo_depreciacion IS NULL) AND (peso_kg IS NULL) AND (volumen_m3 IS NULL))))
);


--
-- TOC entry 252 (class 1259 OID 122937)
-- Name: bien_id_bien_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.bien_id_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 252
-- Name: bien_id_bien_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.bien_id_bien_seq OWNED BY inventario.bien.id_bien;


--
-- TOC entry 255 (class 1259 OID 123018)
-- Name: bien_instancia; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.bien_instancia (
    id_bien_instancia bigint NOT NULL,
    id_bien bigint NOT NULL,
    descripcion_especificaciones text NOT NULL,
    fecha_compra date NOT NULL,
    id_proveedor_compra integer,
    costo_compra numeric(18,4),
    precio_compra numeric(18,2),
    serial_unico character varying(120),
    fecha_fabricacion date,
    fecha_vencimiento date,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT bien_instancia_costo_compra_check CHECK (((costo_compra IS NULL) OR (costo_compra >= (0)::numeric))),
    CONSTRAINT bien_instancia_precio_compra_check CHECK (((precio_compra IS NULL) OR (precio_compra >= (0)::numeric))),
    CONSTRAINT chk_instancia_fechas CHECK ((((fecha_fabricacion IS NULL) OR (fecha_compra >= fecha_fabricacion)) AND ((fecha_vencimiento IS NULL) OR (fecha_vencimiento >= COALESCE(fecha_fabricacion, fecha_compra)))))
);


--
-- TOC entry 254 (class 1259 OID 123017)
-- Name: bien_instancia_id_bien_instancia_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.bien_instancia_id_bien_instancia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 254
-- Name: bien_instancia_id_bien_instancia_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.bien_instancia_id_bien_instancia_seq OWNED BY inventario.bien_instancia.id_bien_instancia;


--
-- TOC entry 257 (class 1259 OID 123062)
-- Name: bien_lote; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.bien_lote (
    id_lote bigint NOT NULL,
    id_bien bigint NOT NULL,
    lote_codigo character varying(80) NOT NULL,
    fecha_compra date NOT NULL,
    id_proveedor_compra integer,
    cantidad_compra integer NOT NULL,
    costo_compra_unitario numeric(18,4),
    precio_compra_unitario numeric(18,2),
    fecha_fabricacion date,
    fecha_vencimiento date,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT bien_lote_cantidad_compra_check CHECK ((cantidad_compra > 0)),
    CONSTRAINT bien_lote_costo_compra_unitario_check CHECK (((costo_compra_unitario IS NULL) OR (costo_compra_unitario >= (0)::numeric))),
    CONSTRAINT bien_lote_precio_compra_unitario_check CHECK (((precio_compra_unitario IS NULL) OR (precio_compra_unitario >= (0)::numeric))),
    CONSTRAINT chk_lote_fechas CHECK ((((fecha_fabricacion IS NULL) OR (fecha_compra >= fecha_fabricacion)) AND ((fecha_vencimiento IS NULL) OR (fecha_vencimiento >= COALESCE(fecha_fabricacion, fecha_compra)))))
);


--
-- TOC entry 256 (class 1259 OID 123061)
-- Name: bien_lote_id_lote_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.bien_lote_id_lote_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 256
-- Name: bien_lote_id_lote_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.bien_lote_id_lote_seq OWNED BY inventario.bien_lote.id_lote;


--
-- TOC entry 259 (class 1259 OID 139283)
-- Name: movimiento_detalle; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.movimiento_detalle (
    id_movimiento bigint NOT NULL,
    id_bien bigint NOT NULL,
    id_lote bigint,
    id_bien_instancia bigint,
    cantidad numeric(18,6) DEFAULT 1 NOT NULL,
    id_espacio_entrada bigint,
    id_espacio_salida bigint,
    CONSTRAINT ck_cantidad_pos CHECK ((cantidad > (0)::numeric)),
    CONSTRAINT ck_detalle_exclusividad CHECK (((id_lote IS NULL) OR (id_bien_instancia IS NULL))),
    CONSTRAINT ck_instancia_cantidad_unidad CHECK (((id_bien_instancia IS NULL) OR (cantidad = (1)::numeric)))
);


--
-- TOC entry 258 (class 1259 OID 139282)
-- Name: movimiento_detalle_id_movimiento_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.movimiento_detalle_id_movimiento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 258
-- Name: movimiento_detalle_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.movimiento_detalle_id_movimiento_seq OWNED BY inventario.movimiento_detalle.id_movimiento;


--
-- TOC entry 320 (class 1259 OID 344067)
-- Name: estudiante_padre; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.estudiante_padre (
    id_asociacion bigint NOT NULL,
    id_padre bigint NOT NULL,
    id_estudiante bigint NOT NULL,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 319 (class 1259 OID 344066)
-- Name: estudiante_padre_id_asociacion_seq; Type: SEQUENCE; Schema: persona; Owner: -
--

CREATE SEQUENCE persona.estudiante_padre_id_asociacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 319
-- Name: estudiante_padre_id_asociacion_seq; Type: SEQUENCE OWNED BY; Schema: persona; Owner: -
--

ALTER SEQUENCE persona.estudiante_padre_id_asociacion_seq OWNED BY persona.estudiante_padre.id_asociacion;


--
-- TOC entry 228 (class 1259 OID 49154)
-- Name: persona; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.persona (
    id_persona bigint NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100),
    telefono character varying(100),
    fecha_nacimiento date,
    email character varying(200),
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 276 (class 1259 OID 221184)
-- Name: persona_estudiante; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.persona_estudiante (
    id_persona bigint NOT NULL,
    codigo_estudiante character varying(50),
    id_unidad_educativa bigint,
    tipo character varying(50),
    nivel_actual character varying(50),
    curso_actual character varying(50),
    turno_actual character varying(50),
    carrera character varying(100),
    anio_ingreso smallint,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    estado_registro boolean DEFAULT true,
    fecha_modificacion timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_tipo_colegial CHECK (((((tipo)::text = 'COLEGIAL'::text) AND (nivel_actual IS NOT NULL) AND (curso_actual IS NOT NULL) AND (turno_actual IS NOT NULL) AND (carrera IS NULL) AND (anio_ingreso IS NULL)) OR (((tipo)::text = 'UNIVERSITARIO'::text) AND (carrera IS NOT NULL) AND (anio_ingreso IS NOT NULL) AND (nivel_actual IS NULL) AND (curso_actual IS NULL) AND (turno_actual IS NULL)))),
    CONSTRAINT persona_estudiante_curso_actual_check CHECK (((curso_actual)::text = ANY ((ARRAY['PRIMERO'::character varying, 'SEGUNDO'::character varying, 'TERCERO'::character varying, 'CUARTO'::character varying, 'QUINTO'::character varying, 'SEXTO'::character varying])::text[]))),
    CONSTRAINT persona_estudiante_nivel_actual_check CHECK (((nivel_actual)::text = ANY ((ARRAY['PRIMARIA'::character varying, 'SECUNDARIA'::character varying])::text[]))),
    CONSTRAINT persona_estudiante_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['UNIVERSITARIO'::character varying, 'COLEGIAL'::character varying])::text[]))),
    CONSTRAINT persona_estudiante_turno_actual_check CHECK (((turno_actual)::text = ANY ((ARRAY['MAÑANA'::character varying, 'TARDE'::character varying, 'NOCHE'::character varying])::text[])))
);


--
-- TOC entry 227 (class 1259 OID 49153)
-- Name: persona_id_persona_seq; Type: SEQUENCE; Schema: persona; Owner: -
--

CREATE SEQUENCE persona.persona_id_persona_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 227
-- Name: persona_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: persona; Owner: -
--

ALTER SEQUENCE persona.persona_id_persona_seq OWNED BY persona.persona.id_persona;


--
-- TOC entry 333 (class 1259 OID 417819)
-- Name: persona_padre; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.persona_padre (
    id_padre bigint NOT NULL,
    es_embajador boolean DEFAULT false,
    metadata jsonb,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 332 (class 1259 OID 417818)
-- Name: persona_padre_id_padre_seq; Type: SEQUENCE; Schema: persona; Owner: -
--

CREATE SEQUENCE persona.persona_padre_id_padre_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 332
-- Name: persona_padre_id_padre_seq; Type: SEQUENCE OWNED BY; Schema: persona; Owner: -
--

ALTER SEQUENCE persona.persona_padre_id_padre_seq OWNED BY persona.persona_padre.id_padre;


--
-- TOC entry 279 (class 1259 OID 229376)
-- Name: persona_tutor_id_tutor_seq; Type: SEQUENCE; Schema: persona; Owner: -
--

CREATE SEQUENCE persona.persona_tutor_id_tutor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 279
-- Name: persona_tutor_id_tutor_seq; Type: SEQUENCE OWNED BY; Schema: persona; Owner: -
--

ALTER SEQUENCE persona.persona_tutor_id_tutor_seq OWNED BY persona.persona_tutor.id_tutor;


--
-- TOC entry 229 (class 1259 OID 49166)
-- Name: persona_usuario; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.persona_usuario (
    id_persona bigint NOT NULL,
    nombre_usuario character varying(80) NOT NULL,
    contrasena_hash character varying(255) NOT NULL,
    tipo_usuario character varying(200),
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    es_super_usuario boolean DEFAULT false NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 49185)
-- Name: proveedor; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.proveedor (
    id_proveedor bigint NOT NULL,
    nombre_proveedor character varying(180) NOT NULL,
    categoria character varying(100),
    telefono character varying(100),
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 230 (class 1259 OID 49184)
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE; Schema: persona; Owner: -
--

CREATE SEQUENCE persona.proveedor_id_proveedor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 230
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE OWNED BY; Schema: persona; Owner: -
--

ALTER SEQUENCE persona.proveedor_id_proveedor_seq OWNED BY persona.proveedor.id_proveedor;


--
-- TOC entry 275 (class 1259 OID 212993)
-- Name: unidad_educativa; Type: TABLE; Schema: persona; Owner: -
--

CREATE TABLE persona.unidad_educativa (
    id_unidad_educativa bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    latitud numeric(9,6),
    longitud numeric(9,6),
    categoria character varying(20) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    estado_registro boolean DEFAULT true,
    fecha_modificacion timestamp without time zone DEFAULT now(),
    CONSTRAINT unidad_educativa_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['privada'::character varying, 'convenio'::character varying, 'fiscal'::character varying])::text[])))
);


--
-- TOC entry 274 (class 1259 OID 212992)
-- Name: unidad_educativa_id_unidad_educativa_seq; Type: SEQUENCE; Schema: persona; Owner: -
--

CREATE SEQUENCE persona.unidad_educativa_id_unidad_educativa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 274
-- Name: unidad_educativa_id_unidad_educativa_seq; Type: SEQUENCE OWNED BY; Schema: persona; Owner: -
--

ALTER SEQUENCE persona.unidad_educativa_id_unidad_educativa_seq OWNED BY persona.unidad_educativa.id_unidad_educativa;


--
-- TOC entry 331 (class 1259 OID 409626)
-- Name: action_log; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.action_log (
    id_action bigint NOT NULL,
    id_sesion bigint NOT NULL,
    tipo_accion text NOT NULL,
    severidad text DEFAULT 'INFO'::text NOT NULL,
    entity_schema text,
    entity_table text,
    entity_pk jsonb,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    success boolean DEFAULT true NOT NULL,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT action_log_severidad_check CHECK ((severidad = ANY (ARRAY['INFO'::text, 'WARN'::text, 'SECURITY'::text, 'ERROR'::text])))
);


--
-- TOC entry 330 (class 1259 OID 409625)
-- Name: action_log_id_action_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.action_log_id_action_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 330
-- Name: action_log_id_action_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.action_log_id_action_seq OWNED BY seguridad.action_log.id_action;


--
-- TOC entry 335 (class 1259 OID 442369)
-- Name: permiso; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.permiso (
    id_permiso bigint NOT NULL,
    codigo text NOT NULL,
    descripcion text,
    modulo text,
    estado_registro text DEFAULT 'Activo'::text NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 334 (class 1259 OID 442368)
-- Name: permiso_id_permiso_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.permiso_id_permiso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 334
-- Name: permiso_id_permiso_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.permiso_id_permiso_seq OWNED BY seguridad.permiso.id_permiso;


--
-- TOC entry 337 (class 1259 OID 442382)
-- Name: rol; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.rol (
    id_rol bigint NOT NULL,
    codigo text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    estado_registro text DEFAULT 'Activo'::text NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 336 (class 1259 OID 442381)
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.rol_id_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 336
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.rol_id_rol_seq OWNED BY seguridad.rol.id_rol;


--
-- TOC entry 338 (class 1259 OID 442394)
-- Name: rol_permiso; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.rol_permiso (
    id_rol bigint NOT NULL,
    id_permiso bigint NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 329 (class 1259 OID 409602)
-- Name: sesion; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.sesion (
    id_sesion bigint NOT NULL,
    id_persona bigint NOT NULL,
    ip_acceso text,
    user_agent text,
    tipo_login text,
    tipo_logout text,
    timestamp_login timestamp with time zone DEFAULT now() NOT NULL,
    timestamp_logout timestamp with time zone,
    esta_activa boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT ck_sesion_logout_ge_login CHECK (((timestamp_logout IS NULL) OR (timestamp_logout >= timestamp_login)))
);


--
-- TOC entry 328 (class 1259 OID 409601)
-- Name: sesion_id_sesion_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.sesion_id_sesion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 328
-- Name: sesion_id_sesion_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.sesion_id_sesion_seq OWNED BY seguridad.sesion.id_sesion;


--
-- TOC entry 340 (class 1259 OID 442429)
-- Name: usuario_permiso; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.usuario_permiso (
    id_persona bigint NOT NULL,
    id_permiso bigint NOT NULL,
    permitido boolean DEFAULT true NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 339 (class 1259 OID 442410)
-- Name: usuario_rol; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.usuario_rol (
    id_persona bigint NOT NULL,
    id_rol bigint NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    estado_registro text DEFAULT 'Activo'::text NOT NULL,
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 344 (class 1259 OID 819201)
-- Name: usuario_token_accion; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.usuario_token_accion (
    id_token_accion bigint NOT NULL,
    id_persona bigint NOT NULL,
    accion character varying(40) NOT NULL,
    token_hash character varying(255) NOT NULL,
    fecha_expiracion timestamp with time zone NOT NULL,
    fecha_usado timestamp with time zone,
    fecha_revocado timestamp with time zone,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario_creador bigint,
    CONSTRAINT chk_usuario_token_accion_accion CHECK (((accion)::text = ANY ((ARRAY['VALIDAR_USUARIO'::character varying, 'CAMBIAR_CONTRASENA'::character varying])::text[]))),
    CONSTRAINT chk_usuario_token_accion_estado CHECK (((estado_registro)::text = ANY ((ARRAY['Activo'::character varying, 'Usado'::character varying, 'Expirado'::character varying, 'Revocado'::character varying])::text[])))
);


--
-- TOC entry 343 (class 1259 OID 819200)
-- Name: usuario_token_accion_id_token_accion_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

ALTER TABLE seguridad.usuario_token_accion ALTER COLUMN id_token_accion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME seguridad.usuario_token_accion_id_token_accion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 290 (class 1259 OID 262163)
-- Name: asistencia_clase_curso; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.asistencia_clase_curso (
    id_asistencia bigint NOT NULL,
    id_clase_curso bigint NOT NULL,
    id_estudiante bigint NOT NULL,
    estado_asistencia character varying(15) NOT NULL,
    hora_marcacion timestamp without time zone,
    observaciones character varying(240),
    fecha_registro timestamp without time zone DEFAULT now(),
    estado_registro boolean DEFAULT true,
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    CONSTRAINT asistencia_clase_curso_estado_asistencia_check CHECK (((estado_asistencia)::text = ANY ((ARRAY['Asistió'::character varying, 'Tardanza'::character varying, 'Falta'::character varying, 'Justificado'::character varying, 'En línea'::character varying])::text[])))
);


--
-- TOC entry 289 (class 1259 OID 262162)
-- Name: asistencia_clase_curso_id_asistencia_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.asistencia_clase_curso_id_asistencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 289
-- Name: asistencia_clase_curso_id_asistencia_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.asistencia_clase_curso_id_asistencia_seq OWNED BY servicios_educativos.asistencia_clase_curso.id_asistencia;


--
-- TOC entry 288 (class 1259 OID 245783)
-- Name: clase_curso; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.clase_curso (
    id_clase_curso bigint NOT NULL,
    id_curso_version bigint NOT NULL,
    id_aula bigint,
    id_tutor bigint,
    fecha date NOT NULL,
    hora_inicio_real time without time zone NOT NULL,
    hora_fin_real time without time zone NOT NULL,
    estado character varying(20) DEFAULT 'Programada'::character varying NOT NULL,
    modalidad character varying(30) DEFAULT 'Presencial'::character varying,
    detalle_temas_revisados character varying(200),
    observaciones character varying(300),
    motivo_cancelacion character varying(200),
    fecha_registro timestamp without time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    estado_registro boolean DEFAULT true,
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    CONSTRAINT clase_curso_check CHECK ((hora_fin_real > hora_inicio_real)),
    CONSTRAINT clase_curso_estado_check CHECK (((estado)::text = ANY ((ARRAY['Programada'::character varying, 'En curso'::character varying, 'Dictada'::character varying, 'Reprogramada'::character varying, 'Cancelada'::character varying])::text[]))),
    CONSTRAINT clase_curso_modalidad_check CHECK (((modalidad)::text = ANY ((ARRAY['Presencial'::character varying, 'Online'::character varying, 'Híbrido'::character varying])::text[])))
);


--
-- TOC entry 287 (class 1259 OID 245782)
-- Name: clase_curso_id_clase_curso_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.clase_curso_id_clase_curso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 287
-- Name: clase_curso_id_clase_curso_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.clase_curso_id_clase_curso_seq OWNED BY servicios_educativos.clase_curso.id_clase_curso;


--
-- TOC entry 281 (class 1259 OID 229509)
-- Name: clase_por_hora_id_clase_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.clase_por_hora_id_clase_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 281
-- Name: clase_por_hora_id_clase_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.clase_por_hora_id_clase_seq OWNED BY servicios_educativos.clase_por_hora.id_clase;


--
-- TOC entry 286 (class 1259 OID 237610)
-- Name: curso_version; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.curso_version (
    id_curso_version bigint NOT NULL,
    id_producto_educativo bigint NOT NULL,
    nombre_version character varying(150) NOT NULL,
    descripcion_version text,
    fecha_inicio date,
    fecha_fin date,
    precio_version numeric(12,2),
    id_horario integer,
    fecha_registro timestamp without time zone DEFAULT now(),
    estado_registro boolean DEFAULT true,
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    CONSTRAINT curso_version_precio_version_check CHECK (((precio_version IS NULL) OR (precio_version >= (0)::numeric)))
);


--
-- TOC entry 285 (class 1259 OID 237609)
-- Name: curso_version_id_curso_version_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.curso_version_id_curso_version_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 285
-- Name: curso_version_id_curso_version_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.curso_version_id_curso_version_seq OWNED BY servicios_educativos.curso_version.id_curso_version;


--
-- TOC entry 284 (class 1259 OID 237597)
-- Name: horarios; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.horarios (
    id_horario bigint NOT NULL,
    repeticion text,
    hora_inicio_lunes time without time zone,
    hora_inicio_martes time without time zone,
    hora_inicio_miercoles time without time zone,
    hora_inicio_jueves time without time zone,
    hora_inicio_viernes time without time zone,
    hora_inicio_sabado time without time zone,
    hora_fin_lunes time without time zone,
    hora_fin_martes time without time zone,
    hora_fin_miercoles time without time zone,
    hora_fin_jueves time without time zone,
    hora_fin_viernes time without time zone,
    hora_fin_sabado time without time zone,
    fecha_registro timestamp without time zone DEFAULT now(),
    estado_registro boolean DEFAULT true,
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    CONSTRAINT horarios_repeticion_check CHECK ((repeticion = ANY (ARRAY['CADA SEMANA'::text, 'CADA QUINCENA'::text, 'CADA MES'::text])))
);


--
-- TOC entry 283 (class 1259 OID 237596)
-- Name: horarios_id_horario_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.horarios_id_horario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 283
-- Name: horarios_id_horario_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.horarios_id_horario_seq OWNED BY servicios_educativos.horarios.id_horario;


--
-- TOC entry 278 (class 1259 OID 221254)
-- Name: materia_tree; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.materia_tree (
    id_tree bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    tema character varying(100) NOT NULL,
    subtema character varying(100) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    estado_registro boolean DEFAULT true,
    fecha_modificacion timestamp without time zone DEFAULT now()
);


--
-- TOC entry 277 (class 1259 OID 221253)
-- Name: materia_tree_id_tree_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.materia_tree_id_tree_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 277
-- Name: materia_tree_id_tree_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.materia_tree_id_tree_seq OWNED BY servicios_educativos.materia_tree.id_tree;


--
-- TOC entry 273 (class 1259 OID 204983)
-- Name: paquetes_producto_educativo; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.paquetes_producto_educativo (
    id_paquete bigint NOT NULL,
    nombre_paquete character varying(150) NOT NULL,
    cantidad_horas_paquete integer DEFAULT 1 NOT NULL,
    precio_paquete numeric(12,2) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now(),
    estado_registro boolean DEFAULT true,
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    fecha_modificacion timestamp without time zone DEFAULT now(),
    CONSTRAINT paquetes_producto_educativo_cantidad_horas_paquete_check CHECK ((cantidad_horas_paquete >= 1)),
    CONSTRAINT paquetes_producto_educativo_precio_paquete_check CHECK ((precio_paquete >= (0)::numeric))
);


--
-- TOC entry 272 (class 1259 OID 204982)
-- Name: paquetes_producto_educativo_id_paquete_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.paquetes_producto_educativo_id_paquete_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 272
-- Name: paquetes_producto_educativo_id_paquete_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.paquetes_producto_educativo_id_paquete_seq OWNED BY servicios_educativos.paquetes_producto_educativo.id_paquete;


--
-- TOC entry 271 (class 1259 OID 204935)
-- Name: producto_educativo; Type: TABLE; Schema: servicios_educativos; Owner: -
--

CREATE TABLE servicios_educativos.producto_educativo (
    id_producto_educativo bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    tipo_producto character varying(50) NOT NULL,
    precio_base numeric(12,2),
    lim_sup_estudiantes integer DEFAULT 30 NOT NULL,
    lim_inf_estudiantes integer DEFAULT 1 NOT NULL,
    id_producto_tienda integer,
    link_bibliografia text,
    link_publicidad text,
    fecha_registro timestamp without time zone DEFAULT now(),
    estado_registro boolean DEFAULT true,
    id_usuario bigint,
    id_usuario_modificacion bigint,
    version_registro integer DEFAULT 1,
    fecha_modificacion timestamp without time zone DEFAULT now(),
    CONSTRAINT producto_educativo_precio_base_check CHECK (((precio_base IS NULL) OR (precio_base >= (0)::numeric)))
);


--
-- TOC entry 270 (class 1259 OID 204934)
-- Name: producto_educativo_id_producto_educativo_seq; Type: SEQUENCE; Schema: servicios_educativos; Owner: -
--

CREATE SEQUENCE servicios_educativos.producto_educativo_id_producto_educativo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 270
-- Name: producto_educativo_id_producto_educativo_seq; Type: SEQUENCE OWNED BY; Schema: servicios_educativos; Owner: -
--

ALTER SEQUENCE servicios_educativos.producto_educativo_id_producto_educativo_seq OWNED BY servicios_educativos.producto_educativo.id_producto_educativo;


--
-- TOC entry 300 (class 1259 OID 319548)
-- Name: clase_titulo; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.clase_titulo (
    id_clase_titulo bigint NOT NULL,
    tipo societario.tipo_titulo_societario DEFAULT 'ACCION'::societario.tipo_titulo_societario NOT NULL,
    sub_tipo character varying(60) NOT NULL,
    descripcion text,
    valor_nominal numeric(18,6),
    derechos_voto_por_titulo numeric(18,6) DEFAULT 1.0,
    prioridad_dividendo_bp integer,
    pref_liquidacion_x numeric(18,6),
    es_convertible boolean DEFAULT false,
    es_participante boolean DEFAULT false,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT clase_titulo_derechos_voto_por_titulo_check CHECK ((derechos_voto_por_titulo >= (0)::numeric)),
    CONSTRAINT clase_titulo_valor_nominal_check CHECK (((valor_nominal IS NULL) OR (valor_nominal >= (0)::numeric)))
);


--
-- TOC entry 299 (class 1259 OID 319547)
-- Name: clase_titulo_id_clase_titulo_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.clase_titulo_id_clase_titulo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 299
-- Name: clase_titulo_id_clase_titulo_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.clase_titulo_id_clase_titulo_seq OWNED BY societario.clase_titulo.id_clase_titulo;


--
-- TOC entry 308 (class 1259 OID 319649)
-- Name: dividendo; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.dividendo (
    id_dividendo bigint NOT NULL,
    id_clase_titulo bigint NOT NULL,
    fecha_declaracion date NOT NULL,
    fecha_pago date,
    monto_total numeric(18,6) NOT NULL,
    observaciones text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT dividendo_monto_total_check CHECK ((monto_total >= (0)::numeric))
);


--
-- TOC entry 307 (class 1259 OID 319648)
-- Name: dividendo_id_dividendo_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.dividendo_id_dividendo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 307
-- Name: dividendo_id_dividendo_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.dividendo_id_dividendo_seq OWNED BY societario.dividendo.id_dividendo;


--
-- TOC entry 310 (class 1259 OID 319669)
-- Name: dividendo_pago; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.dividendo_pago (
    id_dividendo_pago bigint NOT NULL,
    id_dividendo bigint NOT NULL,
    id_titular bigint NOT NULL,
    monto_pagado numeric(18,6) NOT NULL,
    fecha_pago_real date,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT dividendo_pago_monto_pagado_check CHECK ((monto_pagado >= (0)::numeric))
);


--
-- TOC entry 309 (class 1259 OID 319668)
-- Name: dividendo_pago_id_dividendo_pago_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.dividendo_pago_id_dividendo_pago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 309
-- Name: dividendo_pago_id_dividendo_pago_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.dividendo_pago_id_dividendo_pago_seq OWNED BY societario.dividendo_pago.id_dividendo_pago;


--
-- TOC entry 302 (class 1259 OID 319568)
-- Name: emision_titulo; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.emision_titulo (
    id_emision bigint NOT NULL,
    id_clase_titulo bigint NOT NULL,
    ronda societario.tipo_ronda DEFAULT 'OTRA'::societario.tipo_ronda,
    instrumento societario.instrumento_emision DEFAULT 'AUMENTO_CAPITAL'::societario.instrumento_emision NOT NULL,
    serie character varying(30),
    fecha_emision date NOT NULL,
    cantidad_autorizada numeric(28,6) NOT NULL,
    cantidad_emitida numeric(28,6) NOT NULL,
    precio_emision numeric(18,6),
    observaciones text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT emision_titulo_cantidad_autorizada_check CHECK ((cantidad_autorizada > (0)::numeric)),
    CONSTRAINT emision_titulo_cantidad_emitida_check CHECK ((cantidad_emitida >= (0)::numeric)),
    CONSTRAINT emision_titulo_check CHECK ((cantidad_emitida <= cantidad_autorizada)),
    CONSTRAINT emision_titulo_precio_emision_check CHECK (((precio_emision IS NULL) OR (precio_emision >= (0)::numeric)))
);


--
-- TOC entry 301 (class 1259 OID 319567)
-- Name: emision_titulo_id_emision_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.emision_titulo_id_emision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 301
-- Name: emision_titulo_id_emision_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.emision_titulo_id_emision_seq OWNED BY societario.emision_titulo.id_emision;


--
-- TOC entry 304 (class 1259 OID 319591)
-- Name: tenencia; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.tenencia (
    id_tenencia bigint NOT NULL,
    id_emision bigint NOT NULL,
    id_titular bigint NOT NULL,
    cantidad numeric(28,6) NOT NULL,
    fecha_adquisicion date NOT NULL,
    origen societario.tipo_origen_tenencia DEFAULT 'EMISION'::societario.tipo_origen_tenencia NOT NULL,
    es_nominativa boolean DEFAULT true,
    observaciones text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT tenencia_cantidad_check CHECK ((cantidad >= (0)::numeric))
);


--
-- TOC entry 303 (class 1259 OID 319590)
-- Name: tenencia_id_tenencia_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.tenencia_id_tenencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 303
-- Name: tenencia_id_tenencia_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.tenencia_id_tenencia_seq OWNED BY societario.tenencia.id_tenencia;


--
-- TOC entry 298 (class 1259 OID 311298)
-- Name: titular; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.titular (
    id_titular bigint NOT NULL,
    id_persona bigint NOT NULL,
    es_beneficial_owner boolean DEFAULT true,
    observaciones text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint
);


--
-- TOC entry 297 (class 1259 OID 311297)
-- Name: titular_id_titular_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.titular_id_titular_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 297
-- Name: titular_id_titular_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.titular_id_titular_seq OWNED BY societario.titular.id_titular;


--
-- TOC entry 306 (class 1259 OID 319619)
-- Name: transferencia_titulo; Type: TABLE; Schema: societario; Owner: -
--

CREATE TABLE societario.transferencia_titulo (
    id_transferencia bigint NOT NULL,
    id_emision bigint NOT NULL,
    id_titular_origen bigint NOT NULL,
    id_titular_destino bigint NOT NULL,
    cantidad numeric(28,6) NOT NULL,
    precio_unitario numeric(18,6),
    fecha_transferencia date NOT NULL,
    motivo text,
    estado_registro character varying(20) DEFAULT 'Activo'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone,
    version_registro integer DEFAULT 1,
    id_usuario_creador bigint,
    id_usuario_modificacion bigint,
    CONSTRAINT transferencia_titulo_cantidad_check CHECK ((cantidad > (0)::numeric)),
    CONSTRAINT transferencia_titulo_check CHECK ((id_titular_origen <> id_titular_destino)),
    CONSTRAINT transferencia_titulo_precio_unitario_check CHECK (((precio_unitario IS NULL) OR (precio_unitario >= (0)::numeric)))
);


--
-- TOC entry 305 (class 1259 OID 319618)
-- Name: transferencia_titulo_id_transferencia_seq; Type: SEQUENCE; Schema: societario; Owner: -
--

CREATE SEQUENCE societario.transferencia_titulo_id_transferencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 305
-- Name: transferencia_titulo_id_transferencia_seq; Type: SEQUENCE OWNED BY; Schema: societario; Owner: -
--

ALTER SEQUENCE societario.transferencia_titulo_id_transferencia_seq OWNED BY societario.transferencia_titulo.id_transferencia;


--
-- TOC entry 4092 (class 2604 OID 327684)
-- Name: departamento id_departamento; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento ALTER COLUMN id_departamento SET DEFAULT nextval('administracion.departamento_id_departamento_seq'::regclass);


--
-- TOC entry 3907 (class 2604 OID 98328)
-- Name: empleado id_empleado; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado ALTER COLUMN id_empleado SET DEFAULT nextval('administracion.empleado_id_empleado_seq'::regclass);


--
-- TOC entry 3913 (class 2604 OID 106533)
-- Name: empleado_posicion_pago id_empleado_posicion; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado_posicion_pago ALTER COLUMN id_empleado_posicion SET DEFAULT nextval('administracion.empleado_posicion_pago_id_empleado_posicion_seq'::regclass);


--
-- TOC entry 4046 (class 2604 OID 303108)
-- Name: empleado_registro_pago id_pago; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado_registro_pago ALTER COLUMN id_pago SET DEFAULT nextval('administracion.empleado_registro_pago_id_pago_seq'::regclass);


--
-- TOC entry 3959 (class 2604 OID 188420)
-- Name: kpi id_kpi; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.kpi ALTER COLUMN id_kpi SET DEFAULT nextval('administracion.kpi_id_kpi_seq'::regclass);


--
-- TOC entry 4036 (class 2604 OID 270341)
-- Name: objetivo_kpi id_objetivo_kpi; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi ALTER COLUMN id_objetivo_kpi SET DEFAULT nextval('administracion.objetivo_kpi_id_objetivo_kpi_seq'::regclass);


--
-- TOC entry 3903 (class 2604 OID 90202)
-- Name: posicion id_posicion; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.posicion ALTER COLUMN id_posicion SET DEFAULT nextval('administracion.posicion_id_posicion_seq'::regclass);


--
-- TOC entry 4108 (class 2604 OID 336073)
-- Name: archivos_transaccion id_archivo; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.archivos_transaccion ALTER COLUMN id_archivo SET DEFAULT nextval('contabilidad.archivos_transaccion_id_archivo_seq'::regclass);


--
-- TOC entry 3899 (class 2604 OID 57358)
-- Name: centro_costo id_centro_costo; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo ALTER COLUMN id_centro_costo SET DEFAULT nextval('contabilidad.centro_costo_id_centro_costo_seq'::regclass);


--
-- TOC entry 4041 (class 2604 OID 294927)
-- Name: centro_costo_mapa id_cc_mapa; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa ALTER COLUMN id_cc_mapa SET DEFAULT nextval('contabilidad.centro_costo_mapa_id_cc_mapa_seq'::regclass);


--
-- TOC entry 3895 (class 2604 OID 49240)
-- Name: concepto_costo id_concepto; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.concepto_costo ALTER COLUMN id_concepto SET DEFAULT nextval('contabilidad.concepto_costo_id_concepto_seq'::regclass);


--
-- TOC entry 3891 (class 2604 OID 49222)
-- Name: cuenta id_cuenta; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta ALTER COLUMN id_cuenta SET DEFAULT nextval('contabilidad.cuenta_id_cuenta_seq'::regclass);


--
-- TOC entry 4102 (class 2604 OID 336002)
-- Name: cuenta_asignacion id_cuenta_asignacion; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion ALTER COLUMN id_cuenta_asignacion SET DEFAULT nextval('contabilidad.cuenta_asignacion_id_cuenta_asignacion_seq'::regclass);


--
-- TOC entry 3887 (class 2604 OID 49200)
-- Name: grupo_cuenta id_grupo_cuenta; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.grupo_cuenta ALTER COLUMN id_grupo_cuenta SET DEFAULT nextval('contabilidad.grupo_cuenta_id_grupo_cuenta_seq'::regclass);


--
-- TOC entry 4122 (class 2604 OID 393226)
-- Name: pago_tutor id_pago_tutor; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor ALTER COLUMN id_pago_tutor SET DEFAULT nextval('contabilidad.pago_tutor_id_pago_tutor_seq'::regclass);


--
-- TOC entry 4131 (class 2604 OID 393251)
-- Name: pago_tutor_detalle id_pago_tutor_detalle; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor_detalle ALTER COLUMN id_pago_tutor_detalle SET DEFAULT nextval('contabilidad.pago_tutor_detalle_id_pago_tutor_detalle_seq'::regclass);


--
-- TOC entry 4097 (class 2604 OID 335876)
-- Name: transaccion id_transaccion; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion ALTER COLUMN id_transaccion SET DEFAULT nextval('contabilidad.transaccion_id_transaccion_seq'::regclass);


--
-- TOC entry 4116 (class 2604 OID 344096)
-- Name: transaccion_movimiento_cuenta id_movimiento; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion_movimiento_cuenta ALTER COLUMN id_movimiento SET DEFAULT nextval('contabilidad.transaccion_movimiento_cuenta_id_movimiento_seq'::regclass);


--
-- TOC entry 3967 (class 2604 OID 204829)
-- Name: deuda id_deuda; Type: DEFAULT; Schema: deuda; Owner: -
--

ALTER TABLE ONLY deuda.deuda ALTER COLUMN id_deuda SET DEFAULT nextval('deuda.deuda_id_deuda_seq'::regclass);


--
-- TOC entry 3974 (class 2604 OID 204859)
-- Name: pago id_pago; Type: DEFAULT; Schema: deuda; Owner: -
--

ALTER TABLE ONLY deuda.pago ALTER COLUMN id_pago SET DEFAULT nextval('deuda.pago_id_pago_seq'::regclass);


--
-- TOC entry 3928 (class 2604 OID 114786)
-- Name: edificio id_edificio; Type: DEFAULT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.edificio ALTER COLUMN id_edificio SET DEFAULT nextval('infraestructura.edificio_id_edificio_seq'::regclass);


--
-- TOC entry 3924 (class 2604 OID 114765)
-- Name: encargado id_asignacion; Type: DEFAULT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.encargado ALTER COLUMN id_asignacion SET DEFAULT nextval('infraestructura.encargado_id_asignacion_seq'::regclass);


--
-- TOC entry 3954 (class 2604 OID 180228)
-- Name: espacio id_espacio; Type: DEFAULT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.espacio ALTER COLUMN id_espacio SET DEFAULT nextval('infraestructura.espacio_id_espacio_seq'::regclass);


--
-- TOC entry 3920 (class 2604 OID 114750)
-- Name: sucursal id_sucursal; Type: DEFAULT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.sucursal ALTER COLUMN id_sucursal SET DEFAULT nextval('infraestructura.sucursal_id_sucursal_seq'::regclass);


--
-- TOC entry 3963 (class 2604 OID 196612)
-- Name: tienda id_tienda; Type: DEFAULT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda ALTER COLUMN id_tienda SET DEFAULT nextval('infraestructura.tienda_id_tienda_seq'::regclass);


--
-- TOC entry 3932 (class 2604 OID 122941)
-- Name: bien id_bien; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien ALTER COLUMN id_bien SET DEFAULT nextval('inventario.bien_id_bien_seq'::regclass);


--
-- TOC entry 3944 (class 2604 OID 123021)
-- Name: bien_instancia id_bien_instancia; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_instancia ALTER COLUMN id_bien_instancia SET DEFAULT nextval('inventario.bien_instancia_id_bien_instancia_seq'::regclass);


--
-- TOC entry 3948 (class 2604 OID 123065)
-- Name: bien_lote id_lote; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_lote ALTER COLUMN id_lote SET DEFAULT nextval('inventario.bien_lote_id_lote_seq'::regclass);


--
-- TOC entry 3952 (class 2604 OID 139286)
-- Name: movimiento_detalle id_movimiento; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.movimiento_detalle ALTER COLUMN id_movimiento SET DEFAULT nextval('inventario.movimiento_detalle_id_movimiento_seq'::regclass);


--
-- TOC entry 4112 (class 2604 OID 344070)
-- Name: estudiante_padre id_asociacion; Type: DEFAULT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.estudiante_padre ALTER COLUMN id_asociacion SET DEFAULT nextval('persona.estudiante_padre_id_asociacion_seq'::regclass);


--
-- TOC entry 3875 (class 2604 OID 49157)
-- Name: persona id_persona; Type: DEFAULT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona ALTER COLUMN id_persona SET DEFAULT nextval('persona.persona_id_persona_seq'::regclass);


--
-- TOC entry 4143 (class 2604 OID 417822)
-- Name: persona_padre id_padre; Type: DEFAULT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_padre ALTER COLUMN id_padre SET DEFAULT nextval('persona.persona_padre_id_padre_seq'::regclass);


--
-- TOC entry 4008 (class 2604 OID 229380)
-- Name: persona_tutor id_tutor; Type: DEFAULT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_tutor ALTER COLUMN id_tutor SET DEFAULT nextval('persona.persona_tutor_id_tutor_seq'::regclass);


--
-- TOC entry 3883 (class 2604 OID 49188)
-- Name: proveedor id_proveedor; Type: DEFAULT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.proveedor ALTER COLUMN id_proveedor SET DEFAULT nextval('persona.proveedor_id_proveedor_seq'::regclass);


--
-- TOC entry 3994 (class 2604 OID 212996)
-- Name: unidad_educativa id_unidad_educativa; Type: DEFAULT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.unidad_educativa ALTER COLUMN id_unidad_educativa SET DEFAULT nextval('persona.unidad_educativa_id_unidad_educativa_seq'::regclass);


--
-- TOC entry 4136 (class 2604 OID 409629)
-- Name: action_log id_action; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.action_log ALTER COLUMN id_action SET DEFAULT nextval('seguridad.action_log_id_action_seq'::regclass);


--
-- TOC entry 4148 (class 2604 OID 442372)
-- Name: permiso id_permiso; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.permiso ALTER COLUMN id_permiso SET DEFAULT nextval('seguridad.permiso_id_permiso_seq'::regclass);


--
-- TOC entry 4152 (class 2604 OID 442385)
-- Name: rol id_rol; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.rol ALTER COLUMN id_rol SET DEFAULT nextval('seguridad.rol_id_rol_seq'::regclass);


--
-- TOC entry 4132 (class 2604 OID 409605)
-- Name: sesion id_sesion; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.sesion ALTER COLUMN id_sesion SET DEFAULT nextval('seguridad.sesion_id_sesion_seq'::regclass);


--
-- TOC entry 4032 (class 2604 OID 262166)
-- Name: asistencia_clase_curso id_asistencia; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.asistencia_clase_curso ALTER COLUMN id_asistencia SET DEFAULT nextval('servicios_educativos.asistencia_clase_curso_id_asistencia_seq'::regclass);


--
-- TOC entry 4026 (class 2604 OID 245786)
-- Name: clase_curso id_clase_curso; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_curso ALTER COLUMN id_clase_curso SET DEFAULT nextval('servicios_educativos.clase_curso_id_clase_curso_seq'::regclass);


--
-- TOC entry 4012 (class 2604 OID 229513)
-- Name: clase_por_hora id_clase; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_por_hora ALTER COLUMN id_clase SET DEFAULT nextval('servicios_educativos.clase_por_hora_id_clase_seq'::regclass);


--
-- TOC entry 4022 (class 2604 OID 237613)
-- Name: curso_version id_curso_version; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.curso_version ALTER COLUMN id_curso_version SET DEFAULT nextval('servicios_educativos.curso_version_id_curso_version_seq'::regclass);


--
-- TOC entry 4018 (class 2604 OID 237600)
-- Name: horarios id_horario; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.horarios ALTER COLUMN id_horario SET DEFAULT nextval('servicios_educativos.horarios_id_horario_seq'::regclass);


--
-- TOC entry 4003 (class 2604 OID 221257)
-- Name: materia_tree id_tree; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.materia_tree ALTER COLUMN id_tree SET DEFAULT nextval('servicios_educativos.materia_tree_id_tree_seq'::regclass);


--
-- TOC entry 3988 (class 2604 OID 204986)
-- Name: paquetes_producto_educativo id_paquete; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.paquetes_producto_educativo ALTER COLUMN id_paquete SET DEFAULT nextval('servicios_educativos.paquetes_producto_educativo_id_paquete_seq'::regclass);


--
-- TOC entry 3981 (class 2604 OID 204938)
-- Name: producto_educativo id_producto_educativo; Type: DEFAULT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.producto_educativo ALTER COLUMN id_producto_educativo SET DEFAULT nextval('servicios_educativos.producto_educativo_id_producto_educativo_seq'::regclass);


--
-- TOC entry 4060 (class 2604 OID 319551)
-- Name: clase_titulo id_clase_titulo; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.clase_titulo ALTER COLUMN id_clase_titulo SET DEFAULT nextval('societario.clase_titulo_id_clase_titulo_seq'::regclass);


--
-- TOC entry 4084 (class 2604 OID 319652)
-- Name: dividendo id_dividendo; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo ALTER COLUMN id_dividendo SET DEFAULT nextval('societario.dividendo_id_dividendo_seq'::regclass);


--
-- TOC entry 4088 (class 2604 OID 319672)
-- Name: dividendo_pago id_dividendo_pago; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo_pago ALTER COLUMN id_dividendo_pago SET DEFAULT nextval('societario.dividendo_pago_id_dividendo_pago_seq'::regclass);


--
-- TOC entry 4068 (class 2604 OID 319571)
-- Name: emision_titulo id_emision; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.emision_titulo ALTER COLUMN id_emision SET DEFAULT nextval('societario.emision_titulo_id_emision_seq'::regclass);


--
-- TOC entry 4074 (class 2604 OID 319594)
-- Name: tenencia id_tenencia; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.tenencia ALTER COLUMN id_tenencia SET DEFAULT nextval('societario.tenencia_id_tenencia_seq'::regclass);


--
-- TOC entry 4055 (class 2604 OID 311301)
-- Name: titular id_titular; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.titular ALTER COLUMN id_titular SET DEFAULT nextval('societario.titular_id_titular_seq'::regclass);


--
-- TOC entry 4080 (class 2604 OID 319622)
-- Name: transferencia_titulo id_transferencia; Type: DEFAULT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.transferencia_titulo ALTER COLUMN id_transferencia SET DEFAULT nextval('societario.transferencia_titulo_id_transferencia_seq'::regclass);


--
-- TOC entry 4898 (class 0 OID 327681)
-- Dependencies: 312
-- Data for Name: departamento; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.departamento VALUES (2, 'DEP-001', 'Administración', 'Funciones demo', NULL, NULL, NULL, true, '2026-01-08', NULL, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO administracion.departamento VALUES (6, 'DEP-002', 'Administración y Finanzas', 'Gestión administrativa y financiera', NULL, NULL, NULL, true, '2026-01-01', NULL, 'Activo', '2026-01-19 23:13:21.364088+00', '2026-01-19 23:14:31.069327+00', 3, 18, 18);


--
-- TOC entry 4829 (class 0 OID 98325)
-- Dependencies: 243
-- Data for Name: empleado; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.empleado VALUES (2, 1, '2026-01-08', NULL, 'INDEFINIDO', 'FULL_TIME', 'empleado@cpa.local', '70000002', NULL, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO administracion.empleado VALUES (3, 45, '2026-01-10', NULL, 'INDEFINIDO', 'FULL_TIME', 'empleado1@empresa.com', '70000001', 9, 'Activo', '2026-01-20 15:08:01.259046+00', '2026-01-20 15:19:38.751465+00', 2, 18, 18);


--
-- TOC entry 4831 (class 0 OID 106530)
-- Dependencies: 245
-- Data for Name: empleado_posicion_pago; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.empleado_posicion_pago VALUES (1, 2, 2, '2026-01-08', NULL, 'SUELDO', 'MENSUAL', 'BOB', NULL, 3000.00, NULL, NULL, NULL, NULL, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO administracion.empleado_posicion_pago VALUES (2, 3, 4, '2026-01-01', NULL, 'SUELDO', 'MENSUAL', 'BOB', NULL, 3500.00, NULL, NULL, NULL, NULL, 'Activo', '2026-01-20 15:22:42.129847+00', NULL, 1, 18, NULL);


--
-- TOC entry 4882 (class 0 OID 303105)
-- Dependencies: 296
-- Data for Name: empleado_registro_pago; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.empleado_registro_pago VALUES (1, '2026-01-08', 3000, 0, 0, 0, 0, NULL, 'Pago demo', 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);


--
-- TOC entry 4849 (class 0 OID 188417)
-- Dependencies: 263
-- Data for Name: kpi; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.kpi VALUES (1, 'Asistencia', 'MENSUAL', 'KPI demo', 'Porcentaje', 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO administracion.kpi VALUES (2, 'KPI TEST - Ventas', 'KPI temporal para workflow', 'Bs', 'Mensual', 'Activo', '2026-01-11 21:12:10.152693+00', NULL, 1, 18, NULL);
INSERT INTO administracion.kpi VALUES (4, 'Costos', 'Total costos por mes', 'BOB', 'MENSUAL', 'Activo', '2026-01-20 20:13:17.926651+00', NULL, 1, 18, NULL);
INSERT INTO administracion.kpi VALUES (3, 'Ventas Netas', 'Ventas netas por mes', 'BOB', 'MENSUAL', 'Activo', '2026-01-20 20:12:07.591834+00', '2026-01-20 20:24:26.518154+00', 2, 18, 18);


--
-- TOC entry 4878 (class 0 OID 270338)
-- Dependencies: 292
-- Data for Name: objetivo_kpi; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.objetivo_kpi VALUES (1, 1, '2026-01', 95.0000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO administracion.objetivo_kpi VALUES (2, 2, '2026-01', 10000.0000, 8000.0000, 12000.0000, NULL, NULL, NULL, NULL, NULL, false, 'Activo', '2026-01-11 21:12:10.152693+00', NULL, 1, 18, NULL);
INSERT INTO administracion.objetivo_kpi VALUES (3, 2, '2026-02', 11000.0000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'Activo', '2026-01-11 21:12:10.152693+00', NULL, 1, 18, NULL);
INSERT INTO administracion.objetivo_kpi VALUES (4, 3, '2026-01', 100000.0000, 80000.0000, 120000.0000, 3, 9, NULL, NULL, NULL, false, 'Activo', '2026-01-20 21:08:49.419825+00', NULL, 1, 18, NULL);
INSERT INTO administracion.objetivo_kpi VALUES (5, 3, '2026-02', 120000.0000, 90000.0000, 140000.0000, 3, 9, NULL, NULL, NULL, false, 'Activo', '2026-01-20 21:30:32.788492+00', NULL, 1, 18, NULL);
INSERT INTO administracion.objetivo_kpi VALUES (6, 4, '2026-03', 130000.0000, 95000.0000, 150000.0000, 3, 9, NULL, NULL, NULL, false, 'Activo', '2026-01-20 21:30:32.788492+00', NULL, 1, 18, NULL);


--
-- TOC entry 4827 (class 0 OID 90199)
-- Dependencies: 241
-- Data for Name: posicion; Type: TABLE DATA; Schema: administracion; Owner: -
--

INSERT INTO administracion.posicion VALUES (2, 'POS-001', 'Encargado', NULL, 'Posición demo', 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO administracion.posicion VALUES (4, 'POS-002', 'Jefe de Área Senior', NULL, 'Responsable del área (senior)', 'Activo', '2026-01-19 23:23:18.556351+00', '2026-01-19 23:25:09.939471+00', 3, 18, 18);


--
-- TOC entry 4904 (class 0 OID 336070)
-- Dependencies: 318
-- Data for Name: archivos_transaccion; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4825 (class 0 OID 57355)
-- Dependencies: 239
-- Data for Name: centro_costo; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4880 (class 0 OID 294924)
-- Dependencies: 294
-- Data for Name: centro_costo_mapa; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4823 (class 0 OID 49237)
-- Dependencies: 237
-- Data for Name: concepto_costo; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4821 (class 0 OID 49219)
-- Dependencies: 235
-- Data for Name: cuenta; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

INSERT INTO contabilidad.cuenta VALUES (5, 'WF.TEST.CAJA', 'CAJA (TEST)', 4, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO contabilidad.cuenta VALUES (6, 'WF.TEST.INGRESO', 'INGRESO (TEST)', 4, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO contabilidad.cuenta VALUES (7, '1.0.0', 'DIsponibles (Bs.)', 4, 'Activo', '2026-02-14 20:10:20.988633+00', NULL, 1, 18, NULL);


--
-- TOC entry 4902 (class 0 OID 335999)
-- Dependencies: 316
-- Data for Name: cuenta_asignacion; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4819 (class 0 OID 49197)
-- Dependencies: 233
-- Data for Name: grupo_cuenta; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

INSERT INTO contabilidad.grupo_cuenta VALUES (4, 'WF.TEST.ACTIVO', 'ACTIVO (TEST)', NULL, 'BALANCE', 'ACTIVO', NULL, 1, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO contabilidad.grupo_cuenta VALUES (5, 'ACT', 'Activos', NULL, 'BALANCE', 'ACTIVO', NULL, NULL, 'Activo', '2026-02-14 20:23:26.231579+00', NULL, 1, 18, NULL);


--
-- TOC entry 4910 (class 0 OID 393223)
-- Dependencies: 324
-- Data for Name: pago_tutor; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4912 (class 0 OID 393248)
-- Dependencies: 326
-- Data for Name: pago_tutor_detalle; Type: TABLE DATA; Schema: contabilidad; Owner: -
--



--
-- TOC entry 4900 (class 0 OID 335873)
-- Dependencies: 314
-- Data for Name: transaccion; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

INSERT INTO contabilidad.transaccion VALUES (3, '2026-01-09', 'GENERAL', 'WF_TEST', 'Workflow prueba: transacción + movimientos batch', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL, NULL, NULL);


--
-- TOC entry 4908 (class 0 OID 344093)
-- Dependencies: 322
-- Data for Name: transaccion_movimiento_cuenta; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

INSERT INTO contabilidad.transaccion_movimiento_cuenta VALUES (8, 3, 5, 150, 0, 'ACTIVO', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO contabilidad.transaccion_movimiento_cuenta VALUES (9, 3, 6, 0, 150, 'ACTIVO', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);


--
-- TOC entry 4853 (class 0 OID 204826)
-- Dependencies: 267
-- Data for Name: deuda; Type: TABLE DATA; Schema: deuda; Owner: -
--

INSERT INTO deuda.deuda VALUES (11, 13, 9500.00, 0.1000, 'SIMPLE', NULL, 12, 0.00, 0.00, 'FRANCES', 'MENSUAL', 'VENCIDAS', 'INMEDIATA', NULL, '2026-01-08', 'Actualizada por workflow', '2026-01-08 04:02:24.682108+00', 2);


--
-- TOC entry 4855 (class 0 OID 204856)
-- Dependencies: 269
-- Data for Name: pago; Type: TABLE DATA; Schema: deuda; Owner: -
--

INSERT INTO deuda.pago VALUES (10, 11, '2026-01-08', 150.00, 600.00, 0.00, 0.00, 'Pago ajustado', '2026-01-08 04:02:24.682108+00', 2);


--
-- TOC entry 4837 (class 0 OID 114783)
-- Dependencies: 251
-- Data for Name: edificio; Type: TABLE DATA; Schema: infraestructura; Owner: -
--

INSERT INTO infraestructura.edificio VALUES (8, 8, 'ED-002', 'Edificio Sala', 'Av. Secundaria #456', 'Santa Cruz', 'Santa Cruz', 'Bolivia', -17.783300, -63.182100, 1, 20, 15, NULL, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.edificio VALUES (9, 9, 'ED-001', 'Edificio Principal', 'Av. Principal #500', 'Santa Cruz de la Sierra', 'Santa Cruz', 'Bolivia', -17.783000, -63.182000, 2, 30, 18, NULL, 'Activo', '2026-01-18 03:34:14.534342+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.edificio VALUES (11, 9, 'ED-002', 'Edificio Principal (Actualizado)', 'Av. Principal #501', 'Santa Cruz de la Sierra', 'Santa Cruz', 'Bolivia', -17.783000, -63.182000, 3, 32, 18, NULL, 'Activo', '2026-01-18 03:34:53.582542+00', '2026-01-19 03:02:39.408262+00', 2, 18, 18);


--
-- TOC entry 4835 (class 0 OID 114762)
-- Dependencies: 249
-- Data for Name: encargado; Type: TABLE DATA; Schema: infraestructura; Owner: -
--

INSERT INTO infraestructura.encargado VALUES (1, 8, 2, '2026-01-08', '2026-07-07', 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.encargado VALUES (2, 9, 3, '2026-01-17', '2056-01-17', 'Activo', '2026-01-20 21:48:20.967271+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.encargado VALUES (4, 9, 3, '2026-01-17', '2026-12-31', 'Activo', '2026-01-20 23:42:59.091436+00', '2026-01-20 23:47:37.975425+00', 2, 18, 18);


--
-- TOC entry 4847 (class 0 OID 180225)
-- Dependencies: 261
-- Data for Name: espacio; Type: TABLE DATA; Schema: infraestructura; Owner: -
--

INSERT INTO infraestructura.espacio VALUES (5, 8, 'SALA', 'OFICINA', NULL, false, 'Sala Demo', 1, 25, 9, 7, NULL, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.espacio VALUES (6, 11, 'AULA', NULL, 'TEORIA', true, 'Aula 1 (Actualizada)', 1, 18, 6, 5, 'Se cambió a privada', 'Activo', '2026-01-19 15:52:57.660691+00', '2026-01-19 15:55:12.191565+00', 3, 18, 18);
INSERT INTO infraestructura.espacio VALUES (7, 11, 'SALA', 'REUNION', NULL, true, 'Sala de Reuniones (Actualizada)', 2, 12, 5, 4, 'Se aumentó capacidad', 'Activo', '2026-01-19 15:56:44.736197+00', '2026-01-19 15:57:25.786653+00', 2, 18, 18);
INSERT INTO infraestructura.espacio VALUES (8, 11, 'SALA', 'TIENDA', NULL, false, 'Tienda de Meriendas', 1, 10, 4.5, 3.2, 'Cerca de recepción', 'Activo', '2026-01-19 19:05:15.642875+00', NULL, 1, 18, NULL);


--
-- TOC entry 4833 (class 0 OID 114747)
-- Dependencies: 247
-- Data for Name: sucursal; Type: TABLE DATA; Schema: infraestructura; Owner: -
--

INSERT INTO infraestructura.sucursal VALUES (8, 'SCZ-002', 'Sucursal Sala', '70000001', 'sala@cpa.local', 'Av. Secundaria #456', 'Santa Cruz', 'Santa Cruz', 'Bolivia', 'Lun-Vie 08:00-18:00', 20, 15, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.sucursal VALUES (9, 'SCZ-001', 'Sucursal Equipetrol (Actualizada)', '69000001', 'equipetrol@cpa.com', 'Av. San Martín #124', 'Santa Cruz de la Sierra', 'Santa Cruz', 'Bolivia', 'Lun-Vie 08:00-18:00', 20, 12, 'Activo', '2026-01-18 03:25:13.789718+00', '2026-01-18 03:29:12.970088+00', 2, 18, 18);


--
-- TOC entry 4851 (class 0 OID 196609)
-- Dependencies: 265
-- Data for Name: tienda; Type: TABLE DATA; Schema: infraestructura; Owner: -
--

INSERT INTO infraestructura.tienda VALUES (3, 5, 'T-002', 'Tienda Sala', 'Lun-Vie 09:00-17:00', NULL, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO infraestructura.tienda VALUES (4, 8, 'T-001', 'Tienda de Meriendas (Actualizada)', 'Lun-Sab 10:00-18:00', NULL, 'Activo', '2026-01-19 19:05:15.642875+00', '2026-01-19 19:07:03.057978+00', 2, 18, 18);


--
-- TOC entry 4839 (class 0 OID 122938)
-- Dependencies: 253
-- Data for Name: bien; Type: TABLE DATA; Schema: inventario; Owner: -
--

INSERT INTO inventario.bien VALUES (14, 'SKU-WF-AF-001', 'Laptop Activo Fijo WF', 'Laptop para administración', 'ACTIVO_FIJO', 'Activos', 'Computación', 'unidad', 'unidad', 1.000000, false, false, 'PROM', 5000.0000, NULL, 'BOB', 'Lenovo', 'Legion', NULL, 2.500, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5000.00, 36, 200.00, 'LINEA_RECTA', 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL, false);
INSERT INTO inventario.bien VALUES (13, 'SKU-WF-001', 'Producto Loteable WF (edit)', NULL, 'MERCADERIA', 'Snacks', 'Prote', 'unidad', 'unidad', 1.000000, true, false, 'PROM', 10.5000, 15.00, 'BOB', 'MarcaWF', 'ModeloWF', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Activo', '2026-01-08 04:02:24.682108+00', '2026-01-08 04:02:24.682108+00', 2, 18, 18, true);
INSERT INTO inventario.bien VALUES (15, 'SKU-001', 'Cuaderno A4 100 hojas', 'Cuaderno para clases', 'MERCADERIA', 'Papeleria', 'Cuadernos', 'unidad', 'unidad', 1.000000, true, false, 'PROM', 8.5000, 12.00, 'BOB', 'Norma', 'Clasico', '7891234567890', 0.350, 0.3000, 0.2100, 0.0100, 0.0006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Activo', '2026-01-21 01:29:00.558496+00', '2026-01-21 01:30:54.126154+00', 2, 18, 18, true);


--
-- TOC entry 4841 (class 0 OID 123018)
-- Dependencies: 255
-- Data for Name: bien_instancia; Type: TABLE DATA; Schema: inventario; Owner: -
--

INSERT INTO inventario.bien_instancia VALUES (4, 14, 'Laptop i7 16GB 1TB (edit)', '2026-01-08', 13, 4700.0000, NULL, 'SERIAL-WF-0001', NULL, NULL, 'Activo', '2026-01-08 04:02:24.682108+00', '2026-01-08 04:02:24.682108+00', 2, 18, 18);
INSERT INTO inventario.bien_instancia VALUES (5, 15, 'Laptop i5 16GB (ACT)', '2026-01-20', NULL, 4500.0000, 4500.00, 'SN-ABC-123456-EDIT', '2025-12-01', NULL, 'Activo', '2026-01-21 02:42:23.629914+00', '2026-01-21 14:01:46.20138+00', 3, 18, 18);


--
-- TOC entry 4843 (class 0 OID 123062)
-- Dependencies: 257
-- Data for Name: bien_lote; Type: TABLE DATA; Schema: inventario; Owner: -
--

INSERT INTO inventario.bien_lote VALUES (7, 13, 'LOTE-WF-001', '2026-01-08', 13, 120, 8.2000, 12.50, NULL, NULL, 'Activo', '2026-01-08 04:02:24.682108+00', '2026-01-08 04:02:24.682108+00', 2, 18, 18);
INSERT INTO inventario.bien_lote VALUES (11, 15, 'L-2026-01-EDIT', '2026-01-20', NULL, 55, 8.2000, 8.20, '2026-01-01', '2027-01-01', 'Activo', '2026-01-21 02:09:11.215563+00', '2026-01-21 02:16:01.365704+00', 2, 18, 18);


--
-- TOC entry 4845 (class 0 OID 139283)
-- Dependencies: 259
-- Data for Name: movimiento_detalle; Type: TABLE DATA; Schema: inventario; Owner: -
--

INSERT INTO inventario.movimiento_detalle VALUES (6, 14, NULL, 4, 1.000000, NULL, NULL);
INSERT INTO inventario.movimiento_detalle VALUES (5, 13, 7, NULL, 10.000000, NULL, NULL);
INSERT INTO inventario.movimiento_detalle VALUES (7, 14, NULL, 4, 1.000000, NULL, NULL);
INSERT INTO inventario.movimiento_detalle VALUES (8, 13, 7, NULL, 10.000000, NULL, NULL);
INSERT INTO inventario.movimiento_detalle VALUES (10, 15, 11, NULL, 2.000000, NULL, NULL);
INSERT INTO inventario.movimiento_detalle VALUES (11, 15, NULL, 5, 1.000000, NULL, NULL);


--
-- TOC entry 4906 (class 0 OID 344067)
-- Dependencies: 320
-- Data for Name: estudiante_padre; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.estudiante_padre VALUES (1, 1, 19, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO persona.estudiante_padre VALUES (5, 34, 33, 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.estudiante_padre VALUES (6, 41, 40, 'Activo', '2026-01-17 14:12:48.280425+00', NULL, 1, 18, NULL);


--
-- TOC entry 4814 (class 0 OID 49154)
-- Dependencies: 228
-- Data for Name: persona; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.persona VALUES (1, 'Pablo', 'Arauz', '777377232', '2001-12-07', 'pabliarca@gmail.com', 'Activo', '2025-10-02 23:08:45.357502+00', NULL, 1, NULL, NULL);
INSERT INTO persona.persona VALUES (18, 'Super', 'Admin', '70000001', NULL, 'admin@test.local', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, NULL, NULL);
INSERT INTO persona.persona VALUES (19, 'Estudiante', 'Demo', '70000002', '2010-01-01', 'estudiante@test.local', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (20, 'Tutor', 'Demo', '70000005', NULL, 'tutor@test.local', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, NULL, NULL);
INSERT INTO persona.persona VALUES (21, 'Usuario', 'Demo', '70000006', '2000-01-01', 'usuario@test.local', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (33, 'Estudiante', 'Demo', '70000002', '2010-01-01', 'estudiante@test.local', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (34, 'Padre', 'Demo', '70000003', '1980-01-01', 'padre@test.local', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (35, 'Tutor', 'Demo', '70000005', '1998-01-01', 'tutor@test.local', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (36, 'Usuario', 'Demo', '70000006', '2000-01-01', 'usuario@test.local', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (37, 'Ana', 'Rojas', '70000000', '2012-05-20', 'ana.rojas@mail.com', 'Activo', '2026-01-17 02:47:21.862095+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (40, 'Juan Pablo', 'Rojas', '79999999', '2012-05-20', 'ana.rojas@mail.com', 'Activo', '2026-01-17 13:55:00.199958+00', '2026-01-17 13:56:24.29586+00', 2, 18, 18);
INSERT INTO persona.persona VALUES (41, 'Carlos', 'Gutiérrez', '76000000', '1980-02-15', 'carlos@mail.com', 'Activo', '2026-01-17 13:57:54.633312+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (42, 'Luis', 'Soria', '77000000', '2000-08-10', 'luis@mail.com', 'Activo', '2026-01-17 14:00:32.313495+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (43, 'Ana', 'López', NULL, NULL, 'ana@mail.com', 'Activo', '2026-01-17 14:01:01.53236+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (44, 'Pedro', 'Roca', '70012345', '2001-04-02', 'pedro@mail.com', 'Activo', '2026-01-17 14:14:05.613418+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (38, 'Juan Carlos', 'Pérez', '79999999', '2005-01-15', 'juan.c@mail.com', 'Activo', '2026-01-17 02:48:45.222013+00', '2026-01-18 02:53:23.572262+00', 3, 18, 18);
INSERT INTO persona.persona VALUES (45, 'Juan', 'Perez', '70000000', '2000-05-20', 'juan.perez@gmail.com', 'Activo', '2026-01-20 15:08:01.259046+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (46, 'Nombre de prueba', 'Valor de prueba', '70000001', '2026-05-11', 'usuario.prueba.2@example.com', 'Activo', '2026-05-11 23:55:04.03692+00', NULL, 1, NULL, NULL);
INSERT INTO persona.persona VALUES (47, 'Nombre de prueba', 'Valor de prueba', '70000001', '2026-05-11', 'usuario.prueba.20@example.com', 'Activo', '2026-05-12 13:46:14.063187+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (48, 'Nombre de prueba', 'Valor de prueba', '70000001', '2026-05-11', 'usuario.prueba.20@example.com', 'Activo', '2026-05-12 13:54:05.751371+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (49, 'Nombre de prueba', 'Valor de prueba', '70000001', '2026-05-11', 'usuario.prueba.20@example.com', 'Activo', '2026-05-12 13:57:48.332962+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona VALUES (50, 'Usuario', 'Maestro Prueba', '70000000', '2000-01-01', 'maestro.prueba@cpa.test', 'Activo', '2026-05-16 18:43:14.234756+00', NULL, 1, NULL, NULL);


--
-- TOC entry 4862 (class 0 OID 221184)
-- Dependencies: 276
-- Data for Name: persona_estudiante; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.persona_estudiante VALUES (19, 'EST-001', 11, 'COLEGIAL', 'SECUNDARIA', 'TERCERO', 'MAÑANA', NULL, NULL, '2026-01-07 16:19:37.41041', 18, NULL, 1, true, '2026-01-07 16:19:37.41041');
INSERT INTO persona.persona_estudiante VALUES (33, 'EST-002', 23, 'COLEGIAL', 'SECUNDARIA', 'TERCERO', 'MAÑANA', NULL, NULL, '2026-01-08 16:28:47.939393', 18, NULL, 1, true, '2026-01-08 16:28:47.939393');
INSERT INTO persona.persona_estudiante VALUES (37, 'EST-0001', 11, 'COLEGIAL', 'SECUNDARIA', 'PRIMERO', 'MAÑANA', NULL, NULL, '2026-01-17 02:47:21.862095', 18, NULL, 1, true, '2026-01-17 02:47:21.862095');
INSERT INTO persona.persona_estudiante VALUES (38, 'UNI-0007', 11, 'UNIVERSITARIO', NULL, NULL, NULL, 'Ingeniería Comercial', 2024, '2026-01-17 02:48:45.222013', 18, NULL, 1, true, '2026-01-17 02:48:45.222013');
INSERT INTO persona.persona_estudiante VALUES (40, 'EST-0002', 11, 'COLEGIAL', 'SECUNDARIA', 'PRIMERO', 'TARDE', NULL, NULL, '2026-01-17 13:55:00.199958', 18, 18, 2, true, '2026-01-17 13:56:24.29586');


--
-- TOC entry 4918 (class 0 OID 417819)
-- Dependencies: 333
-- Data for Name: persona_padre; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.persona_padre VALUES (1, false, '{"telefono": "70000003", "nombre_contacto": "Padre Demo"}', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona_padre VALUES (34, false, '{"nota": "Padre Demo"}', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.persona_padre VALUES (41, true, '{"nota": "Referido por campaña"}', 'Activo', '2026-01-17 13:57:54.633312+00', '2026-01-17 13:58:52.967594+00', 3, 18, 18);


--
-- TOC entry 4866 (class 0 OID 229377)
-- Dependencies: 280
-- Data for Name: persona_tutor; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.persona_tutor VALUES (5, 35, 50.00, 'RECLUTA', 'COLEGIAL', 'SECUNDARIA', '2026-01-08 16:28:47.939393', 18, NULL, 1, true, NULL);
INSERT INTO persona.persona_tutor VALUES (7, 43, 80.00, 'EXPERIMENTADO', 'UNIVERSITARIO', NULL, '2026-01-17 14:01:01.53236', 18, NULL, 1, true, NULL);
INSERT INTO persona.persona_tutor VALUES (6, 42, 60.00, 'SENIOR', 'COLEGIAL', 'SECUNDARIA', '2026-01-17 14:00:32.313495', 18, 18, 2, true, '2026-01-17 14:18:56.258208+00');


--
-- TOC entry 4815 (class 0 OID 49166)
-- Dependencies: 229
-- Data for Name: persona_usuario; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.persona_usuario VALUES (1, 'pablo.arauz', '$2a$12$Y/YObRO9Sm/aAacdqRW8jerMexJOeb58ICWYu4ge7.aDEGA1jc0sC', 'ADMIN-SUPERUSER', 'Activo', '2025-10-02 23:08:45.357502+00', '2025-10-03 00:35:24.300161+00', 2, NULL, NULL, false);
INSERT INTO persona.persona_usuario VALUES (21, 'usuario.demo', '$2a$12$./4ei.7Ohy1fYZR.SmutbOIjWTpTx0MNEZA2ueBQwlXAPyuEVT4TK', 'OPERADOR', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL, false);
INSERT INTO persona.persona_usuario VALUES (18, 'admin', '$2a$06$nNxGxLtQ5qbjkn2JWpAZfuzAi58lhVSV1BIJ.mR9r2zpHhvEh3OB2', 'ADMIN', 'Activo', '2026-01-07 16:19:37.41041+00', '2026-01-08 16:28:47.939393+00', 2, NULL, NULL, true);
INSERT INTO persona.persona_usuario VALUES (36, 'usuario.demo_', '$2a$12$Rot0GU7VERhVy8DLWW2gaeUjsoBMptxI7iorrqKxww7IzS5DzIZ4a', 'OPERADOR', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL, false);
INSERT INTO persona.persona_usuario VALUES (44, 'pedro.roca', '$2a$12$.zAfidZ/aoSwgU0xTUKZ1uk8jU1O7bDHwKs/UoFVh/uS4t6KljadW', 'ADMIN', 'Activo', '2026-01-17 14:14:05.613418+00', NULL, 1, 18, NULL, false);
INSERT INTO persona.persona_usuario VALUES (50, 'maestro.prueba', 'e720b546415d9adc8dc7d64ad81b77a772d293d512aaa961a7d1c7f0f1908c0d', 'SUPER_ADMIN', 'Activo', '2026-05-16 18:45:49.649437+00', NULL, 1, NULL, NULL, true);


--
-- TOC entry 4817 (class 0 OID 49185)
-- Dependencies: 231
-- Data for Name: proveedor; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.proveedor VALUES (1, 'Proveedor Demo', 'Snacks', '70000004', 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO persona.proveedor VALUES (13, 'Proveedor Workflow', 'TEST', '70000000', 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO persona.proveedor VALUES (17, 'Proveedor Demo', 'Snacks', '70000004', 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO persona.proveedor VALUES (18, 'Papelería Central', 'OFICINA', '72222222', 'Activo', '2026-01-17 14:04:44.067708+00', '2026-01-17 14:06:23.946763+00', 2, 18, 18);
INSERT INTO persona.proveedor VALUES (19, 'Papelería Central', 'OFICINA', '72111111', 'Activo', '2026-01-21 01:53:40.809176+00', NULL, 1, 18, NULL);


--
-- TOC entry 4861 (class 0 OID 212993)
-- Dependencies: 275
-- Data for Name: unidad_educativa; Type: TABLE DATA; Schema: persona; Owner: -
--

INSERT INTO persona.unidad_educativa VALUES (11, 'Unidad Educativa Demo', NULL, NULL, 'privada', '2026-01-07 16:19:37.41041', 18, NULL, 1, true, '2026-01-07 16:19:37.41041');
INSERT INTO persona.unidad_educativa VALUES (23, 'Unidad Educativa Demo', NULL, NULL, 'privada', '2026-01-08 16:28:47.939393', 18, NULL, 1, true, '2026-01-08 16:28:47.939393');
INSERT INTO persona.unidad_educativa VALUES (24, 'Colegio San Martín (Sede 2)', -17.783300, -63.182100, 'privada', '2026-01-17 14:08:44.678021', 18, 18, 2, true, '2026-01-17 14:10:15.737516');


--
-- TOC entry 4916 (class 0 OID 409626)
-- Dependencies: 331
-- Data for Name: action_log; Type: TABLE DATA; Schema: seguridad; Owner: -
--

INSERT INTO seguridad.action_log VALUES (123, 43, 'CREAR_PROVEEDOR', 'INFO', 'persona', 'proveedor', '{"id_proveedor": 13}', 'workflow', '{"id_actor": 18}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (124, 43, 'CREAR_DEUDA', 'INFO', 'deuda', 'deuda', '{"id_deuda": 11}', 'workflow', '{"tipo_tasa": "SIMPLE", "id_proveedor": 13, "monto_inicial": 10000.00}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (125, 43, 'CREAR_PAGO', 'INFO', 'deuda', 'pago', '{"id_pago": 10}', 'workflow', '{"id_deuda": 11, "fecha_pago": "2026-01-08"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (126, 43, 'CREAR_BIEN', 'INFO', 'inventario', 'bien', '{"id_bien": 13}', 'workflow', '{"sku": "SKU-WF-001", "tipo": "MERCADERIA"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (127, 43, 'CREAR_BIEN_LOTE', 'INFO', 'inventario', 'bien_lote', '{"id_lote": 7}', 'workflow', '{"id_bien": 13, "lote_codigo": "LOTE-WF-001", "cantidad_compra": 13}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (128, 43, 'CREAR_BIEN', 'INFO', 'inventario', 'bien', '{"id_bien": 14}', 'workflow', '{"sku": "SKU-WF-AF-001", "tipo": "ACTIVO_FIJO"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (129, 43, 'CREAR_BIEN_INSTANCIA', 'INFO', 'inventario', 'bien_instancia', '{"id_bien_instancia": 4}', 'workflow', '{"id_bien": 14, "fecha_compra": "2026-01-08"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (130, 43, 'CREAR_MOVIMIENTO_DETALLE', 'INFO', 'inventario', 'movimiento_detalle', '{"id_movimiento": 5}', 'workflow', '{"id_bien": 13, "id_lote": 7, "cantidad": 5, "id_bien_instancia": null}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (131, 43, 'CREAR_MOVIMIENTO_DETALLE', 'INFO', 'inventario', 'movimiento_detalle', '{"id_movimiento": 6}', 'workflow', '{"id_bien": 14, "id_lote": null, "cantidad": 1, "id_bien_instancia": 4}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (132, 43, 'ACTUALIZAR_DEUDA', 'INFO', 'deuda', 'deuda', '{"id_deuda": 11}', 'workflow', '{"tasa_anual": 0.1000, "id_proveedor": 13, "monto_inicial": 9500.00}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (133, 43, 'ACTUALIZAR_PAGO', 'INFO', 'deuda', 'pago', '{"id_pago": 10}', 'workflow', '{"id_deuda": 11, "fecha_pago": "2026-01-08"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (134, 43, 'ACTUALIZAR_BIEN', 'INFO', 'inventario', 'bien', '{"id_bien": 13}', 'workflow', '{"sku": "SKU-WF-001", "tipo": "MERCADERIA"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (135, 43, 'ACTUALIZAR_BIEN_LOTE', 'INFO', 'inventario', 'bien_lote', '{"id_lote": 7}', 'workflow', '{"id_bien": 13, "lote_codigo": "LOTE-WF-001", "cantidad_compra": 13}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (136, 43, 'ACTUALIZAR_BIEN_INSTANCIA', 'INFO', 'inventario', 'bien_instancia', '{"id_bien_instancia": 4}', 'workflow', '{"id_bien": 14, "fecha_compra": "2026-01-08"}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (137, 43, 'ACTUALIZAR_MOVIMIENTO_DETALLE', 'INFO', 'inventario', 'movimiento_detalle', '{"id_movimiento": 5}', 'workflow', '{"id_bien": 13, "id_lote": 7, "cantidad": 10, "id_bien_instancia": null}', true, 'Activo', '2026-01-08 04:02:24.682108+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (138, 46, 'CREAR_SUCURSAL', 'INFO', 'infraestructura', 'sucursal', '{"id_sucursal": 8}', 'dbeaver/do-block', '{"pais": "Bolivia", "email": "sala@cpa.local", "ciudad": "Santa Cruz", "codigo": "SCZ-002", "nombre": "Sucursal Sala", "ancho_m": 15, "largo_m": 20, "telefono": "70000001", "departamento": "Santa Cruz", "horario_texto": "Lun-Vie 08:00-18:00"}', true, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (17, 11, 'CREAR_UNIDAD_EDUCATIVA', 'INFO', 'persona', 'unidad_educativa', '{"id_unidad_educativa": 11}', 'psql-do-workflow', '{"id_actor": 18}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (18, 11, 'CREAR_ESTUDIANTE', 'INFO', 'persona', 'persona_estudiante', '{"id_persona": 19}', 'psql-do-workflow', '{"id_actor": 18, "codigo_estudiante": "EST-001"}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (19, 11, 'CREAR_PADRE', 'INFO', 'persona', 'persona_padre', '{"id_padre": 1}', 'psql-do-workflow', '{"id_actor": 18}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (20, 11, 'ASIGNAR_PADRE_ESTUDIANTE', 'INFO', 'persona', 'estudiante_padre', '{"id_asociacion": 1}', 'psql-do-workflow', '{"id_actor": 18, "id_padre": 1, "id_estudiante": 19}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (21, 11, 'CREAR_PROVEEDOR', 'INFO', 'persona', 'proveedor', '{"id_proveedor": 1}', 'psql-do-workflow', '{"id_actor": 18}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (22, 11, 'CREAR_TUTOR', 'ERROR', 'persona', 'persona_tutor', NULL, 'psql-do-workflow', '{"error": "new row for relation \"persona_tutor\" violates check constraint \"chk_tipo_vs_nivel\"", "id_actor": 18, "sqlstate": "23514", "id_persona": 20}', false, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (23, 11, 'SIGNUP_USUARIO', 'INFO', 'persona', 'persona_usuario', '{"id_persona": 21}', 'psql-do-workflow', '{"creado_por": 18, "tipo_usuario": "OPERADOR", "nombre_usuario": "usuario.demo", "es_super_usuario": false}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (24, 11, 'ASIGNAR_ROL_USUARIO', 'INFO', 'seguridad', 'usuario_rol', '{"id_rol": 3, "id_persona": 21}', 'psql-do-workflow', '{"id_actor": 18, "codigo_rol": "CAJERO"}', true, 'Activo', '2026-01-07 16:19:37.41041+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (139, 46, 'CREAR_EDIFICIO', 'INFO', 'infraestructura', 'edificio', '{"id_edificio": 8}', 'dbeaver/do-block', '{"pisos": 1, "codigo": "ED-002", "nombre": "Edificio Sala", "id_sucursal": 8}', true, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (140, 46, 'CREAR_SALA', 'INFO', 'infraestructura', 'espacio', '{"id_espacio": 5}', 'dbeaver/do-block', '{"piso": 1, "tipo": "SALA", "nombre": "Sala Demo", "capacidad": 25, "es_privada": false, "id_edificio": 8, "categoria_sala": "OFICINA"}', true, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (141, 46, 'CREAR_TIENDA', 'INFO', 'infraestructura', 'tienda', '{"id_tienda": 3}', 'dbeaver/do-block', '{"codigo": "T-002", "nombre": "Tienda Sala", "id_espacio": 5, "id_responsable": null}', true, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (142, 46, 'CREAR_ENCARGADO', 'INFO', 'infraestructura', 'encargado', '{"id_asignacion": 1}', 'dbeaver/do-block', '{"fecha_fin": "2026-07-07", "id_empleado": 2, "id_sucursal": 8, "fecha_inicio": "2026-01-08"}', true, 'Activo', '2026-01-08 15:13:54.183598+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (179, 62, 'CREAR_TENENCIA', 'INFO', 'societario', 'tenencia', '{"id_tenencia": 1}', NULL, '{"cantidad": 50.000000, "id_emision": 1, "id_titular": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (180, 62, 'CREAR_DIVIDENDO', 'INFO', 'societario', 'dividendo', '{"id_dividendo": 1}', NULL, '{"monto_total": 1000.000000, "id_clase_titulo": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (181, 62, 'CREAR_DIVIDENDO_PAGO', 'INFO', 'societario', 'dividendo_pago', '{"id_dividendo_pago": 1}', NULL, '{"id_titular": 1, "id_dividendo": 1, "monto_pagado": 500.000000}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (182, 62, 'CREAR_TRANSFERENCIA_TITULO', 'INFO', 'societario', 'transferencia_titulo', '{"id_transferencia": 1}', NULL, '{"origen": 1, "destino": 2, "cantidad": 10.000000, "id_emision": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (183, 62, 'ACTUALIZAR_CLASE_TITULO', 'INFO', 'societario', 'clase_titulo', '{"id_clase_titulo": 1}', NULL, '{"tipo": "ACCION", "sub_tipo": "ORDINARIA"}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (184, 62, 'ACTUALIZAR_EMISION_TITULO', 'INFO', 'societario', 'emision_titulo', '{"id_emision": 1}', NULL, '{"ronda": "SEED", "instrumento": "AUMENTO_CAPITAL", "id_clase_titulo": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (185, 62, 'ACTUALIZAR_TENENCIA', 'INFO', 'societario', 'tenencia', '{"id_tenencia": 1}', NULL, '{"cantidad": 55.000000, "id_emision": 1, "id_titular": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (186, 62, 'ACTUALIZAR_DIVIDENDO', 'INFO', 'societario', 'dividendo', '{"id_dividendo": 1}', NULL, '{"monto_total": 1100.000000, "id_clase_titulo": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (187, 62, 'ACTUALIZAR_DIVIDENDO_PAGO', 'INFO', 'societario', 'dividendo_pago', '{"id_dividendo_pago": 1}', NULL, '{"id_titular": 1, "id_dividendo": 1, "monto_pagado": 550.000000}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (188, 62, 'ACTUALIZAR_TRANSFERENCIA_TITULO', 'INFO', 'societario', 'transferencia_titulo', '{"id_transferencia": 1}', NULL, '{"origen": 1, "destino": 2, "cantidad": 11.000000, "id_emision": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (55, 31, 'CREAR_DEPARTAMENTO', 'INFO', 'administracion', 'departamento', '{"id_departamento": 2}', 'dbeaver/do-block', '{"codigo": "DEP-001", "nombre": "Administración", "id_sucursal": null}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (56, 31, 'CREAR_POSICION', 'INFO', 'administracion', 'posicion', '{"id_posicion": 2}', 'dbeaver/do-block', '{"codigo": "POS-001", "nombre": "Encargado"}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (57, 31, 'CREAR_EMPLEADO', 'INFO', 'administracion', 'empleado', '{"id_empleado": 2}', 'dbeaver/do-block', '{"id_persona": 1, "id_sucursal": null, "fecha_ingreso": "2026-01-08"}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (58, 31, 'CREAR_EMPLEADO_POSICION_PAGO', 'INFO', 'administracion', 'empleado_posicion_pago', '{"id_empleado_posicion": 1}', 'dbeaver/do-block', '{"id_empleado": 2, "id_posicion": 2, "tipo_esquema_pago": "SUELDO"}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (59, 31, 'CREAR_KPI', 'INFO', 'administracion', 'kpi', '{"id_kpi": 1}', 'dbeaver/do-block', '{"nombre": "Asistencia", "frecuencia": "Porcentaje", "unidad_medida": "KPI demo"}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (60, 31, 'CREAR_OBJETIVO_KPI', 'INFO', 'administracion', 'objetivo_kpi', '{"id_objetivo_kpi": 1}', 'dbeaver/do-block', '{"id_kpi": 1, "periodo": "2026-01", "valor_meta": 95.0000}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (61, 31, 'CREAR_EMPLEADO_REGISTRO_PAGO', 'INFO', 'administracion', 'empleado_registro_pago', '{"id_pago": 1}', 'dbeaver/do-block', '{"fecha_pago": "2026-01-08", "haber_basico_pagado": 3000}', true, 'Activo', '2026-01-08 00:31:32.046438+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (161, 59, 'CREAR_UNIDAD_EDUCATIVA', 'INFO', 'persona', 'unidad_educativa', '{"id_unidad_educativa": 23}', 'psql-do-workflow', '{"id_actor": 18}', true, 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (162, 59, 'ASIGNAR_PADRE_ESTUDIANTE', 'INFO', 'persona', 'estudiante_padre', '{"id_asociacion": 5}', 'psql-do-workflow', '{"id_actor": 18, "id_padre": 34, "id_estudiante": 33}', true, 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (163, 59, 'CREAR_PROVEEDOR', 'INFO', 'persona', 'proveedor', '{"id_proveedor": 17}', 'psql-do-workflow', '{"id_actor": 18}', true, 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (164, 59, 'SIGNUP_USUARIO', 'INFO', 'persona', 'persona_usuario', '{"id_persona": 36}', 'psql-do-workflow', '{"creado_por": 18, "tipo_usuario": "OPERADOR", "nombre_usuario": "usuario.demo_", "es_super_usuario": false}', true, 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (165, 59, 'ASIGNAR_ROL_USUARIO', 'INFO', 'seguridad', 'usuario_rol', '{"id_rol": 3, "id_persona": 36}', 'psql-do-workflow', '{"id_actor": 18, "codigo_rol": "CAJERO"}', true, 'Activo', '2026-01-08 16:28:47.939393+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (166, 60, 'CREAR_MATERIA_TREE', 'INFO', 'servicios_educativos', 'materia_tree', '{"id_tree": 1}', 'dbeaver', '{"tema": "Álgebra", "nombre": "Matemáticas", "subtema": "Ecuaciones"}', true, 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (167, 60, 'ACTUALIZAR_MATERIA_TREE', 'INFO', 'servicios_educativos', 'materia_tree', '{"id_tree": 1}', 'dbeaver', '{"tema": "Álgebra", "nombre": "Matemáticas", "subtema": "Ecuaciones lineales"}', true, 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (168, 60, 'CREAR_HORARIOS', 'INFO', 'servicios_educativos', 'horarios', '{"id_horario": 1}', 'dbeaver', '{"repeticion": "CADA SEMANA"}', true, 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (169, 60, 'CREAR_PRODUCTO_EDUCATIVO', 'INFO', 'servicios_educativos', 'producto_educativo', '{"id_producto_educativo": 1}', 'dbeaver', '{"nombre": "Curso Intensivo Álgebra", "tipo_producto": "CURSO"}', true, 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (170, 60, 'CREAR_CURSO_VERSION', 'INFO', 'servicios_educativos', 'curso_version', '{"id_curso_version": 1}', 'dbeaver', '{"nombre_version": "Versión Enero", "id_producto_educativo": 1}', true, 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (171, 60, 'CREAR_CLASE_POR_HORA', 'INFO', 'servicios_educativos', 'clase_por_hora', '{"id_clase": 1}', 'dbeaver', '{"motivo": "NIVELACIÓN", "id_tutor": 5, "id_estudiante": 19}', true, 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (172, 61, 'CREAR_HORARIOS', 'INFO', 'servicios_educativos', 'horarios', '{"id_horario": 2}', 'dbeaver', '{"repeticion": "CADA SEMANA"}', true, 'Activo', '2026-01-08 16:31:30.148585+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (173, 61, 'CREAR_PRODUCTO_EDUCATIVO', 'INFO', 'servicios_educativos', 'producto_educativo', '{"id_producto_educativo": 2}', 'dbeaver', '{"nombre": "Curso Intensivo Álgebra", "tipo_producto": "CURSO"}', true, 'Activo', '2026-01-08 16:31:30.148585+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (174, 61, 'CREAR_CURSO_VERSION', 'INFO', 'servicios_educativos', 'curso_version', '{"id_curso_version": 2}', 'dbeaver', '{"nombre_version": "Versión Enero", "id_producto_educativo": 2}', true, 'Activo', '2026-01-08 16:31:30.148585+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (175, 62, 'CREAR_TITULAR', 'INFO', 'societario', 'titular', '{"id_titular": 1}', NULL, '{"id_persona": 1, "es_beneficial_owner": true}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (176, 62, 'CREAR_TITULAR', 'INFO', 'societario', 'titular', '{"id_titular": 2}', NULL, '{"id_persona": 18, "es_beneficial_owner": true}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (177, 62, 'CREAR_CLASE_TITULO', 'INFO', 'societario', 'clase_titulo', '{"id_clase_titulo": 1}', NULL, '{"tipo": "ACCION", "sub_tipo": "ORDINARIA"}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (178, 62, 'CREAR_EMISION_TITULO', 'INFO', 'societario', 'emision_titulo', '{"id_emision": 1}', NULL, '{"ronda": "SEED", "instrumento": "AUMENTO_CAPITAL", "id_clase_titulo": 1}', true, 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (209, 70, 'CREAR_GRUPO_CUENTA', 'INFO', 'contabilidad', 'grupo_cuenta', '{"id_grupo_cuenta": 4}', 'workflow-prueba', '{}', true, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (210, 70, 'CREAR_CUENTA', 'INFO', 'contabilidad', 'cuenta', '{"id_cuenta": 5}', 'workflow-prueba', '{}', true, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (211, 70, 'CREAR_CUENTA', 'INFO', 'contabilidad', 'cuenta', '{"id_cuenta": 6}', 'workflow-prueba', '{}', true, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (212, 70, 'CREAR_TRANSACCION', 'INFO', 'contabilidad', 'transaccion', '{"id_transaccion": 3}', 'workflow-prueba', '{}', true, 'Activo', '2026-01-09 20:54:16.742839+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (213, 71, 'CREAR_MOVIMIENTO_DETALLE_BATCH', 'INFO', 'inventario', 'movimiento_detalle', '[7, 8]', 'workflow-inventario', '{"insertados": 2}', true, 'Activo', '2026-01-11 20:57:55.909995+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (214, 72, 'CREAR_OBJETIVO_KPI_BATCH', 'INFO', 'administracion', 'objetivo_kpi', '[2, 3]', 'workflow-objetivo-kpi', '{"insertados": 2}', true, 'Activo', '2026-01-11 21:12:10.152693+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (215, 73, 'USUARIO_EDITAR', 'INFO', 'persona', 'persona_usuario', '{"id_persona": 38}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 02:54:15.051764+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (216, 73, 'USUARIO_SET_ESTADO', 'SECURITY', 'persona', 'persona_usuario', '{"id_persona": 38}', 'PostmanRuntime/7.51.0', '{"id_actor": 18, "estado_registro": "Inactivo"}', true, 'Activo', '2026-01-17 02:57:46.047923+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (217, 73, 'ASIGNAR_ROL_USUARIO', 'INFO', 'seguridad', 'usuario_rol', '{"id_rol": 2, "id_persona": 37}', 'PostmanRuntime/7.51.0', '{"id_actor": 18, "codigo_rol": "ACADEMICO"}', true, 'Activo', '2026-01-17 03:04:25.970698+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (218, 73, 'ROL_CREAR_O_UPDATE', 'INFO', 'seguridad', 'rol', '{"id_rol": 6}', 'PostmanRuntime/7.51.0', '{"codigo": "SOPORTE", "id_actor": 18}', true, 'Activo', '2026-01-17 03:07:13.215021+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (219, 73, 'ROL_EDITAR', 'INFO', 'seguridad', 'rol', '{"id_rol": 6}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 03:23:01.930231+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (220, 73, 'ROL_SET_PERMISOS', 'SECURITY', 'seguridad', 'rol_permiso', '{"id_rol": 6}', 'PostmanRuntime/7.51.0', '{"count": 2, "id_actor": 18}', true, 'Activo', '2026-01-17 13:38:29.69627+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (221, 73, 'EDITAR_ESTUDIANTE', 'INFO', 'persona', 'persona_estudiante', '{"id_persona": 40}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 13:56:24.29586+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (223, 73, 'EDITAR_PADRE', 'INFO', 'persona', 'persona_padre', '{"id_padre": 41}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 13:58:39.542416+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (224, 73, 'EDITAR_PADRE', 'ERROR', 'persona', 'persona_padre', NULL, 'PostmanRuntime/7.51.0', '{"error": "Padre no existe (id_padre=40)", "id_actor": 18, "id_padre": 40, "sqlstate": "P0001"}', false, 'Activo', '2026-01-17 13:58:46.206917+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (225, 73, 'EDITAR_PADRE', 'INFO', 'persona', 'persona_padre', '{"id_padre": 41}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 13:58:52.967594+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (226, 73, 'EDITAR_TUTOR', 'ERROR', 'persona', 'persona_tutor', NULL, 'PostmanRuntime/7.51.0', '{"error": "record \"new\" has no field \"fecha_modificacion\"", "id_actor": 18, "id_tutor": 6, "sqlstate": "42703"}', false, 'Activo', '2026-01-17 14:02:23.100323+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (227, 73, 'CREAR_PROVEEDOR', 'INFO', 'persona', 'proveedor', '{"id_proveedor": 18}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 14:04:44.067708+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (228, 73, 'EDITAR_PROVEEDOR', 'INFO', 'persona', 'proveedor', '{"id_proveedor": 18}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 14:06:23.946763+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (229, 73, 'CREAR_UNIDAD_EDUCATIVA', 'INFO', 'persona', 'unidad_educativa', '{"id_unidad_educativa": 24}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 14:08:44.678021+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (231, 73, 'EDITAR_UNIDAD_EDUCATIVA', 'INFO', 'persona', 'unidad_educativa', '{"id_unidad_educativa": 24}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 14:10:15.737516+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (232, 73, 'ASIGNAR_PADRE_ESTUDIANTE', 'INFO', 'persona', 'estudiante_padre', '{"id_asociacion": 6}', 'PostmanRuntime/7.51.0', '{"id_actor": 18, "id_padre": 41, "id_estudiante": 40}', true, 'Activo', '2026-01-17 14:12:48.280425+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (233, 73, 'SIGNUP_USUARIO', 'INFO', 'persona', 'persona_usuario', '{"id_persona": 44}', 'PostmanRuntime/7.51.0', '{"creado_por": 18, "tipo_usuario": "ADMIN", "nombre_usuario": "pedro.roca", "es_super_usuario": false}', true, 'Activo', '2026-01-17 14:14:05.613418+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (234, 73, 'EDITAR_TUTOR', 'INFO', 'persona', 'persona_tutor', '{"id_tutor": 6}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-17 14:18:56.258208+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (235, 75, 'LISTAR_SESIONES', 'INFO', 'seguridad', 'sesion', NULL, 'PostmanRuntime/7.51.0', '{"limit": 100, "offset": 0, "id_actor": 18}', true, 'Activo', '2026-01-18 02:52:33.313263+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (236, 75, 'ASIGNAR_ROL_USUARIO', 'INFO', 'seguridad', 'usuario_rol', '{"id_rol": 2, "id_persona": 37}', 'PostmanRuntime/7.51.0', '{"id_actor": 18, "codigo_rol": "ACADEMICO"}', true, 'Activo', '2026-01-18 02:53:04.891731+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (237, 76, 'EDITAR_USUARIO', 'INFO', 'persona', 'persona_usuario', '{"id_persona": 38}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-18 02:53:23.572262+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (238, 76, 'USUARIO_SET_ESTADO', 'SECURITY', 'persona', 'persona_usuario', '{"id_persona": 38}', 'PostmanRuntime/7.51.0', '{"id_actor": 18, "estado_registro": "Inactivo"}', true, 'Activo', '2026-01-18 02:53:30.688084+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (239, 76, 'LISTAR_USUARIOS', 'INFO', 'persona', 'persona_usuario', NULL, 'PostmanRuntime/7.51.0', '{"q": null, "limit": 50, "offset": 0, "id_actor": 18}', true, 'Activo', '2026-01-18 02:53:38.967413+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (240, 76, 'LISTAR_ROLES', 'INFO', 'seguridad', 'rol', NULL, 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-18 02:53:46.94888+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (241, 76, 'ROL_CREAR_O_UPDATE', 'INFO', 'seguridad', 'rol', '{"id_rol": 6}', 'PostmanRuntime/7.51.0', '{"codigo": "SOPORTE", "id_actor": 18}', true, 'Activo', '2026-01-18 02:53:53.580126+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (242, 76, 'ROL_EDITAR', 'INFO', 'seguridad', 'rol', '{"id_rol": 6}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-18 02:53:58.412638+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (243, 76, 'ROL_SET_PERMISOS', 'SECURITY', 'seguridad', 'rol_permiso', '{"id_rol": 6}', 'PostmanRuntime/7.51.0', '{"count": 2, "id_actor": 18}', true, 'Activo', '2026-01-18 02:54:06.19563+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (244, 76, 'ROL_CREAR_O_UPDATE', 'INFO', 'seguridad', 'rol', '{"id_rol": 8}', 'PostmanRuntime/7.51.0', '{"codigo": "SOPORTE_", "id_actor": 18}', true, 'Activo', '2026-01-18 02:54:40.585835+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (245, 76, 'ROL_EDITAR', 'ERROR', 'seguridad', 'rol', '{"id_rol": 8}', 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"rol_codigo_key\"", "id_actor": 18, "sqlstate": "23505"}', false, 'Activo', '2026-01-18 02:54:49.351013+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (246, 76, 'ROL_EDITAR', 'INFO', 'seguridad', 'rol', '{"id_rol": 8}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-18 02:55:06.167268+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (247, 73, 'LISTAR_LOGS', 'INFO', 'seguridad', 'action_log', NULL, 'PostmanRuntime/7.51.0', '{"limit": 100, "offset": 0, "id_actor": 18}', true, 'Activo', '2026-01-18 02:55:24.729051+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (248, 76, 'LISTAR_LOGS', 'INFO', 'seguridad', 'action_log', NULL, 'PostmanRuntime/7.51.0', '{"limit": 100, "offset": 0, "id_actor": 18}', true, 'Activo', '2026-01-18 02:55:40.655729+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (249, 76, 'CERRAR_SESION', 'SECURITY', 'seguridad', 'sesion', '{"id_sesion_objetivo": 60}', 'PostmanRuntime/7.51.0', '{"ok": true, "id_actor": 18, "tipo_logout": "admin"}', true, 'Activo', '2026-01-18 02:55:47.876879+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (250, 76, 'CERRAR_SESION', 'SECURITY', 'seguridad', 'sesion', '{"id_sesion_objetivo": 60}', 'PostmanRuntime/7.51.0', '{"ok": true, "id_actor": 18, "tipo_logout": "admin"}', true, 'Activo', '2026-01-18 02:56:01.297658+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (251, 76, 'CREAR_SUCURSAL', 'INFO', 'infraestructura', 'sucursal', '{"id_sucursal": 9}', 'PostmanRuntime/7.51.0', '{"pais": "Bolivia", "email": "equipetrol@cpa.com", "ciudad": "Santa Cruz de la Sierra", "codigo": "SCZ-001", "nombre": "Sucursal Equipetrol", "ancho_m": 12, "largo_m": 20, "telefono": "69000000", "departamento": "Santa Cruz", "horario_texto": "Lun-Vie 08:00-18:00"}', true, 'Activo', '2026-01-18 03:25:13.789718+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (252, 75, 'ACTUALIZAR_SUCURSAL', 'INFO', 'infraestructura', 'sucursal', '{"id_sucursal": 9}', 'PostmanRuntime/7.51.0', '{"codigo": "SCZ-001", "nombre": "Sucursal Equipetrol (Actualizada)"}', true, 'Activo', '2026-01-18 03:29:12.970088+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (253, 75, 'CREAR_EDIFICIO', 'INFO', 'infraestructura', 'edificio', '{"id_edificio": 9}', 'PostmanRuntime/7.51.0', '{"pisos": 2, "codigo": "ED-001", "nombre": "Edificio Principal", "id_sucursal": 9}', true, 'Activo', '2026-01-18 03:34:14.534342+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (254, 75, 'CREAR_EDIFICIO', 'ERROR', 'infraestructura', 'edificio', NULL, 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"edificio\" violates foreign key constraint \"edificio_id_sucursal_fkey\"", "codigo": "ED-001", "sqlstate": "23503", "id_sucursal": 11}', false, 'Activo', '2026-01-18 03:34:43.533091+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (255, 75, 'CREAR_EDIFICIO', 'INFO', 'infraestructura', 'edificio', '{"id_edificio": 11}', 'PostmanRuntime/7.51.0', '{"pisos": 2, "codigo": "ED-002", "nombre": "Edificio Principal", "id_sucursal": 9}', true, 'Activo', '2026-01-18 03:34:53.582542+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (256, 76, 'ACTUALIZAR_EDIFICIO', 'ERROR', 'infraestructura', 'edificio', '{"id_edificio": 11}', 'PostmanRuntime/7.51.0', '{"error": "id_sucursal es obligatorio", "sqlstate": "22023", "id_edificio": 11}', false, 'Activo', '2026-01-19 03:00:41.96205+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (257, 76, 'ACTUALIZAR_EDIFICIO', 'ERROR', 'infraestructura', 'edificio', '{"id_edificio": 11}', 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"uq_edificio_sucursal_codigo\"", "sqlstate": "23505", "id_edificio": 11}', false, 'Activo', '2026-01-19 03:01:47.797691+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (258, 76, 'ACTUALIZAR_EDIFICIO', 'INFO', 'infraestructura', 'edificio', '{"id_edificio": 11}', 'PostmanRuntime/7.51.0', '{"codigo": "ED-002", "nombre": "Edificio Principal (Actualizado)", "id_sucursal": 9}', true, 'Activo', '2026-01-19 03:02:39.408262+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (259, 76, 'CREAR_AULA', 'INFO', 'infraestructura', 'espacio', '{"id_espacio": 6}', 'PostmanRuntime/7.51.0', '{"piso": 1, "nombre": "Aula 1", "ancho_m": 5, "largo_m": 6, "capacidad": 20, "tipo_aula": "MULTIUSO", "es_privada": false, "id_edificio": 11}', true, 'Activo', '2026-01-19 15:52:57.660691+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (260, 73, 'ACTUALIZAR_AULA', 'ERROR', 'infraestructura', 'espacio', '{"id_espacio": 6}', 'PostmanRuntime/7.51.0', '{"error": "id_edificio es obligatorio", "sqlstate": "22023", "tipo_aula": "TEORIA", "id_espacio": 6, "id_edificio": null}', false, 'Activo', '2026-01-19 15:54:48.467758+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (261, 73, 'ACTUALIZAR_AULA', 'INFO', 'infraestructura', 'espacio', '{"id_espacio": 6}', 'PostmanRuntime/7.51.0', '{"piso": 1, "tipo": "AULA", "nombre": "Aula 1 (Actualizada)", "ancho_m": 5, "largo_m": 6, "capacidad": 18, "tipo_aula": "TEORIA", "es_privada": true, "id_espacio": 6, "id_edificio": 11}', true, 'Activo', '2026-01-19 15:55:01.000699+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (262, 73, 'ACTUALIZAR_AULA', 'ERROR', 'infraestructura', 'espacio', '{"id_espacio": 6}', 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"espacio\" violates foreign key constraint \"espacio_id_edificio_fkey\"", "sqlstate": "23503", "tipo_aula": "TEORIA", "id_espacio": 6, "id_edificio": 12}', false, 'Activo', '2026-01-19 15:55:06.410296+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (263, 73, 'ACTUALIZAR_AULA', 'INFO', 'infraestructura', 'espacio', '{"id_espacio": 6}', 'PostmanRuntime/7.51.0', '{"piso": 1, "tipo": "AULA", "nombre": "Aula 1 (Actualizada)", "ancho_m": 5, "largo_m": 6, "capacidad": 18, "tipo_aula": "TEORIA", "es_privada": true, "id_espacio": 6, "id_edificio": 11}', true, 'Activo', '2026-01-19 15:55:12.191565+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (264, 76, 'CREAR_SALA', 'INFO', 'infraestructura', 'espacio', '{"id_espacio": 7}', 'PostmanRuntime/7.51.0', '{"piso": 2, "tipo": "SALA", "nombre": "Sala de Reuniones", "capacidad": 10, "es_privada": true, "id_edificio": 11, "categoria_sala": "REUNION"}', true, 'Activo', '2026-01-19 15:56:44.736197+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (265, 76, 'ACTUALIZAR_SALA', 'INFO', 'infraestructura', 'espacio', '{"id_espacio": 7}', 'PostmanRuntime/7.51.0', '{"piso": 2, "tipo": "SALA", "nombre": "Sala de Reuniones (Actualizada)", "ancho_m": 4, "largo_m": 5, "capacidad": 12, "es_privada": true, "id_espacio": 7, "id_edificio": 11, "categoria_sala": "REUNION"}', true, 'Activo', '2026-01-19 15:57:25.786653+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (266, 76, 'CREAR_TIENDA', 'INFO', 'infraestructura', 'tienda', '{"id_tienda": 4}', 'PostmanRuntime/7.51.0', '{"codigo": "T-001", "nombre": "Tienda de Meriendas", "id_espacio": 8, "id_edificio": 11, "horario_texto": "Lun-Sab 09:00-17:00", "id_responsable_in": null, "id_responsable_persona": null}', true, 'Activo', '2026-01-19 19:05:15.642875+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (267, 76, 'ACTUALIZAR_TIENDA', 'INFO', 'infraestructura', 'tienda', '{"id_tienda": 4}', 'PostmanRuntime/7.51.0', '{"codigo": "T-001", "nombre": "Tienda de Meriendas (Actualizada)", "id_espacio": 8, "id_responsable": null}', true, 'Activo', '2026-01-19 19:07:03.057978+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (268, 76, 'CREAR_DEPARTAMENTO', 'ERROR', 'administracion', 'departamento', NULL, 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"uq_dep_codigo\"", "codigo": "DEP-001", "sqlstate": "23505"}', false, 'Activo', '2026-01-19 23:12:38.524034+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (269, 76, 'CREAR_DEPARTAMENTO', 'ERROR', 'administracion', 'departamento', NULL, 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"departamento\" violates foreign key constraint \"departamento_id_sucursal_fkey\"", "codigo": "DEP-002", "sqlstate": "23503"}', false, 'Activo', '2026-01-19 23:12:47.936051+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (270, 76, 'CREAR_DEPARTAMENTO', 'ERROR', 'administracion', 'departamento', NULL, 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"uq_dep_codigo\"", "codigo": "DEP-001", "sqlstate": "23505"}', false, 'Activo', '2026-01-19 23:13:15.59142+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (271, 76, 'CREAR_DEPARTAMENTO', 'INFO', 'administracion', 'departamento', '{"id_departamento": 6}', 'PostmanRuntime/7.51.0', '{"codigo": "DEP-002", "nombre": "Administración", "id_sucursal": 9}', true, 'Activo', '2026-01-19 23:13:21.364088+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (272, 76, 'ACTUALIZAR_DEPARTAMENTO', 'ERROR', 'administracion', 'departamento', '{"id_departamento": 6}', 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"uq_dep_codigo\"", "sqlstate": "23505"}', false, 'Activo', '2026-01-19 23:14:11.908135+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (273, 76, 'ACTUALIZAR_DEPARTAMENTO', 'ERROR', 'administracion', 'departamento', '{"id_departamento": 6}', 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"departamento\" violates foreign key constraint \"departamento_id_sucursal_fkey\"", "sqlstate": "23503"}', false, 'Activo', '2026-01-19 23:14:17.770779+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (274, 76, 'ACTUALIZAR_DEPARTAMENTO', 'INFO', 'administracion', 'departamento', '{"id_departamento": 6}', 'PostmanRuntime/7.51.0', '{"codigo": "DEP-002", "nombre": "Administración y Finanzas"}', true, 'Activo', '2026-01-19 23:14:27.133256+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (275, 76, 'ACTUALIZAR_DEPARTAMENTO', 'INFO', 'administracion', 'departamento', '{"id_departamento": 6}', 'PostmanRuntime/7.51.0', '{"codigo": "DEP-002", "nombre": "Administración y Finanzas"}', true, 'Activo', '2026-01-19 23:14:31.069327+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (276, 76, 'CREAR_POSICION', 'ERROR', 'administracion', 'posicion', NULL, 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"posicion_codigo_key\"", "codigo": "POS-001", "sqlstate": "23505"}', false, 'Activo', '2026-01-19 23:23:14.12246+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (277, 76, 'CREAR_POSICION', 'INFO', 'administracion', 'posicion', '{"id_posicion": 4}', 'PostmanRuntime/7.51.0', '{"codigo": "POS-002", "nombre": "Jefe de Área"}', true, 'Activo', '2026-01-19 23:23:18.556351+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (278, 76, 'CREAR_POSICION', 'ERROR', 'administracion', 'posicion', NULL, 'PostmanRuntime/7.51.0', '{"error": "codigo es obligatorio", "codigo": null, "sqlstate": "22023"}', false, 'Activo', '2026-01-19 23:23:48.593952+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (279, 76, 'CREAR_POSICION', 'ERROR', 'administracion', 'posicion', NULL, 'PostmanRuntime/7.51.0', '{"error": "duplicate key value violates unique constraint \"posicion_codigo_key\"", "codigo": "POS-002", "sqlstate": "23505"}', false, 'Activo', '2026-01-19 23:23:52.369227+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (280, 76, 'ACTUALIZAR_POSICION', 'INFO', 'administracion', 'posicion', '{"id_posicion": 4}', 'PostmanRuntime/7.51.0', '{"codigo": "POS-002", "nombre": "Jefe de Área Senior"}', true, 'Activo', '2026-01-19 23:24:18.000568+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (281, 76, 'ACTUALIZAR_POSICION', 'ERROR', 'administracion', 'posicion', '{"id_posicion": 4}', 'PostmanRuntime/7.51.0', '{"error": "codigo es obligatorio", "sqlstate": "22023"}', false, 'Activo', '2026-01-19 23:24:22.981051+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (282, 76, 'ACTUALIZAR_POSICION', 'INFO', 'administracion', 'posicion', '{"id_posicion": 4}', 'PostmanRuntime/7.51.0', '{"codigo": "POS-002", "nombre": "Jefe de Área Senior"}', true, 'Activo', '2026-01-19 23:25:09.939471+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (284, 76, 'CREAR_EMPLEADO', 'INFO', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"nombres": "Juan", "apellidos": "Perez", "id_persona": 45, "id_sucursal": 9, "fecha_ingreso": "2026-01-10"}', true, 'Activo', '2026-01-20 15:08:01.259046+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (285, 76, 'ACTUALIZAR_EMPLEADO', 'ERROR', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"error": "invalid input value for enum administracion.jornada_laboral: \"TIEMPO_COMPLETO\"", "sqlstate": "22P02"}', false, 'Activo', '2026-01-20 15:16:27.666474+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (286, 76, 'ACTUALIZAR_EMPLEADO', 'ERROR', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"error": "invalid input value for enum administracion.jornada_laboral: \"TIEMPO_COMPLETO\"", "sqlstate": "22P02"}', false, 'Activo', '2026-01-20 15:17:53.428818+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (287, 76, 'ACTUALIZAR_EMPLEADO', 'ERROR', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"error": "id_persona es obligatorio", "sqlstate": "22023"}', false, 'Activo', '2026-01-20 15:18:53.737371+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (288, 76, 'ACTUALIZAR_EMPLEADO', 'ERROR', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"empleado\" violates foreign key constraint \"fgk_id_sucursal\"", "sqlstate": "23503"}', false, 'Activo', '2026-01-20 15:19:04.593657+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (289, 76, 'ACTUALIZAR_EMPLEADO', 'ERROR', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"empleado\" violates foreign key constraint \"fgk_id_sucursal\"", "sqlstate": "23503"}', false, 'Activo', '2026-01-20 15:19:26.781866+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (290, 76, 'ACTUALIZAR_EMPLEADO', 'INFO', 'administracion', 'empleado', '{"id_empleado": 3}', 'PostmanRuntime/7.51.0', '{"id_persona": 45, "fecha_ingreso": "2026-01-10"}', true, 'Activo', '2026-01-20 15:19:38.751465+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (291, 76, 'CREAR_EMPLEADO_POSICION_PAGO', 'ERROR', 'administracion', 'empleado_posicion_pago', NULL, 'PostmanRuntime/7.51.0', '{"error": "invalid input value for enum administracion.tipo_esquema_pago: \"SUELDO_MENSUAL\"", "sqlstate": "22P02", "id_empleado": 3, "id_posicion": 4}', false, 'Activo', '2026-01-20 15:22:24.426269+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (292, 76, 'CREAR_EMPLEADO_POSICION_PAGO', 'INFO', 'administracion', 'empleado_posicion_pago', '{"id_empleado_posicion": 2}', 'PostmanRuntime/7.51.0', '{"id_empleado": 3, "id_posicion": 4, "tipo_esquema_pago": "SUELDO"}', true, 'Activo', '2026-01-20 15:22:42.129847+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (293, 76, 'CREAR_KPI', 'INFO', 'administracion', 'kpi', '{"id_kpi": 3}', 'PostmanRuntime/7.51.0', '{"nombre": "Ventas", "frecuencia": "MENSUAL", "unidad_medida": "BOB"}', true, 'Activo', '2026-01-20 20:12:07.591834+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (294, 76, 'CREAR_KPI', 'INFO', 'administracion', 'kpi', '{"id_kpi": 4}', 'PostmanRuntime/7.51.0', '{"nombre": "Costos", "frecuencia": "MENSUAL", "unidad_medida": "BOB"}', true, 'Activo', '2026-01-20 20:13:17.926651+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (295, 76, 'ACTUALIZAR_KPI', 'INFO', 'administracion', 'kpi', '{"id_kpi": 3}', 'PostmanRuntime/7.51.0', '{"nombre": "Ventas Netas", "frecuencia": "MENSUAL", "unidad_medida": "BOB"}', true, 'Activo', '2026-01-20 20:24:26.518154+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (296, 76, 'CREAR_EMPLEADO_POSICION_PAGO', 'ERROR', 'administracion', 'empleado_posicion_pago', NULL, 'PostmanRuntime/7.51.0', '{"error": "id_empleado es obligatorio", "sqlstate": "22023", "id_empleado": null, "id_posicion": null}', false, 'Activo', '2026-01-20 20:25:05.844414+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (297, 76, 'CREAR_EMPLEADO_POSICION_PAGO', 'ERROR', 'administracion', 'empleado_posicion_pago', NULL, 'PostmanRuntime/7.51.0', '{"error": "id_empleado es obligatorio", "sqlstate": "22023", "id_empleado": null, "id_posicion": null}', false, 'Activo', '2026-01-20 21:06:53.568523+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (298, 76, 'CREAR_OBJETIVO_KPI', 'INFO', 'administracion', 'objetivo_kpi', '{"id_objetivo_kpi": 4}', 'PostmanRuntime/7.51.0', '{"id_kpi": 3, "periodo": "2026-01", "valor_meta": 100000}', true, 'Activo', '2026-01-20 21:08:49.419825+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (299, 76, 'ACTUALIZAR_OBJETIVO_KPI', 'ERROR', 'administracion', 'objetivo_kpi', '{"id_objetivo_kpi": 4}', 'PostmanRuntime/7.51.0', '{"error": "record \"new\" has no field \"id_bien\"", "sqlstate": "42703"}', false, 'Activo', '2026-01-20 21:15:26.33016+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (300, 76, 'CREAR_OBJETIVO_KPI_BATCH', 'INFO', 'administracion', 'objetivo_kpi', '[5, 6]', 'PostmanRuntime/7.51.0', '{"insertados": 2}', true, 'Activo', '2026-01-20 21:30:32.788492+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (301, 76, 'CREAR_ENCARGADO', 'ERROR', 'infraestructura', 'encargado', NULL, 'PostmanRuntime/7.51.0', '{"error": "fecha_fin es obligatorio", "sqlstate": "22023", "id_empleado": 3, "id_sucursal": 9}', false, 'Activo', '2026-01-20 21:47:42.780742+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (302, 76, 'CREAR_ENCARGADO', 'INFO', 'infraestructura', 'encargado', '{"id_asignacion": 2}', 'PostmanRuntime/7.51.0', '{"fecha_fin": "2056-01-17", "id_empleado": 3, "id_sucursal": 9, "fecha_inicio": "2026-01-17"}', true, 'Activo', '2026-01-20 21:48:20.967271+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (303, 76, 'CREAR_ENCARGADO', 'ERROR', 'infraestructura', 'encargado', NULL, 'PostmanRuntime/7.51.0', '{"error": "null value in column \"fecha_fin\" of relation \"encargado\" violates not-null constraint", "sqlstate": "23502", "id_empleado": 2, "id_sucursal": 9}', false, 'Activo', '2026-01-20 23:41:17.837112+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (304, 76, 'CREAR_ENCARGADO', 'INFO', 'infraestructura', 'encargado', '{"id_asignacion": 4}', 'PostmanRuntime/7.51.0', '{"fecha_fin": null, "id_empleado": 2, "id_sucursal": 9, "fecha_inicio": "2026-01-17"}', true, 'Activo', '2026-01-20 23:42:59.091436+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (305, 76, 'ACTUALIZAR_ENCARGADO', 'INFO', 'infraestructura', 'encargado', '{"id_asignacion": 4}', 'PostmanRuntime/7.51.0', '{"fecha_fin": "2026-12-31", "id_empleado": 3, "id_sucursal": 9, "fecha_inicio": "2026-01-17"}', true, 'Activo', '2026-01-20 23:47:37.975425+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (306, 76, 'CREAR_BIEN', 'ERROR', 'inventario', 'bien', NULL, 'PostmanRuntime/7.51.0', '{"sku": "SKU-001", "tipo": "MERCADERIA", "error": "invalid input value for enum inventario.metodo_valuacion: \"PROMEDIO\"", "sqlstate": "22P02"}', false, 'Activo', '2026-01-21 01:28:21.74308+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (307, 76, 'CREAR_BIEN', 'INFO', 'inventario', 'bien', '{"id_bien": 15}', 'PostmanRuntime/7.51.0', '{"sku": "SKU-001", "tipo": "MERCADERIA"}', true, 'Activo', '2026-01-21 01:29:00.558496+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (308, 76, 'ACTUALIZAR_BIEN', 'INFO', 'inventario', 'bien', '{"id_bien": 15}', 'PostmanRuntime/7.51.0', '{"sku": "SKU-001", "tipo": "MERCADERIA"}', true, 'Activo', '2026-01-21 01:30:54.126154+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (309, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:32:54.445266+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (310, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:38:10.962474+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (311, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:44:04.556489+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (312, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:45:09.309159+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (313, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:46:45.721256+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (314, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:48:27.121759+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (315, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:52:06.859715+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (316, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"bien_lote\" violates foreign key constraint \"bien_lote_id_proveedor_compra_fkey\"", "id_bien": 15, "sqlstate": "23503", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:52:42.917081+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (317, 73, 'CREAR_PROVEEDOR', 'INFO', 'persona', 'proveedor', '{"id_proveedor": 19}', 'PostmanRuntime/7.51.0', '{"id_actor": 18}', true, 'Activo', '2026-01-21 01:53:40.809176+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (318, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"bien_lote\" violates foreign key constraint \"bien_lote_id_proveedor_compra_fkey\"", "id_bien": 15, "sqlstate": "23503", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:53:57.954899+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (319, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "cantidad_compra debe ser > 0", "id_bien": 15, "sqlstate": "22023", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:54:49.164292+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (320, 76, 'CREAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', NULL, 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"bien_lote\" violates foreign key constraint \"bien_lote_id_proveedor_compra_fkey\"", "id_bien": 15, "sqlstate": "23503", "lote_codigo": "L-2026-01"}', false, 'Activo', '2026-01-21 01:58:51.756478+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (321, 76, 'CREAR_BIEN_LOTE', 'INFO', 'inventario', 'bien_lote', '{"id_lote": 11}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "lote_codigo": "L-2026-01", "cantidad_compra": 50, "id_proveedor_compra": 19}', true, 'Activo', '2026-01-21 02:09:11.215563+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (322, 76, 'ACTUALIZAR_BIEN_LOTE', 'ERROR', 'inventario', 'bien_lote', '{"id_lote": 11}', 'PostmanRuntime/7.51.0', '{"error": "id_bien es obligatorio", "sqlstate": "22023"}', false, 'Activo', '2026-01-21 02:15:41.573954+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (323, 76, 'ACTUALIZAR_BIEN_LOTE', 'INFO', 'inventario', 'bien_lote', '{"id_lote": 11}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "lote_codigo": "L-2026-01-EDIT", "cantidad_compra": 55, "id_proveedor_compra": null}', true, 'Activo', '2026-01-21 02:16:01.365704+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (324, 76, 'CREAR_BIEN_INSTANCIA', 'INFO', 'inventario', 'bien_instancia', '{"id_bien_instancia": 5}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "fecha_compra": "2026-01-20"}', true, 'Activo', '2026-01-21 02:42:23.629914+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (325, 76, 'ACTUALIZAR_BIEN_INSTANCIA', 'INFO', 'inventario', 'bien_instancia', '{"id_bien_instancia": 5}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "fecha_compra": "2026-01-20"}', true, 'Activo', '2026-01-21 02:45:21.178691+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (326, 76, 'CREAR_MOVIMIENTO_DETALLE', 'ERROR', 'inventario', 'movimiento_detalle', NULL, 'PostmanRuntime/7.51.0', '{"error": "insert or update on table \"movimiento_detalle\" violates foreign key constraint \"movimiento_detalle_id_lote_fkey\"", "id_bien": 15, "sqlstate": "23503"}', false, 'Activo', '2026-01-21 02:48:21.647503+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (327, 76, 'CREAR_MOVIMIENTO_DETALLE', 'INFO', 'inventario', 'movimiento_detalle', '{"id_movimiento": 10}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "id_lote": 11, "cantidad": 2, "id_bien_instancia": null}', true, 'Activo', '2026-01-21 02:49:14.747306+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (329, 76, 'CREAR_MOVIMIENTO_DETALLE', 'INFO', 'inventario', 'movimiento_detalle', '{"id_movimiento": 11}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "id_lote": null, "cantidad": 1, "id_bien_instancia": 5}', true, 'Activo', '2026-01-21 02:49:45.684464+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (330, 76, 'ACTUALIZAR_BIEN_INSTANCIA', 'INFO', 'inventario', 'bien_instancia', '{"id_bien_instancia": 5}', 'PostmanRuntime/7.51.0', '{"id_bien": 15, "fecha_compra": "2026-01-20"}', true, 'Activo', '2026-01-21 14:01:46.20138+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (341, 77, 'OBTENER_GRUPO_CUENTA', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-13 20:25:56.008363+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (342, 78, 'OBTENER_GRUPO_CUENTA', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-13 20:35:19.181328+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (343, 78, 'OBTENER_GRUPO_CUENTA', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-13 20:41:41.795266+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (344, 78, 'LISTAR_GRUPOS_CUENTA', 'INFO', 'contabilidad', 'grupo_cuenta', '{"count": 1, "limit": 50, "offset": 0}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-13 20:41:41.795266+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (345, 78, 'OBTENER_GRUPO_CUENTA', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-13 20:43:02.315369+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (346, 78, 'LISTAR_GRUPOS_CUENTA', 'INFO', 'contabilidad', 'grupo_cuenta', '{"count": 1, "limit": 50, "offset": 0}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-13 20:43:02.315369+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (347, 78, 'OBTENER_GRUPO_CUENTA', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-13 20:43:08.47293+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (348, 78, 'LISTAR_GRUPOS_CUENTA', 'INFO', 'contabilidad', 'grupo_cuenta', '{"count": 1, "limit": 50, "offset": 0}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-13 20:43:08.47293+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (349, 78, 'OBTENER_GRUPO_CUENTA', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-14 18:30:24.451869+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (350, 78, 'LISTAR_GRUPOS_CUENTA', 'INFO', 'contabilidad', 'grupo_cuenta', '{"count": 1, "limit": 50, "offset": 0}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-14 18:30:24.451869+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (351, 78, 'CREAR_CUENTA', 'INFO', 'contabilidad', 'cuenta', '{"id_cuenta": 7}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-14 20:10:20.988633+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (352, 78, 'LISTAR_CUENTAS', 'INFO', NULL, NULL, NULL, NULL, '{"limit": 50, "offset": 0}', true, 'Activo', '2026-02-14 20:16:42.762898+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (353, 78, 'LISTAR_CUENTAS', 'INFO', 'contabilidad', 'cuenta', '{"count": 3, "limit": 50, "offset": 0}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-14 20:16:42.762898+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (356, 78, 'CREAR_GRUPO_CUENTA', 'INFO', 'contabilidad', 'grupo_cuenta', '{"id_grupo_cuenta": 5}', 'PostmanRuntime/7.51.1', '{}', true, 'Activo', '2026-02-14 20:23:26.231579+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (357, 81, 'AUTH.LOGIN.CREATE', 'INFO', 'auth', 'login', '{"id": "login"}', 'PostmanRuntime/7.53.0', '{"request": {"ip": "::1", "body": {"email": "maestro.prueba@cpa.test", "password": "[REDACTED]"}, "path": "/api/auth/publicAuth/login", "user": null, "query": {}, "method": "POST", "params": {}, "requestId": "90430315-b036-47b0-870e-28d67debf0a2", "permission": null}, "response": {"message": "Login exitoso.", "success": true, "statusCode": 200}}', true, 'Activo', '2026-05-16 18:51:34.56002+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.action_log VALUES (358, 81, 'AUTH.ACTIVATE_USER.CREATE', 'ERROR', 'auth', 'activate_user', '{"id": "activate-user"}', 'PostmanRuntime/7.53.0', '{"request": {"ip": "::1", "path": "/api/auth/publicAuth/activate-user", "user": null, "query": {}, "method": "POST", "params": {}, "requestId": "ed0e649e-9906-4f10-b60b-1a44b58dc3a8", "permission": null}, "response": {"message": "Datos inválidos.", "success": false, "statusCode": 400}}', false, 'Activo', '2026-05-16 19:04:20.62765+00', NULL, 1, 18, NULL);


--
-- TOC entry 4920 (class 0 OID 442369)
-- Dependencies: 335
-- Data for Name: permiso; Type: TABLE DATA; Schema: seguridad; Owner: -
--

INSERT INTO seguridad.permiso VALUES (1, 'SISTEMA.USUARIOS.VER', 'Ver usuarios', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (2, 'SISTEMA.USUARIOS.CREAR', 'Crear usuarios', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (3, 'SISTEMA.USUARIOS.EDITAR', 'Editar usuarios', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (4, 'SISTEMA.USUARIOS.DESACTIVAR', 'Activar/Desactivar usuarios', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (5, 'SISTEMA.ROLES.VER', 'Ver roles y permisos', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (6, 'SISTEMA.ROLES.GESTIONAR', 'Crear/editar roles y asignar permisos', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (7, 'SISTEMA.USUARIOS.ASIGNAR_ROL', 'Asignar roles a usuarios', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (8, 'SISTEMA.LOGS.VER', 'Ver action_log', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (9, 'SISTEMA.SESIONES.VER', 'Ver sesiones', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (10, 'SISTEMA.SESIONES.CERRAR', 'Forzar cierre de sesiones', 'SISTEMA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (11, 'PERSONA.PERSONAS.VER', 'Ver personas', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (12, 'PERSONA.PERSONAS.CREAR', 'Crear personas', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (13, 'PERSONA.PERSONAS.EDITAR', 'Editar personas', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (14, 'PERSONA.ESTUDIANTES.VER', 'Ver estudiantes', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (15, 'PERSONA.ESTUDIANTES.CREAR', 'Registrar estudiantes', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (16, 'PERSONA.ESTUDIANTES.EDITAR', 'Editar estudiantes', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (17, 'PERSONA.TUTORES.VER', 'Ver tutores', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (18, 'PERSONA.TUTORES.CREAR', 'Registrar tutores', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (19, 'PERSONA.TUTORES.EDITAR', 'Editar tutores', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (20, 'PERSONA.PROVEEDORES.VER', 'Ver proveedores', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (21, 'PERSONA.PROVEEDORES.CREAR', 'Crear proveedores', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (22, 'PERSONA.PROVEEDORES.EDITAR', 'Editar proveedores', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (23, 'PERSONA.UNIDAD_EDUCATIVA.VER', 'Ver unidades educativas', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (24, 'PERSONA.UNIDAD_EDUCATIVA.CREAR', 'Crear unidades educativas', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (25, 'PERSONA.UNIDAD_EDUCATIVA.EDITAR', 'Editar unidades educativas', 'PERSONA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (26, 'INFRA.EDIFICIO.VER', 'Ver edificios', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (27, 'INFRA.EDIFICIO.CREAR', 'Crear edificios', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (28, 'INFRA.EDIFICIO.EDITAR', 'Editar edificios', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (29, 'INFRA.SUCURSAL.VER', 'Ver sucursales', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (30, 'INFRA.SUCURSAL.CREAR', 'Crear sucursales', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (31, 'INFRA.SUCURSAL.EDITAR', 'Editar sucursales', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (32, 'INFRA.ESPACIO.VER', 'Ver espacios (AULA/SALA)', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (33, 'INFRA.ESPACIO.CREAR', 'Crear espacios (AULA/SALA)', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (34, 'INFRA.ESPACIO.EDITAR', 'Editar espacios (AULA/SALA)', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (35, 'INFRA.ESPACIO.DESACTIVAR', 'Activar/Desactivar espacios', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (36, 'INFRA.TIENDA.VER', 'Ver tiendas', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (37, 'INFRA.TIENDA.CREAR', 'Crear tiendas', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (38, 'INFRA.TIENDA.EDITAR', 'Editar tiendas', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (39, 'INFRA.TIENDA.DESACTIVAR', 'Activar/Desactivar tiendas', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (40, 'INFRA.ENCARGADO.VER', 'Ver encargados por sucursal', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (41, 'INFRA.ENCARGADO.CREAR', 'Asignar encargado a sucursal', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (42, 'INFRA.ENCARGADO.EDITAR', 'Editar asignación de encargado', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (43, 'INFRA.ENCARGADO.DESACTIVAR', 'Activar/Desactivar asignación de encargado', 'INFRA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (44, 'ACADEMICO.MATERIA_TREE.VER', 'Ver árbol de materias', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (45, 'ACADEMICO.MATERIA_TREE.EDITAR', 'Editar árbol de materias', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (46, 'ACADEMICO.HORARIOS.VER', 'Ver horarios', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (47, 'ACADEMICO.HORARIOS.GESTIONAR', 'Crear/editar horarios', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (48, 'ACADEMICO.CURSOS.VER', 'Ver cursos/versiones', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (49, 'ACADEMICO.CURSOS.GESTIONAR', 'Gestionar cursos/versiones', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (50, 'ACADEMICO.CLASES.VER', 'Ver clases', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (51, 'ACADEMICO.CLASES.REGISTRAR', 'Registrar/agendar clases', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (52, 'ACADEMICO.CLASES.EDITAR', 'Editar clases', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (53, 'ACADEMICO.CLASES.CANCELAR', 'Cancelar clases', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (54, 'ACADEMICO.ASISTENCIA.REGISTRAR', 'Registrar asistencia', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (55, 'ACADEMICO.ASISTENCIA.VER', 'Ver asistencia', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (56, 'ACADEMICO.PRODUCTO.VER', 'Ver productos educativos', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (57, 'ACADEMICO.PRODUCTO.GESTIONAR', 'Gestionar productos educativos', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (58, 'ACADEMICO.PAQUETES.VER', 'Ver paquetes', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (59, 'ACADEMICO.PAQUETES.GESTIONAR', 'Gestionar paquetes', 'ACADEMICO', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (60, 'CAJA.DEUDA.VER', 'Ver deudas', 'CAJA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (61, 'CAJA.DEUDA.CREAR', 'Crear deuda', 'CAJA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (62, 'CAJA.DEUDA.EDITAR', 'Editar deuda', 'CAJA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (63, 'CAJA.PAGO.REGISTRAR', 'Registrar pago', 'CAJA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (64, 'CAJA.PAGO.ANULAR', 'Anular pago', 'CAJA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (65, 'CAJA.PAGO.VER', 'Ver pagos', 'CAJA', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (66, 'CONTAB.CUENTAS.VER', 'Ver plan de cuentas', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (67, 'CONTAB.CUENTAS.GESTIONAR', 'Gestionar plan de cuentas', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (68, 'CONTAB.CENTRO_COSTO.VER', 'Ver centro de costo', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (69, 'CONTAB.CENTRO_COSTO.GESTIONAR', 'Gestionar centro de costo', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (70, 'CONTAB.TRANSACCION.VER', 'Ver transacciones', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (71, 'CONTAB.TRANSACCION.REGISTRAR', 'Registrar transacciones', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (72, 'CONTAB.TRANSACCION.ANULAR', 'Anular transacciones', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (73, 'CONTAB.PAGO_TUTOR.VER', 'Ver pagos a tutores', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (74, 'CONTAB.PAGO_TUTOR.GESTIONAR', 'Gestionar pagos a tutores', 'CONTAB', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (75, 'INV.BIEN.VER', 'Ver bienes/productos', 'INV', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (76, 'INV.BIEN.GESTIONAR', 'Crear/editar bienes/productos', 'INV', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (77, 'INV.MOVIMIENTO.REGISTRAR', 'Registrar movimientos de inventario', 'INV', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (78, 'INV.MOVIMIENTO.VER', 'Ver movimientos de inventario', 'INV', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (79, 'ADMIN.EMPLEADO.VER', 'Ver empleados', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (80, 'ADMIN.EMPLEADO.GESTIONAR', 'Gestionar empleados', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (81, 'ADMIN.KPI.VER', 'Ver KPIs/Objetivos', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (82, 'ADMIN.KPI.GESTIONAR', 'Gestionar KPIs/Objetivos', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (83, 'ADMIN.DEPARTAMENTO.VER', 'Ver departamentos', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (84, 'ADMIN.DEPARTAMENTO.GESTIONAR', 'Gestionar departamentos', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (85, 'ADMIN.POSICION.VER', 'Ver posiciones', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (86, 'ADMIN.POSICION.GESTIONAR', 'Gestionar posiciones', 'ADMIN', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (87, 'SOC.TITULOS.VER', 'Ver información societaria', 'SOC', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (88, 'SOC.TITULOS.GESTIONAR', 'Gestionar información societaria', 'SOC', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (89, 'PERSONA.PADRES.VER', 'Ver padres', 'PERSONA', 'Activo', '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (90, 'PERSONA.PADRES.CREAR', 'Crear padres', 'PERSONA', 'Activo', '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (91, 'PERSONA.PADRES.EDITAR', 'Editar padres', 'PERSONA', 'Activo', '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (92, 'PERSONA.ESTUDIANTE_PADRE.VER', 'Ver relación estudiante-padre', 'PERSONA', 'Activo', '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.permiso VALUES (93, 'PERSONA.ESTUDIANTE_PADRE.GESTIONAR', 'Gestionar relación estudiante-padre', 'PERSONA', 'Activo', '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);


--
-- TOC entry 4922 (class 0 OID 442382)
-- Dependencies: 337
-- Data for Name: rol; Type: TABLE DATA; Schema: seguridad; Owner: -
--

INSERT INTO seguridad.rol VALUES (1, 'ADMIN_GENERAL', 'Administrador General', 'Acceso total vía RBAC (más bypass por superusuario si aplica)', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol VALUES (2, 'ACADEMICO', 'Académico', 'Gestiona estudiantes/tutores/cursos/clases/horarios/espacios', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol VALUES (3, 'CAJERO', 'Cajero', 'Gestiona deudas y pagos', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol VALUES (4, 'CONTADOR', 'Contador', 'Gestiona contabilidad y conciliación', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol VALUES (5, 'TIENDA', 'Tienda/Inventario', 'Gestiona tiendas e inventario', 'Activo', '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol VALUES (6, 'SOPORTE', 'Soporte TI', 'Actualizado', 'Activo', '2026-01-17 03:07:13.215021+00', '2026-01-18 02:53:58.412638+00', 4, 18, 18);
INSERT INTO seguridad.rol VALUES (8, 'SOPORTE__', 'Soporte TI', 'Actualizado', 'Activo', '2026-01-18 02:54:40.585835+00', '2026-01-18 02:55:06.167268+00', 2, 18, 18);


--
-- TOC entry 4923 (class 0 OID 442394)
-- Dependencies: 338
-- Data for Name: rol_permiso; Type: TABLE DATA; Schema: seguridad; Owner: -
--

INSERT INTO seguridad.rol_permiso VALUES (1, 1, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 2, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 3, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 4, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 5, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 6, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 7, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 8, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 9, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 10, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 11, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 12, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 13, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 14, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 15, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 16, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 17, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 18, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 19, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 20, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 21, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 22, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 23, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 24, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 25, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 26, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 27, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 28, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 29, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 30, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 31, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 32, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 33, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 34, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 35, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 36, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 37, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 38, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 39, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 40, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 41, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 42, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 43, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 44, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 45, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 46, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 47, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 48, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 49, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 50, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 51, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 52, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 53, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 54, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 55, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 56, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 57, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 58, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 59, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 60, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 61, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 62, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 63, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 64, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 65, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 66, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 67, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 68, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 69, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 70, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 71, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 72, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 73, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 74, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 75, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 76, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 77, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 78, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 79, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 80, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 81, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 82, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 83, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 84, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 85, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 86, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 87, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 88, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 11, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 12, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 13, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 14, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 15, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 16, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 17, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 18, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 19, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 23, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 32, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 33, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 34, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 35, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 44, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 45, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 46, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 47, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 48, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 49, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 50, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 51, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 52, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 53, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 54, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 55, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 56, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 57, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 58, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 59, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 14, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 20, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 60, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 61, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 62, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 63, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 64, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (3, 65, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 17, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 50, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 55, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 60, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 65, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 66, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 67, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 68, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 69, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 70, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 71, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 72, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 73, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (4, 74, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 26, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 29, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 32, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 36, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 37, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 38, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 39, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 75, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 76, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 77, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (5, 78, '2026-01-06 20:31:01.593231+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 89, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 90, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 91, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 92, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (1, 93, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 89, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 90, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 91, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 92, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (2, 93, '2026-01-07 03:19:32.186308+00', NULL, 1, NULL, NULL);
INSERT INTO seguridad.rol_permiso VALUES (6, 1, '2026-01-18 02:54:06.19563+00', NULL, 1, 18, NULL);
INSERT INTO seguridad.rol_permiso VALUES (6, 8, '2026-01-18 02:54:06.19563+00', NULL, 1, 18, NULL);


--
-- TOC entry 4914 (class 0 OID 409602)
-- Dependencies: 329
-- Data for Name: sesion; Type: TABLE DATA; Schema: seguridad; Owner: -
--

INSERT INTO seguridad.sesion VALUES (59, 18, '127.0.0.1', 'psql-do-workflow', 'bootstrap', NULL, '2026-01-08 16:28:47.939393+00', NULL, true, '{"workflow": "persona-core-api-test"}');
INSERT INTO seguridad.sesion VALUES (11, 18, '127.0.0.1', 'psql-do-workflow', 'bootstrap', NULL, '2026-01-07 16:19:37.41041+00', NULL, true, '{"workflow": "rbac"}');
INSERT INTO seguridad.sesion VALUES (70, 18, '127.0.0.1', 'workflow-prueba', 'password', 'workflow', '2026-01-09 20:54:16.742839+00', '2026-01-09 20:54:16.742839+00', true, '{}');
INSERT INTO seguridad.sesion VALUES (71, 18, '127.0.0.1', 'workflow-inventario', 'password', 'workflow', '2026-01-11 20:57:55.909995+00', '2026-01-11 20:57:55.909995+00', true, '{}');
INSERT INTO seguridad.sesion VALUES (72, 18, '127.0.0.1', 'workflow-objetivo-kpi', 'password', 'workflow', '2026-01-11 21:12:10.152693+00', '2026-01-11 21:12:10.152693+00', true, '{}');
INSERT INTO seguridad.sesion VALUES (73, 18, '127.0.0.1', 'PostmanRuntime/7.51.0', 'password', NULL, '2026-01-17 02:15:32.238206+00', NULL, true, '{"from": "postman"}');
INSERT INTO seguridad.sesion VALUES (74, 18, '127.0.0.1', 'PostmanRuntime/7.51.0', 'password', NULL, '2026-01-17 02:17:24.415246+00', NULL, true, '{"from": "postman"}');
INSERT INTO seguridad.sesion VALUES (31, 18, 'workflow-admin', 'dbeaver/do-block', 'admin', 'admin', '2026-01-08 00:31:32.046438+00', '2026-01-17 13:43:49.866129+00', true, '{"origen": "workflow_administracion"}');
INSERT INTO seguridad.sesion VALUES (61, 18, 'psql-do-workflow', 'dbeaver', 'password', 'admin', '2026-01-08 16:31:30.148585+00', '2026-01-17 13:44:27.493057+00', true, '{}');
INSERT INTO seguridad.sesion VALUES (62, 18, NULL, NULL, 'password', 'admin', '2026-01-08 19:41:27.528019+00', '2026-01-17 13:44:35.170011+00', true, '{}');
INSERT INTO seguridad.sesion VALUES (75, 18, '127.0.0.1', 'PostmanRuntime/7.51.0', 'password', NULL, '2026-01-18 01:09:54.877365+00', NULL, true, '{"from": "postman"}');
INSERT INTO seguridad.sesion VALUES (76, 18, '127.0.0.1', 'PostmanRuntime/7.51.0', 'password', NULL, '2026-01-18 02:53:15.632619+00', NULL, true, '{"from": "postman"}');
INSERT INTO seguridad.sesion VALUES (60, 18, 'psql-do-workflow', 'dbeaver', 'password', 'admin', '2026-01-08 16:29:33.4826+00', '2026-01-17 13:44:55.018968+00', true, '{}');
INSERT INTO seguridad.sesion VALUES (77, 18, '127.0.0.1', 'PostmanRuntime/7.51.1', 'password', NULL, '2026-02-10 21:40:17.094394+00', NULL, true, '{"from": "postman"}');
INSERT INTO seguridad.sesion VALUES (78, 18, '127.0.0.1', 'PostmanRuntime/7.51.1', 'password', NULL, '2026-02-13 20:35:05.70931+00', NULL, true, '{"from": "postman"}');
INSERT INTO seguridad.sesion VALUES (79, 50, '::1', 'PostmanRuntime/7.53.0', 'PASSWORD', NULL, '2026-05-16 18:48:01.431396+00', NULL, true, '{}');
INSERT INTO seguridad.sesion VALUES (80, 50, '::1', 'PostmanRuntime/7.53.0', 'PASSWORD', NULL, '2026-05-16 18:50:17.709606+00', NULL, true, '{}');
INSERT INTO seguridad.sesion VALUES (81, 50, '::1', 'PostmanRuntime/7.53.0', 'PASSWORD', NULL, '2026-05-16 18:51:34.339749+00', NULL, true, '{}');
INSERT INTO seguridad.sesion VALUES (43, 18, '127.0.0.1', 'workflow', 'password', NULL, '2026-01-08 04:02:24.682108+00', NULL, true, '{}');
INSERT INTO seguridad.sesion VALUES (46, 18, 'workflow-infra-sala', 'dbeaver/do-block', 'admin', NULL, '2026-01-08 15:13:54.183598+00', NULL, true, '{"origen": "workflow_infraestructura_sala"}');


--
-- TOC entry 4925 (class 0 OID 442429)
-- Dependencies: 340
-- Data for Name: usuario_permiso; Type: TABLE DATA; Schema: seguridad; Owner: -
--



--
-- TOC entry 4924 (class 0 OID 442410)
-- Dependencies: 339
-- Data for Name: usuario_rol; Type: TABLE DATA; Schema: seguridad; Owner: -
--

INSERT INTO seguridad.usuario_rol VALUES (21, 3, '2026-01-07 16:19:37.41041+00', 'Activo', NULL, 1, 18, NULL);
INSERT INTO seguridad.usuario_rol VALUES (36, 3, '2026-01-08 16:28:47.939393+00', 'Activo', NULL, 1, 18, NULL);
INSERT INTO seguridad.usuario_rol VALUES (37, 2, '2026-01-17 03:04:25.970698+00', 'Activo', '2026-01-18 02:53:04.891731+00', 2, 18, 18);


--
-- TOC entry 4927 (class 0 OID 819201)
-- Dependencies: 344
-- Data for Name: usuario_token_accion; Type: TABLE DATA; Schema: seguridad; Owner: -
--



--
-- TOC entry 4876 (class 0 OID 262163)
-- Dependencies: 290
-- Data for Name: asistencia_clase_curso; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--



--
-- TOC entry 4874 (class 0 OID 245783)
-- Dependencies: 288
-- Data for Name: clase_curso; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--



--
-- TOC entry 4868 (class 0 OID 229510)
-- Dependencies: 282
-- Data for Name: clase_por_hora; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--

INSERT INTO servicios_educativos.clase_por_hora VALUES (1, 5, 19, 5, 1, '2026-01-08 16:29:33.4826', 'NIVELACIÓN', 'PRESENCIAL', 'Activo', '2026-01-08 16:29:33.4826+00', NULL, 1, 18, 18, NULL, 'ABIERTA');


--
-- TOC entry 4872 (class 0 OID 237610)
-- Dependencies: 286
-- Data for Name: curso_version; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--

INSERT INTO servicios_educativos.curso_version VALUES (1, 1, 'Versión Enero', 'Primera edición', '2026-01-08', '2026-02-07', 250.00, 1, '2026-01-08 16:29:33.4826', true, 18, 18, 1);
INSERT INTO servicios_educativos.curso_version VALUES (2, 2, 'Versión Enero', 'Primera edición', '2026-01-08', '2026-02-07', 250.00, 2, '2026-01-08 16:31:30.148585', true, 18, 18, 1);


--
-- TOC entry 4870 (class 0 OID 237597)
-- Dependencies: 284
-- Data for Name: horarios; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--

INSERT INTO servicios_educativos.horarios VALUES (1, 'CADA SEMANA', '08:00:00', NULL, NULL, NULL, NULL, NULL, '10:00:00', NULL, NULL, NULL, NULL, NULL, '2026-01-08 16:29:33.4826', true, 18, 18, 1);
INSERT INTO servicios_educativos.horarios VALUES (2, 'CADA SEMANA', '08:00:00', NULL, NULL, NULL, NULL, NULL, '10:00:00', NULL, NULL, NULL, NULL, NULL, '2026-01-08 16:31:30.148585', true, 18, 18, 1);


--
-- TOC entry 4864 (class 0 OID 221254)
-- Dependencies: 278
-- Data for Name: materia_tree; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--

INSERT INTO servicios_educativos.materia_tree VALUES (1, 'Matemáticas', 'Álgebra', 'Ecuaciones lineales', '2026-01-08 16:29:33.4826', 18, 18, 2, true, '2026-01-08 16:29:33.4826');


--
-- TOC entry 4859 (class 0 OID 204983)
-- Dependencies: 273
-- Data for Name: paquetes_producto_educativo; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--



--
-- TOC entry 4857 (class 0 OID 204935)
-- Dependencies: 271
-- Data for Name: producto_educativo; Type: TABLE DATA; Schema: servicios_educativos; Owner: -
--

INSERT INTO servicios_educativos.producto_educativo VALUES (1, 'Curso Intensivo Álgebra', 'Curso para reforzar álgebra', 'CURSO', 250.00, 30, 1, NULL, NULL, NULL, '2026-01-08 16:29:33.4826', true, 18, 18, 1, '2026-01-08 16:29:33.4826');
INSERT INTO servicios_educativos.producto_educativo VALUES (2, 'Curso Intensivo Álgebra', 'Curso para reforzar álgebra', 'CURSO', 250.00, 30, 1, NULL, NULL, NULL, '2026-01-08 16:31:30.148585', true, 18, 18, 1, '2026-01-08 16:31:30.148585');


--
-- TOC entry 4886 (class 0 OID 319548)
-- Dependencies: 300
-- Data for Name: clase_titulo; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.clase_titulo VALUES (1, 'ACCION', 'ORDINARIA', 'Clase ordinaria (actualizada)', 1.000000, 1.000000, NULL, NULL, false, false, 'Activo', '2026-01-08 19:41:27.528019+00', '2026-01-08 19:41:27.528019+00', 2, 18, 18);


--
-- TOC entry 4894 (class 0 OID 319649)
-- Dependencies: 308
-- Data for Name: dividendo; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.dividendo VALUES (1, 1, '2026-01-08', '2026-02-22', 1100.000000, 'Dividendo actualizado (workflow)', 'Activo', '2026-01-08 19:41:27.528019+00', '2026-01-08 19:41:27.528019+00', 2, 18, 18);


--
-- TOC entry 4896 (class 0 OID 319669)
-- Dependencies: 310
-- Data for Name: dividendo_pago; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.dividendo_pago VALUES (1, 1, 1, 550.000000, '2026-02-22', 'Activo', '2026-01-08 19:41:27.528019+00', '2026-01-08 19:41:27.528019+00', 2, 18, 18);


--
-- TOC entry 4888 (class 0 OID 319568)
-- Dependencies: 302
-- Data for Name: emision_titulo; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.emision_titulo VALUES (1, 1, 'SEED', 'AUMENTO_CAPITAL', 'S1', '2026-01-08', 100.000000, 100.000000, 11.000000, 'Emisión actualizada (workflow)', 'Activo', '2026-01-08 19:41:27.528019+00', '2026-01-08 19:41:27.528019+00', 2, 18, 18);


--
-- TOC entry 4890 (class 0 OID 319591)
-- Dependencies: 304
-- Data for Name: tenencia; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.tenencia VALUES (1, 1, 1, 55.000000, '2026-01-08', 'AJUSTE', true, 'Tenencia ajustada (workflow)', 'Activo', '2026-01-08 19:41:27.528019+00', '2026-01-08 19:41:27.528019+00', 2, 18, 18);


--
-- TOC entry 4884 (class 0 OID 311298)
-- Dependencies: 298
-- Data for Name: titular; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.titular VALUES (1, 1, true, 'Titular origen (workflow)', 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);
INSERT INTO societario.titular VALUES (2, 18, true, 'Titular destino (workflow)', 'Activo', '2026-01-08 19:41:27.528019+00', NULL, 1, 18, NULL);


--
-- TOC entry 4892 (class 0 OID 319619)
-- Dependencies: 306
-- Data for Name: transferencia_titulo; Type: TABLE DATA; Schema: societario; Owner: -
--

INSERT INTO societario.transferencia_titulo VALUES (1, 1, 1, 2, 11.000000, 13.000000, '2026-01-08', 'Transferencia actualizada (workflow)', 'Activo', '2026-01-08 19:41:27.528019+00', '2026-01-08 19:41:27.528019+00', 2, 18, 18);


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 311
-- Name: departamento_id_departamento_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.departamento_id_departamento_seq', 6, true);


--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 242
-- Name: empleado_id_empleado_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.empleado_id_empleado_seq', 3, true);


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 244
-- Name: empleado_posicion_pago_id_empleado_posicion_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.empleado_posicion_pago_id_empleado_posicion_seq', 2, true);


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 295
-- Name: empleado_registro_pago_id_pago_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.empleado_registro_pago_id_pago_seq', 1, true);


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 262
-- Name: kpi_id_kpi_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.kpi_id_kpi_seq', 4, true);


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 291
-- Name: objetivo_kpi_id_objetivo_kpi_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.objetivo_kpi_id_objetivo_kpi_seq', 6, true);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 240
-- Name: posicion_id_posicion_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('administracion.posicion_id_posicion_seq', 5, true);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 317
-- Name: archivos_transaccion_id_archivo_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.archivos_transaccion_id_archivo_seq', 1, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 238
-- Name: centro_costo_id_centro_costo_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.centro_costo_id_centro_costo_seq', 2, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 293
-- Name: centro_costo_mapa_id_cc_mapa_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.centro_costo_mapa_id_cc_mapa_seq', 2, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 236
-- Name: concepto_costo_id_concepto_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.concepto_costo_id_concepto_seq', 2, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 315
-- Name: cuenta_asignacion_id_cuenta_asignacion_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.cuenta_asignacion_id_cuenta_asignacion_seq', 1, true);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 234
-- Name: cuenta_id_cuenta_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.cuenta_id_cuenta_seq', 7, true);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 232
-- Name: grupo_cuenta_id_grupo_cuenta_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.grupo_cuenta_id_grupo_cuenta_seq', 5, true);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 325
-- Name: pago_tutor_detalle_id_pago_tutor_detalle_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.pago_tutor_detalle_id_pago_tutor_detalle_seq', 1, true);


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 323
-- Name: pago_tutor_id_pago_tutor_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.pago_tutor_id_pago_tutor_seq', 1, true);


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 313
-- Name: transaccion_id_transaccion_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.transaccion_id_transaccion_seq', 3, true);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 321
-- Name: transaccion_movimiento_cuenta_id_movimiento_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('contabilidad.transaccion_movimiento_cuenta_id_movimiento_seq', 9, true);


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 266
-- Name: deuda_id_deuda_seq; Type: SEQUENCE SET; Schema: deuda; Owner: -
--

SELECT pg_catalog.setval('deuda.deuda_id_deuda_seq', 11, true);


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 268
-- Name: pago_id_pago_seq; Type: SEQUENCE SET; Schema: deuda; Owner: -
--

SELECT pg_catalog.setval('deuda.pago_id_pago_seq', 10, true);


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 250
-- Name: edificio_id_edificio_seq; Type: SEQUENCE SET; Schema: infraestructura; Owner: -
--

SELECT pg_catalog.setval('infraestructura.edificio_id_edificio_seq', 11, true);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 248
-- Name: encargado_id_asignacion_seq; Type: SEQUENCE SET; Schema: infraestructura; Owner: -
--

SELECT pg_catalog.setval('infraestructura.encargado_id_asignacion_seq', 4, true);


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 260
-- Name: espacio_id_espacio_seq; Type: SEQUENCE SET; Schema: infraestructura; Owner: -
--

SELECT pg_catalog.setval('infraestructura.espacio_id_espacio_seq', 8, true);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 246
-- Name: sucursal_id_sucursal_seq; Type: SEQUENCE SET; Schema: infraestructura; Owner: -
--

SELECT pg_catalog.setval('infraestructura.sucursal_id_sucursal_seq', 9, true);


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 264
-- Name: tienda_id_tienda_seq; Type: SEQUENCE SET; Schema: infraestructura; Owner: -
--

SELECT pg_catalog.setval('infraestructura.tienda_id_tienda_seq', 4, true);


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 252
-- Name: bien_id_bien_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.bien_id_bien_seq', 15, true);


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 254
-- Name: bien_instancia_id_bien_instancia_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.bien_instancia_id_bien_instancia_seq', 5, true);


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 256
-- Name: bien_lote_id_lote_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.bien_lote_id_lote_seq', 11, true);


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 258
-- Name: movimiento_detalle_id_movimiento_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.movimiento_detalle_id_movimiento_seq', 11, true);


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 319
-- Name: estudiante_padre_id_asociacion_seq; Type: SEQUENCE SET; Schema: persona; Owner: -
--

SELECT pg_catalog.setval('persona.estudiante_padre_id_asociacion_seq', 6, true);


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 227
-- Name: persona_id_persona_seq; Type: SEQUENCE SET; Schema: persona; Owner: -
--

SELECT pg_catalog.setval('persona.persona_id_persona_seq', 50, true);


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 332
-- Name: persona_padre_id_padre_seq; Type: SEQUENCE SET; Schema: persona; Owner: -
--

SELECT pg_catalog.setval('persona.persona_padre_id_padre_seq', 1, true);


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 279
-- Name: persona_tutor_id_tutor_seq; Type: SEQUENCE SET; Schema: persona; Owner: -
--

SELECT pg_catalog.setval('persona.persona_tutor_id_tutor_seq', 7, true);


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 230
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE SET; Schema: persona; Owner: -
--

SELECT pg_catalog.setval('persona.proveedor_id_proveedor_seq', 19, true);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 274
-- Name: unidad_educativa_id_unidad_educativa_seq; Type: SEQUENCE SET; Schema: persona; Owner: -
--

SELECT pg_catalog.setval('persona.unidad_educativa_id_unidad_educativa_seq', 24, true);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 330
-- Name: action_log_id_action_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.action_log_id_action_seq', 358, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 334
-- Name: permiso_id_permiso_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.permiso_id_permiso_seq', 93, true);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 336
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.rol_id_rol_seq', 8, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 328
-- Name: sesion_id_sesion_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.sesion_id_sesion_seq', 81, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 343
-- Name: usuario_token_accion_id_token_accion_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.usuario_token_accion_id_token_accion_seq', 1, false);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 289
-- Name: asistencia_clase_curso_id_asistencia_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.asistencia_clase_curso_id_asistencia_seq', 1, false);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 287
-- Name: clase_curso_id_clase_curso_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.clase_curso_id_clase_curso_seq', 2, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 281
-- Name: clase_por_hora_id_clase_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.clase_por_hora_id_clase_seq', 1, true);


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 285
-- Name: curso_version_id_curso_version_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.curso_version_id_curso_version_seq', 2, true);


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 283
-- Name: horarios_id_horario_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.horarios_id_horario_seq', 2, true);


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 277
-- Name: materia_tree_id_tree_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.materia_tree_id_tree_seq', 2, true);


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 272
-- Name: paquetes_producto_educativo_id_paquete_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.paquetes_producto_educativo_id_paquete_seq', 1, false);


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 270
-- Name: producto_educativo_id_producto_educativo_seq; Type: SEQUENCE SET; Schema: servicios_educativos; Owner: -
--

SELECT pg_catalog.setval('servicios_educativos.producto_educativo_id_producto_educativo_seq', 2, true);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 299
-- Name: clase_titulo_id_clase_titulo_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.clase_titulo_id_clase_titulo_seq', 1, true);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 307
-- Name: dividendo_id_dividendo_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.dividendo_id_dividendo_seq', 1, true);


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 309
-- Name: dividendo_pago_id_dividendo_pago_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.dividendo_pago_id_dividendo_pago_seq', 1, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 301
-- Name: emision_titulo_id_emision_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.emision_titulo_id_emision_seq', 1, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 303
-- Name: tenencia_id_tenencia_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.tenencia_id_tenencia_seq', 1, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 297
-- Name: titular_id_titular_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.titular_id_titular_seq', 2, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 305
-- Name: transferencia_titulo_id_transferencia_seq; Type: SEQUENCE SET; Schema: societario; Owner: -
--

SELECT pg_catalog.setval('societario.transferencia_titulo_id_transferencia_seq', 1, true);


--
-- TOC entry 4437 (class 2606 OID 327691)
-- Name: departamento departamento_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento
    ADD CONSTRAINT departamento_pkey PRIMARY KEY (id_departamento);


--
-- TOC entry 4312 (class 2606 OID 98338)
-- Name: empleado empleado_id_persona_key; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado
    ADD CONSTRAINT empleado_id_persona_key UNIQUE (id_persona);


--
-- TOC entry 4314 (class 2606 OID 98336)
-- Name: empleado empleado_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado
    ADD CONSTRAINT empleado_pkey PRIMARY KEY (id_empleado);


--
-- TOC entry 4317 (class 2606 OID 106551)
-- Name: empleado_posicion_pago empleado_posicion_pago_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado_posicion_pago
    ADD CONSTRAINT empleado_posicion_pago_pkey PRIMARY KEY (id_empleado_posicion);


--
-- TOC entry 4413 (class 2606 OID 303120)
-- Name: empleado_registro_pago empleado_registro_pago_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado_registro_pago
    ADD CONSTRAINT empleado_registro_pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4353 (class 2606 OID 188427)
-- Name: kpi kpi_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.kpi
    ADD CONSTRAINT kpi_pkey PRIMARY KEY (id_kpi);


--
-- TOC entry 4403 (class 2606 OID 270347)
-- Name: objetivo_kpi objetivo_kpi_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_pkey PRIMARY KEY (id_objetivo_kpi);


--
-- TOC entry 4308 (class 2606 OID 90211)
-- Name: posicion posicion_codigo_key; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.posicion
    ADD CONSTRAINT posicion_codigo_key UNIQUE (codigo);


--
-- TOC entry 4310 (class 2606 OID 90209)
-- Name: posicion posicion_pkey; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.posicion
    ADD CONSTRAINT posicion_pkey PRIMARY KEY (id_posicion);


--
-- TOC entry 4439 (class 2606 OID 327693)
-- Name: departamento uq_dep_codigo; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento
    ADD CONSTRAINT uq_dep_codigo UNIQUE (codigo);


--
-- TOC entry 4441 (class 2606 OID 327695)
-- Name: departamento uq_dep_sucursal_nombre; Type: CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento
    ADD CONSTRAINT uq_dep_sucursal_nombre UNIQUE (id_sucursal, nombre);


--
-- TOC entry 4454 (class 2606 OID 336080)
-- Name: archivos_transaccion archivos_transaccion_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.archivos_transaccion
    ADD CONSTRAINT archivos_transaccion_pkey PRIMARY KEY (id_archivo);


--
-- TOC entry 4303 (class 2606 OID 57367)
-- Name: centro_costo centro_costo_codigo_key; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo
    ADD CONSTRAINT centro_costo_codigo_key UNIQUE (codigo);


--
-- TOC entry 4405 (class 2606 OID 294935)
-- Name: centro_costo_mapa centro_costo_mapa_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_pkey PRIMARY KEY (id_cc_mapa);


--
-- TOC entry 4305 (class 2606 OID 57365)
-- Name: centro_costo centro_costo_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo
    ADD CONSTRAINT centro_costo_pkey PRIMARY KEY (id_centro_costo);


--
-- TOC entry 4299 (class 2606 OID 49248)
-- Name: concepto_costo concepto_costo_codigo_key; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.concepto_costo
    ADD CONSTRAINT concepto_costo_codigo_key UNIQUE (codigo);


--
-- TOC entry 4301 (class 2606 OID 49246)
-- Name: concepto_costo concepto_costo_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.concepto_costo
    ADD CONSTRAINT concepto_costo_pkey PRIMARY KEY (id_concepto);


--
-- TOC entry 4452 (class 2606 OID 336012)
-- Name: cuenta_asignacion cuenta_asignacion_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_pkey PRIMARY KEY (id_cuenta_asignacion);


--
-- TOC entry 4295 (class 2606 OID 49229)
-- Name: cuenta cuenta_codigo_key; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta
    ADD CONSTRAINT cuenta_codigo_key UNIQUE (codigo);


--
-- TOC entry 4297 (class 2606 OID 49227)
-- Name: cuenta cuenta_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta
    ADD CONSTRAINT cuenta_pkey PRIMARY KEY (id_cuenta);


--
-- TOC entry 4290 (class 2606 OID 49210)
-- Name: grupo_cuenta grupo_cuenta_codigo_key; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.grupo_cuenta
    ADD CONSTRAINT grupo_cuenta_codigo_key UNIQUE (codigo);


--
-- TOC entry 4292 (class 2606 OID 49208)
-- Name: grupo_cuenta grupo_cuenta_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.grupo_cuenta
    ADD CONSTRAINT grupo_cuenta_pkey PRIMARY KEY (id_grupo_cuenta);


--
-- TOC entry 4469 (class 2606 OID 393256)
-- Name: pago_tutor_detalle pago_tutor_detalle_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor_detalle
    ADD CONSTRAINT pago_tutor_detalle_pkey PRIMARY KEY (id_pago_tutor_detalle);


--
-- TOC entry 4466 (class 2606 OID 393239)
-- Name: pago_tutor pago_tutor_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor
    ADD CONSTRAINT pago_tutor_pkey PRIMARY KEY (id_pago_tutor);


--
-- TOC entry 4462 (class 2606 OID 344103)
-- Name: transaccion_movimiento_cuenta transaccion_movimiento_cuenta_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion_movimiento_cuenta
    ADD CONSTRAINT transaccion_movimiento_cuenta_pkey PRIMARY KEY (id_movimiento);


--
-- TOC entry 4450 (class 2606 OID 335884)
-- Name: transaccion transaccion_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_pkey PRIMARY KEY (id_transaccion);


--
-- TOC entry 4363 (class 2606 OID 204849)
-- Name: deuda deuda_pkey; Type: CONSTRAINT; Schema: deuda; Owner: -
--

ALTER TABLE ONLY deuda.deuda
    ADD CONSTRAINT deuda_pkey PRIMARY KEY (id_deuda);


--
-- TOC entry 4365 (class 2606 OID 204872)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: deuda; Owner: -
--

ALTER TABLE ONLY deuda.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4325 (class 2606 OID 114798)
-- Name: edificio edificio_pkey; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.edificio
    ADD CONSTRAINT edificio_pkey PRIMARY KEY (id_edificio);


--
-- TOC entry 4323 (class 2606 OID 114770)
-- Name: encargado encargado_pkey; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.encargado
    ADD CONSTRAINT encargado_pkey PRIMARY KEY (id_asignacion);


--
-- TOC entry 4348 (class 2606 OID 180239)
-- Name: espacio espacio_pkey; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.espacio
    ADD CONSTRAINT espacio_pkey PRIMARY KEY (id_espacio);


--
-- TOC entry 4319 (class 2606 OID 114759)
-- Name: sucursal sucursal_codigo_key; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.sucursal
    ADD CONSTRAINT sucursal_codigo_key UNIQUE (codigo);


--
-- TOC entry 4321 (class 2606 OID 114757)
-- Name: sucursal sucursal_pkey; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.sucursal
    ADD CONSTRAINT sucursal_pkey PRIMARY KEY (id_sucursal);


--
-- TOC entry 4355 (class 2606 OID 196621)
-- Name: tienda tienda_codigo_key; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda
    ADD CONSTRAINT tienda_codigo_key UNIQUE (codigo);


--
-- TOC entry 4357 (class 2606 OID 196619)
-- Name: tienda tienda_id_espacio_key; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda
    ADD CONSTRAINT tienda_id_espacio_key UNIQUE (id_espacio);


--
-- TOC entry 4359 (class 2606 OID 196617)
-- Name: tienda tienda_pkey; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda
    ADD CONSTRAINT tienda_pkey PRIMARY KEY (id_tienda);


--
-- TOC entry 4328 (class 2606 OID 114800)
-- Name: edificio uq_edificio_sucursal_codigo; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.edificio
    ADD CONSTRAINT uq_edificio_sucursal_codigo UNIQUE (id_sucursal, codigo);


--
-- TOC entry 4361 (class 2606 OID 196633)
-- Name: tienda uq_tienda_espacio; Type: CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda
    ADD CONSTRAINT uq_tienda_espacio UNIQUE (id_espacio);


--
-- TOC entry 4334 (class 2606 OID 123030)
-- Name: bien_instancia bien_instancia_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_instancia
    ADD CONSTRAINT bien_instancia_pkey PRIMARY KEY (id_bien_instancia);


--
-- TOC entry 4336 (class 2606 OID 123075)
-- Name: bien_lote bien_lote_id_bien_lote_codigo_key; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_lote
    ADD CONSTRAINT bien_lote_id_bien_lote_codigo_key UNIQUE (id_bien, lote_codigo);


--
-- TOC entry 4338 (class 2606 OID 123073)
-- Name: bien_lote bien_lote_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_lote
    ADD CONSTRAINT bien_lote_pkey PRIMARY KEY (id_lote);


--
-- TOC entry 4330 (class 2606 OID 122969)
-- Name: bien bien_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_pkey PRIMARY KEY (id_bien);


--
-- TOC entry 4332 (class 2606 OID 122971)
-- Name: bien bien_sku_key; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_sku_key UNIQUE (sku);


--
-- TOC entry 4346 (class 2606 OID 139292)
-- Name: movimiento_detalle movimiento_detalle_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.movimiento_detalle
    ADD CONSTRAINT movimiento_detalle_pkey PRIMARY KEY (id_movimiento);


--
-- TOC entry 4456 (class 2606 OID 344075)
-- Name: estudiante_padre estudiante_padre_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.estudiante_padre
    ADD CONSTRAINT estudiante_padre_pkey PRIMARY KEY (id_asociacion);


--
-- TOC entry 4373 (class 2606 OID 221198)
-- Name: persona_estudiante persona_estudiante_codigo_estudiante_key; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_estudiante
    ADD CONSTRAINT persona_estudiante_codigo_estudiante_key UNIQUE (codigo_estudiante);


--
-- TOC entry 4375 (class 2606 OID 221196)
-- Name: persona_estudiante persona_estudiante_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_estudiante
    ADD CONSTRAINT persona_estudiante_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 4482 (class 2606 OID 417830)
-- Name: persona_padre persona_padre_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_padre
    ADD CONSTRAINT persona_padre_pkey PRIMARY KEY (id_padre);


--
-- TOC entry 4280 (class 2606 OID 49164)
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 4381 (class 2606 OID 229390)
-- Name: persona_tutor persona_tutor_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_tutor
    ADD CONSTRAINT persona_tutor_pkey PRIMARY KEY (id_tutor);


--
-- TOC entry 4283 (class 2606 OID 49177)
-- Name: persona_usuario persona_usuario_nombre_usuario_key; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_usuario
    ADD CONSTRAINT persona_usuario_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- TOC entry 4285 (class 2606 OID 49175)
-- Name: persona_usuario persona_usuario_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_usuario
    ADD CONSTRAINT persona_usuario_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 4288 (class 2606 OID 49193)
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id_proveedor);


--
-- TOC entry 4371 (class 2606 OID 213002)
-- Name: unidad_educativa unidad_educativa_pkey; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.unidad_educativa
    ADD CONSTRAINT unidad_educativa_pkey PRIMARY KEY (id_unidad_educativa);


--
-- TOC entry 4460 (class 2606 OID 458795)
-- Name: estudiante_padre uq_estudiante_padre; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.estudiante_padre
    ADD CONSTRAINT uq_estudiante_padre UNIQUE (id_padre, id_estudiante);


--
-- TOC entry 4383 (class 2606 OID 229392)
-- Name: persona_tutor uq_tutor_persona; Type: CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_tutor
    ADD CONSTRAINT uq_tutor_persona UNIQUE (id_persona);


--
-- TOC entry 4478 (class 2606 OID 409638)
-- Name: action_log action_log_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.action_log
    ADD CONSTRAINT action_log_pkey PRIMARY KEY (id_action);


--
-- TOC entry 4484 (class 2606 OID 442380)
-- Name: permiso permiso_codigo_key; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.permiso
    ADD CONSTRAINT permiso_codigo_key UNIQUE (codigo);


--
-- TOC entry 4486 (class 2606 OID 442378)
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id_permiso);


--
-- TOC entry 4488 (class 2606 OID 442393)
-- Name: rol rol_codigo_key; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.rol
    ADD CONSTRAINT rol_codigo_key UNIQUE (codigo);


--
-- TOC entry 4493 (class 2606 OID 442399)
-- Name: rol_permiso rol_permiso_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.rol_permiso
    ADD CONSTRAINT rol_permiso_pkey PRIMARY KEY (id_rol, id_permiso);


--
-- TOC entry 4490 (class 2606 OID 442391)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4476 (class 2606 OID 409613)
-- Name: sesion sesion_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.sesion
    ADD CONSTRAINT sesion_pkey PRIMARY KEY (id_sesion);


--
-- TOC entry 4501 (class 2606 OID 819211)
-- Name: usuario_token_accion uq_usuario_token_accion_token_hash; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_token_accion
    ADD CONSTRAINT uq_usuario_token_accion_token_hash UNIQUE (token_hash);


--
-- TOC entry 4499 (class 2606 OID 442435)
-- Name: usuario_permiso usuario_permiso_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_permiso
    ADD CONSTRAINT usuario_permiso_pkey PRIMARY KEY (id_persona, id_permiso);


--
-- TOC entry 4496 (class 2606 OID 442418)
-- Name: usuario_rol usuario_rol_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_rol
    ADD CONSTRAINT usuario_rol_pkey PRIMARY KEY (id_persona, id_rol);


--
-- TOC entry 4503 (class 2606 OID 819209)
-- Name: usuario_token_accion usuario_token_accion_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_token_accion
    ADD CONSTRAINT usuario_token_accion_pkey PRIMARY KEY (id_token_accion);


--
-- TOC entry 4397 (class 2606 OID 262172)
-- Name: asistencia_clase_curso asistencia_clase_curso_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.asistencia_clase_curso
    ADD CONSTRAINT asistencia_clase_curso_pkey PRIMARY KEY (id_asistencia);


--
-- TOC entry 4394 (class 2606 OID 245798)
-- Name: clase_curso clase_curso_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_curso
    ADD CONSTRAINT clase_curso_pkey PRIMARY KEY (id_clase_curso);


--
-- TOC entry 4385 (class 2606 OID 229523)
-- Name: clase_por_hora clase_por_hora_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_por_hora
    ADD CONSTRAINT clase_por_hora_pkey PRIMARY KEY (id_clase);


--
-- TOC entry 4392 (class 2606 OID 237621)
-- Name: curso_version curso_version_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.curso_version
    ADD CONSTRAINT curso_version_pkey PRIMARY KEY (id_curso_version);


--
-- TOC entry 4390 (class 2606 OID 237608)
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id_horario);


--
-- TOC entry 4377 (class 2606 OID 221264)
-- Name: materia_tree materia_tree_nombre_key; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.materia_tree
    ADD CONSTRAINT materia_tree_nombre_key UNIQUE (nombre);


--
-- TOC entry 4379 (class 2606 OID 221262)
-- Name: materia_tree materia_tree_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.materia_tree
    ADD CONSTRAINT materia_tree_pkey PRIMARY KEY (id_tree);


--
-- TOC entry 4369 (class 2606 OID 204994)
-- Name: paquetes_producto_educativo paquetes_producto_educativo_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.paquetes_producto_educativo
    ADD CONSTRAINT paquetes_producto_educativo_pkey PRIMARY KEY (id_paquete);


--
-- TOC entry 4367 (class 2606 OID 204948)
-- Name: producto_educativo producto_educativo_pkey; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.producto_educativo
    ADD CONSTRAINT producto_educativo_pkey PRIMARY KEY (id_producto_educativo);


--
-- TOC entry 4401 (class 2606 OID 262174)
-- Name: asistencia_clase_curso uq_asistencia_unica; Type: CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.asistencia_clase_curso
    ADD CONSTRAINT uq_asistencia_unica UNIQUE (id_clase_curso, id_estudiante);


--
-- TOC entry 4419 (class 2606 OID 319564)
-- Name: clase_titulo clase_titulo_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.clase_titulo
    ADD CONSTRAINT clase_titulo_pkey PRIMARY KEY (id_clase_titulo);


--
-- TOC entry 4421 (class 2606 OID 319566)
-- Name: clase_titulo clase_titulo_tipo_sub_tipo_key; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.clase_titulo
    ADD CONSTRAINT clase_titulo_tipo_sub_tipo_key UNIQUE (tipo, sub_tipo);


--
-- TOC entry 4433 (class 2606 OID 319680)
-- Name: dividendo_pago dividendo_pago_id_dividendo_id_titular_key; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo_pago
    ADD CONSTRAINT dividendo_pago_id_dividendo_id_titular_key UNIQUE (id_dividendo, id_titular);


--
-- TOC entry 4435 (class 2606 OID 319678)
-- Name: dividendo_pago dividendo_pago_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo_pago
    ADD CONSTRAINT dividendo_pago_pkey PRIMARY KEY (id_dividendo_pago);


--
-- TOC entry 4431 (class 2606 OID 319660)
-- Name: dividendo dividendo_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo
    ADD CONSTRAINT dividendo_pkey PRIMARY KEY (id_dividendo);


--
-- TOC entry 4423 (class 2606 OID 319584)
-- Name: emision_titulo emision_titulo_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.emision_titulo
    ADD CONSTRAINT emision_titulo_pkey PRIMARY KEY (id_emision);


--
-- TOC entry 4425 (class 2606 OID 319606)
-- Name: tenencia tenencia_id_emision_id_titular_key; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.tenencia
    ADD CONSTRAINT tenencia_id_emision_id_titular_key UNIQUE (id_emision, id_titular) DEFERRABLE;


--
-- TOC entry 4427 (class 2606 OID 319604)
-- Name: tenencia tenencia_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.tenencia
    ADD CONSTRAINT tenencia_pkey PRIMARY KEY (id_tenencia);


--
-- TOC entry 4415 (class 2606 OID 311311)
-- Name: titular titular_id_persona_key; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.titular
    ADD CONSTRAINT titular_id_persona_key UNIQUE (id_persona);


--
-- TOC entry 4417 (class 2606 OID 311309)
-- Name: titular titular_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.titular
    ADD CONSTRAINT titular_pkey PRIMARY KEY (id_titular);


--
-- TOC entry 4429 (class 2606 OID 319632)
-- Name: transferencia_titulo transferencia_titulo_pkey; Type: CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.transferencia_titulo
    ADD CONSTRAINT transferencia_titulo_pkey PRIMARY KEY (id_transferencia);


--
-- TOC entry 4315 (class 1259 OID 98346)
-- Name: idx_empleado_sucursal; Type: INDEX; Schema: administracion; Owner: -
--

CREATE INDEX idx_empleado_sucursal ON administracion.empleado USING btree (id_sucursal);


--
-- TOC entry 4306 (class 1259 OID 90220)
-- Name: idx_posicion_parent; Type: INDEX; Schema: administracion; Owner: -
--

CREATE INDEX idx_posicion_parent ON administracion.posicion USING btree (id_posicion_parent);


--
-- TOC entry 4293 (class 1259 OID 49216)
-- Name: idx_grupo_cuenta_parent; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX idx_grupo_cuenta_parent ON contabilidad.grupo_cuenta USING btree (id_parent);


--
-- TOC entry 4406 (class 1259 OID 294972)
-- Name: ix_ccm_bien; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_ccm_bien ON contabilidad.centro_costo_mapa USING btree (id_bien) WHERE (id_bien IS NOT NULL);


--
-- TOC entry 4407 (class 1259 OID 294971)
-- Name: ix_ccm_deuda; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_ccm_deuda ON contabilidad.centro_costo_mapa USING btree (id_deuda) WHERE (id_deuda IS NOT NULL);


--
-- TOC entry 4408 (class 1259 OID 294975)
-- Name: ix_ccm_empleado; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_ccm_empleado ON contabilidad.centro_costo_mapa USING btree (id_empleado) WHERE (id_empleado IS NOT NULL);


--
-- TOC entry 4409 (class 1259 OID 294976)
-- Name: ix_ccm_posicion; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_ccm_posicion ON contabilidad.centro_costo_mapa USING btree (id_posicion) WHERE (id_posicion IS NOT NULL);


--
-- TOC entry 4410 (class 1259 OID 294973)
-- Name: ix_ccm_sucursal; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_ccm_sucursal ON contabilidad.centro_costo_mapa USING btree (id_sucursal) WHERE (id_sucursal IS NOT NULL);


--
-- TOC entry 4411 (class 1259 OID 294974)
-- Name: ix_ccm_tienda; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_ccm_tienda ON contabilidad.centro_costo_mapa USING btree (id_tienda) WHERE (id_tienda IS NOT NULL);


--
-- TOC entry 4467 (class 1259 OID 393268)
-- Name: ix_pago_tutor_detalle_pago; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_pago_tutor_detalle_pago ON contabilidad.pago_tutor_detalle USING btree (id_pago_tutor);


--
-- TOC entry 4463 (class 1259 OID 393246)
-- Name: ix_pago_tutor_estado; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_pago_tutor_estado ON contabilidad.pago_tutor USING btree (estado_pago);


--
-- TOC entry 4464 (class 1259 OID 393299)
-- Name: ix_pago_tutor_tutor_periodo; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_pago_tutor_tutor_periodo ON contabilidad.pago_tutor USING btree (id_tutor, periodo_inicio, periodo_fin);


--
-- TOC entry 4442 (class 1259 OID 335966)
-- Name: ix_transaccion_ccosto; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_ccosto ON contabilidad.transaccion USING btree (id_centro_costo_mapa);


--
-- TOC entry 4443 (class 1259 OID 335969)
-- Name: ix_transaccion_empleado; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_empleado ON contabilidad.transaccion USING btree (id_empleado);


--
-- TOC entry 4444 (class 1259 OID 335967)
-- Name: ix_transaccion_mov; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_mov ON contabilidad.transaccion USING btree (id_movimiento_detalle);


--
-- TOC entry 4445 (class 1259 OID 335968)
-- Name: ix_transaccion_pago_deuda; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_pago_deuda ON contabilidad.transaccion USING btree (id_pago_deuda);


--
-- TOC entry 4446 (class 1259 OID 335971)
-- Name: ix_transaccion_sucursal; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_sucursal ON contabilidad.transaccion USING btree (id_sucursal);


--
-- TOC entry 4447 (class 1259 OID 335970)
-- Name: ix_transaccion_tienda; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_tienda ON contabilidad.transaccion USING btree (id_tienda);


--
-- TOC entry 4448 (class 1259 OID 335965)
-- Name: ix_transaccion_tipo_fecha; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE INDEX ix_transaccion_tipo_fecha ON contabilidad.transaccion USING btree (tipo_transaccion, fecha_transaccion);


--
-- TOC entry 4470 (class 1259 OID 393267)
-- Name: ux_pago_tutor_detalle_clase_unica; Type: INDEX; Schema: contabilidad; Owner: -
--

CREATE UNIQUE INDEX ux_pago_tutor_detalle_clase_unica ON contabilidad.pago_tutor_detalle USING btree (id_clase);


--
-- TOC entry 4326 (class 1259 OID 114811)
-- Name: idx_edificio_sucursal; Type: INDEX; Schema: infraestructura; Owner: -
--

CREATE INDEX idx_edificio_sucursal ON infraestructura.edificio USING btree (id_sucursal);


--
-- TOC entry 4349 (class 1259 OID 180246)
-- Name: idx_espacio_categoria; Type: INDEX; Schema: infraestructura; Owner: -
--

CREATE INDEX idx_espacio_categoria ON infraestructura.espacio USING btree (categoria_sala);


--
-- TOC entry 4350 (class 1259 OID 180247)
-- Name: idx_espacio_edificio; Type: INDEX; Schema: infraestructura; Owner: -
--

CREATE INDEX idx_espacio_edificio ON infraestructura.espacio USING btree (id_edificio);


--
-- TOC entry 4351 (class 1259 OID 180245)
-- Name: idx_espacio_tipo; Type: INDEX; Schema: infraestructura; Owner: -
--

CREATE INDEX idx_espacio_tipo ON infraestructura.espacio USING btree (tipo);


--
-- TOC entry 4339 (class 1259 OID 139319)
-- Name: ix_mvdet_bien; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX ix_mvdet_bien ON inventario.movimiento_detalle USING btree (id_bien);


--
-- TOC entry 4340 (class 1259 OID 139322)
-- Name: ix_mvdet_esp_in; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX ix_mvdet_esp_in ON inventario.movimiento_detalle USING btree (id_espacio_entrada);


--
-- TOC entry 4341 (class 1259 OID 139323)
-- Name: ix_mvdet_esp_out; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX ix_mvdet_esp_out ON inventario.movimiento_detalle USING btree (id_espacio_salida);


--
-- TOC entry 4342 (class 1259 OID 139321)
-- Name: ix_mvdet_inst; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX ix_mvdet_inst ON inventario.movimiento_detalle USING btree (id_bien_instancia) WHERE (id_bien_instancia IS NOT NULL);


--
-- TOC entry 4343 (class 1259 OID 139320)
-- Name: ix_mvdet_lote; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX ix_mvdet_lote ON inventario.movimiento_detalle USING btree (id_lote) WHERE (id_lote IS NOT NULL);


--
-- TOC entry 4344 (class 1259 OID 139318)
-- Name: ix_mvdet_mov; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX ix_mvdet_mov ON inventario.movimiento_detalle USING btree (id_movimiento);


--
-- TOC entry 4457 (class 1259 OID 458797)
-- Name: ix_estudiante_padre_id_estudiante; Type: INDEX; Schema: persona; Owner: -
--

CREATE INDEX ix_estudiante_padre_id_estudiante ON persona.estudiante_padre USING btree (id_estudiante);


--
-- TOC entry 4458 (class 1259 OID 458796)
-- Name: ix_estudiante_padre_id_padre; Type: INDEX; Schema: persona; Owner: -
--

CREATE INDEX ix_estudiante_padre_id_padre ON persona.estudiante_padre USING btree (id_padre);


--
-- TOC entry 4281 (class 1259 OID 434177)
-- Name: ix_persona_usuario_super; Type: INDEX; Schema: persona; Owner: -
--

CREATE INDEX ix_persona_usuario_super ON persona.persona_usuario USING btree (id_persona) WHERE (es_super_usuario = true);


--
-- TOC entry 4286 (class 1259 OID 352294)
-- Name: uq_persona_usuario_nombre_usuario_lower; Type: INDEX; Schema: persona; Owner: -
--

CREATE UNIQUE INDEX uq_persona_usuario_nombre_usuario_lower ON persona.persona_usuario USING btree (lower((nombre_usuario)::text));


--
-- TOC entry 4479 (class 1259 OID 409648)
-- Name: ix_action_log_entity_pk_gin; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_action_log_entity_pk_gin ON seguridad.action_log USING gin (entity_pk);


--
-- TOC entry 4480 (class 1259 OID 409649)
-- Name: ix_action_log_metadata_gin; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_action_log_metadata_gin ON seguridad.action_log USING gin (metadata);


--
-- TOC entry 4491 (class 1259 OID 442447)
-- Name: ix_rol_permiso_rol; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_rol_permiso_rol ON seguridad.rol_permiso USING btree (id_rol);


--
-- TOC entry 4471 (class 1259 OID 409621)
-- Name: ix_sesion_activa; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_sesion_activa ON seguridad.sesion USING btree (esta_activa, timestamp_login DESC);


--
-- TOC entry 4472 (class 1259 OID 409620)
-- Name: ix_sesion_login; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_sesion_login ON seguridad.sesion USING btree (timestamp_login DESC);


--
-- TOC entry 4473 (class 1259 OID 409624)
-- Name: ix_sesion_metadata_gin; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_sesion_metadata_gin ON seguridad.sesion USING gin (metadata);


--
-- TOC entry 4474 (class 1259 OID 409619)
-- Name: ix_sesion_persona_login; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_sesion_persona_login ON seguridad.sesion USING btree (id_persona, timestamp_login DESC);


--
-- TOC entry 4497 (class 1259 OID 442448)
-- Name: ix_usuario_permiso_persona; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_usuario_permiso_persona ON seguridad.usuario_permiso USING btree (id_persona);


--
-- TOC entry 4494 (class 1259 OID 442446)
-- Name: ix_usuario_rol_persona; Type: INDEX; Schema: seguridad; Owner: -
--

CREATE INDEX ix_usuario_rol_persona ON seguridad.usuario_rol USING btree (id_persona);


--
-- TOC entry 4398 (class 1259 OID 262186)
-- Name: idx_asistencia_clase; Type: INDEX; Schema: servicios_educativos; Owner: -
--

CREATE INDEX idx_asistencia_clase ON servicios_educativos.asistencia_clase_curso USING btree (id_clase_curso);


--
-- TOC entry 4399 (class 1259 OID 262187)
-- Name: idx_asistencia_estudiante; Type: INDEX; Schema: servicios_educativos; Owner: -
--

CREATE INDEX idx_asistencia_estudiante ON servicios_educativos.asistencia_clase_curso USING btree (id_estudiante);


--
-- TOC entry 4395 (class 1259 OID 303127)
-- Name: ix_clase_curso_id_tutor; Type: INDEX; Schema: servicios_educativos; Owner: -
--

CREATE INDEX ix_clase_curso_id_tutor ON servicios_educativos.clase_curso USING btree (id_tutor);


--
-- TOC entry 4386 (class 1259 OID 393221)
-- Name: ix_cph_estado_operativo; Type: INDEX; Schema: servicios_educativos; Owner: -
--

CREATE INDEX ix_cph_estado_operativo ON servicios_educativos.clase_por_hora USING btree (estado_operativo);


--
-- TOC entry 4387 (class 1259 OID 393220)
-- Name: ix_cph_tutor_hora_llegada; Type: INDEX; Schema: servicios_educativos; Owner: -
--

CREATE INDEX ix_cph_tutor_hora_llegada ON servicios_educativos.clase_por_hora USING btree (id_tutor, hora_llegada);


--
-- TOC entry 4388 (class 1259 OID 393219)
-- Name: ux_cph_tutor_abierta; Type: INDEX; Schema: servicios_educativos; Owner: -
--

CREATE UNIQUE INDEX ux_cph_tutor_abierta ON servicios_educativos.clase_por_hora USING btree (id_tutor) WHERE (estado_operativo = 'ABIERTA'::text);


--
-- TOC entry 4632 (class 2620 OID 98345)
-- Name: empleado bu_empleado; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER bu_empleado BEFORE UPDATE ON administracion.empleado FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4631 (class 2620 OID 90219)
-- Name: posicion bu_posicion; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER bu_posicion BEFORE UPDATE ON administracion.posicion FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4657 (class 2620 OID 303128)
-- Name: empleado_registro_pago trg_bu_empleado_registro_pago_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER trg_bu_empleado_registro_pago_audit BEFORE UPDATE ON administracion.empleado_registro_pago FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4633 (class 2620 OID 106562)
-- Name: empleado_posicion_pago trg_empleado_posicion_pago; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER trg_empleado_posicion_pago BEFORE UPDATE ON administracion.empleado_posicion_pago FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4641 (class 2620 OID 278530)
-- Name: kpi trg_kpi_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER trg_kpi_audit BEFORE UPDATE ON administracion.kpi FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4654 (class 2620 OID 278529)
-- Name: objetivo_kpi trg_objetivo_kpi_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER trg_objetivo_kpi_audit BEFORE UPDATE ON administracion.objetivo_kpi FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4655 (class 2620 OID 278531)
-- Name: objetivo_kpi trg_objetivo_kpi_check_es_producto_tienda; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER trg_objetivo_kpi_check_es_producto_tienda BEFORE UPDATE ON administracion.objetivo_kpi FOR EACH ROW EXECUTE FUNCTION inventario.check_es_producto_tienda();


--
-- TOC entry 4660 (class 2620 OID 336086)
-- Name: archivos_transaccion bu_archivos_transaccion; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_archivos_transaccion BEFORE UPDATE ON contabilidad.archivos_transaccion FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4656 (class 2620 OID 294977)
-- Name: centro_costo_mapa bu_ccm; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_ccm BEFORE UPDATE ON contabilidad.centro_costo_mapa FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4630 (class 2620 OID 57378)
-- Name: centro_costo bu_ccosto; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_ccosto BEFORE UPDATE ON contabilidad.centro_costo FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4629 (class 2620 OID 49249)
-- Name: concepto_costo bu_concepto; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_concepto BEFORE UPDATE ON contabilidad.concepto_costo FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4628 (class 2620 OID 49235)
-- Name: cuenta bu_cuenta; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_cuenta BEFORE UPDATE ON contabilidad.cuenta FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4659 (class 2620 OID 336068)
-- Name: cuenta_asignacion bu_cuenta_asignacion; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_cuenta_asignacion BEFORE UPDATE ON contabilidad.cuenta_asignacion FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4627 (class 2620 OID 49217)
-- Name: grupo_cuenta bu_grupo_cuenta; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_grupo_cuenta BEFORE UPDATE ON contabilidad.grupo_cuenta FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4658 (class 2620 OID 335972)
-- Name: transaccion bu_transaccion; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_transaccion BEFORE UPDATE ON contabilidad.transaccion FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4663 (class 2620 OID 344114)
-- Name: transaccion_movimiento_cuenta bu_transaccion_movimiento_cuenta; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bu_transaccion_movimiento_cuenta BEFORE UPDATE ON contabilidad.transaccion_movimiento_cuenta FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4661 (class 2620 OID 745473)
-- Name: archivos_transaccion trg_sync_archivos_transaccion_links; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER trg_sync_archivos_transaccion_links BEFORE INSERT OR UPDATE OF link_achivo, link_archivo ON contabilidad.archivos_transaccion FOR EACH ROW EXECUTE FUNCTION contabilidad.trg_sync_archivos_transaccion_links();


--
-- TOC entry 4643 (class 2620 OID 221294)
-- Name: deuda trg_bu_deuda_audit; Type: TRIGGER; Schema: deuda; Owner: -
--

CREATE TRIGGER trg_bu_deuda_audit BEFORE UPDATE ON deuda.deuda FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4644 (class 2620 OID 221295)
-- Name: pago trg_bu_pago_audit; Type: TRIGGER; Schema: deuda; Owner: -
--

CREATE TRIGGER trg_bu_pago_audit BEFORE UPDATE ON deuda.pago FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4636 (class 2620 OID 114812)
-- Name: edificio bu_edificio; Type: TRIGGER; Schema: infraestructura; Owner: -
--

CREATE TRIGGER bu_edificio BEFORE UPDATE ON infraestructura.edificio FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4635 (class 2620 OID 114781)
-- Name: encargado bu_encargado; Type: TRIGGER; Schema: infraestructura; Owner: -
--

CREATE TRIGGER bu_encargado BEFORE UPDATE ON infraestructura.encargado FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4640 (class 2620 OID 180248)
-- Name: espacio bu_espacio; Type: TRIGGER; Schema: infraestructura; Owner: -
--

CREATE TRIGGER bu_espacio BEFORE UPDATE ON infraestructura.espacio FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4634 (class 2620 OID 114760)
-- Name: sucursal bu_sucursal; Type: TRIGGER; Schema: infraestructura; Owner: -
--

CREATE TRIGGER bu_sucursal BEFORE UPDATE ON infraestructura.sucursal FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4642 (class 2620 OID 196634)
-- Name: tienda bu_tienda; Type: TRIGGER; Schema: infraestructura; Owner: -
--

CREATE TRIGGER bu_tienda BEFORE UPDATE ON infraestructura.tienda FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4637 (class 2620 OID 123086)
-- Name: bien bu_bien; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER bu_bien BEFORE UPDATE ON inventario.bien FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4638 (class 2620 OID 221286)
-- Name: bien_instancia trg_bu_bien_instancia_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER trg_bu_bien_instancia_audit BEFORE UPDATE ON inventario.bien_instancia FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4639 (class 2620 OID 221287)
-- Name: bien_lote trg_bu_bien_lote_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER trg_bu_bien_lote_audit BEFORE UPDATE ON inventario.bien_lote FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4662 (class 2620 OID 344086)
-- Name: estudiante_padre bu_estudiante_padre; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER bu_estudiante_padre BEFORE UPDATE ON persona.estudiante_padre FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4624 (class 2620 OID 49165)
-- Name: persona bu_persona; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER bu_persona BEFORE UPDATE ON persona.persona FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4625 (class 2620 OID 49183)
-- Name: persona_usuario bu_persona_usuario; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER bu_persona_usuario BEFORE UPDATE ON persona.persona_usuario FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4626 (class 2620 OID 49194)
-- Name: proveedor bu_proveedor; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER bu_proveedor BEFORE UPDATE ON persona.proveedor FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4648 (class 2620 OID 221283)
-- Name: persona_estudiante trg_bu_persona_estudiante_audit; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER trg_bu_persona_estudiante_audit BEFORE UPDATE ON persona.persona_estudiante FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4664 (class 2620 OID 458823)
-- Name: persona_padre trg_bu_persona_padre_audit; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER trg_bu_persona_padre_audit BEFORE UPDATE ON persona.persona_padre FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4650 (class 2620 OID 229398)
-- Name: persona_tutor trg_bu_tutor_audit; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER trg_bu_tutor_audit BEFORE UPDATE ON persona.persona_tutor FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4647 (class 2620 OID 221282)
-- Name: unidad_educativa trg_bu_unidad_educativa_audit; Type: TRIGGER; Schema: persona; Owner: -
--

CREATE TRIGGER trg_bu_unidad_educativa_audit BEFORE UPDATE ON persona.unidad_educativa FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4651 (class 2620 OID 393283)
-- Name: clase_por_hora tg_bloquear_edicion_clase_pagada; Type: TRIGGER; Schema: servicios_educativos; Owner: -
--

CREATE TRIGGER tg_bloquear_edicion_clase_pagada BEFORE DELETE OR UPDATE ON servicios_educativos.clase_por_hora FOR EACH ROW EXECUTE FUNCTION servicios_educativos.trg_bloquear_edicion_clase_pagada();


--
-- TOC entry 4653 (class 2620 OID 245814)
-- Name: clase_curso trg_bu_clase_curso_audit; Type: TRIGGER; Schema: servicios_educativos; Owner: -
--

CREATE TRIGGER trg_bu_clase_curso_audit BEFORE UPDATE ON servicios_educativos.clase_curso FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4652 (class 2620 OID 229544)
-- Name: clase_por_hora trg_bu_clase_por_hora_audit; Type: TRIGGER; Schema: servicios_educativos; Owner: -
--

CREATE TRIGGER trg_bu_clase_por_hora_audit BEFORE UPDATE ON servicios_educativos.clase_por_hora FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4649 (class 2620 OID 221285)
-- Name: materia_tree trg_bu_materia_tree_audit; Type: TRIGGER; Schema: servicios_educativos; Owner: -
--

CREATE TRIGGER trg_bu_materia_tree_audit BEFORE UPDATE ON servicios_educativos.materia_tree FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4646 (class 2620 OID 221281)
-- Name: paquetes_producto_educativo trg_bu_paquetes_prod_educ_audit; Type: TRIGGER; Schema: servicios_educativos; Owner: -
--

CREATE TRIGGER trg_bu_paquetes_prod_educ_audit BEFORE UPDATE ON servicios_educativos.paquetes_producto_educativo FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4645 (class 2620 OID 221279)
-- Name: producto_educativo trg_bu_producto_educativo_audit; Type: TRIGGER; Schema: servicios_educativos; Owner: -
--

CREATE TRIGGER trg_bu_producto_educativo_audit BEFORE UPDATE ON servicios_educativos.producto_educativo FOR EACH ROW EXECUTE FUNCTION contabilidad.fn_audit_bu_simple();


--
-- TOC entry 4575 (class 2606 OID 327696)
-- Name: departamento departamento_id_departamento_padre_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento
    ADD CONSTRAINT departamento_id_departamento_padre_fkey FOREIGN KEY (id_departamento_padre) REFERENCES administracion.departamento(id_departamento) ON DELETE SET NULL;


--
-- TOC entry 4576 (class 2606 OID 327706)
-- Name: departamento departamento_id_jefe_empleado_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento
    ADD CONSTRAINT departamento_id_jefe_empleado_fkey FOREIGN KEY (id_jefe_empleado) REFERENCES administracion.empleado(id_empleado) ON DELETE SET NULL;


--
-- TOC entry 4577 (class 2606 OID 327701)
-- Name: departamento departamento_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.departamento
    ADD CONSTRAINT departamento_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal) ON DELETE SET NULL;


--
-- TOC entry 4510 (class 2606 OID 98339)
-- Name: empleado empleado_id_persona_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado
    ADD CONSTRAINT empleado_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona(id_persona) ON DELETE RESTRICT;


--
-- TOC entry 4512 (class 2606 OID 106552)
-- Name: empleado_posicion_pago empleado_posicion_pago_id_empleado_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado_posicion_pago
    ADD CONSTRAINT empleado_posicion_pago_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES administracion.empleado(id_empleado) ON DELETE CASCADE;


--
-- TOC entry 4513 (class 2606 OID 106557)
-- Name: empleado_posicion_pago empleado_posicion_pago_id_posicion_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado_posicion_pago
    ADD CONSTRAINT empleado_posicion_pago_id_posicion_fkey FOREIGN KEY (id_posicion) REFERENCES administracion.posicion(id_posicion) ON DELETE RESTRICT;


--
-- TOC entry 4511 (class 2606 OID 114850)
-- Name: empleado fgk_id_sucursal; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.empleado
    ADD CONSTRAINT fgk_id_sucursal FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal);


--
-- TOC entry 4551 (class 2606 OID 270348)
-- Name: objetivo_kpi objetivo_kpi_id_kpi_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_id_kpi_fkey FOREIGN KEY (id_kpi) REFERENCES administracion.kpi(id_kpi) ON DELETE CASCADE;


--
-- TOC entry 4552 (class 2606 OID 270368)
-- Name: objetivo_kpi objetivo_kpi_id_producto_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES servicios_educativos.producto_educativo(id_producto_educativo);


--
-- TOC entry 4553 (class 2606 OID 270373)
-- Name: objetivo_kpi objetivo_kpi_id_producto_tienda_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_id_producto_tienda_fkey FOREIGN KEY (id_producto_tienda) REFERENCES inventario.bien(id_bien);


--
-- TOC entry 4554 (class 2606 OID 270358)
-- Name: objetivo_kpi objetivo_kpi_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal);


--
-- TOC entry 4555 (class 2606 OID 270363)
-- Name: objetivo_kpi objetivo_kpi_id_tienda_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES infraestructura.tienda(id_tienda);


--
-- TOC entry 4556 (class 2606 OID 270353)
-- Name: objetivo_kpi objetivo_kpi_responsable_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.objetivo_kpi
    ADD CONSTRAINT objetivo_kpi_responsable_fkey FOREIGN KEY (responsable) REFERENCES administracion.empleado(id_empleado);


--
-- TOC entry 4509 (class 2606 OID 90212)
-- Name: posicion posicion_id_posicion_parent_fkey; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY administracion.posicion
    ADD CONSTRAINT posicion_id_posicion_parent_fkey FOREIGN KEY (id_posicion_parent) REFERENCES administracion.posicion(id_posicion);


--
-- TOC entry 4607 (class 2606 OID 745480)
-- Name: archivos_transaccion archivos_transaccion_id_transaccion_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.archivos_transaccion
    ADD CONSTRAINT archivos_transaccion_id_transaccion_fkey FOREIGN KEY (id_transaccion) REFERENCES contabilidad.transaccion(id_transaccion);


--
-- TOC entry 4507 (class 2606 OID 57373)
-- Name: centro_costo centro_costo_id_cuenta_costo_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo
    ADD CONSTRAINT centro_costo_id_cuenta_costo_fkey FOREIGN KEY (id_cuenta_costo) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4508 (class 2606 OID 57368)
-- Name: centro_costo centro_costo_id_cuenta_ingreso_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo
    ADD CONSTRAINT centro_costo_id_cuenta_ingreso_fkey FOREIGN KEY (id_cuenta_ingreso) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4557 (class 2606 OID 294946)
-- Name: centro_costo_mapa centro_costo_mapa_id_bien_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_bien_fkey FOREIGN KEY (id_bien) REFERENCES inventario.bien(id_bien);


--
-- TOC entry 4558 (class 2606 OID 294936)
-- Name: centro_costo_mapa centro_costo_mapa_id_centro_costo_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_centro_costo_fkey FOREIGN KEY (id_centro_costo) REFERENCES contabilidad.centro_costo(id_centro_costo);


--
-- TOC entry 4559 (class 2606 OID 327711)
-- Name: centro_costo_mapa centro_costo_mapa_id_departamento_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES administracion.departamento(id_departamento);


--
-- TOC entry 4560 (class 2606 OID 294941)
-- Name: centro_costo_mapa centro_costo_mapa_id_deuda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_deuda_fkey FOREIGN KEY (id_deuda) REFERENCES deuda.deuda(id_deuda);


--
-- TOC entry 4561 (class 2606 OID 294961)
-- Name: centro_costo_mapa centro_costo_mapa_id_empleado_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES administracion.empleado(id_empleado);


--
-- TOC entry 4562 (class 2606 OID 294966)
-- Name: centro_costo_mapa centro_costo_mapa_id_posicion_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_posicion_fkey FOREIGN KEY (id_posicion) REFERENCES administracion.posicion(id_posicion);


--
-- TOC entry 4563 (class 2606 OID 294951)
-- Name: centro_costo_mapa centro_costo_mapa_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal);


--
-- TOC entry 4564 (class 2606 OID 294956)
-- Name: centro_costo_mapa centro_costo_mapa_id_tienda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.centro_costo_mapa
    ADD CONSTRAINT centro_costo_mapa_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES infraestructura.tienda(id_tienda);


--
-- TOC entry 4596 (class 2606 OID 336043)
-- Name: cuenta_asignacion cuenta_asignacion_id_bien_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_bien_fkey FOREIGN KEY (id_bien) REFERENCES inventario.bien(id_bien);


--
-- TOC entry 4597 (class 2606 OID 336063)
-- Name: cuenta_asignacion cuenta_asignacion_id_cuenta_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_cuenta_fkey FOREIGN KEY (id_cuenta) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4598 (class 2606 OID 336058)
-- Name: cuenta_asignacion cuenta_asignacion_id_departamento_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES administracion.departamento(id_departamento);


--
-- TOC entry 4599 (class 2606 OID 336048)
-- Name: cuenta_asignacion cuenta_asignacion_id_deuda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_deuda_fkey FOREIGN KEY (id_deuda) REFERENCES deuda.deuda(id_deuda);


--
-- TOC entry 4600 (class 2606 OID 336033)
-- Name: cuenta_asignacion cuenta_asignacion_id_edificio_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_edificio_fkey FOREIGN KEY (id_edificio) REFERENCES infraestructura.edificio(id_edificio);


--
-- TOC entry 4601 (class 2606 OID 336013)
-- Name: cuenta_asignacion cuenta_asignacion_id_empleado_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES administracion.empleado(id_empleado);


--
-- TOC entry 4602 (class 2606 OID 336018)
-- Name: cuenta_asignacion cuenta_asignacion_id_persona_estudiante_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_persona_estudiante_fkey FOREIGN KEY (id_persona_estudiante) REFERENCES persona.persona_estudiante(id_persona);


--
-- TOC entry 4603 (class 2606 OID 336023)
-- Name: cuenta_asignacion cuenta_asignacion_id_persona_tutor_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_persona_tutor_fkey FOREIGN KEY (id_persona_tutor) REFERENCES persona.persona_tutor(id_tutor);


--
-- TOC entry 4604 (class 2606 OID 336053)
-- Name: cuenta_asignacion cuenta_asignacion_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES persona.proveedor(id_proveedor);


--
-- TOC entry 4605 (class 2606 OID 336028)
-- Name: cuenta_asignacion cuenta_asignacion_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal);


--
-- TOC entry 4606 (class 2606 OID 336038)
-- Name: cuenta_asignacion cuenta_asignacion_id_tienda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta_asignacion
    ADD CONSTRAINT cuenta_asignacion_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES infraestructura.tienda(id_tienda);


--
-- TOC entry 4506 (class 2606 OID 49230)
-- Name: cuenta cuenta_id_grupo_cuenta_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.cuenta
    ADD CONSTRAINT cuenta_id_grupo_cuenta_fkey FOREIGN KEY (id_grupo_cuenta) REFERENCES contabilidad.grupo_cuenta(id_grupo_cuenta);


--
-- TOC entry 4613 (class 2606 OID 393262)
-- Name: pago_tutor_detalle fk_detalle_clase_por_hora; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor_detalle
    ADD CONSTRAINT fk_detalle_clase_por_hora FOREIGN KEY (id_clase) REFERENCES servicios_educativos.clase_por_hora(id_clase);


--
-- TOC entry 4614 (class 2606 OID 393257)
-- Name: pago_tutor_detalle fk_detalle_pago_tutor; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor_detalle
    ADD CONSTRAINT fk_detalle_pago_tutor FOREIGN KEY (id_pago_tutor) REFERENCES contabilidad.pago_tutor(id_pago_tutor) ON DELETE CASCADE;


--
-- TOC entry 4612 (class 2606 OID 393240)
-- Name: pago_tutor fk_pago_tutor_tutor; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.pago_tutor
    ADD CONSTRAINT fk_pago_tutor_tutor FOREIGN KEY (id_tutor) REFERENCES persona.persona_tutor(id_tutor);


--
-- TOC entry 4505 (class 2606 OID 49211)
-- Name: grupo_cuenta grupo_cuenta_id_parent_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.grupo_cuenta
    ADD CONSTRAINT grupo_cuenta_id_parent_fkey FOREIGN KEY (id_parent) REFERENCES contabilidad.grupo_cuenta(id_grupo_cuenta);


--
-- TOC entry 4578 (class 2606 OID 335890)
-- Name: transaccion transaccion_id_bien_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_bien_fkey FOREIGN KEY (id_bien) REFERENCES inventario.bien(id_bien);


--
-- TOC entry 4579 (class 2606 OID 335885)
-- Name: transaccion transaccion_id_centro_costo_mapa_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_centro_costo_mapa_fkey FOREIGN KEY (id_centro_costo_mapa) REFERENCES contabilidad.centro_costo_mapa(id_cc_mapa);


--
-- TOC entry 4580 (class 2606 OID 335925)
-- Name: transaccion transaccion_id_clase_por_hora_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_clase_por_hora_fkey FOREIGN KEY (id_clase_por_hora) REFERENCES servicios_educativos.clase_por_hora(id_clase);


--
-- TOC entry 4581 (class 2606 OID 344087)
-- Name: transaccion transaccion_id_cliente_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES persona.persona(id_persona);


--
-- TOC entry 4582 (class 2606 OID 335935)
-- Name: transaccion transaccion_id_curso_version_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_curso_version_fkey FOREIGN KEY (id_curso_version) REFERENCES servicios_educativos.curso_version(id_curso_version);


--
-- TOC entry 4583 (class 2606 OID 335920)
-- Name: transaccion transaccion_id_departamento_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES administracion.departamento(id_departamento);


--
-- TOC entry 4584 (class 2606 OID 335900)
-- Name: transaccion transaccion_id_deuda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_deuda_fkey FOREIGN KEY (id_deuda) REFERENCES deuda.deuda(id_deuda);


--
-- TOC entry 4585 (class 2606 OID 335955)
-- Name: transaccion transaccion_id_dividendo_pago_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_dividendo_pago_fkey FOREIGN KEY (id_dividendo_pago) REFERENCES societario.dividendo_pago(id_dividendo_pago);


--
-- TOC entry 4586 (class 2606 OID 335960)
-- Name: transaccion transaccion_id_emision_titulo_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_emision_titulo_fkey FOREIGN KEY (id_emision_titulo) REFERENCES societario.emision_titulo(id_emision);


--
-- TOC entry 4587 (class 2606 OID 335910)
-- Name: transaccion transaccion_id_empleado_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES administracion.empleado(id_empleado);


--
-- TOC entry 4588 (class 2606 OID 335915)
-- Name: transaccion transaccion_id_empleado_pago_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_empleado_pago_fkey FOREIGN KEY (id_empleado_pago) REFERENCES administracion.empleado_registro_pago(id_pago);


--
-- TOC entry 4589 (class 2606 OID 335895)
-- Name: transaccion transaccion_id_movimiento_detalle_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_movimiento_detalle_fkey FOREIGN KEY (id_movimiento_detalle) REFERENCES inventario.movimiento_detalle(id_movimiento);


--
-- TOC entry 4590 (class 2606 OID 335905)
-- Name: transaccion transaccion_id_pago_deuda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_pago_deuda_fkey FOREIGN KEY (id_pago_deuda) REFERENCES deuda.pago(id_pago);


--
-- TOC entry 4591 (class 2606 OID 745503)
-- Name: transaccion transaccion_id_pago_tutor_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_pago_tutor_fkey FOREIGN KEY (id_pago_tutor) REFERENCES contabilidad.pago_tutor(id_pago_tutor);


--
-- TOC entry 4592 (class 2606 OID 335930)
-- Name: transaccion transaccion_id_producto_educativo_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_producto_educativo_fkey FOREIGN KEY (id_producto_educativo) REFERENCES servicios_educativos.producto_educativo(id_producto_educativo);


--
-- TOC entry 4593 (class 2606 OID 335950)
-- Name: transaccion transaccion_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES persona.proveedor(id_proveedor);


--
-- TOC entry 4594 (class 2606 OID 335940)
-- Name: transaccion transaccion_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal);


--
-- TOC entry 4595 (class 2606 OID 335945)
-- Name: transaccion transaccion_id_tienda_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion
    ADD CONSTRAINT transaccion_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES infraestructura.tienda(id_tienda);


--
-- TOC entry 4610 (class 2606 OID 745498)
-- Name: transaccion_movimiento_cuenta transaccion_movimiento_cuenta_id_cuenta_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion_movimiento_cuenta
    ADD CONSTRAINT transaccion_movimiento_cuenta_id_cuenta_fkey FOREIGN KEY (id_cuenta) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4611 (class 2606 OID 745493)
-- Name: transaccion_movimiento_cuenta transaccion_movimiento_cuenta_id_transaccion_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY contabilidad.transaccion_movimiento_cuenta
    ADD CONSTRAINT transaccion_movimiento_cuenta_id_transaccion_fkey FOREIGN KEY (id_transaccion) REFERENCES contabilidad.transaccion(id_transaccion);


--
-- TOC entry 4533 (class 2606 OID 204850)
-- Name: deuda deuda_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: deuda; Owner: -
--

ALTER TABLE ONLY deuda.deuda
    ADD CONSTRAINT deuda_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES persona.proveedor(id_proveedor) ON DELETE RESTRICT;


--
-- TOC entry 4534 (class 2606 OID 204873)
-- Name: pago pago_id_deuda_fkey; Type: FK CONSTRAINT; Schema: deuda; Owner: -
--

ALTER TABLE ONLY deuda.pago
    ADD CONSTRAINT pago_id_deuda_fkey FOREIGN KEY (id_deuda) REFERENCES deuda.deuda(id_deuda) ON DELETE CASCADE;


--
-- TOC entry 4516 (class 2606 OID 114806)
-- Name: edificio edificio_id_administrador_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.edificio
    ADD CONSTRAINT edificio_id_administrador_fkey FOREIGN KEY (id_administrador) REFERENCES administracion.empleado(id_empleado);


--
-- TOC entry 4517 (class 2606 OID 114801)
-- Name: edificio edificio_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.edificio
    ADD CONSTRAINT edificio_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal) ON DELETE CASCADE;


--
-- TOC entry 4514 (class 2606 OID 114776)
-- Name: encargado encargado_id_empleado_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.encargado
    ADD CONSTRAINT encargado_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES administracion.empleado(id_empleado);


--
-- TOC entry 4515 (class 2606 OID 114771)
-- Name: encargado encargado_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.encargado
    ADD CONSTRAINT encargado_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES infraestructura.sucursal(id_sucursal);


--
-- TOC entry 4530 (class 2606 OID 180240)
-- Name: espacio espacio_id_edificio_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.espacio
    ADD CONSTRAINT espacio_id_edificio_fkey FOREIGN KEY (id_edificio) REFERENCES infraestructura.edificio(id_edificio) ON DELETE CASCADE;


--
-- TOC entry 4531 (class 2606 OID 196622)
-- Name: tienda tienda_id_espacio_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda
    ADD CONSTRAINT tienda_id_espacio_fkey FOREIGN KEY (id_espacio) REFERENCES infraestructura.espacio(id_espacio) ON DELETE SET NULL;


--
-- TOC entry 4532 (class 2606 OID 196627)
-- Name: tienda tienda_id_responsable_fkey; Type: FK CONSTRAINT; Schema: infraestructura; Owner: -
--

ALTER TABLE ONLY infraestructura.tienda
    ADD CONSTRAINT tienda_id_responsable_fkey FOREIGN KEY (id_responsable) REFERENCES persona.persona(id_persona);


--
-- TOC entry 4518 (class 2606 OID 122977)
-- Name: bien bien_id_cuenta_costo_venta_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_id_cuenta_costo_venta_fkey FOREIGN KEY (id_cuenta_costo_venta) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4519 (class 2606 OID 122992)
-- Name: bien bien_id_cuenta_depreciacion_acumulada_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_id_cuenta_depreciacion_acumulada_fkey FOREIGN KEY (id_cuenta_depreciacion_acumulada) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4520 (class 2606 OID 122987)
-- Name: bien bien_id_cuenta_depreciacion_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_id_cuenta_depreciacion_fkey FOREIGN KEY (id_cuenta_depreciacion) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4521 (class 2606 OID 122972)
-- Name: bien bien_id_cuenta_existencias_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_id_cuenta_existencias_fkey FOREIGN KEY (id_cuenta_existencias) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4522 (class 2606 OID 122982)
-- Name: bien bien_id_cuenta_ingreso_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien
    ADD CONSTRAINT bien_id_cuenta_ingreso_fkey FOREIGN KEY (id_cuenta_ingreso) REFERENCES contabilidad.cuenta(id_cuenta);


--
-- TOC entry 4523 (class 2606 OID 123031)
-- Name: bien_instancia bien_instancia_id_bien_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_instancia
    ADD CONSTRAINT bien_instancia_id_bien_fkey FOREIGN KEY (id_bien) REFERENCES inventario.bien(id_bien) ON DELETE CASCADE;


--
-- TOC entry 4524 (class 2606 OID 123036)
-- Name: bien_instancia bien_instancia_id_proveedor_compra_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_instancia
    ADD CONSTRAINT bien_instancia_id_proveedor_compra_fkey FOREIGN KEY (id_proveedor_compra) REFERENCES persona.proveedor(id_proveedor);


--
-- TOC entry 4525 (class 2606 OID 123076)
-- Name: bien_lote bien_lote_id_bien_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_lote
    ADD CONSTRAINT bien_lote_id_bien_fkey FOREIGN KEY (id_bien) REFERENCES inventario.bien(id_bien) ON DELETE CASCADE;


--
-- TOC entry 4526 (class 2606 OID 123081)
-- Name: bien_lote bien_lote_id_proveedor_compra_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.bien_lote
    ADD CONSTRAINT bien_lote_id_proveedor_compra_fkey FOREIGN KEY (id_proveedor_compra) REFERENCES persona.proveedor(id_proveedor);


--
-- TOC entry 4527 (class 2606 OID 139293)
-- Name: movimiento_detalle movimiento_detalle_id_bien_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.movimiento_detalle
    ADD CONSTRAINT movimiento_detalle_id_bien_fkey FOREIGN KEY (id_bien) REFERENCES inventario.bien(id_bien);


--
-- TOC entry 4528 (class 2606 OID 139303)
-- Name: movimiento_detalle movimiento_detalle_id_bien_instancia_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.movimiento_detalle
    ADD CONSTRAINT movimiento_detalle_id_bien_instancia_fkey FOREIGN KEY (id_bien_instancia) REFERENCES inventario.bien_instancia(id_bien_instancia);


--
-- TOC entry 4529 (class 2606 OID 139298)
-- Name: movimiento_detalle movimiento_detalle_id_lote_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.movimiento_detalle
    ADD CONSTRAINT movimiento_detalle_id_lote_fkey FOREIGN KEY (id_lote) REFERENCES inventario.bien_lote(id_lote);


--
-- TOC entry 4608 (class 2606 OID 458789)
-- Name: estudiante_padre estudiante_padre_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.estudiante_padre
    ADD CONSTRAINT estudiante_padre_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES persona.persona_estudiante(id_persona);


--
-- TOC entry 4609 (class 2606 OID 458784)
-- Name: estudiante_padre estudiante_padre_persona_padre_fk; Type: FK CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.estudiante_padre
    ADD CONSTRAINT estudiante_padre_persona_padre_fk FOREIGN KEY (id_padre) REFERENCES persona.persona_padre(id_padre);


--
-- TOC entry 4536 (class 2606 OID 221199)
-- Name: persona_estudiante persona_estudiante_id_persona_fkey; Type: FK CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_estudiante
    ADD CONSTRAINT persona_estudiante_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona(id_persona) ON DELETE CASCADE;


--
-- TOC entry 4537 (class 2606 OID 458803)
-- Name: persona_estudiante persona_estudiante_id_unidad_educativa_fkey; Type: FK CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_estudiante
    ADD CONSTRAINT persona_estudiante_id_unidad_educativa_fkey FOREIGN KEY (id_unidad_educativa) REFERENCES persona.unidad_educativa(id_unidad_educativa);


--
-- TOC entry 4538 (class 2606 OID 229393)
-- Name: persona_tutor persona_tutor_id_persona_fkey; Type: FK CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_tutor
    ADD CONSTRAINT persona_tutor_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona(id_persona) ON DELETE CASCADE;


--
-- TOC entry 4504 (class 2606 OID 49178)
-- Name: persona_usuario persona_usuario_id_persona_fkey; Type: FK CONSTRAINT; Schema: persona; Owner: -
--

ALTER TABLE ONLY persona.persona_usuario
    ADD CONSTRAINT persona_usuario_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona(id_persona) ON DELETE CASCADE;


--
-- TOC entry 4616 (class 2606 OID 409639)
-- Name: action_log action_log_id_sesion_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.action_log
    ADD CONSTRAINT action_log_id_sesion_fkey FOREIGN KEY (id_sesion) REFERENCES seguridad.sesion(id_sesion) ON DELETE RESTRICT;


--
-- TOC entry 4623 (class 2606 OID 819212)
-- Name: usuario_token_accion fk_usuario_token_accion_persona_usuario; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_token_accion
    ADD CONSTRAINT fk_usuario_token_accion_persona_usuario FOREIGN KEY (id_persona) REFERENCES persona.persona_usuario(id_persona) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4617 (class 2606 OID 442405)
-- Name: rol_permiso rol_permiso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.rol_permiso
    ADD CONSTRAINT rol_permiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES seguridad.permiso(id_permiso) ON DELETE CASCADE;


--
-- TOC entry 4618 (class 2606 OID 442400)
-- Name: rol_permiso rol_permiso_id_rol_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.rol_permiso
    ADD CONSTRAINT rol_permiso_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES seguridad.rol(id_rol) ON DELETE CASCADE;


--
-- TOC entry 4615 (class 2606 OID 827397)
-- Name: sesion sesion_id_persona_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.sesion
    ADD CONSTRAINT sesion_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona_usuario(id_persona) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4621 (class 2606 OID 442441)
-- Name: usuario_permiso usuario_permiso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_permiso
    ADD CONSTRAINT usuario_permiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES seguridad.permiso(id_permiso) ON DELETE CASCADE;


--
-- TOC entry 4622 (class 2606 OID 827392)
-- Name: usuario_permiso usuario_permiso_id_persona_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_permiso
    ADD CONSTRAINT usuario_permiso_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona_usuario(id_persona) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4619 (class 2606 OID 442419)
-- Name: usuario_rol usuario_rol_id_persona_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_rol
    ADD CONSTRAINT usuario_rol_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona(id_persona) ON DELETE CASCADE;


--
-- TOC entry 4620 (class 2606 OID 442424)
-- Name: usuario_rol usuario_rol_id_rol_fkey; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuario_rol
    ADD CONSTRAINT usuario_rol_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES seguridad.rol(id_rol) ON DELETE CASCADE;


--
-- TOC entry 4549 (class 2606 OID 262175)
-- Name: asistencia_clase_curso asistencia_clase_curso_id_clase_curso_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.asistencia_clase_curso
    ADD CONSTRAINT asistencia_clase_curso_id_clase_curso_fkey FOREIGN KEY (id_clase_curso) REFERENCES servicios_educativos.clase_curso(id_clase_curso) ON DELETE CASCADE;


--
-- TOC entry 4550 (class 2606 OID 262180)
-- Name: asistencia_clase_curso asistencia_clase_curso_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.asistencia_clase_curso
    ADD CONSTRAINT asistencia_clase_curso_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES persona.persona_estudiante(id_persona) ON DELETE RESTRICT;


--
-- TOC entry 4545 (class 2606 OID 245804)
-- Name: clase_curso clase_curso_id_aula_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_curso
    ADD CONSTRAINT clase_curso_id_aula_fkey FOREIGN KEY (id_aula) REFERENCES infraestructura.espacio(id_espacio) ON DELETE SET NULL;


--
-- TOC entry 4546 (class 2606 OID 245799)
-- Name: clase_curso clase_curso_id_curso_version_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_curso
    ADD CONSTRAINT clase_curso_id_curso_version_fkey FOREIGN KEY (id_curso_version) REFERENCES servicios_educativos.curso_version(id_curso_version) ON DELETE CASCADE;


--
-- TOC entry 4547 (class 2606 OID 245809)
-- Name: clase_curso clase_curso_id_tutor_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_curso
    ADD CONSTRAINT clase_curso_id_tutor_fkey FOREIGN KEY (id_tutor) REFERENCES administracion.empleado(id_empleado) ON DELETE SET NULL;


--
-- TOC entry 4539 (class 2606 OID 458808)
-- Name: clase_por_hora clase_por_hora_id_aula_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_por_hora
    ADD CONSTRAINT clase_por_hora_id_aula_fkey FOREIGN KEY (id_aula) REFERENCES infraestructura.espacio(id_espacio);


--
-- TOC entry 4540 (class 2606 OID 458813)
-- Name: clase_por_hora clase_por_hora_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_por_hora
    ADD CONSTRAINT clase_por_hora_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES persona.persona_estudiante(id_persona);


--
-- TOC entry 4541 (class 2606 OID 229539)
-- Name: clase_por_hora clase_por_hora_id_materia_tree_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_por_hora
    ADD CONSTRAINT clase_por_hora_id_materia_tree_fkey FOREIGN KEY (id_materia_tree) REFERENCES servicios_educativos.materia_tree(id_tree);


--
-- TOC entry 4542 (class 2606 OID 458818)
-- Name: clase_por_hora clase_por_hora_id_tutor_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_por_hora
    ADD CONSTRAINT clase_por_hora_id_tutor_fkey FOREIGN KEY (id_tutor) REFERENCES persona.persona_tutor(id_tutor);


--
-- TOC entry 4543 (class 2606 OID 237627)
-- Name: curso_version curso_version_id_horario_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.curso_version
    ADD CONSTRAINT curso_version_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES servicios_educativos.horarios(id_horario);


--
-- TOC entry 4544 (class 2606 OID 237622)
-- Name: curso_version curso_version_id_producto_educativo_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.curso_version
    ADD CONSTRAINT curso_version_id_producto_educativo_fkey FOREIGN KEY (id_producto_educativo) REFERENCES servicios_educativos.producto_educativo(id_producto_educativo) ON DELETE CASCADE;


--
-- TOC entry 4548 (class 2606 OID 303122)
-- Name: clase_curso fk_clase_curso_tutor; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.clase_curso
    ADD CONSTRAINT fk_clase_curso_tutor FOREIGN KEY (id_tutor) REFERENCES persona.persona_tutor(id_tutor) ON DELETE SET NULL;


--
-- TOC entry 4535 (class 2606 OID 204949)
-- Name: producto_educativo producto_educativo_id_producto_tienda_fkey; Type: FK CONSTRAINT; Schema: servicios_educativos; Owner: -
--

ALTER TABLE ONLY servicios_educativos.producto_educativo
    ADD CONSTRAINT producto_educativo_id_producto_tienda_fkey FOREIGN KEY (id_producto_tienda) REFERENCES inventario.bien(id_bien);


--
-- TOC entry 4572 (class 2606 OID 319661)
-- Name: dividendo dividendo_id_clase_titulo_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo
    ADD CONSTRAINT dividendo_id_clase_titulo_fkey FOREIGN KEY (id_clase_titulo) REFERENCES societario.clase_titulo(id_clase_titulo) ON DELETE RESTRICT;


--
-- TOC entry 4573 (class 2606 OID 319681)
-- Name: dividendo_pago dividendo_pago_id_dividendo_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo_pago
    ADD CONSTRAINT dividendo_pago_id_dividendo_fkey FOREIGN KEY (id_dividendo) REFERENCES societario.dividendo(id_dividendo) ON DELETE CASCADE;


--
-- TOC entry 4574 (class 2606 OID 319686)
-- Name: dividendo_pago dividendo_pago_id_titular_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.dividendo_pago
    ADD CONSTRAINT dividendo_pago_id_titular_fkey FOREIGN KEY (id_titular) REFERENCES societario.titular(id_titular) ON DELETE RESTRICT;


--
-- TOC entry 4566 (class 2606 OID 319585)
-- Name: emision_titulo emision_titulo_id_clase_titulo_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.emision_titulo
    ADD CONSTRAINT emision_titulo_id_clase_titulo_fkey FOREIGN KEY (id_clase_titulo) REFERENCES societario.clase_titulo(id_clase_titulo) ON DELETE CASCADE;


--
-- TOC entry 4567 (class 2606 OID 319608)
-- Name: tenencia tenencia_id_emision_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.tenencia
    ADD CONSTRAINT tenencia_id_emision_fkey FOREIGN KEY (id_emision) REFERENCES societario.emision_titulo(id_emision) ON DELETE CASCADE;


--
-- TOC entry 4568 (class 2606 OID 319613)
-- Name: tenencia tenencia_id_titular_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.tenencia
    ADD CONSTRAINT tenencia_id_titular_fkey FOREIGN KEY (id_titular) REFERENCES societario.titular(id_titular) ON DELETE RESTRICT;


--
-- TOC entry 4565 (class 2606 OID 311312)
-- Name: titular titular_id_persona_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.titular
    ADD CONSTRAINT titular_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES persona.persona(id_persona) ON DELETE RESTRICT;


--
-- TOC entry 4569 (class 2606 OID 319633)
-- Name: transferencia_titulo transferencia_titulo_id_emision_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.transferencia_titulo
    ADD CONSTRAINT transferencia_titulo_id_emision_fkey FOREIGN KEY (id_emision) REFERENCES societario.emision_titulo(id_emision) ON DELETE CASCADE;


--
-- TOC entry 4570 (class 2606 OID 319643)
-- Name: transferencia_titulo transferencia_titulo_id_titular_destino_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.transferencia_titulo
    ADD CONSTRAINT transferencia_titulo_id_titular_destino_fkey FOREIGN KEY (id_titular_destino) REFERENCES societario.titular(id_titular) ON DELETE RESTRICT;


--
-- TOC entry 4571 (class 2606 OID 319638)
-- Name: transferencia_titulo transferencia_titulo_id_titular_origen_fkey; Type: FK CONSTRAINT; Schema: societario; Owner: -
--

ALTER TABLE ONLY societario.transferencia_titulo
    ADD CONSTRAINT transferencia_titulo_id_titular_origen_fkey FOREIGN KEY (id_titular_origen) REFERENCES societario.titular(id_titular) ON DELETE RESTRICT;


-- Completed on 2026-06-18 21:52:56

--
-- PostgreSQL database dump complete
--

