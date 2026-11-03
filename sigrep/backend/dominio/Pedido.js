const EntidadBase = require('./EntidadBase');

class Pedido extends EntidadBase {
  constructor({ id, identificadorDeCliente, fechaDeEntrega, especificaciones, estado, productosSolicitados }) {
    super(id);
    this.identificadorDeCliente = identificadorDeCliente;
    this.fechaDeEntrega = fechaDeEntrega;
    this.especificaciones = especificaciones;
    this.estado = estado;
    this.productosSolicitados = productosSolicitados || [];
  }

  agregarProductoSolicitado(itemPedido) {
    this.productosSolicitados.push(itemPedido);
  }

  calcularTotalDelPedido() {
    return this.productosSolicitados.reduce(
      (sumaAcumulada, itemPedido) => sumaAcumulada + itemPedido.calcularSubtotal(),
      0
    );
  }

  puedeTransicionarA(nuevoEstado) {
    return Pedido.ESTADOS_VALIDOS.includes(nuevoEstado);
  }

  cambiarEstado(nuevoEstado) {
    if (!this.puedeTransicionarA(nuevoEstado)) {
      throw new Error('El estado solicitado no es un estado válido para un pedido');
    }
    this.estado = nuevoEstado;
  }

  convertirseEnFilaDeBaseDeDatos() {
    return {
      cliente_id: this.identificadorDeCliente,
      fecha_entrega: this.fechaDeEntrega,
      especificaciones: this.especificaciones,
      estado: this.estado,
    };
  }

  static crearDesdeFilaDeBaseDeDatos(fila, productosSolicitados = []) {
    return new Pedido({
      id: fila.id,
      identificadorDeCliente: fila.cliente_id,
      fechaDeEntrega: fila.fecha_entrega,
      especificaciones: fila.especificaciones,
      estado: fila.estado,
      productosSolicitados,
    });
  }
}

Pedido.ESTADOS_VALIDOS = ['pendiente', 'en_produccion', 'listo', 'entregado', 'cancelado'];

module.exports = Pedido;
