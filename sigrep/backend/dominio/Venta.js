const EntidadBase = require('./EntidadBase');

class Venta extends EntidadBase {
  constructor({ id, identificadorDeProducto, cantidadVendida, totalCobrado, fechaDeLaVenta }) {
    super(id);
    this.identificadorDeProducto = identificadorDeProducto;
    this.cantidadVendida = cantidadVendida;
    this.totalCobrado = totalCobrado;
    this.fechaDeLaVenta = fechaDeLaVenta;
  }

  convertirseEnFilaDeBaseDeDatos() {
    return {
      producto_id: this.identificadorDeProducto,
      cantidad: this.cantidadVendida,
      total: this.totalCobrado,
    };
  }

  static crearDesdeFilaDeBaseDeDatos(fila) {
    return new Venta({
      id: fila.id,
      identificadorDeProducto: fila.producto_id,
      cantidadVendida: fila.cantidad,
      totalCobrado: fila.total,
      fechaDeLaVenta: fila.fecha,
    });
  }
}

module.exports = Venta;
