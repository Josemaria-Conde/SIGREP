async function renderInventario(container) {
  const insumos = await api.getInsumos();

  container.innerHTML = `
    <h2>Inventario de insumos</h2>
    <div class="card">
      <h3>Agregar insumo</h3>
      <div class="form-row">
        <div><label>Nombre</label><input id="i-nombre" /></div>
        <div><label>Unidad</label><input id="i-unidad" placeholder="g, kg, ml, pieza" /></div>
      </div>
      <div class="form-row">
        <div><label>Stock actual</label><input id="i-stock" type="number" value="0" /></div>
        <div><label>Stock mínimo</label><input id="i-stock-min" type="number" value="0" /></div>
        <div><label>Costo unitario ($)</label><input id="i-costo" type="number" step="0.01" value="0" /></div>
        <div><label>Caducidad</label><input id="i-caducidad" type="date" /></div>
      </div>
      <br />
      <button class="primary" id="btn-crear-insumo">Agregar</button>
    </div>

    <h3>Existencias</h3>
    <div class="card">
      <table>
        <thead>
          <tr><th>Insumo</th><th>Stock</th><th>Mínimo</th><th>Costo unit.</th><th>Caducidad</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody id="tabla-insumos"></tbody>
      </table>
    </div>
  `;

  const tbody = container.querySelector('#tabla-insumos');
  tbody.innerHTML = insumos.map(insumoRowHTML).join('');

  container.querySelector('#btn-crear-insumo').addEventListener('click', async () => {
    const nombre = container.querySelector('#i-nombre').value.trim();
    const unidad = container.querySelector('#i-unidad').value.trim();
    if (!nombre || !unidad) return alert('Nombre y unidad son requeridos');
    await api.crearInsumo({
      nombre, unidad,
      stock_actual: Number(container.querySelector('#i-stock').value),
      stock_minimo: Number(container.querySelector('#i-stock-min').value),
      costo_unitario: Number(container.querySelector('#i-costo').value),
      fecha_caducidad: container.querySelector('#i-caducidad').value || null,
    });
    renderInventario(container);
  });

  insumos.forEach((i) => {
    const row = tbody.querySelector(`[data-insumo-id="${i.id}"]`);
    row.querySelector('.btn-sumar').addEventListener('click', async () => {
      const cant = prompt(`¿Cuánto ${i.unidad} de ${i.nombre} deseas agregar al stock?`, '0');
      if (cant) { await api.ajustarStock(i.id, Number(cant)); renderInventario(container); }
    });
    row.querySelector('.btn-restar').addEventListener('click', async () => {
      const cant = prompt(`¿Cuánto ${i.unidad} de ${i.nombre} deseas descontar del stock?`, '0');
      if (cant) { await api.ajustarStock(i.id, -Number(cant)); renderInventario(container); }
    });
    row.querySelector('.btn-eliminar-insumo').addEventListener('click', async () => {
      if (confirm(`¿Eliminar "${i.nombre}"?`)) { await api.eliminarInsumo(i.id); renderInventario(container); }
    });
  });
}

function insumoRowHTML(i) {
  let badge = '<span class="badge success">OK</span>';
  if (i.alerta_stock_bajo) badge = '<span class="badge danger">Stock bajo</span>';
  else if (i.alerta_caducidad) badge = '<span class="badge warning">Por caducar</span>';

  return `
    <tr data-insumo-id="${i.id}">
      <td>${i.nombre}</td>
      <td>${i.stock_actual} ${i.unidad}</td>
      <td>${i.stock_minimo} ${i.unidad}</td>
      <td>$${i.costo_unitario.toFixed(3)}</td>
      <td>${i.fecha_caducidad || '—'}</td>
      <td>${badge}</td>
      <td>
        <button class="secondary btn-sumar" title="Agregar stock">+</button>
        <button class="secondary btn-restar" title="Descontar stock">−</button>
        <button class="danger btn-eliminar-insumo">Eliminar</button>
      </td>
    </tr>
  `;
}
