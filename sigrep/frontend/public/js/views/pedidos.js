async function renderPedidos(container) {
  const [pedidos, clientes, productos] = await Promise.all([
    api.getPedidos(), api.getClientes(), api.getProductos(),
  ]);

  container.innerHTML = `
    <h2>Pedidos</h2>
    <div class="card">
      <h3>Nuevo pedido</h3>
      <div class="form-row">
        <div>
          <label>Cliente</label>
          <select id="ped-cliente">
            <option value="">— Sin cliente —</option>
            ${clientes.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div><label>Fecha de entrega</label><input id="ped-fecha" type="date" /></div>
      </div>
      <label>Especificaciones</label>
      <textarea id="ped-especificaciones" rows="2" placeholder="Ej. Sin nuez, decoración rosa, para 20 personas"></textarea>

      <div class="form-row" style="margin-top:10px;">
        <div>
          <label>Producto</label>
          <select id="ped-producto">
            ${productos.map((p) => `<option value="${p.producto.id}" data-precio="${p.precio_sugerido}">${p.producto.nombre} ($${p.precio_sugerido.toFixed(2)})</option>`).join('')}
          </select>
        </div>
        <div><label>Cantidad</label><input id="ped-cantidad" type="number" value="1" /></div>
      </div>
      <button class="secondary" id="btn-agregar-item" style="margin-top:8px;">Agregar producto al pedido</button>

      <table style="margin-top:12px;">
        <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th></th></tr></thead>
        <tbody id="items-pedido"></tbody>
      </table>

      <br />
      <button class="primary" id="btn-crear-pedido">Crear pedido</button>
    </div>

    <h3>Pedidos registrados</h3>
    <div id="lista-pedidos"></div>
  `;

  let itemsPedido = [];

  function renderItems() {
    container.querySelector('#items-pedido').innerHTML = itemsPedido.map((it, idx) => `
      <tr>
        <td>${it.nombre}</td><td>${it.cantidad}</td><td>$${it.precio_unitario.toFixed(2)}</td>
        <td><button class="danger" data-idx="${idx}" onclick="this.closest('tr').remove()">Quitar</button></td>
      </tr>
    `).join('');
  }

  container.querySelector('#btn-agregar-item').addEventListener('click', () => {
    const select = container.querySelector('#ped-producto');
    const option = select.selectedOptions[0];
    const cantidad = Number(container.querySelector('#ped-cantidad').value) || 1;
    itemsPedido.push({
      producto_id: select.value,
      nombre: option.textContent,
      cantidad,
      precio_unitario: Number(option.dataset.precio),
    });
    renderItems();
  });

  container.querySelector('#btn-crear-pedido').addEventListener('click', async () => {
    const fecha = container.querySelector('#ped-fecha').value;
    if (!fecha) return alert('La fecha de entrega es requerida');
    if (itemsPedido.length === 0) return alert('Agrega al menos un producto');

    await api.crearPedido({
      cliente_id: container.querySelector('#ped-cliente').value || null,
      fecha_entrega: fecha,
      especificaciones: container.querySelector('#ped-especificaciones').value,
      productos: itemsPedido.map((it) => ({
        producto_id: it.producto_id, cantidad: it.cantidad, precio_unitario: it.precio_unitario,
      })),
    });
    renderPedidos(container);
  });

  const listaEl = container.querySelector('#lista-pedidos');
  const estados = ['pendiente', 'en_produccion', 'listo', 'entregado', 'cancelado'];
  listaEl.innerHTML = pedidos.map((p) => `
    <div class="card" data-pedido-id="${p.id}">
      <div style="display:flex; justify-content:space-between;">
        <div>
          <strong>${p.cliente_nombre || 'Sin cliente'}</strong> — Entrega: ${p.fecha_entrega}
          <p style="font-size:12px; color:var(--muted);">${p.especificaciones || ''}</p>
        </div>
        <select class="select-estado">
          ${estados.map((e) => `<option value="${e}" ${e === p.estado ? 'selected' : ''}>${e.replace('_', ' ')}</option>`).join('')}
        </select>
      </div>
      <table style="margin-top:8px;">
        <tbody>
          ${p.productos.map((pp) => `<tr><td>${pp.producto_nombre}</td><td>x${pp.cantidad}</td><td>$${(pp.cantidad * pp.precio_unitario).toFixed(2)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p style="text-align:right; font-weight:700; margin-top:8px;">Total: $${p.total.toFixed(2)}</p>
    </div>
  `).join('') || '<p>No hay pedidos registrados.</p>';

  pedidos.forEach((p) => {
    const card = listaEl.querySelector(`[data-pedido-id="${p.id}"]`);
    card.querySelector('.select-estado').addEventListener('change', async (e) => {
      await api.actualizarEstadoPedido(p.id, e.target.value);
    });
  });
}
