const EntidadBase = require('./EntidadBase');

class Usuario extends EntidadBase {
  constructor({ id, nombre, rol, nombreUsuario, contrasenaCifrada }) {
    super(id);
    this.nombre = nombre;
    this.rol = rol;
    this.nombreUsuario = nombreUsuario;
    this.contrasenaCifrada = contrasenaCifrada;
  }

  esDuena() {
    return this.rol === Usuario.ROL_DUENA;
  }

  esAyudanteDeProduccion() {
    return this.rol === Usuario.ROL_AYUDANTE_PRODUCCION;
  }

  obtenerDatosPublicos() {
    return { id: this.id, nombre: this.nombre, rol: this.rol, usuario: this.nombreUsuario };
  }

  convertirseEnFilaDeBaseDeDatos() {
    return {
      nombre: this.nombre,
      rol: this.rol,
      usuario: this.nombreUsuario,
      password: this.contrasenaCifrada,
    };
  }

  static crearDesdeFilaDeBaseDeDatos(fila) {
    return new Usuario({
      id: fila.id,
      nombre: fila.nombre,
      rol: fila.rol,
      nombreUsuario: fila.usuario,
      contrasenaCifrada: fila.password,
    });
  }
}

Usuario.ROL_DUENA = 'dueña';
Usuario.ROL_AYUDANTE_PRODUCCION = 'ayudante_produccion';

module.exports = Usuario;
