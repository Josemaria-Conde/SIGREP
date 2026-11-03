const RepositorioBase = require('./RepositorioBase');
const Cliente = require('../dominio/Cliente');

class RepositorioClientes extends RepositorioBase {
  obtenerNombreDeTabla() {
    return 'clientes';
  }

  convertirFilaEnEntidad(fila) {
    return Cliente.crearDesdeFilaDeBaseDeDatos(fila);
  }

  convertirEntidadEnFila(entidad) {
    return entidad.convertirseEnFilaDeBaseDeDatos();
  }

  buscarTodosOrdenadosPorNombre() {
    return this.buscarTodosOrdenadosPor('nombre');
  }
}

module.exports = RepositorioClientes;
