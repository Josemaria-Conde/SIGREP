const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { requerirTexto, requerirNumeroNoNegativo } = require('../utils/validar');
const { DIAS_ALERTA_CADUCIDAD } = require('../constants');


router.get('/', (req, res) => {
  const insumos = db.prepare('SELECT * FROM insumos ORDER BY nombre').all();
  const hoy = new Date();
  const fechaLimiteCaducidad = new Date();
  fechaLimiteCaducidad.setDate(hoy.getDate() + DIAS_ALERTA_CADUCIDAD);

  const conAlertas = insumos.map((i) => ({
    ...i,
    alerta_stock_bajo: i.stock_actual <= i.stock_minimo,
    alerta_caducidad: i.fecha_caducidad
      ? new Date(i.fecha_caducidad) <= fechaLimiteCaducidad
      : false,
  }));
  res.json(conAlertas);
});


router.get('/:id', (req, res) => {
  const insumo = db.prepare('SELECT * FROM insumos WHERE id = ?').get(req.params.id);
  if (!insumo) throw new AppError('Insumo no encontrado.', 404);
  res.json(insumo);
});


router.post('/', (req, res) => {
  const nombre = requerirTexto(req.body.nombre, 'nombre');
  const unidad = requerirTexto(req.body.unidad, 'unidad');
  const stockActual = requerirNumeroNoNegativo(req.body.stock_actual ?? 0, 'stock_actual');
  const stockMinimo = requerirNumeroNoNegativo(req.body.stock_minimo ?? 0, 'stock_minimo');
  const costoUnitario = requerirNumeroNoNegativo(req.body.costo_unitario ?? 0, 'costo_unitario');

  const result = db
    .prepare(
      `INSERT INTO insumos (nombre, unidad, stock_actual, stock_minimo, costo_unitario, fecha_caducidad)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(nombre, unidad, stockActual, stockMinimo, costoUnitario, req.body.fecha_caducidad || null);
  const nuevo = db.prepare('SELECT * FROM insumos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(nuevo);
});


router.put('/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM insumos WHERE id = ?').get(req.params.id);
  if (!existente) throw new AppError('Insumo no encontrado.', 404);

  const nombre = req.body.nombre !== undefined ? requerirTexto(req.body.nombre, 'nombre') : existente.nombre;
  const unidad = req.body.unidad !== undefined ? requerirTexto(req.body.unidad, 'unidad') : existente.unidad;
  const stockActual = req.body.stock_actual !== undefined
    ? requerirNumeroNoNegativo(req.body.stock_actual, 'stock_actual')
    : existente.stock_actual;
  const stockMinimo = req.body.stock_minimo !== undefined
    ? requerirNumeroNoNegativo(req.body.stock_minimo, 'stock_minimo')
    : existente.stock_minimo;
  const costoUnitario = req.body.costo_unitario !== undefined
    ? requerirNumeroNoNegativo(req.body.costo_unitario, 'costo_unitario')
    : existente.costo_unitario;
  const fechaCaducidad = req.body.fecha_caducidad ?? existente.fecha_caducidad;

  db.prepare(
    `UPDATE insumos SET nombre=?, unidad=?, stock_actual=?, stock_minimo=?, costo_unitario=?, fecha_caducidad=?
     WHERE id=?`
  ).run(nombre, unidad, stockActual, stockMinimo, costoUnitario, fechaCaducidad, req.params.id);

  res.json(db.prepare('SELECT * FROM insumos WHERE id = ?').get(req.params.id));
});


router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM insumos WHERE id = ?').run(req.params.id);
  if (result.changes === 0) throw new AppError('Insumo no encontrado.', 404);
  res.status(204).send();
});


router.patch('/:id/ajustar-stock', (req, res) => {
  const delta = Number(req.body.delta);
  if (!Number.isFinite(delta)) throw new AppError('delta debe ser un número.', 400);

  const insumo = db.prepare('SELECT * FROM insumos WHERE id = ?').get(req.params.id);
  if (!insumo) throw new AppError('Insumo no encontrado.', 404);

  const nuevoStock = Math.max(0, insumo.stock_actual + delta);
  db.prepare('UPDATE insumos SET stock_actual = ? WHERE id = ?').run(nuevoStock, req.params.id);
  res.json(db.prepare('SELECT * FROM insumos WHERE id = ?').get(req.params.id));
});

module.exports = router;
