const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const inventarioService = require('../services/inventarioService');

// GET /api/ventas - listar ventas
router.get('/', (req, res) => {
  const ventas = db
    .prepare(
      `SELECT v.*, p.nombre as producto_nombre FROM ventas v
       JOIN productos p ON p.id = v.producto_id ORDER BY v.fecha DESC`
    )
    .all();
  res.json(ventas);
});

// POST /api/ventas - registrar venta directa (mostrador).
// Usa el mismo servicio que "producir" para calcular precio, verificar
// stock y descontar insumos: una sola fuente de verdad para esa lógica.
router.post('/', (req, res) => {
  const { producto_id } = req.body;
  if (!producto_id) throw new AppError('producto_id es requerido.', 400);

  const resultado = inventarioService.producirOVender(producto_id, req.body.cantidad);

  const ventaId = db
    .prepare('INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)')
    .run(producto_id, resultado.cantidad, resultado.total).lastInsertRowid;

  const venta = db.prepare('SELECT * FROM ventas WHERE id = ?').get(ventaId);
  res.status(201).json({ ...venta, alertas: resultado.alertas });
});

// GET /api/ventas/reportes/resumen - panel de reportes
router.get('/reportes/resumen', (req, res) => {
  const totalVentas = db.prepare('SELECT COALESCE(SUM(total),0) as t FROM ventas').get().t;
  const numVentas = db.prepare('SELECT COUNT(*) as c FROM ventas').get().c;

  const masVendidos = db
    .prepare(
      `SELECT p.nombre, SUM(v.cantidad) as unidades, SUM(v.total) as ingresos
       FROM ventas v JOIN productos p ON p.id = v.producto_id
       GROUP BY v.producto_id ORDER BY unidades DESC LIMIT 5`
    )
    .all();

  const insumosBajos = db
    .prepare('SELECT nombre, stock_actual, stock_minimo, unidad FROM insumos WHERE stock_actual <= stock_minimo')
    .all();

  res.json({
    total_ventas: Number(totalVentas.toFixed(2)),
    numero_ventas: numVentas,
    productos_mas_vendidos: masVendidos,
    insumos_bajo_stock: insumosBajos,
  });
});

module.exports = router;
