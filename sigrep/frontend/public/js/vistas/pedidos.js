class VistaPedidos extends VistaBase {
  async renderizarEnElContenedor() {
    const [pedidosRegistrados, clientesDisponibles, productosDisponibles] = await Promise.all([
      ClienteApi.listarPedidos(),
      ClienteApi.listarClientes(),
      ClienteApi.listarProductosConCosto(),
    ]);
    this.contenedorDeVista.innerHTML = `
      <h2>Pedidos</h2>
      <p class="mensaje-error-vista alerta"></p>
      <div class="tarjeta">
        <h3>Nuevo pedido</h3>
        <form id="formularioDeNuevoPedido" class="formulario-en-linea">
          <select name="cliente_id">
            <option value="">Sin cliente</option>
            ${clientesDisponibles.map((cliente) => `<option value="${cliente.id}">${this.escaparTextoParaHtml(cliente.nombre)}</option>`).join('')}
          </select>
          <input type="date" name="fecha_entrega" required />
          <select name="producto_id" required>
            <option value="">Producto…</option>
            ${productosDisponibles.map((item) => `<option value="${item.producto.id}" data-precio="${item.precioDeVentaSugerido}">${this.escaparTextoParaHtml(item.producto.nombre)}</option>`).join('')}
          </select>
          <input type="number" step="1" min="1" name="cantidad" placeholder="Cantidad" required />
          <input type="text" name="especificaciones" placeholder="Especificaciones" />
          <button type="submit">Crear pedido</button>
        </form>
      </div>
      <table>
        <thead><tr><th>#</th><th>Cliente</th><th>Entrega</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead>
        <tbody>
          ${pedidosRegistrados.map((pedido) => this.construirFilaDePedido(pedido, clientesDisponibles)).join('')}
        </tbody>
      </table>
    `;
    this.registrarEscuchadoresDeEventos();
  }

  construirFilaDePedido(pedido, clientesDisponibles) {
    const clienteDelPedido = clientesDisponibles.find((cliente) => String(cliente.id) === String(pedido.identificadorDeCliente));
    const totalDelPedido = pedido.productosSolicitados.reduce((suma, item) => suma + item.cantidadSolicitada * item.precioUnitarioPactado, 0);
    return `
      <tr>
        <td>${pedido.id}</td>
        <td>${clienteDelPedido ? this.escaparTextoParaHtml(clienteDelPedido.nombre) : '—'}</td>
        <td>${pedido.fechaDeEntrega}</td>
        <td>${pedido.productosSolicitados.map((item) => `${item.cantidadSolicitada}x ${this.escaparTextoParaHtml(item.nombreDelProducto)}`).join(', ')}</td>
        <td>$${totalDelPedido.toFixed(2)}</td>
        <td>
          <select class="selector-estado" data-id="${pedido.id}">
            ${['pendiente', 'en_produccion', 'listo', 'entregado', 'cancelado']
              .map((estado) => `<option value="${estado}" ${estado === pedido.estado ? 'selected' : ''}>${estado}</option>`)
              .join('')}
          </select>
        </td>
      </tr>
    `;
  }

  registrarEscuchadoresDeEventos() {
    this.contenedorDeVista
      .querySelector('#formularioDeNuevoPedido')
      .addEventListener('submit', (evento) => this.manejarEnvioDeNuevoPedido(evento));

    this.contenedorDeVista.querySelectorAll('.selector-estado').forEach((selector) => {
      selector.addEventListener('change', () => this.manejarCambioDeEstado(selector.dataset.id, selector.value));
    });
  }

  async manejarEnvioDeNuevoPedido(evento) {
    evento.preventDefault();
    const datosDelFormulario = new FormData(evento.target);
    const selectorDeProducto = evento.target.querySelector('select[name="producto_id"]');
    const precioUnitarioSugerido = Number(selectorDeProducto.selectedOptions[0]?.dataset.precio || 0);
    try {
      await ClienteApi.crearPedido({
        cliente_id: datosDelFormulario.get('cliente_id') || null,
        fecha_entrega: datosDelFormulario.get('fecha_entrega'),
        especificaciones: datosDelFormulario.get('especificaciones') || '',
        productos: [
          {
            producto_id: datosDelFormulario.get('producto_id'),
            cantidad: Number(datosDelFormulario.get('cantidad')),
            precio_unitario: precioUnitarioSugerido,
          },
        ],
      });
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }

  async manejarCambioDeEstado(identificadorDePedido, nuevoEstado) {
    try {
      await ClienteApi.cambiarEstadoDelPedido(identificadorDePedido, nuevoEstado);
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }
}
