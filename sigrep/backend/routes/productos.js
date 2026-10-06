const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { requerirTexto, requerirNumeroNoNegativo } = require('../utils/validar');
const { MARGEN_DEFECTO } = require('../constants');
const inventarioService = require('../services/inventarioService');


router.get('/', (req, res) => 
  {
  
  const productos = db.prepare('SELECT id FROM productos ORDER BY nombre').all();
  res.json(productos.map((p) => inventarioService.calcularCostoProducto(p.id)));
  }
          );


router.get('/:id', (req, res) =>
  {
  const resultado = inventarioService.calcularCostoProducto(req.params.id);
  if (!resultado) throw new AppError('Producto no encontrado.', 404);
  res.json(resultado);

  }
          );


router.post('/', (req, res) => 
  {
  const nombre = requerirTexto(req.body.nombre, 'nombre');
  const costoManoObra = requerirNumeroNoNegativo(req.body.costo_mano_obra ?? 0, 'costo_mano_obra');
  const margen = requerirNumeroNoNegativo(req.body.margen_deseado ?? MARGEN_DEFECTO, 'margen_deseado');

  const result = db
    .prepare(
      'INSERT INTO productos (nombre, descripcion, costo_mano_obra, margen_deseado) VALUES (?, ?, ?, ?)'
    )
    .run(nombre, req.body.descripcion || '', costoManoObra, margen);

  res.status(201).json(inventarioService.calcularCostoProducto(result.lastInsertRowid));

  }
           );

router.put('/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
  if (!existente) throw new AppError('Producto no encontrado.', 404);

  const nombre = req.body.nombre !== undefined ? requerirTexto(req.body.nombre, 'nombre') : existente.nombre;
  const costoManoObra = req.body.costo_mano_obra !== undefined
    ? requerirNumeroNoNegativo(req.body.costo_mano_obra, 'costo_mano_obra')
    : existente.costo_mano_obra;
  const margen = req.body.margen_deseado !== undefined
    ? requerirNumeroNoNegativo(req.body.margen_deseado, 'margen_deseado')
    : existente.margen_deseado;
  const descripcion = req.body.descripcion ?? existente.descripcion;

  db.prepare(
    'UPDATE productos SET nombre=?, descripcion=?, costo_mano_obra=?, margen_deseado=? WHERE id=?'
  ).run(nombre, descripcion, costoManoObra, margen, req.params.id);

  res.json(inventarioService.calcularCostoProducto(req.params.id));


}            );

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
  if (result.changes === 0) throw new AppError('Producto no encontrado.', 404);
  res.status(204).send();
}
             );

module.exports = router;
