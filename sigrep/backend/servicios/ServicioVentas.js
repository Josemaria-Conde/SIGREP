const ServicioBase = require('./ServicioBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');
const Venta = require('../dominio/Venta');

class ServicioVentas extends ServicioBase {
  constructor(repositorioVentas, repositorioInsumos, servicioInventario) {
    super();
    this.repositorioVentas = repositorioVentas;
    this.repositorioInsumos = repositorioInsumos;
    this.servicioInventario = servicioInventario;
  }

  listarVentasRegistradas() {
    return this.repositorioVentas.buscarTodasOrdenadasPorFechaDescendente();
  }

  registrarVentaDeMostrador(identificadorDeProducto, cantidadVendida) {
    if (!identificadorDeProducto) {
      throw new ErrorDeAplicacion('producto_id es requerido.', 400);
    }
    const resultadoDeLaVenta = this.servicioInventario.producirOVenderUnidadesDeProducto(identificadorDeProducto, cantidadVendida);
    const nuevaVenta = new Venta({
      identificadorDeProducto,
      cantidadVendida: resultadoDeLaVenta.cantidad,
      totalCobrado: resultadoDeLaVenta.total,
    });
    const ventaRegistrada = this.repositorioVentas.crearRegistro(nuevaVenta);
    return { ...ventaRegistrada, alertas: resultadoDeLaVenta.alertas };
  }

  generarResumenDeVentasYExistencias() {
    return {
      totalDeVentas: Number(this.repositorioVentas.calcularTotalAcumuladoDeVentas().toFixed(2)),
      numeroDeVentas: this.repositorioVentas.contarNumeroDeVentasRegistradas(),
      productosMasVendidos: this.repositorioVentas.buscarProductosMasVendidos(5),
      insumosConExistenciaBaja: this.repositorioInsumos
        .buscarTodosOrdenadosPorNombre()
        .filter((insumo) => insumo.estaPorDebajoDeLaExistenciaMinima()),
    };
  }
}

module.exports = ServicioVentas;
