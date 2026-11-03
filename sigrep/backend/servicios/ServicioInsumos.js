const ServicioBase = require('./ServicioBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');
const ValidadorDeEntradas = require('../utilidades/ValidadorDeEntradas');
const ConstantesDelNegocio = require('../configuracion/ConstantesDelNegocio');
const Insumo = require('../dominio/Insumo');

class ServicioInsumos extends ServicioBase {
  constructor(repositorioInsumos) {
    super();
    this.repositorioInsumos = repositorioInsumos;
  }

  listarInsumosConAlertas() {
    return this.repositorioInsumos.buscarTodosOrdenadosPorNombre().map((insumo) => ({
      ...insumo,
      alertaDeExistenciaBaja: insumo.estaPorDebajoDeLaExistenciaMinima(),
      alertaDeCaducidadProxima: insumo.estaProximoACaducar(ConstantesDelNegocio.diasDeAnticipacionParaAlertarCaducidad),
    }));
  }

  obtenerInsumoPorIdentificador(identificador) {
    const insumo = this.repositorioInsumos.buscarPorIdentificador(identificador);
    if (!insumo) {
      throw new ErrorDeAplicacion('Insumo no encontrado.', 404);
    }
    return insumo;
  }

  registrarNuevoInsumo(datosDelInsumo) {
    const nombreValidado = ValidadorDeEntradas.exigirTextoNoVacio(datosDelInsumo.nombre, 'nombre');
    const unidadValidada = ValidadorDeEntradas.exigirTextoNoVacio(datosDelInsumo.unidad, 'unidad');
    const existenciaActualValidada = ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelInsumo.stock_actual ?? 0, 'stock_actual');
    const existenciaMinimaValidada = ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelInsumo.stock_minimo ?? 0, 'stock_minimo');
    const costoUnitarioValidado = ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelInsumo.costo_unitario ?? 0, 'costo_unitario');
    const nuevoInsumo = new Insumo({
      nombre: nombreValidado,
      unidadDeMedida: unidadValidada,
      existenciaActual: existenciaActualValidada,
      existenciaMinima: existenciaMinimaValidada,
      costoPorUnidad: costoUnitarioValidado,
      fechaDeCaducidad: datosDelInsumo.fecha_caducidad || null,
    });
    return this.repositorioInsumos.crearRegistro(nuevoInsumo);
  }

  actualizarDatosDelInsumo(identificador, datosDelInsumo) {
    const insumoExistente = this.obtenerInsumoPorIdentificador(identificador);
    const nombreValidado =
      datosDelInsumo.nombre !== undefined
        ? ValidadorDeEntradas.exigirTextoNoVacio(datosDelInsumo.nombre, 'nombre')
        : insumoExistente.nombre;
    const unidadValidada =
      datosDelInsumo.unidad !== undefined
        ? ValidadorDeEntradas.exigirTextoNoVacio(datosDelInsumo.unidad, 'unidad')
        : insumoExistente.unidadDeMedida;
    const existenciaActualValidada =
      datosDelInsumo.stock_actual !== undefined
        ? ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelInsumo.stock_actual, 'stock_actual')
        : insumoExistente.existenciaActual;
    const existenciaMinimaValidada =
      datosDelInsumo.stock_minimo !== undefined
        ? ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelInsumo.stock_minimo, 'stock_minimo')
        : insumoExistente.existenciaMinima;
    const costoUnitarioValidado =
      datosDelInsumo.costo_unitario !== undefined
        ? ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelInsumo.costo_unitario, 'costo_unitario')
        : insumoExistente.costoPorUnidad;
    const fechaDeCaducidadActualizada = datosDelInsumo.fecha_caducidad ?? insumoExistente.fechaDeCaducidad;
    const insumoActualizado = new Insumo({
      id: identificador,
      nombre: nombreValidado,
      unidadDeMedida: unidadValidada,
      existenciaActual: existenciaActualValidada,
      existenciaMinima: existenciaMinimaValidada,
      costoPorUnidad: costoUnitarioValidado,
      fechaDeCaducidad: fechaDeCaducidadActualizada,
    });
    return this.repositorioInsumos.actualizarRegistro(identificador, insumoActualizado);
  }

  eliminarInsumoPorIdentificador(identificador) {
    const seElimino = this.repositorioInsumos.eliminarRegistroPorIdentificador(identificador);
    if (!seElimino) {
      throw new ErrorDeAplicacion('Insumo no encontrado.', 404);
    }
  }

  ajustarExistenciaManualmente(identificador, cantidadADeltaAplicar) {
    const insumo = this.obtenerInsumoPorIdentificador(identificador);
    const delta = Number(cantidadADeltaAplicar);
    if (!Number.isFinite(delta)) {
      throw new ErrorDeAplicacion('delta debe ser un número.', 400);
    }
    const nuevaExistencia = Math.max(0, insumo.existenciaActual + delta);
    return this.repositorioInsumos.actualizarExistenciaDelInsumo(identificador, nuevaExistencia);
  }
}

module.exports = ServicioInsumos;
