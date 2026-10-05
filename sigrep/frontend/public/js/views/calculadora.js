async function renderCalculadora(container) {
  const productos = await api.getProductos();
  const insumos = await api.getInsumos();

  container.innerHTML = `
    <h2>Calculadora de precios</h2>
    <div class="card">
      <h3>Nuevo producto</h3>
      <div class="form-row">
        <div><label>Nombre</label><input id="p-nombre" /></div>
        <div><label>Costo de mano de obra ($)</label><input id="p-mano-obra" type="number" value="0" /></div>
        <div><label>Margen deseado (%)</label><input id="p-margen" type="number" value="30" /></div>
      </div>
      <label>Descripción</label><textarea id="p-descripcion" rows="2"></textarea>
      <br /><br />
      <button class="primary" id="btn-crear-producto">Crear producto</button>
    </div>

    <h3>Productos y precio sugerido</h3>
    <div id="lista-productos"></div>
  `;

  const listaEl = container.querySelector('#lista-productos');
  listaEl.innerHTML = productos.map((p) => productoCardHTML(p)).join('') || '<p>No hay productos aún.</p>';

  container.querySelector('#btn-crear-producto').addEventListener('click', async () => {
    const nombre = container.querySelector('#p-nombre').value.trim();
    if (!nombre) return alert('El nombre es requerido');
    await api.crearProducto({
      nombre,
      descripcion: container.querySelector('#p-descripcion').value,
      costo_mano_obra: Number(container.querySelector('#p-mano-obra').value),
      margen_deseado: Number(container.querySelector('#p-margen').value) / 100,
    });
    renderCalculadora(container);
  });

  productos.forEach((p) => {
    const card = listaEl.querySelector(`[data-producto-id="${p.producto.id}"]`);
    card.querySelector('.btn-toggle-receta').addEventListener('click', () => {
      const recetaBox = card.querySelector('.receta-box');
      recetaBox.style.display = recetaBox.style.display === 'none' ? 'block' : 'none';
      if (recetaBox.style.display === 'block' && !recetaBox.dataset.loaded) {
        recetaBox.dataset.loaded = '1';
        renderRecetaEditor(recetaBox, p, insumos, container);
      }
    });
    card.querySelector('.btn-eliminar-producto').addEventListener('click', async () => {
      if (confirm(`¿Eliminar "${p.producto.nombre}"?`)) {
        await api.eliminarProducto(p.producto.id);
        renderCalculadora(container);
      }
    });
  });
}

function productoCardHTML(p) {
  return `
    <div class="card" data-producto-id="${p.producto.id}">
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <strong>${p.producto.nombre}</strong>
          <p style="color:var(--muted); font-size:12px;">${p.producto.descripcion || ''}</p>
        </div>
        <button class="btn-eliminar-producto danger">Eliminar</button>
      </div>
      <div class="price-result">
        <div class="line"><span>Costo de insumos</span><span>$${p.costo_insumos.toFixed(2)}</span></div>
        <div class="line"><span>Mano de obra</span><span>$${p.costo_mano_obra.toFixed(2)}</span></div>
        <div class="line"><span>Costo total</span><span>$${p.costo_total.toFixed(2)}</span></div>
        <div class="line"><span>Margen (${(p.margen_deseado * 100).toFixed(0)}%)</span><span></span></div>
        <div class="line total"><span>Precio sugerido</span><span>$${p.precio_sugerido.toFixed(2)}</span></div>
      </div>
      <button class="secondary btn-toggle-receta" style="margin-top:12px;">Editar receta (insumos)</button>
      <div class="receta-box" style="display:none; margin-top:12px;"></div>
    </div>
  `;
}

function renderRecetaEditor(box, p, insumos, container) {
  box.innerHTML = `
    <table>
      <thead><tr><th>Insumo</th><th>Cantidad</th><th>Costo</th><th></th></tr></thead>
      <tbody>
        ${p.receta.map((r) => `
          <tr>
            <td>${r.nombre}</td>
            <td>${r.cantidad}</td>
            <td>$${(r.cantidad * r.costo_unitario).toFixed(2)}</td>
            <td><button class="danger btn-quitar-insumo" data-insumo-id="${r.insumo_id}">Quitar</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-row" style="margin-top:12px;">
      <div>
        <label>Insumo</label>
        <select class="select-insumo">
          ${insumos.map((i) => `<option value="${i.id}">${i.nombre} (${i.unidad})</option>`).join('')}
        </select>
      </div>
      <div><label>Cantidad</label><input class="input-cantidad-receta" type="number" value="1" /></div>
    </div>
    <button class="primary btn-agregar-insumo" style="margin-top:8px;">Agregar a la receta</button>
  `;

  box.querySelectorAll('.btn-quitar-insumo').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await api.quitarRecetaItem(p.producto.id, btn.dataset.insumoId);
      renderCalculadora(container);
    });
  });

  box.querySelector('.btn-agregar-insumo').addEventListener('click', async () => {
    const insumoId = box.querySelector('.select-insumo').value;
    const cantidad = Number(box.querySelector('.input-cantidad-receta').value);
    await api.agregarRecetaItem(p.producto.id, { insumo_id: insumoId, cantidad });
    renderCalculadora(container);
  });
}
