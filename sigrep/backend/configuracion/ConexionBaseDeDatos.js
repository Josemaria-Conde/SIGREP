const Database = require('better-sqlite3');
const fs = require('fs');

class ConexionBaseDeDatos {
  constructor(rutaDelArchivoDeBaseDeDatos) {
    this.baseDeDatosNativa = new Database(rutaDelArchivoDeBaseDeDatos);
    this.baseDeDatosNativa.pragma('journal_mode = WAL');
    this.baseDeDatosNativa.pragma('foreign_keys = ON');
  }

  inicializarEsquemaDesdeArchivo(rutaDelArchivoDeEsquema) {
    const contenidoDelEsquema = fs.readFileSync(rutaDelArchivoDeEsquema, 'utf8');
    this.baseDeDatosNativa.exec(contenidoDelEsquema);
  }

  prepararConsulta(textoDeLaConsultaSql) {
    return this.baseDeDatosNativa.prepare(textoDeLaConsultaSql);
  }

  ejecutarComoTransaccionAtomica(funcionATransaccionar) {
    return this.baseDeDatosNativa.transaction(funcionATransaccionar);
  }

  contarFilasDeTabla(nombreDeTabla) {
    return this.prepararConsulta(`SELECT COUNT(*) AS cantidad FROM ${nombreDeTabla}`).get().cantidad;
  }
}

module.exports = ConexionBaseDeDatos;
