// Error de aplicación con código HTTP asociado.
// Permite que las rutas usen "throw new AppError(...)" en lugar de
// construir manualmente la respuesta res.status(...).json(...) en cada
// punto de validación. El middleware de errores en server.js decide
// cómo responder según el statusCode adjunto.
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

module.exports = { AppError };
