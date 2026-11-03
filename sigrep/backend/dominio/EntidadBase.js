class EntidadBase {
  constructor(identificador) {
    if (new.target === EntidadBase) {
      throw new Error('EntidadBase es una clase abstracta y no puede instanciarse directamente');
    }
    this.id = identificador;
  }

  obtenerIdentificador() {
    return this.id;
  }

  convertirseEnFilaDeBaseDeDatos() {
    throw new Error('convertirseEnFilaDeBaseDeDatos debe implementarse en la subclase');
  }

  static crearDesdeFilaDeBaseDeDatos() {
    throw new Error('crearDesdeFilaDeBaseDeDatos debe implementarse en la subclase');
  }
}

module.exports = EntidadBase;
