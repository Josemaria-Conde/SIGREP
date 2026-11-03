

const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { requerirNumeroPositivo } = require('../utils/validar');


function obtenerReceta(productoId) {
  return db
    .prepare(
      `SELECT pi.cantidad, pi.insumo_id, i.nombre, i.unidad, i.costo_unitario
       FROM producto_insumo pi
       JOIN insumos i ON i.id = pi.insumo_id
       WHERE pi.producto_id = ?`
    )
    .all(productoId);
}

function calcularCostoProducto(productoId) {
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(productoId);
  if (!producto) return null;

  const receta = obtenerReceta(productoId);
  const costoInsumos = receta.reduce((suma, item) => suma + item.cantidad * item.costo_unitario, 0);
  const costoTotal = costoInsumos + producto.costo_mano_obra;
  const precioSugerido = costoTotal * (1 + producto.margen_deseado);

  return {
    producto,
    receta,
    costo_insumos: Number(costoInsumos.toFixed(2)),
    costo_mano_obra: producto.costo_mano_obra,
    costo_total: Number(costoTotal.toFixed(2)),
    margen_deseado: producto.margen_deseado,
    precio_sugerido: Number(precioSugerido.toFixed(2)),
  };
}

function verificarStockSuficiente(receta, cantidad) {
  for (const item of receta) {
    const insumo = db.prepare('SELECT * FROM insumos WHERE id = ?').get(item.insumo_id);
    const requerido = item.cantidad * cantidad;
    if (insumo.stock_actual < requerido) {
      throw new AppError(
        `Stock insuficiente de ${insumo.nombre}. Disponible: ${insumo.stock_actual}${insumo.unidad}, requerido: ${requerido}${insumo.unidad}.`,
        400
      );
    }
  }
}


function descontarInsumosDeReceta(receta, cantidad) {
  const transaccion = db.transaction(() => {
    for (const item of receta) {
      db.prepare('UPDATE insumos SET stock_actual = stock_actual - ? WHERE id = ?').run(
        item.cantidad * cantidad,
        item.insumo_id
      );
    }
  });
  transaccion();
}


function obtenerAlertasDeStock(receta) {
  return receta
    .map((item) => db.prepare('SELECT * FROM insumos WHERE id = ?').get(item.insumo_id))
    .filter((insumo) => insumo.stock_actual <= insumo.stock_minimo)
    .map((insumo) => `${insumo.nombre} está por debajo del stock mínimo (${insumo.stock_actual}${insumo.unidad}).`);
}


function producirOVender(productoId, cantidadSolicitada) {
  const cantidad = requerirNumeroPositivo(cantidadSolicitada, 'cantidad');

  const costo = calcularCostoProducto(productoId);
  if (!costo) throw new AppError('Producto no encontrado.', 404);

  const receta = costo.receta;
  verificarStockSuficiente(receta, cantidad);
  descontarInsumosDeReceta(receta, cantidad);

  return {
    producto: costo.producto,
    cantidad,
    precio_unitario: costo.precio_sugerido,
    total: Number((costo.precio_sugerido * cantidad).toFixed(2)),
    alertas: obtenerAlertasDeStock(receta),
  };
}

module.exports = {
  obtenerReceta,
  calcularCostoProducto,
  verificarStockSuficiente,
  descontarInsumosDeReceta,
  obtenerAlertasDeStock,
  producirOVender,
};
