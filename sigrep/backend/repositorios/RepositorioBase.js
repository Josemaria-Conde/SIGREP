class RepositorioBase {
  constructor(conexionBaseDeDatos) {
    if (new.target === RepositorioBase) {
      throw new Error('RepositorioBase es una clase abstracta y no puede instanciarse directamente');
    }
    this.conexionBaseDeDatos = conexionBaseDeDatos;
  }

  obtenerNombreDeTabla() {
    throw new Error('obtenerNombreDeTabla debe implementarse en la subclase');
  }

  convertirFilaEnEntidad() {
    throw new Error('convertirFilaEnEntidad debe implementarse en la subclase');
  }

  convertirEntidadEnFila() {
    throw new Error('convertirEntidadEnFila debe implementarse en la subclase');
  }

  buscarTodosOrdenadosPor(nombreDeColumnaDeOrden) {
    const filasEncontradas = this.conexionBaseDeDatos
      .prepararConsulta(`SELECT * FROM ${this.obtenerNombreDeTabla()} ORDER BY ${nombreDeColumnaDeOrden}`)
      .all();
    return filasEncontradas.map((fila) => this.convertirFilaEnEntidad(fila));
  }

  buscarPorIdentificador(identificador) {
    const filaEncontrada = this.conexionBaseDeDatos
      .prepararConsulta(`SELECT * FROM ${this.obtenerNombreDeTabla()} WHERE id = ?`)
      .get(identificador);
    return filaEncontrada ? this.convertirFilaEnEntidad(filaEncontrada) : null;
  }

  crearRegistro(entidad) {
    const columnasAInsertar = this.convertirEntidadEnFila(entidad);
    const nombresDeColumnas = Object.keys(columnasAInsertar);
    const marcadoresDeValores = nombresDeColumnas.map(() => '?').join(', ');
    const resultadoDeLaInsercion = this.conexionBaseDeDatos
      .prepararConsulta(
        `INSERT INTO ${this.obtenerNombreDeTabla()} (${nombresDeColumnas.join(', ')}) VALUES (${marcadoresDeValores})`
      )
      .run(...Object.values(columnasAInsertar));
    return this.buscarPorIdentificador(resultadoDeLaInsercion.lastInsertRowid);
  }

  actualizarRegistro(identificador, entidad) {
    const columnasAActualizar = this.convertirEntidadEnFila(entidad);
    const nombresDeColumnas = Object.keys(columnasAActualizar);
    const asignacionesDeColumnas = nombresDeColumnas.map((nombreDeColumna) => `${nombreDeColumna} = ?`).join(', ');
    this.conexionBaseDeDatos
      .prepararConsulta(`UPDATE ${this.obtenerNombreDeTabla()} SET ${asignacionesDeColumnas} WHERE id = ?`)
      .run(...Object.values(columnasAActualizar), identificador);
    return this.buscarPorIdentificador(identificador);
  }

  eliminarRegistroPorIdentificador(identificador) {
    const resultadoDeLaEliminacion = this.conexionBaseDeDatos
      .prepararConsulta(`DELETE FROM ${this.obtenerNombreDeTabla()} WHERE id = ?`)
      .run(identificador);
    return resultadoDeLaEliminacion.changes > 0;
  }
}

module.exports = RepositorioBase;
