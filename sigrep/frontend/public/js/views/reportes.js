async function renderReportes(container) {
  const [resumen, productos] = await Promise.all([api.getResumenReportes(), api.getProductos()]);

  container.innerHTML = `
    <h2>Reportes</h2>
    <div class="stat-grid">
      <div class="stat-card"><div class="label">Total de ventas</div><div class="value">$${resumen.total_ventas.toFixed(2)}</div></div>
      <div class="stat-card"><div class="label">Número de ventas</div><div class="value">${resumen.numero_ventas}</div></div>
      <div class="stat-card"><div class="label">Insumos bajo stock</div><div class="value">${resumen.insumos_bajo_stock.length}</div></div>
    </div>

    <div class="card">
      <h3>Registrar venta de mostrador</h3>
      <div class="form-row">
        <div>
          <label>Producto</label>
          <select id="v-producto">
            ${productos.map((p) => `<option value="${p.producto.id}">${p.producto.nombre} ($${p.precio_sugerido.toFixed(2)})</option>`).join('')}
          </select>
        </div>
        <div><label>Cantidad</label><input id="v-cantidad" type="number" value="1" /></div>
      </div>
      <br />
      <button class="primary" id="btn-registrar-venta">Registrar venta</button>
      <p id="venta-msg" style="margin-top:8px; font-size:13px;"></p>
    </div>

    <div class="card">
      <h3>Productos más vendidos</h3>
      <table>
        <thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr></thead>
        <tbody>
          ${resumen.productos_mas_vendidos.map((p) => `<tr><td>${p.nombre}</td><td>${p.unidades}</td><td>$${p.ingresos.toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="3">Sin ventas registradas.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>Insumos bajo stock mínimo</h3>
      <table>
        <thead><tr><th>Insumo</th><th>Stock actual</th><th>Mínimo</th></tr></thead>
        <tbody>
          ${resumen.insumos_bajo_stock.map((i) => `<tr><td>${i.nombre}</td><td>${i.stock_actual} ${i.unidad}</td><td>${i.stock_minimo} ${i.unidad}</td></tr>`).join('') || '<tr><td colspan="3">Todo en orden.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  container.querySelector('#btn-registrar-venta').addEventListener('click', async () => {
    const msgEl = container.querySelector('#venta-msg');
    try {
      await api.registrarVenta({
        producto_id: container.querySelector('#v-producto').value,
        cantidad: Number(container.querySelector('#v-cantidad').value),
      });
      msgEl.textContent = 'Venta registrada correctamente.';
      msgEl.style.color = 'var(--success)';
      setTimeout(() => renderReportes(container), 800);
    } catch (err) {
      msgEl.textContent = err.message;
      msgEl.style.color = 'var(--danger)';
    }
  });
}
