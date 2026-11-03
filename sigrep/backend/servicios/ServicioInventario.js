const ServicioBase = require('./ServicioBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');
const ValidadorDeEntradas = require('../utilidades/ValidadorDeEntradas');
const ConstantesDelNegocio = require('../configuracion/ConstantesDelNegocio');
const Producto = require('../dominio/Producto');

class ServicioInventario extends ServicioBase {
  constructor(repositorioProductos, repositorioInsumos) {
    super();
    this.repositorioProductos = repositorioProductos;
    this.repositorioInsumos = repositorioInsumos;
  }

  listarProductosConCostoYPrecioCalculado() {
    return this.repositorioProductos
      .buscarTodosOrdenadosPorNombre()
      .map((producto) => this.obtenerProductoConCostoYPrecioCalculado(producto.id));
  }

  obtenerProductoConCostoYPrecioCalculado(identificadorDeProducto) {
    const producto = this.repositorioProductos.buscarProductoConSuReceta(identificadorDeProducto);
    if (!producto) {
      return null;
    }
    return {
      producto,
      receta: producto.receta,
      costoDeInsumos: Number(producto.calcularCostoDeInsumosParaProducir(1).toFixed(2)),
      costoDeManoDeObra: producto.costoDeManoDeObra,
      costoTotal: Number(producto.calcularCostoTotalParaProducir(1).toFixed(2)),
      margenDeGananciaDeseado: producto.margenDeGananciaDeseado,
      precioDeVentaSugerido: Number(producto.calcularPrecioDeVentaUnitarioSugerido().toFixed(2)),
    };
  }

  registrarNuevoProducto(datosDelProducto) {
    const nombreValidado = ValidadorDeEntradas.exigirTextoNoVacio(datosDelProducto.nombre, 'nombre');
    const costoDeManoDeObraValidado = ValidadorDeEntradas.exigirNumeroNoNegativo(
      datosDelProducto.costo_mano_obra ?? 0,
      'costo_mano_obra'
    );
    const margenValidado = ValidadorDeEntradas.exigirNumeroNoNegativo(
      datosDelProducto.margen_deseado ?? ConstantesDelNegocio.margenDeGananciaPorDefecto,
      'margen_deseado'
    );
    const nuevoProducto = new Producto({
      nombre: nombreValidado,
      descripcion: datosDelProducto.descripcion || '',
      costoDeManoDeObra: costoDeManoDeObraValidado,
      margenDeGananciaDeseado: margenValidado,
    });
    const productoCreado = this.repositorioProductos.crearRegistro(nuevoProducto);
    return this.obtenerProductoConCostoYPrecioCalculado(productoCreado.id);
  }

