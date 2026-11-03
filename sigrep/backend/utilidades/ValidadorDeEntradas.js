const ErrorDeAplicacion = require('./ErrorDeAplicacion');

class ValidadorDeEntradas {
  constructor() {
    throw new Error('ValidadorDeEntradas es una clase abstracta y no puede instanciarse directamente');
  }

  static exigirNumeroPositivo(valor, nombreDelCampo) {
    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero <= 0) {
      throw new ErrorDeAplicacion(`${nombreDelCampo} debe ser un número mayor que cero.`, 400);
    }
    return numero;
  }

  static exigirNumeroNoNegativo(valor, nombreDelCampo) {
    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero < 0) {
      throw new ErrorDeAplicacion(`${nombreDelCampo} no puede ser negativo.`, 400);
    }
    return numero;
  }

  static exigirTextoNoVacio(valor, nombreDelCampo) {
    if (typeof valor !== 'string' || valor.trim().length === 0) {
      throw new ErrorDeAplicacion(`${nombreDelCampo} es requerido.`, 400);
    }
    return valor.trim();
  }

  static exigirValorDentroDelConjuntoPermitido(valor, conjuntoPermitido, nombreDelCampo) {
    if (!conjuntoPermitido.includes(valor)) {
      throw new ErrorDeAplicacion(`${nombreDelCampo} debe ser uno de: ${conjuntoPermitido.join(', ')}.`, 400);
    }
    return valor;
  }
}

module.exports = ValidadorDeEntradas;
