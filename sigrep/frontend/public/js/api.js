const API_BASE = '/api';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(err.error || 'Error en la solicitud');
  }
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  login: (usuario, password) =>
    apiRequest('/usuarios/login', { method: 'POST', body: JSON.stringify({ usuario, password }) }),

  // Insumos
  getInsumos: () => apiRequest('/insumos'),
  crearInsumo: (data) => apiRequest('/insumos', { method: 'POST', body: JSON.stringify(data) }),
  actualizarInsumo: (id, data) => apiRequest(`/insumos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarInsumo: (id) => apiRequest(`/insumos/${id}`, { method: 'DELETE' }),
  ajustarStock: (id, delta) => apiRequest(`/insumos/${id}/ajustar-stock`, { method: 'PATCH', body: JSON.stringify({ delta }) }),

  // Productos
  getProductos: () => apiRequest('/productos'),
  getProducto: (id) => apiRequest(`/productos/${id}`),
  crearProducto: (data) => apiRequest('/productos', { method: 'POST', body: JSON.stringify(data) }),
  actualizarProducto: (id, data) => apiRequest(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarProducto: (id) => apiRequest(`/productos/${id}`, { method: 'DELETE' }),
  agregarRecetaItem: (id, data) => apiRequest(`/productos/${id}/receta`, { method: 'POST', body: JSON.stringify(data) }),
  quitarRecetaItem: (id, insumoId) => apiRequest(`/productos/${id}/receta/${insumoId}`, { method: 'DELETE' }),
  producir: (id, cantidad) => apiRequest(`/productos/${id}/producir`, { method: 'POST', body: JSON.stringify({ cantidad }) }),

  // Clientes
  getClientes: () => apiRequest('/clientes'),
  getCliente: (id) => apiRequest(`/clientes/${id}`),
  crearCliente: (data) => apiRequest('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  eliminarCliente: (id) => apiRequest(`/clientes/${id}`, { method: 'DELETE' }),

  // Pedidos
  getPedidos: () => apiRequest('/pedidos'),
  crearPedido: (data) => apiRequest('/pedidos', { method: 'POST', body: JSON.stringify(data) }),
  actualizarEstadoPedido: (id, estado) => apiRequest(`/pedidos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  eliminarPedido: (id) => apiRequest(`/pedidos/${id}`, { method: 'DELETE' }),

  // Ventas / reportes
  getVentas: () => apiRequest('/ventas'),
  registrarVenta: (data) => apiRequest('/ventas', { method: 'POST', body: JSON.stringify(data) }),
  getResumenReportes: () => apiRequest('/ventas/reportes/resumen'),
};
