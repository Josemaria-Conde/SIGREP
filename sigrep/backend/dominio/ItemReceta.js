const ItemDeAsociacion = require('./ItemDeAsociacion');

class ItemReceta extends ItemDeAsociacion {
  constructor({ identificadorDeInsumo, cantidadRequeridaPorUnidad, nombreDelInsumo, costoUnitarioDelInsumo }) {
    super();
    this.identificadorDeInsumo = identificadorDeInsumo;
    this.cantidadRequeridaPorUnidad = cantidadRequeridaPorUnidad;
    this.nombreDelInsumo = nombreDelInsumo;
    this.costoUnitarioDelInsumo = costoUnitarioDelInsumo;
  }

  calcularCantidadRequeridaParaProducir(cantidadDeUnidadesAProducir) {
    return this.cantidadRequeridaPorUnidad * cantidadDeUnidadesAProducir;
  }

  calcularSubtotal(cantidadDeUnidadesAProducir) {
    return this.calcularCantidadRequeridaParaProducir(cantidadDeUnidadesAProducir) * this.costoUnitarioDelInsumo;
  }

  static crearDesdeFilaDeBaseDeDatos(fila) {
    return new ItemReceta({
      identificadorDeInsumo: fila.insumo_id,
      cantidadRequeridaPorUnidad: fila.cantidad,
      nombreDelInsumo: fila.nombre,
      costoUnitarioDelInsumo: fila.costo_unitario,
    });
  }
}

module.exports = ItemReceta;
