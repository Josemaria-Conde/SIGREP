class ControladorBase {
  constructor() {
    if (new.target === ControladorBase) {
      throw new Error('ControladorBase es una clase abstracta y no puede instanciarse directamente');
    }
  }

  registrarRutas() {
    throw new Error('registrarRutas debe implementarse en la subclase');
  }
}

module.exports = ControladorBase;
