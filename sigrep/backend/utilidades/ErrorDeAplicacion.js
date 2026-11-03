class ErrorDeAplicacion extends Error {
  constructor(mensaje, codigoDeEstadoHttp = 400) {
    super(mensaje);
    this.name = 'ErrorDeAplicacion';
    this.codigoDeEstadoHttp = codigoDeEstadoHttp;
  }
}

module.exports = ErrorDeAplicacion;
