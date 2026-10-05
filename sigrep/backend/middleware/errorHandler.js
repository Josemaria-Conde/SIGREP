const { AppError } = require('../utils/errors');

// Middleware de manejo de errores de Express (debe registrarse al final,
// después de todas las rutas: Express lo identifica por tener 4
// parámetros). Centraliza la respuesta de error para que las rutas solo
// necesiten "throw new AppError(...)" o dejar que un error inesperado
// suba, sin tener que armar res.status().json() en cada punto.
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Error no anticipado: se registra en el servidor con el detalle
  // completo, pero al cliente solo se le da un mensaje genérico para no
  // filtrar detalles internos (rutas de archivos, consultas SQL, etc.).
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}

module.exports = errorHandler;
