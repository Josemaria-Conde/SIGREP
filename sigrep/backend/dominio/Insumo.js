const EntidadBase = require('./EntidadBase');

class Insumo extends EntidadBase {
  constructor({ id, nombre, unidadDeMedida, existenciaActual, existenciaMinima, costoPorUnidad, fechaDeCaducidad }) {
    super(id);
    this.nombre = nombre;
    this.unidadDeMedida = unidadDeMedida;
    this.existenciaActual = existenciaActual;
    this.existenciaMinima = existenciaMinima;
    this.costoPorUnidad = costoPorUnidad;
    this.fechaDeCaducidad = fechaDeCaducidad;
  }

  tieneExistenciaSuficiente(cantidadRequerida) {
    return this.existenciaActual >= cantidadRequerida;
  }

  estaPorDebajoDeLaExistenciaMinima() {
    return this.existenciaActual <= this.existenciaMinima;
  }

  estaProximoACaducar(diasDeAnticipacion) {
    if (!this.fechaDeCaducidad) {
      return false;
    }
    const fechaLimiteDeAlerta = new Date();
    fechaLimiteDeAlerta.setDate(fechaLimiteDeAlerta.getDate() + diasDeAnticipacion);
    return new Date(this.fechaDeCaducidad) <= fechaLimiteDeAlerta;
  }

  descontarExistencia(cantidad) {
    this.existenciaActual = Math.max(0, this.existenciaActual - cantidad);
  }

  aumentarExistencia(cantidad) {
    this.existenciaActual += cantidad;
  }

  convertirseEnFilaDeBaseDeDatos() {
    return {
      nombre: this.nombre,
      unidad: this.unidadDeMedida,
      stock_actual: this.existenciaActual,
      stock_minimo: this.existenciaMinima,
      costo_unitario: this.costoPorUnidad,
      fecha_caducidad: this.fechaDeCaducidad,
    };
  }

  static crearDesdeFilaDeBaseDeDatos(fila) {
    return new Insumo({
      id: fila.id,
      nombre: fila.nombre,
      unidadDeMedida: fila.unidad,
      existenciaActual: fila.stock_actual,
      existenciaMinima: fila.stock_minimo,
      costoPorUnidad: fila.costo_unitario,
      fechaDeCaducidad: fila.fecha_caducidad,
    });
  }
}

module.exports = Insumo;
