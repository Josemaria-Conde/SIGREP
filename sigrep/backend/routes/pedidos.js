const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { requerirTexto, requerirNumeroPositivo, requerirNumeroNoNegativo, requerirEnumerado } = require('../utils/validar');
const { ESTADOS_PEDIDO_VALIDOS } = require('../constants');

function obtenerPedidoCompleto(id) {
  const pedido = db
    .prepare(
      `SELECT p.*, c.nombre as cliente_nombre FROM pedidos p
       LEFT JOIN clientes c ON c.id = p.cliente_id WHERE p.id = ?`
    )
    .get(id);
  if (!pedido) return null;

  const productos = db
    .prepare(
      `SELECT pp.*, pr.nombre as producto_nombre FROM pedido_producto pp
       JOIN productos pr ON pr.id = pp.producto_id WHERE pp.pedido_id = ?`
    )
    .all(id);

  const total = productos.reduce((sum, p) => sum + p.cantidad * p.precio_unitario, 0);

  return { ...pedido, productos, total: Number(total.toFixed(2)) };
}


router.get('/', (req, res) => {
  const { estado } = req.query;
  const pedidos = estado
    ? db.prepare('SELECT id FROM pedidos WHERE estado = ? ORDER BY fecha_entrega').all(estado)
    : db.prepare('SELECT id FROM pedidos ORDER BY fecha_entrega').all();

  res.json(pedidos.map((p) => obtenerPedidoCompleto(p.id)));
});


router.get('/:id', (req, res) => {
  const pedido = obtenerPedidoCompleto(req.params.id);
  if (!pedido) throw new AppError('Pedido no encontrado.', 404);
  res.json(pedido);
});


function validarItemsPedido(productos) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new AppError('El pedido debe incluir al menos un producto.', 400);
  }
  return productos.map((item) => {
    if (!item.producto_id) throw new AppError('Cada producto del pedido requiere producto_id.', 400);
    const producto = db.prepare('SELECT id FROM productos WHERE id = ?').get(item.producto_id);
    if (!producto) throw new AppError(`Producto ${item.producto_id} no encontrado.`, 404);
    return {
      producto_id: item.producto_id,
      cantidad: requerirNumeroPositivo(item.cantidad ?? 1, 'cantidad'),
      precio_unitario: requerirNumeroNoNegativo(item.precio_unitario ?? 0, 'precio_unitario'),
    };
  });
}


router.post('/', (req, res) => {
  const fechaEntrega = requerirTexto(req.body.fecha_entrega, 'fecha_entrega');
  const items = validarItemsPedido(req.body.productos);

  const crear = db.transaction(() => {
    const result = db
      .prepare(
        'INSERT INTO pedidos (cliente_id, fecha_entrega, especificaciones, estado) VALUES (?, ?, ?, ?)'
      )
      .run(req.body.cliente_id || null, fechaEntrega, req.body.especificaciones || '', 'pendiente');

    const pedidoId = result.lastInsertRowid;
    for (const item of items) {
      db.prepare(
        'INSERT INTO pedido_producto (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)'
      ).run(pedidoId, item.producto_id, item.cantidad, item.precio_unitario);
    }
    return pedidoId;
  });

  const pedidoId = crear();
  res.status(201).json(obtenerPedidoCompleto(pedidoId));
});


router.put('/:id/estado', (req, res) => {
  const estado = requerirEnumerado(req.body.estado, ESTADOS_PEDIDO_VALIDOS, 'estado');
  const result = db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, req.params.id);
  if (result.changes === 0) throw new AppError('Pedido no encontrado.', 404);
  res.json(obtenerPedidoCompleto(req.params.id));
});


router.put('/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id);
  if (!existente) throw new AppError('Pedido no encontrado.', 404);
  const {
    cliente_id = existente.cliente_id,
    fecha_entrega = existente.fecha_entrega,
    especificaciones = existente.especificaciones,
  } = req.body;
  db.prepare('UPDATE pedidos SET cliente_id=?, fecha_entrega=?, especificaciones=? WHERE id=?').run(
    cliente_id, fecha_entrega, especificaciones, req.params.id
  );
  res.json(obtenerPedidoCompleto(req.params.id));
});


router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM pedidos WHERE id = ?').run(req.params.id);
  if (result.changes === 0) throw new AppError('Pedido no encontrado.', 404);
  res.status(204).send();
});

module.exports = router;
