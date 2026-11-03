class ClienteApi {
  constructor() {
    throw new Error('ClienteApi es una clase abstracta y no puede instanciarse directamente');
  }

  static async enviarPeticion(rutaRelativa, opciones = {}) {
    const respuesta = await fetch(`/api${rutaRelativa}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
    if (respuesta.status === 204) {
      return null;
    }
    const cuerpoDeLaRespuesta = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
      throw new Error(cuerpoDeLaRespuesta?.error || 'Ocurrió un error inesperado.');
    }
    return cuerpoDeLaRespuesta;
  }

  static iniciarSesion(usuario, password) {
    return ClienteApi.enviarPeticion('/usuarios/login', { method: 'POST', body: JSON.stringify({ usuario, password }) });
  }

  static listarInsumos() {
    return ClienteApi.enviarPeticion('/insumos');
  }

  static registrarInsumo(datosDelInsumo) {
    return ClienteApi.enviarPeticion('/insumos', { method: 'POST', body: JSON.stringify(datosDelInsumo) });
  }

  static ajustarStockDelInsumo(identificador, delta) {
    return ClienteApi.enviarPeticion(`/insumos/${identificador}/ajustar-stock`, {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    });
  }

  static eliminarInsumo(identificador) {
    return ClienteApi.enviarPeticion(`/insumos/${identificador}`, { method: 'DELETE' });
  }

  static listarProductosConCosto() {
    return ClienteApi.enviarPeticion('/productos');
  }

  static registrarProducto(datosDelProducto) {
    return ClienteApi.enviarPeticion('/productos', { method: 'POST', body: JSON.stringify(datosDelProducto) });
  }

  static agregarInsumoALaReceta(identificadorDeProducto, insumoId, cantidad) {
    return ClienteApi.enviarPeticion(`/productos/${identificadorDeProducto}/receta`, {
      method: 'POST',
      body: JSON.stringify({ insumo_id: insumoId, cantidad }),
    });
  }

  static quitarInsumoDeLaReceta(identificadorDeProducto, insumoId) {
    return ClienteApi.enviarPeticion(`/productos/${identificadorDeProducto}/receta/${insumoId}`, { method: 'DELETE' });
  }

  static producirUnidadesDeProducto(identificadorDeProducto, cantidad) {
    return ClienteApi.enviarPeticion(`/productos/${identificadorDeProducto}/producir`, {
      method: 'POST',
      body: JSON.stringify({ cantidad }),
    });
  }

  static listarClientes() {
    return ClienteApi.enviarPeticion('/clientes');
  }

  static obtenerClienteConSusPedidos(identificador) {
    return ClienteApi.enviarPeticion(`/clientes/${identificador}`);
  }

  static registrarCliente(datosDelCliente) {
    return ClienteApi.enviarPeticion('/clientes', { method: 'POST', body: JSON.stringify(datosDelCliente) });
  }

  static eliminarCliente(identificador) {
    return ClienteApi.enviarPeticion(`/clientes/${identificador}`, { method: 'DELETE' });
  }

  static listarPedidos(estado) {
    const parametroDeEstado = estado ? `?estado=${encodeURIComponent(estado)}` : '';
    return ClienteApi.enviarPeticion(`/pedidos${parametroDeEstado}`);
  }

  static crearPedido(datosDelPedido) {
    return ClienteApi.enviarPeticion('/pedidos', { method: 'POST', body: JSON.stringify(datosDelPedido) });
  }

  static cambiarEstadoDelPedido(identificador, estado) {
    return ClienteApi.enviarPeticion(`/pedidos/${identificador}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });
  }

  static registrarVenta(productoId, cantidad) {
    return ClienteApi.enviarPeticion('/ventas', { method: 'POST', body: JSON.stringify({ producto_id: productoId, cantidad }) });
  }

  static obtenerResumenDeReportes() {
    return ClienteApi.enviarPeticion('/ventas/reportes/resumen');
  }
}
