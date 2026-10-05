const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { BCRYPT_SALT_ROUNDS } = require('../constants');

const DB_PATH = path.join(__dirname, 'sigrep.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Aplicar esquema (idempotente gracias a IF NOT EXISTS)
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);

// Semilla inicial solo si la tabla de usuarios está vacía
const userCount = db.prepare('SELECT COUNT(*) AS c FROM usuarios').get().c;
if (userCount === 0) {
  const insertUser = db.prepare(
    'INSERT INTO usuarios (nombre, rol, usuario, password) VALUES (?, ?, ?, ?)'
  );
  insertUser.run('Dueña Alcarusi', 'dueña', 'duena', bcrypt.hashSync('duena123', BCRYPT_SALT_ROUNDS));
  insertUser.run('Ayudante 1', 'ayudante_produccion', 'ayudante1', bcrypt.hashSync('ayudante123', BCRYPT_SALT_ROUNDS));

  const insertInsumo = db.prepare(
    'INSERT INTO insumos (nombre, unidad, stock_actual, stock_minimo, costo_unitario, fecha_caducidad) VALUES (?, ?, ?, ?, ?, ?)'
  );
  insertInsumo.run('Harina', 'g', 5000, 1000, 0.02, '2026-12-31');
  insertInsumo.run('Azúcar', 'g', 3000, 800, 0.018, '2027-01-15');
  insertInsumo.run('Mantequilla', 'g', 2000, 500, 0.09, '2026-09-20');
  insertInsumo.run('Huevo', 'pieza', 60, 12, 3.5, '2026-09-15');

  const insertProducto = db.prepare(
    'INSERT INTO productos (nombre, descripcion, costo_mano_obra, margen_deseado) VALUES (?, ?, ?, ?)'
  );
  const pastelId = insertProducto.run('Pastel de vainilla (chico)', 'Pastel clásico de vainilla, 15cm', 40, 0.35).lastInsertRowid;

  const insertReceta = db.prepare(
    'INSERT INTO producto_insumo (producto_id, insumo_id, cantidad) VALUES (?, ?, ?)'
  );
  insertReceta.run(pastelId, 1, 300); // 300g harina
  insertReceta.run(pastelId, 2, 250); // 250g azúcar
  insertReceta.run(pastelId, 3, 200); // 200g mantequilla
  insertReceta.run(pastelId, 4, 4);   // 4 huevos

  console.log('Base de datos inicializada con datos de ejemplo.');
}

module.exports = db;
