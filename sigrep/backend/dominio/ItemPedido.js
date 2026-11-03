const ItemDeAsociacion = require('./ItemDeAsociacion');

class ItemPedido extends ItemDeAsociacion {
  constructor({ identificadorDeProducto, cantidadSolicitada, precioUnitarioPactado, nombreDelProducto }) {
    super();
    this.identificadorDeProducto = identificadorDeProducto;
    this.cantidadSolicitada = cantidadSolicitada;
    this.precioUnitarioPactado = precioUnitarioPactado;
    this.nombreDelProducto = nombreDelProducto;
  }

  calcularSubtotal() {
    return this.cantidadSolicitada * this.precioUnitarioPactado;
  }

  static crearDesdeFilaDeBaseDeDatos(fila) {
    return new ItemPedido({
      identificadorDeProducto: fila.producto_id,
      cantidadSolicitada: fila.cantidad,
      precioUnitarioPactado: fila.precio_unitario,
      nombreDelProducto: fila.nombre_del_producto,
    });
  }
}

module.exports = ItemPedido;
