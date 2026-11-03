const RepositorioBase = require('./RepositorioBase');
const Venta = require('../dominio/Venta');

class RepositorioVentas extends RepositorioBase {
  obtenerNombreDeTabla() {
    return 'ventas';
  }

  convertirFilaEnEntidad(fila) {
    return Venta.crearDesdeFilaDeBaseDeDatos(fila);
  }

  convertirEntidadEnFila(entidad) {
    return entidad.convertirseEnFilaDeBaseDeDatos();
  }

  buscarTodasOrdenadasPorFechaDescendente() {
    return this.conexionBaseDeDatos
      .prepararConsulta(
        `SELECT ventas.*, productos.nombre AS nombre_del_producto
         FROM ventas JOIN productos ON productos.id = ventas.producto_id
         ORDER BY ventas.fecha DESC`
      )
      .all();
  }

  calcularTotalAcumuladoDeVentas() {
    return this.conexionBaseDeDatos.prepararConsulta('SELECT COALESCE(SUM(total), 0) AS total FROM ventas').get().total;
  }

  contarNumeroDeVentasRegistradas() {
    return this.conexionBaseDeDatos.prepararConsulta('SELECT COUNT(*) AS cantidad FROM ventas').get().cantidad;
  }

  buscarProductosMasVendidos(cantidadMaximaDeResultados) {
    return this.conexionBaseDeDatos
      .prepararConsulta(
        `SELECT productos.nombre AS nombre, SUM(ventas.cantidad) AS unidades, SUM(ventas.total) AS ingresos
         FROM ventas JOIN productos ON productos.id = ventas.producto_id
         GROUP BY ventas.producto_id ORDER BY unidades DESC LIMIT ?`
      )
      .all(cantidadMaximaDeResultados);
  }
}

module.exports = RepositorioVentas;
