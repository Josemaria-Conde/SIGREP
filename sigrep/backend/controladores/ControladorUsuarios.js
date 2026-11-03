const ControladorBase = require('./ControladorBase');

class ControladorUsuarios extends ControladorBase {
  constructor(servicioAutenticacion) {
    super();
    this.servicioAutenticacion = servicioAutenticacion;
  }

  registrarRutas(enrutadorExpress) {
    enrutadorExpress.get('/', this.manejarListarUsuarios);
    enrutadorExpress.post('/login', this.manejarIniciarSesion);
    enrutadorExpress.post('/', this.manejarRegistrarNuevoUsuario);
    enrutadorExpress.delete('/:id', this.manejarEliminarUsuario);
  }

  manejarListarUsuarios = (peticion, respuesta) => {
    respuesta.json(this.servicioAutenticacion.listarUsuariosConDatosPublicos());
  };

  manejarIniciarSesion = (peticion, respuesta) => {
    respuesta.json(this.servicioAutenticacion.autenticarUsuario(peticion.body.usuario, peticion.body.password));
  };

  manejarRegistrarNuevoUsuario = (peticion, respuesta) => {
    respuesta.status(201).json(this.servicioAutenticacion.registrarNuevoUsuario(peticion.body));
  };

  manejarEliminarUsuario = (peticion, respuesta) => {
    this.servicioAutenticacion.eliminarUsuarioPorIdentificador(peticion.params.id);
    respuesta.status(204).send();
  };
}

module.exports = ControladorUsuarios;
