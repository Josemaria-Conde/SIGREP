class ServicioBase {
  constructor() {
    if (new.target === ServicioBase) {
      throw new Error('ServicioBase es una clase abstracta y no puede instanciarse directamente');
    }
  }
}

module.exports = ServicioBase;
