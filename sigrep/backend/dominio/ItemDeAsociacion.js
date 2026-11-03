class ItemDeAsociacion {
  constructor() {
    if (new.target === ItemDeAsociacion) {
      throw new Error('ItemDeAsociacion es una clase abstracta y no puede instanciarse directamente');
    }
  }

  calcularSubtotal() {
    throw new Error('calcularSubtotal debe implementarse en la subclase');
  }
}

module.exports = ItemDeAsociacion;
