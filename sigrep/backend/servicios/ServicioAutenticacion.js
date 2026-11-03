const bcrypt = require('bcryptjs');
const ServicioBase = require('./ServicioBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');
const ValidadorDeEntradas = require('../utilidades/ValidadorDeEntradas');
const ConstantesDelNegocio = require('../configuracion/ConstantesDelNegocio');
const Usuario = require('../dominio/Usuario');

const HASH_INVALIDO_PARA_COMPARACION_CONSTANTE = '$2a$10$invalidoinvalidoinvalidoinvalidoinval';

class ServicioAutenticacion extends ServicioBase {
  constructor(repositorioUsuarios) {
    super();
    this.repositorioUsuarios = repositorioUsuarios;
  }

  listarUsuariosConDatosPublicos() {
    return this.repositorioUsuarios.buscarTodosOrdenadosPor('nombre').map((usuario) => usuario.obtenerDatosPublicos());
  }

  autenticarUsuario(nombreDeUsuario, contrasenaSinCifrar) {
    if (!nombreDeUsuario || !contrasenaSinCifrar) {
      throw new ErrorDeAplicacion('usuario y password son requeridos.', 400);
    }
    const usuarioEncontrado = this.repositorioUsuarios.buscarPorNombreDeUsuario(nombreDeUsuario);
    const hashParaComparar = usuarioEncontrado
      ? usuarioEncontrado.contrasenaCifrada
      : HASH_INVALIDO_PARA_COMPARACION_CONSTANTE;
    const laContrasenaEsValida = bcrypt.compareSync(contrasenaSinCifrar, hashParaComparar);
    if (!usuarioEncontrado || !laContrasenaEsValida) {
      throw new ErrorDeAplicacion('Usuario o contraseña incorrectos.', 401);
    }
    return usuarioEncontrado.obtenerDatosPublicos();
  }

  registrarNuevoUsuario(datosDelUsuario) {
    const nombreValidado = ValidadorDeEntradas.exigirTextoNoVacio(datosDelUsuario.nombre, 'nombre');
    const nombreDeUsuarioValidado = ValidadorDeEntradas.exigirTextoNoVacio(datosDelUsuario.usuario, 'usuario');
    const contrasenaValidada = ValidadorDeEntradas.exigirTextoNoVacio(datosDelUsuario.password, 'password');
    const rolValidado = ValidadorDeEntradas.exigirValorDentroDelConjuntoPermitido(
      datosDelUsuario.rol,
      ConstantesDelNegocio.rolesDeUsuarioValidos,
      'rol'
    );
    if (this.repositorioUsuarios.existeNombreDeUsuario(nombreDeUsuarioValidado)) {
      throw new ErrorDeAplicacion('El nombre de usuario ya existe.', 409);
    }
    const nuevoUsuario = new Usuario({
      nombre: nombreValidado,
      rol: rolValidado,
      nombreUsuario: nombreDeUsuarioValidado,
      contrasenaCifrada: bcrypt.hashSync(contrasenaValidada, ConstantesDelNegocio.numeroDeRondasParaCifradoDeContrasenas),
    });
    const usuarioCreado = this.repositorioUsuarios.crearRegistro(nuevoUsuario);
    return usuarioCreado.obtenerDatosPublicos();
  }

  eliminarUsuarioPorIdentificador(identificador) {
    const seElimino = this.repositorioUsuarios.eliminarRegistroPorIdentificador(identificador);
    if (!seElimino) {
      throw new ErrorDeAplicacion('Usuario no encontrado.', 404);
    }
  }
}

module.exports = ServicioAutenticacion;
