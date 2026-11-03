const RepositorioBase = require('./RepositorioBase');
const Pedido = require('../dominio/Pedido');
const ItemPedido = require('../dominio/ItemPedido');

class RepositorioPedidos extends RepositorioBase {
  obtenerNombreDeTabla() {
    return 'pedidos';
  }

  convertirFilaEnEntidad(fila) {
    return Pedido.crearDesdeFilaDeBaseDeDatos(fila);
  }

  convertirEntidadEnFila(entidad) {
    return entidad.convertirseEnFilaDeBaseDeDatos();
  }

  buscarTodosOrdenadosPorFechaDeEntrega() {
    return this.buscarTodosOrdenadosPor('fecha_entrega');
  }

  buscarTodosFiltradosPorEstado(estado) {
    const filasEncontradas = this.conexionBaseDeDatos
      .prepararConsulta('SELECT * FROM pedidos WHERE estado = ? ORDER BY fecha_entrega')
      .all(estado);
    return filasEncontradas.map((fila) => this.convertirFilaEnEntidad(fila));
  }

  buscarProductosSolicitadosDelPedido(identificadorDePedido) {
    const filasEncontradas = this.conexionBaseDeDatos
      .prepararConsulta(
        `SELECT pedido_producto.producto_id AS producto_id, pedido_producto.cantidad AS cantidad, pedido_producto.precio_unitario AS precio_unitario, productos.nombre AS nombre_del_producto
         FROM pedido_producto
         JOIN productos ON productos.id = pedido_producto.producto_id
         WHERE pedido_producto.pedido_id = ?`
      )
      .all(identificadorDePedido);
    return filasEncontradas.map((fila) => ItemPedido.crearDesdeFilaDeBaseDeDatos(fila));
  }

  buscarPedidoConSusProductosSolicitados(identificadorDePedido) {
    const pedido = this.buscarPorIdentificador(identificadorDePedido);
    if (!pedido) {
      return null;
    }
    pedido.productosSolicitados = this.buscarProductosSolicitadosDelPedido(identificadorDePedido);
    return pedido;
  }

  crearPedidoConSusProductosSolicitados(pedido) {
    const transaccionDeCreacion = this.conexionBaseDeDatos.ejecutarComoTransaccionAtomica(() => {
      const pedidoCreado = this.crearRegistro(pedido);
      pedido.productosSolicitados.forEach((itemPedido) => {
        this.conexionBaseDeDatos
          .prepararConsulta(
            'INSERT INTO pedido_producto (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)'
          )
          .run(
            pedidoCreado.id,
            itemPedido.identificadorDeProducto,
            itemPedido.cantidadSolicitada,
            itemPedido.precioUnitarioPactado
          );
      });
      return pedidoCreado.id;
    });
    const identificadorDelPedidoCreado = transaccionDeCreacion();
    return this.buscarPedidoConSusProductosSolicitados(identificadorDelPedidoCreado);
  }

  actualizarEstadoDelPedido(identificadorDePedido, nuevoEstado) {
    const resultadoDeLaActualizacion = this.conexionBaseDeDatos
      .prepararConsulta('UPDATE pedidos SET estado = ? WHERE id = ?')
      .run(nuevoEstado, identificadorDePedido);
    return resultadoDeLaActualizacion.changes > 0;
  }
}

module.exports = RepositorioPedidos;
