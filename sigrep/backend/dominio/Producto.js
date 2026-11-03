const EntidadBase = require('./EntidadBase');

class Producto extends EntidadBase {
  constructor({ id, nombre, descripcion, costoDeManoDeObra, margenDeGananciaDeseado, receta }) {
    super(id);
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.costoDeManoDeObra = costoDeManoDeObra;
    this.margenDeGananciaDeseado = margenDeGananciaDeseado;
    this.receta = receta || [];
  }

  agregarItemALaReceta(itemReceta) {
    this.receta.push(itemReceta);
  }

  calcularCostoDeInsumosParaProducir(cantidadAProducir) {
    return this.receta.reduce(
      (sumaAcumulada, itemReceta) => sumaAcumulada + itemReceta.calcularSubtotal(cantidadAProducir),
      0
    );
  }

  calcularCostoTotalParaProducir(cantidadAProducir) {
    return this.calcularCostoDeInsumosParaProducir(cantidadAProducir) + this.costoDeManoDeObra * cantidadAProducir;
  }

  calcularPrecioDeVentaSugeridoParaProducir(cantidadAProducir) {
    return this.calcularCostoTotalParaProducir(cantidadAProducir) * (1 + this.margenDeGananciaDeseado);
  }

  calcularPrecioDeVentaUnitarioSugerido() {
    return this.calcularPrecioDeVentaSugeridoParaProducir(1);
  }

  convertirseEnFilaDeBaseDeDatos() {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      costo_mano_obra: this.costoDeManoDeObra,
      margen_deseado: this.margenDeGananciaDeseado,
    };
  }

  static crearDesdeFilaDeBaseDeDatos(fila, receta = []) {
    return new Producto({
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      costoDeManoDeObra: fila.costo_mano_obra,
      margenDeGananciaDeseado: fila.margen_deseado,
      receta,
    });
  }
}

module.exports = Producto;
