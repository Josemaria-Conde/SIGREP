const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');

class ManejadorDeErrores {
  static manejar(error, peticion, respuesta, siguiente) {
    if (error instanceof ErrorDeAplicacion) {
      respuesta.status(error.codigoDeEstadoHttp).json({ error: error.message });
      return;
    }
    respuesta.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = ManejadorDeErrores;
