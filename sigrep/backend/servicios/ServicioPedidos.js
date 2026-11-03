const ServicioBase = require('./ServicioBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');
const ValidadorDeEntradas = require('../utilidades/ValidadorDeEntradas');
const ConstantesDelNegocio = require('../configuracion/ConstantesDelNegocio');
const Pedido = require('../dominio/Pedido');
const ItemPedido = require('../dominio/ItemPedido');

class ServicioPedidos extends ServicioBase {
  constructor(repositorioPedidos, repositorioProductos) {
    super();
    this.repositorioPedidos = repositorioPedidos;
    this.repositorioProductos = repositorioProductos;
  }

  listarPedidosFiltradosPorEstado(estado) {
    const pedidosEncontrados = estado
      ? this.repositorioPedidos.buscarTodosFiltradosPorEstado(estado)
      : this.repositorioPedidos.buscarTodosOrdenadosPorFechaDeEntrega();
    return pedidosEncontrados.map((pedido) => this.repositorioPedidos.buscarPedidoConSusProductosSolicitados(pedido.id));
  }

  obtenerPedidoConSusProductosSolicitados(identificadorDePedido) {
    const pedido = this.repositorioPedidos.buscarPedidoConSusProductosSolicitados(identificadorDePedido);
    if (!pedido) {
      throw new ErrorDeAplicacion('Pedido no encontrado.', 404);
    }
    return pedido;
  }

  construirItemsPedidoValidados(productosSolicitados) {
    if (!Array.isArray(productosSolicitados) || productosSolicitados.length === 0) {
      throw new ErrorDeAplicacion('El pedido debe incluir al menos un producto.', 400);
    }
    return productosSolicitados.map((itemSolicitado) => {
      if (!itemSolicitado.producto_id) {
        throw new ErrorDeAplicacion('Cada producto del pedido requiere producto_id.', 400);
      }
      const productoExiste = this.repositorioProductos.buscarPorIdentificador(itemSolicitado.producto_id);
      if (!productoExiste) {
        throw new ErrorDeAplicacion(`Producto ${itemSolicitado.producto_id} no encontrado.`, 404);
      }
      return new ItemPedido({
        identificadorDeProducto: itemSolicitado.producto_id,
        cantidadSolicitada: ValidadorDeEntradas.exigirNumeroPositivo(itemSolicitado.cantidad ?? 1, 'cantidad'),
        precioUnitarioPactado: ValidadorDeEntradas.exigirNumeroNoNegativo(itemSolicitado.precio_unitario ?? 0, 'precio_unitario'),
      });
    });
  }

  crearPedidoConProductosSolicitados(datosDelPedido) {
    const fechaDeEntregaValidada = ValidadorDeEntradas.exigirTextoNoVacio(datosDelPedido.fecha_entrega, 'fecha_entrega');
    const itemsValidados = this.construirItemsPedidoValidados(datosDelPedido.productos);
    const nuevoPedido = new Pedido({
      identificadorDeCliente: datosDelPedido.cliente_id || null,
      fechaDeEntrega: fechaDeEntregaValidada,
      especificaciones: datosDelPedido.especificaciones || '',
      estado: ConstantesDelNegocio.estadoInicialDePedido,
      productosSolicitados: itemsValidados,
    });
    return this.repositorioPedidos.crearPedidoConSusProductosSolicitados(nuevoPedido);
  }

  cambiarEstadoDelPedido(identificadorDePedido, nuevoEstado) {
    const estadoValidado = ValidadorDeEntradas.exigirValorDentroDelConjuntoPermitido(
      nuevoEstado,
      ConstantesDelNegocio.estadosDePedidoValidos,
      'estado'
    );
    const seActualizo = this.repositorioPedidos.actualizarEstadoDelPedido(identificadorDePedido, estadoValidado);
    if (!seActualizo) {
      throw new ErrorDeAplicacion('Pedido no encontrado.', 404);
    }
    return this.obtenerPedidoConSusProductosSolicitados(identificadorDePedido);
  }

  eliminarPedidoPorIdentificador(identificadorDePedido) {
    const seElimino = this.repositorioPedidos.eliminarRegistroPorIdentificador(identificadorDePedido);
    if (!seElimino) {
      throw new ErrorDeAplicacion('Pedido no encontrado.', 404);
    }
  }
}

module.exports = ServicioPedidos;
