const RepositorioBase = require('./RepositorioBase');
const Usuario = require('../dominio/Usuario');

class RepositorioUsuarios extends RepositorioBase {
  obtenerNombreDeTabla() {
    return 'usuarios';
  }

  convertirFilaEnEntidad(fila) {
    return Usuario.crearDesdeFilaDeBaseDeDatos(fila);
  }

  convertirEntidadEnFila(entidad) {
    return entidad.convertirseEnFilaDeBaseDeDatos();
  }

  buscarPorNombreDeUsuario(nombreDeUsuario) {
    const filaEncontrada = this.conexionBaseDeDatos
      .prepararConsulta('SELECT * FROM usuarios WHERE usuario = ?')
      .get(nombreDeUsuario);
    return filaEncontrada ? this.convertirFilaEnEntidad(filaEncontrada) : null;
  }

  existeNombreDeUsuario(nombreDeUsuario) {
    return this.buscarPorNombreDeUsuario(nombreDeUsuario) !== null;
  }
}

module.exports = RepositorioUsuarios;
