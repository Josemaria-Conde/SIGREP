const bcrypt = require('bcryptjs');
const Usuario = require('../dominio/Usuario');
const ConstantesDelNegocio = require('./ConstantesDelNegocio');

class SembradorDeDatosIniciales {
  constructor(conexionBaseDeDatos) {
    this.conexionBaseDeDatos = conexionBaseDeDatos;
  }

  sembrarSiLaBaseDeDatosEstaVacia() {
    const cantidadDeUsuariosExistentes = this.conexionBaseDeDatos.contarFilasDeTabla('usuarios');
    if (cantidadDeUsuariosExistentes > 0) {
      return;
    }
    this.sembrarUsuarios();
    this.sembrarInsumos();
    this.sembrarProductoDeEjemploConSuReceta();
  }

  sembrarUsuarios() {
    const insertarUsuario = this.conexionBaseDeDatos.prepararConsulta(
      'INSERT INTO usuarios (nombre, rol, usuario, password) VALUES (?, ?, ?, ?)'
    );
    insertarUsuario.run(
      'Dueña Alcarusi',
      Usuario.ROL_DUENA,
      'duena',
      bcrypt.hashSync('duena123', ConstantesDelNegocio.numeroDeRondasParaCifradoDeContrasenas)
    );
    insertarUsuario.run(
      'Ayudante 1',
      Usuario.ROL_AYUDANTE_PRODUCCION,
      'ayudante1',
      bcrypt.hashSync('ayudante123', ConstantesDelNegocio.numeroDeRondasParaCifradoDeContrasenas)
    );
  }

  sembrarInsumos() {
    const insertarInsumo = this.conexionBaseDeDatos.prepararConsulta(
      'INSERT INTO insumos (nombre, unidad, stock_actual, stock_minimo, costo_unitario, fecha_caducidad) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertarInsumo.run('Harina', 'g', 5000, 1000, 0.02, '2026-12-31');
    insertarInsumo.run('Azúcar', 'g', 3000, 800, 0.018, '2027-01-15');
    insertarInsumo.run('Mantequilla', 'g', 2000, 500, 0.09, '2026-09-20');
    insertarInsumo.run('Huevo', 'pieza', 60, 12, 3.5, '2026-09-15');
  }

  sembrarProductoDeEjemploConSuReceta() {
    const resultadoDeLaInsercion = this.conexionBaseDeDatos
      .prepararConsulta('INSERT INTO productos (nombre, descripcion, costo_mano_obra, margen_deseado) VALUES (?, ?, ?, ?)')
      .run('Pastel de vainilla (chico)', 'Pastel clásico de vainilla, 15cm', 40, 0.35);
    const identificadorDelProductoCreado = resultadoDeLaInsercion.lastInsertRowid;
    const insertarItemDeReceta = this.conexionBaseDeDatos.prepararConsulta(
      'INSERT INTO producto_insumo (producto_id, insumo_id, cantidad) VALUES (?, ?, ?)'
    );
    insertarItemDeReceta.run(identificadorDelProductoCreado, 1, 300);
    insertarItemDeReceta.run(identificadorDelProductoCreado, 2, 250);
    insertarItemDeReceta.run(identificadorDelProductoCreado, 3, 200);
    insertarItemDeReceta.run(identificadorDelProductoCreado, 4, 4);
  }
}

module.exports = SembradorDeDatosIniciales;
