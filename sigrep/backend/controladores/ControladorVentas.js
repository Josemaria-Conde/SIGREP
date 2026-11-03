const ControladorBase = require('./ControladorBase');

class ControladorVentas extends ControladorBase {
  constructor(servicioVentas) {
    super();
    this.servicioVentas = servicioVentas;
  }

  registrarRutas(enrutadorExpress) {
    enrutadorExpress.get('/', this.manejarListarVentas);
    enrutadorExpress.post('/', this.manejarRegistrarVenta);
    enrutadorExpress.get('/reportes/resumen', this.manejarGenerarResumenDeReportes);
  }

  manejarListarVentas = (peticion, respuesta) => {
    respuesta.json(this.servicioVentas.listarVentasRegistradas());
  };

  manejarRegistrarVenta = (peticion, respuesta) => {
    respuesta.status(201).json(this.servicioVentas.registrarVentaDeMostrador(peticion.body.producto_id, peticion.body.cantidad));
  };

  manejarGenerarResumenDeReportes = (peticion, respuesta) => {
    respuesta.json(this.servicioVentas.generarResumenDeVentasYExistencias());
  };
}

module.exports = ControladorVentas;
