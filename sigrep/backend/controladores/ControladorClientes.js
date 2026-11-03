const ControladorBase = require('./ControladorBase');

class ControladorClientes extends ControladorBase {
  constructor(servicioClientes) {
    super();
    this.servicioClientes = servicioClientes;
  }

  registrarRutas(enrutadorExpress) {
    enrutadorExpress.get('/', this.manejarListarClientes);
    enrutadorExpress.get('/:id', this.manejarObtenerClienteConSusPedidos);
    enrutadorExpress.post('/', this.manejarRegistrarNuevoCliente);
    enrutadorExpress.put('/:id', this.manejarActualizarDatosDelCliente);
    enrutadorExpress.delete('/:id', this.manejarEliminarCliente);
  }

  manejarListarClientes = (peticion, respuesta) => {
    respuesta.json(this.servicioClientes.listarClientes());
  };

  manejarObtenerClienteConSusPedidos = (peticion, respuesta) => {
    const { cliente, pedidosDelCliente } = this.servicioClientes.obtenerClienteConSusPedidos(peticion.params.id);
    respuesta.json({ ...cliente, pedidos: pedidosDelCliente });
  };

  manejarRegistrarNuevoCliente = (peticion, respuesta) => {
    respuesta.status(201).json(this.servicioClientes.registrarNuevoCliente(peticion.body));
  };

  manejarActualizarDatosDelCliente = (peticion, respuesta) => {
    respuesta.json(this.servicioClientes.actualizarDatosDelCliente(peticion.params.id, peticion.body));
  };

  manejarEliminarCliente = (peticion, respuesta) => {
    this.servicioClientes.eliminarClientePorIdentificador(peticion.params.id);
    respuesta.status(204).send();
  };
}

module.exports = ControladorClientes;
