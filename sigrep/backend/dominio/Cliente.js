const EntidadBase = require('./EntidadBase');

class Cliente extends EntidadBase {
  constructor({ id, nombre, telefono, correoElectronico, notas }) {
    super(id);
    this.nombre = nombre;
    this.telefono = telefono;
    this.correoElectronico = correoElectronico;
    this.notas = notas;
  }

  convertirseEnFilaDeBaseDeDatos() {
    return {
      nombre: this.nombre,
      telefono: this.telefono,
      email: this.correoElectronico,
      notas: this.notas,
    };
  }

  static crearDesdeFilaDeBaseDeDatos(fila) {
    return new Cliente({
      id: fila.id,
      nombre: fila.nombre,
      telefono: fila.telefono,
      correoElectronico: fila.email,
      notas: fila.notas,
    });
  }
}

module.exports = Cliente;
