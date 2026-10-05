const views = {
  calculadora: renderCalculadora,
  inventario: renderInventario,
  pedidos: renderPedidos,
  clientes: renderClientes,
  reportes: renderReportes,
};

let usuarioActual = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function navigateTo(view) {
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  const content = document.getElementById('content');
  content.innerHTML = '<p style="color:var(--muted);">Cargando…</p>';
  try {
    await views[view](content);
  } catch (err) {
    content.innerHTML = `<p style="color:var(--danger);">Error: ${err.message}</p>`;
  }
}

document.getElementById('btn-login').addEventListener('click', async () => {
  const usuario = document.getElementById('login-usuario').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  try {
    usuarioActual = await api.login(usuario, password);
    document.getElementById('user-info').textContent = `${usuarioActual.nombre} (${usuarioActual.rol.replace('_', ' ')})`;
    showScreen('app');
    navigateTo('calculadora');
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  usuarioActual = null;
  showScreen('login-screen');
});

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.view));
});