  actualizarDatosDelProducto(identificadorDeProducto, datosDelProducto) {
    const productoExistente = this.repositorioProductos.buscarPorIdentificador(identificadorDeProducto);
    if (!productoExistente) {
      throw new ErrorDeAplicacion('Producto no encontrado.', 404);
    }
    const nombreValidado =
      datosDelProducto.nombre !== undefined
        ? ValidadorDeEntradas.exigirTextoNoVacio(datosDelProducto.nombre, 'nombre')
        : productoExistente.nombre;
    const costoDeManoDeObraValidado =
      datosDelProducto.costo_mano_obra !== undefined
        ? ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelProducto.costo_mano_obra, 'costo_mano_obra')
        : productoExistente.costoDeManoDeObra;
    const margenValidado =
      datosDelProducto.margen_deseado !== undefined
        ? ValidadorDeEntradas.exigirNumeroNoNegativo(datosDelProducto.margen_deseado, 'margen_deseado')
        : productoExistente.margenDeGananciaDeseado;
    const productoActualizado = new Producto({
      id: identificadorDeProducto,
      nombre: nombreValidado,
      descripcion: datosDelProducto.descripcion ?? productoExistente.descripcion,
      costoDeManoDeObra: costoDeManoDeObraValidado,
      margenDeGananciaDeseado: margenValidado,
    });
    this.repositorioProductos.actualizarRegistro(identificadorDeProducto, productoActualizado);
    return this.obtenerProductoConCostoYPrecioCalculado(identificadorDeProducto);
  }

  eliminarProductoPorIdentificador(identificadorDeProducto) {
    const seElimino = this.repositorioProductos.eliminarRegistroPorIdentificador(identificadorDeProducto);
    if (!seElimino) {
      throw new ErrorDeAplicacion('Producto no encontrado.', 404);
    }
  }

  agregarInsumoALaRecetaDeProducto(identificadorDeProducto, identificadorDeInsumo, cantidadRequeridaPorUnidad) {
    const cantidadValidada = ValidadorDeEntradas.exigirNumeroNoNegativo(cantidadRequeridaPorUnidad, 'cantidad');
    if (!identificadorDeInsumo) {
      throw new ErrorDeAplicacion('insumo_id es requerido.', 400);
    }
    const producto = this.repositorioProductos.buscarPorIdentificador(identificadorDeProducto);
    const insumo = this.repositorioInsumos.buscarPorIdentificador(identificadorDeInsumo);
    if (!producto) {
      throw new ErrorDeAplicacion('Producto no encontrado.', 404);
    }
    if (!insumo) {
      throw new ErrorDeAplicacion('Insumo no encontrado.', 404);
    }
    this.repositorioProductos.agregarOActualizarItemDeLaReceta(identificadorDeProducto, identificadorDeInsumo, cantidadValidada);
    return this.obtenerProductoConCostoYPrecioCalculado(identificadorDeProducto);
  }

  quitarInsumoDeLaRecetaDeProducto(identificadorDeProducto, identificadorDeInsumo) {
    this.repositorioProductos.quitarItemDeLaReceta(identificadorDeProducto, identificadorDeInsumo);
    return this.obtenerProductoConCostoYPrecioCalculado(identificadorDeProducto);
  }

  verificarQueHayaExistenciaSuficienteParaProducir(producto, cantidadAProducir) {
    producto.receta.forEach((itemReceta) => {
      const insumo = this.repositorioInsumos.buscarPorIdentificador(itemReceta.identificadorDeInsumo);
      const cantidadRequerida = itemReceta.calcularCantidadRequeridaParaProducir(cantidadAProducir);
      if (!insumo.tieneExistenciaSuficiente(cantidadRequerida)) {
        throw new ErrorDeAplicacion(
          `Stock insuficiente de ${insumo.nombre}. Disponible: ${insumo.existenciaActual}${insumo.unidadDeMedida}, requerido: ${cantidadRequerida}${insumo.unidadDeMedida}.`,
          400
        );
      }
    });
  }

  descontarInsumosUsadosAlProducir(producto, cantidadAProducir) {
    producto.receta.forEach((itemReceta) => {
      const insumo = this.repositorioInsumos.buscarPorIdentificador(itemReceta.identificadorDeInsumo);
      insumo.descontarExistencia(itemReceta.calcularCantidadRequeridaParaProducir(cantidadAProducir));
      this.repositorioInsumos.actualizarExistenciaDelInsumo(insumo.id, insumo.existenciaActual);
    });
  }

  obtenerAlertasDeExistenciaBajaTrasProducir(producto) {
    return producto.receta
      .map((itemReceta) => this.repositorioInsumos.buscarPorIdentificador(itemReceta.identificadorDeInsumo))
      .filter((insumo) => insumo.estaPorDebajoDeLaExistenciaMinima())
      .map((insumo) => `${insumo.nombre} está por debajo del stock mínimo (${insumo.existenciaActual}${insumo.unidadDeMedida}).`);
  }

  producirOVenderUnidadesDeProducto(identificadorDeProducto, cantidadSolicitada) {
    const cantidadValidada = ValidadorDeEntradas.exigirNumeroPositivo(cantidadSolicitada, 'cantidad');
    const producto = this.repositorioProductos.buscarProductoConSuReceta(identificadorDeProducto);
    if (!producto) {
      throw new ErrorDeAplicacion('Producto no encontrado.', 404);
    }
    this.verificarQueHayaExistenciaSuficienteParaProducir(producto, cantidadValidada);
    this.descontarInsumosUsadosAlProducir(producto, cantidadValidada);
    const precioUnitarioSugerido = producto.calcularPrecioDeVentaUnitarioSugerido();
    return {
      producto,
      cantidad: cantidadValidada,
      precioUnitario: Number(precioUnitarioSugerido.toFixed(2)),
      total: Number((precioUnitarioSugerido * cantidadValidada).toFixed(2)),
      alertas: this.obtenerAlertasDeExistenciaBajaTrasProducir(producto),
    };
  }
}

module.exports = ServicioInventario;
