const RepositorioBase = require('./RepositorioBase');
const Producto = require('../dominio/Producto');
const ItemReceta = require('../dominio/ItemReceta');

class RepositorioProductos extends RepositorioBase {
  obtenerNombreDeTabla() {
    return 'productos';
  }

  convertirFilaEnEntidad(fila) {
    return Producto.crearDesdeFilaDeBaseDeDatos(fila);
  }

  convertirEntidadEnFila(entidad) {
    return entidad.convertirseEnFilaDeBaseDeDatos();
  }

  buscarTodosOrdenadosPorNombre() {
    return this.buscarTodosOrdenadosPor('nombre');
  }

  buscarRecetaDelProducto(identificadorDeProducto) {
    const filasDeLaReceta = this.conexionBaseDeDatos
      .prepararConsulta(
        `SELECT producto_insumo.cantidad AS cantidad, insumos.id AS insumo_id, insumos.nombre AS nombre, insumos.costo_unitario AS costo_unitario
         FROM producto_insumo
         JOIN insumos ON insumos.id = producto_insumo.insumo_id
         WHERE producto_insumo.producto_id = ?`
      )
      .all(identificadorDeProducto);
    return filasDeLaReceta.map((fila) => ItemReceta.crearDesdeFilaDeBaseDeDatos(fila));
  }

  buscarProductoConSuReceta(identificadorDeProducto) {
    const producto = this.buscarPorIdentificador(identificadorDeProducto);
    if (!producto) {
      return null;
    }
    producto.receta = this.buscarRecetaDelProducto(identificadorDeProducto);
    return producto;
  }

  agregarOActualizarItemDeLaReceta(identificadorDeProducto, identificadorDeInsumo, cantidadRequeridaPorUnidad) {
    this.conexionBaseDeDatos
      .prepararConsulta(
        `INSERT INTO producto_insumo (producto_id, insumo_id, cantidad) VALUES (?, ?, ?)
         ON CONFLICT(producto_id, insumo_id) DO UPDATE SET cantidad = excluded.cantidad`
      )
      .run(identificadorDeProducto, identificadorDeInsumo, cantidadRequeridaPorUnidad);
  }

  quitarItemDeLaReceta(identificadorDeProducto, identificadorDeInsumo) {
    this.conexionBaseDeDatos
      .prepararConsulta('DELETE FROM producto_insumo WHERE producto_id = ? AND insumo_id = ?')
      .run(identificadorDeProducto, identificadorDeInsumo);
  }
}

module.exports = RepositorioProductos;
