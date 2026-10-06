const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { requerirTexto, requerirEnumerado } = require('../utils/validar');
const { ROLES_VALIDOS, BCRYPT_SALT_ROUNDS } = require('../constants');


router.get('/', (req, res) => {
  res.json(db.prepare('SELECT id, nombre, rol, usuario FROM usuarios ORDER BY nombre').all());
});



router.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) throw new AppError('usuario y password son requeridos.', 400);

  const encontrado = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario);


  const hashParaComparar = encontrado ? encontrado.password : '$2a$10$invalidoinvalidoinvalidoinvalidoinval';
  const passwordValido = bcrypt.compareSync(password, hashParaComparar);

  if (!encontrado || !passwordValido) {
    throw new AppError('Usuario o contraseña incorrectos.', 401);
  }

  res.json({ id: encontrado.id, nombre: encontrado.nombre, rol: encontrado.rol, usuario: encontrado.usuario });
});


router.post('/', (req, res) => {
  const nombre = requerirTexto(req.body.nombre, 'nombre');
    const usuario = requerirTexto(req.body.usuario, 'usuario');
  const password = requerirTexto(req.body.password, 'password');
  const rol = requerirEnumerado(req.body.rol, ROLES_VALIDOS, 'rol');

  const yaExiste = db.prepare('SELECT id FROM usuarios WHERE usuario = ?').get(usuario);
  if (yaExiste) throw new AppError('El nombre de usuario ya existe.', 409);

  const passwordHash = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
  const result = db
    .prepare('INSERT INTO usuarios (nombre, rol, usuario, password) VALUES (?, ?, ?, ?)')
    .run(nombre, rol, usuario, passwordHash);

  res.status(201).json(
    db.prepare('SELECT id, nombre, rol, usuario FROM usuarios WHERE id = ?').get(result.lastInsertRowid)
  );
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM usuarios WHERE id = ?').run(req.params.id);
  if (result.changes === 0) throw new AppError('Usuario no encontrado.', 404);
  res.status(204).send();
});

module.exports = router;
