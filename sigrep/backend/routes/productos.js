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


router.post('/:id/receta', (req, res) => {
  const { insumo_id } = req.body;
  const cantidad = requerirNumeroNoNegativo(req.body.cantidad, 'cantidad');
  if (!insumo_id) throw new AppError('insumo_id es requerido.', 400);

  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
  const insumo = db.prepare('SELECT * FROM insumos WHERE id = ?').get(insumo_id);
  if (!producto) throw new AppError('Producto no encontrado.', 404);
  if (!insumo) throw new AppError('Insumo no encontrado.', 404);

  db.prepare(
    `INSERT INTO producto_insumo (producto_id, insumo_id, cantidad) VALUES (?, ?, ?)
     ON CONFLICT(producto_id, insumo_id) DO UPDATE SET cantidad = excluded.cantidad`
  ).run(req.params.id, insumo_id, cantidad);

  res.status(201).json(inventarioService.calcularCostoProducto(req.params.id));
}
           );


router.delete('/:id/receta/:insumoId', (req, res) => {
  db.prepare('DELETE FROM producto_insumo WHERE producto_id = ? AND insumo_id = ?').run(
    req.params.id,
    req.params.insumoId
  
  );
  res.json(inventarioService.calcularCostoProducto(req.params.id));
}
             );


router.post('/:id/producir', (req, res) => {
  const resultado = inventarioService.producirOVender(req.params.id, req.body.cantidad ?? 1);
  res.json({
    mensaje: `Producción de ${resultado.cantidad} x ${resultado.producto.nombre} registrada.`,
    alertas: resultado.alertas,
  });
});

module.exports = router;
