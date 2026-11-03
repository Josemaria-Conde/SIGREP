class VistaClientes extends VistaBase {
  async renderizarEnElContenedor() {
    const clientesRegistrados = await ClienteApi.listarClientes();
    this.contenedorDeVista.innerHTML = `
      <h2>Clientes</h2>
      <p class="mensaje-error-vista alerta"></p>
      <div class="tarjeta">
        <h3>Nuevo cliente</h3>
        <form id="formularioDeNuevoCliente" class="formulario-en-linea">
          <input type="text" name="nombre" placeholder="Nombre" required />
          <input type="text" name="telefono" placeholder="Teléfono" />
          <input type="email" name="email" placeholder="Correo" />
          <input type="text" name="notas" placeholder="Notas" />
          <button type="submit">Agregar</button>
        </form>
      </div>
      <table>
        <thead><tr><th>Nombre</th><th>Teléfono</th><th>Correo</th><th>Acciones</th></tr></thead>
        <tbody>
          ${clientesRegistrados.map((cliente) => this.construirFilaDeCliente(cliente)).join('')}
        </tbody>
      </table>
    `;
    this.registrarEscuchadoresDeEventos();
  }

  construirFilaDeCliente(cliente) {
    return `
      <tr>
        <td>${this.escaparTextoParaHtml(cliente.nombre)}</td>
        <td>${this.escaparTextoParaHtml(cliente.telefono || '—')}</td>
        <td>${this.escaparTextoParaHtml(cliente.correoElectronico || '—')}</td>
        <td><button class="boton-accion boton-peligro boton-eliminar" data-id="${cliente.id}">Eliminar</button></td>
      </tr>
    `;
  }

  registrarEscuchadoresDeEventos() {
    this.contenedorDeVista
      .querySelector('#formularioDeNuevoCliente')
      .addEventListener('submit', (evento) => this.manejarEnvioDeNuevoCliente(evento));

    this.contenedorDeVista.querySelectorAll('.boton-eliminar').forEach((boton) => {
      boton.addEventListener('click', () => this.manejarEliminacionDeCliente(boton.dataset.id));
    });
  }

  async manejarEnvioDeNuevoCliente(evento) {
    evento.preventDefault();
    const datosDelFormulario = new FormData(evento.target);
    try {
      await ClienteApi.registrarCliente({
        nombre: datosDelFormulario.get('nombre'),
        telefono: datosDelFormulario.get('telefono'),
        email: datosDelFormulario.get('email'),
        notas: datosDelFormulario.get('notas'),
      });
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }

  async manejarEliminacionDeCliente(identificador) {
    try {
      await ClienteApi.eliminarCliente(identificador);
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }
}
