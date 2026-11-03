const ServicioBase = require('./ServicioBase');
const ErrorDeAplicacion = require('../utilidades/ErrorDeAplicacion');
const ValidadorDeEntradas = require('../utilidades/ValidadorDeEntradas');
const Cliente = require('../dominio/Cliente');

class ServicioClientes extends ServicioBase {
  constructor(repositorioClientes, repositorioPedidos) {
    super();
    this.repositorioClientes = repositorioClientes;
    this.repositorioPedidos = repositorioPedidos;
  }

  listarClientes() {
    return this.repositorioClientes.buscarTodosOrdenadosPorNombre();
  }

  obtenerClienteConSusPedidos(identificador) {
    const cliente = this.repositorioClientes.buscarPorIdentificador(identificador);
    if (!cliente) {
      throw new ErrorDeAplicacion('Cliente no encontrado.', 404);
    }
    const pedidosDelCliente = this.repositorioPedidos
      .buscarTodosOrdenadosPorFechaDeEntrega()
      .filter((pedido) => String(pedido.identificadorDeCliente) === String(identificador));
    return { cliente, pedidosDelCliente };
  }

  registrarNuevoCliente(datosDelCliente) {
    const nombreValidado = ValidadorDeEntradas.exigirTextoNoVacio(datosDelCliente.nombre, 'nombre');
    const nuevoCliente = new Cliente({
      nombre: nombreValidado,
      telefono: datosDelCliente.telefono || '',
      correoElectronico: datosDelCliente.email || '',
      notas: datosDelCliente.notas || '',
    });
    return this.repositorioClientes.crearRegistro(nuevoCliente);
  }

  actualizarDatosDelCliente(identificador, datosDelCliente) {
    const clienteExistente = this.repositorioClientes.buscarPorIdentificador(identificador);
    if (!clienteExistente) {
      throw new ErrorDeAplicacion('Cliente no encontrado.', 404);
    }
    const nombreValidado =
      datosDelCliente.nombre !== undefined
        ? ValidadorDeEntradas.exigirTextoNoVacio(datosDelCliente.nombre, 'nombre')
        : clienteExistente.nombre;
    const clienteActualizado = new Cliente({
      id: identificador,
      nombre: nombreValidado,
      telefono: datosDelCliente.telefono ?? clienteExistente.telefono,
      correoElectronico: datosDelCliente.email ?? clienteExistente.correoElectronico,
      notas: datosDelCliente.notas ?? clienteExistente.notas,
    });
    return this.repositorioClientes.actualizarRegistro(identificador, clienteActualizado);
  }

  eliminarClientePorIdentificador(identificador) {
    const seElimino = this.repositorioClientes.eliminarRegistroPorIdentificador(identificador);
    if (!seElimino) {
      throw new ErrorDeAplicacion('Cliente no encontrado.', 404);
    }
  }
}

module.exports = ServicioClientes;
