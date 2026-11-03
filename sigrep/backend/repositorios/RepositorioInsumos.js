const RepositorioBase = require('./RepositorioBase');
const Insumo = require('../dominio/Insumo');

class RepositorioInsumos extends RepositorioBase {
  obtenerNombreDeTabla() {
    return 'insumos';
  }

  convertirFilaEnEntidad(fila) {
    return Insumo.crearDesdeFilaDeBaseDeDatos(fila);
  }

  convertirEntidadEnFila(entidad) {
    return entidad.convertirseEnFilaDeBaseDeDatos();
  }

  buscarTodosOrdenadosPorNombre() {
    return this.buscarTodosOrdenadosPor('nombre');
  }

  actualizarExistenciaDelInsumo(identificadorDeInsumo, nuevaExistencia) {
    this.conexionBaseDeDatos
      .prepararConsulta('UPDATE insumos SET stock_actual = ? WHERE id = ?')
      .run(nuevaExistencia, identificadorDeInsumo);
    return this.buscarPorIdentificador(identificadorDeInsumo);
  }
}

module.exports = RepositorioInsumos;
