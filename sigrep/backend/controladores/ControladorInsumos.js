const ControladorBase = require('./ControladorBase');

class ControladorInsumos extends ControladorBase {
  constructor(servicioInsumos) {
    super();
    this.servicioInsumos = servicioInsumos;
  }

  registrarRutas(enrutadorExpress) {
    enrutadorExpress.get('/', this.manejarListarInsumos);
    enrutadorExpress.get('/:id', this.manejarObtenerInsumoPorIdentificador);
    enrutadorExpress.post('/', this.manejarRegistrarNuevoInsumo);
    enrutadorExpress.put('/:id', this.manejarActualizarDatosDelInsumo);
    enrutadorExpress.delete('/:id', this.manejarEliminarInsumo);
    enrutadorExpress.patch('/:id/ajustar-stock', this.manejarAjustarExistenciaDelInsumo);
  }

  manejarListarInsumos = (peticion, respuesta) => {
    respuesta.json(this.servicioInsumos.listarInsumosConAlertas());
  };

  manejarObtenerInsumoPorIdentificador = (peticion, respuesta) => {
    respuesta.json(this.servicioInsumos.obtenerInsumoPorIdentificador(peticion.params.id));
  };

  manejarRegistrarNuevoInsumo = (peticion, respuesta) => {
    respuesta.status(201).json(this.servicioInsumos.registrarNuevoInsumo(peticion.body));
  };

  manejarActualizarDatosDelInsumo = (peticion, respuesta) => {
    respuesta.json(this.servicioInsumos.actualizarDatosDelInsumo(peticion.params.id, peticion.body));
  };

  manejarEliminarInsumo = (peticion, respuesta) => {
    this.servicioInsumos.eliminarInsumoPorIdentificador(peticion.params.id);
    respuesta.status(204).send();
  };

  manejarAjustarExistenciaDelInsumo = (peticion, respuesta) => {
    respuesta.json(this.servicioInsumos.ajustarExistenciaManualmente(peticion.params.id, peticion.body.delta));
  };
}

module.exports = ControladorInsumos;
