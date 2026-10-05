const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { requerirTexto } = require('../utils/validar');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM clientes ORDER BY nombre').all());
});

router.get('/:id', (req, res) => {
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  if (!cliente) throw new AppError('Cliente no encontrado.', 404);

  const pedidos = db
    .prepare('SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY fecha_entrega DESC')
    .all(req.params.id);

  res.json({ ...cliente, pedidos });
});

router.post('/', (req, res) => {
  const nombre = requerirTexto(req.body.nombre, 'nombre');
  const result = db
    .prepare('INSERT INTO clientes (nombre, telefono, email, notas) VALUES (?, ?, ?, ?)')
    .run(nombre, req.body.telefono || '', req.body.email || '', req.body.notas || '');
  res.status(201).json(db.prepare('SELECT * FROM clientes WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  if (!existente) throw new AppError('Cliente no encontrado.', 404);
  const nombre = req.body.nombre !== undefined ? requerirTexto(req.body.nombre, 'nombre') : existente.nombre;
  const {
    telefono = existente.telefono,
    email = existente.email,
    notas = existente.notas,
  } = req.body;
  db.prepare('UPDATE clientes SET nombre=?, telefono=?, email=?, notas=? WHERE id=?').run(
    nombre, telefono, email, notas, req.params.id
  );
  res.json(db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) throw new AppError('Cliente no encontrado.', 404);
  res.status(204).send();
});

module.exports = router;
