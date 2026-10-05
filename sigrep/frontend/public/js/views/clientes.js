async function renderClientes(container) {
  const clientes = await api.getClientes();

  container.innerHTML = `
    <h2>Clientes</h2>
    <div class="card">
      <h3>Nuevo cliente</h3>
      <div class="form-row">
        <div><label>Nombre</label><input id="c-nombre" /></div>
        <div><label>Teléfono</label><input id="c-telefono" /></div>
        <div><label>Email</label><input id="c-email" /></div>
      </div>
      <label>Notas</label><textarea id="c-notas" rows="2"></textarea>
      <br /><br />
      <button class="primary" id="btn-crear-cliente">Agregar cliente</button>
    </div>

    <h3>Lista de clientes</h3>
    <div class="card">
      <table>
        <thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Notas</th><th></th></tr></thead>
        <tbody id="tabla-clientes"></tbody>
      </table>
    </div>
  `;

  container.querySelector('#tabla-clientes').innerHTML = clientes.map((c) => `
    <tr data-cliente-id="${c.id}">
      <td>${c.nombre}</td><td>${c.telefono || '—'}</td><td>${c.email || '—'}</td><td>${c.notas || '—'}</td>
      <td><button class="danger btn-eliminar-cliente">Eliminar</button></td>
    </tr>
  `).join('') || '<tr><td colspan="5">No hay clientes registrados.</td></tr>';

  container.querySelector('#btn-crear-cliente').addEventListener('click', async () => {
    const nombre = container.querySelector('#c-nombre').value.trim();
    if (!nombre) return alert('El nombre es requerido');
    await api.crearCliente({
      nombre,
      telefono: container.querySelector('#c-telefono').value,
      email: container.querySelector('#c-email').value,
      notas: container.querySelector('#c-notas').value,
    });
    renderClientes(container);
  });

  clientes.forEach((c) => {
    const row = container.querySelector(`[data-cliente-id="${c.id}"]`);
    row.querySelector('.btn-eliminar-cliente').addEventListener('click', async () => {
      if (confirm(`¿Eliminar a "${c.nombre}"?`)) { await api.eliminarCliente(c.id); renderClientes(container); }
    });
  });
}
