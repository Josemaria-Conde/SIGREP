const ControladorBase = require('./ControladorBase');

class ControladorPedidos extends ControladorBase {
  constructor(servicioPedidos) {
    super();
    this.servicioPedidos = servicioPedidos;
  }

  registrarRutas(enrutadorExpress) {
    enrutadorExpress.get('/', this.manejarListarPedidos);
    enrutadorExpress.get('/:id', this.manejarObtenerPedido);
    enrutadorExpress.post('/', this.manejarCrearPedido);
    enrutadorExpress.put('/:id/estado', this.manejarCambiarEstadoDelPedido);
    enrutadorExpress.delete('/:id', this.manejarEliminarPedido);
  }

  manejarListarPedidos = (peticion, respuesta) => {
    respuesta.json(this.servicioPedidos.listarPedidosFiltradosPorEstado(peticion.query.estado));
  };

  manejarObtenerPedido = (peticion, respuesta) => {
    respuesta.json(this.servicioPedidos.obtenerPedidoConSusProductosSolicitados(peticion.params.id));
  };

  manejarCrearPedido = (peticion, respuesta) => {
    respuesta.status(201).json(this.servicioPedidos.crearPedidoConProductosSolicitados(peticion.body));
  };

  manejarCambiarEstadoDelPedido = (peticion, respuesta) => {
    respuesta.json(this.servicioPedidos.cambiarEstadoDelPedido(peticion.params.id, peticion.body.estado));
  };

  manejarEliminarPedido = (peticion, respuesta) => {
    this.servicioPedidos.eliminarPedidoPorIdentificador(peticion.params.id);
    respuesta.status(204).send();
  };
}

module.exports = ControladorPedidos;
