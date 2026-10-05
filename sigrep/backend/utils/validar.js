const { AppError } = require('./errors');

// Valida que un valor sea un número finito mayor que cero.
// Se usa para cantidades de producción, venta, y recetas: nunca deben
// ser negativas ni cero, porque no tiene sentido de negocio (Cap. 8,
// "Protecting Your Program from Invalid Inputs").
function requerirNumeroPositivo(valor, nombreCampo) {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero <= 0) {
    throw new AppError(`${nombreCampo} debe ser un número mayor que cero.`, 400);
  }
  return numero;
}

// Valida que un valor sea un número finito >= 0 (permite cero).
// Útil para costos, stock mínimo, stock actual: pueden ser cero pero
// nunca negativos.
function requerirNumeroNoNegativo(valor, nombreCampo) {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero < 0) {
    throw new AppError(`${nombreCampo} no puede ser negativo.`, 400);
  }
  return numero;
}

// Valida que un campo de texto requerido no esté vacío.
function requerirTexto(valor, nombreCampo) {
  if (typeof valor !== 'string' || valor.trim().length === 0) {
    throw new AppError(`${nombreCampo} es requerido.`, 400);
  }
  return valor.trim();
}

// Valida que un valor esté dentro de un conjunto de opciones permitidas.
function requerirEnumerado(valor, opciones, nombreCampo) {
  if (!opciones.includes(valor)) {
    throw new AppError(`${nombreCampo} debe ser uno de: ${opciones.join(', ')}.`, 400);
  }
  return valor;
}

module.exports = {
  requerirNumeroPositivo,
  requerirNumeroNoNegativo,
  requerirTexto,
  requerirEnumerado,
};
