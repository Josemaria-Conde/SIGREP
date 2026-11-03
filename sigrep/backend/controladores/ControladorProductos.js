const ControladorBase = require('./ControladorBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');

class ControladorProductos extends ControladorBase {
  constructor(servicioInventario) {
    super();
    this.servicioInventario = servicioInventario;
  }

  registrarRutas(enrutadorExpress) {
    enrutadorExpress.get('/', this.manejarListarProductos);
    enrutadorExpress.get('/:id', this.manejarObtenerProductoConCosto);
    enrutadorExpress.post('/', this.manejarRegistrarNuevoProducto);
    enrutadorExpress.put('/:id', this.manejarActualizarDatosDelProducto);
    enrutadorExpress.delete('/:id', this.manejarEliminarProducto);
    enrutadorExpress.post('/:id/receta', this.manejarAgregarInsumoALaReceta);
    enrutadorExpress.delete('/:id/receta/:insumoId', this.manejarQuitarInsumoDeLaReceta);
    enrutadorExpress.post('/:id/producir', this.manejarProducirUnidadesDeProducto);
  }

  manejarListarProductos = (peticion, respuesta) => {
    respuesta.json(this.servicioInventario.listarProductosConCostoYPrecioCalculado());
  };

  manejarObtenerProductoConCosto = (peticion, respuesta) => {
    const resultado = this.servicioInventario.obtenerProductoConCostoYPrecioCalculado(peticion.params.id);
    if (!resultado) {
      throw new ErrorDeAplicacion('Producto no encontrado.', 404);
    }
    respuesta.json(resultado);
  };

  manejarRegistrarNuevoProducto = (peticion, respuesta) => {
    respuesta.status(201).json(this.servicioInventario.registrarNuevoProducto(peticion.body));
  };

  manejarActualizarDatosDelProducto = (peticion, respuesta) => {
    respuesta.json(this.servicioInventario.actualizarDatosDelProducto(peticion.params.id, peticion.body));
  };

  manejarEliminarProducto = (peticion, respuesta) => {
    this.servicioInventario.eliminarProductoPorIdentificador(peticion.params.id);
    respuesta.status(204).send();
  };

  manejarAgregarInsumoALaReceta = (peticion, respuesta) => {
    respuesta
      .status(201)
      .json(
        this.servicioInventario.agregarInsumoALaRecetaDeProducto(
          peticion.params.id,
          peticion.body.insumo_id,
          peticion.body.cantidad
        )
      );
  };

  manejarQuitarInsumoDeLaReceta = (peticion, respuesta) => {
    respuesta.json(this.servicioInventario.quitarInsumoDeLaRecetaDeProducto(peticion.params.id, peticion.params.insumoId));
  };

  manejarProducirUnidadesDeProducto = (peticion, respuesta) => {
    const resultado = this.servicioInventario.producirOVenderUnidadesDeProducto(peticion.params.id, peticion.body.cantidad ?? 1);
    respuesta.json({
      mensaje: `Producción de ${resultado.cantidad} x ${resultado.producto.nombre} registrada.`,
      alertas: resultado.alertas,
    });
  };
}

module.exports = ControladorProductos;
