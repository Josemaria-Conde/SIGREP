class VistaInventario extends VistaBase {
  async renderizarEnElContenedor() {
    const insumosConAlertas = await ClienteApi.listarInsumos();
    this.contenedorDeVista.innerHTML = `
      <h2>Inventario de insumos</h2>
      <p class="mensaje-error-vista alerta"></p>
      <div class="tarjeta">
        <h3>Nuevo insumo</h3>
        <form id="formularioDeNuevoInsumo" class="formulario-en-linea">
          <input type="text" name="nombre" placeholder="Nombre" required />
          <input type="text" name="unidad" placeholder="Unidad (g, pieza...)" required />
          <input type="number" step="0.01" name="stock_actual" placeholder="Stock actual" required />
          <input type="number" step="0.01" name="stock_minimo" placeholder="Stock mínimo" required />
          <input type="number" step="0.01" name="costo_unitario" placeholder="Costo unitario" required />
          <input type="date" name="fecha_caducidad" />
          <button type="submit">Agregar</button>
        </form>
      </div>
      <table>
        <thead><tr><th>Nombre</th><th>Stock</th><th>Mínimo</th><th>Costo</th><th>Caducidad</th><th>Acciones</th></tr></thead>
        <tbody>
          ${insumosConAlertas.map((insumo) => this.construirFilaDeInsumo(insumo)).join('')}
        </tbody>
      </table>
    `;
    this.registrarEscuchadoresDeEventos();
  }

  construirFilaDeInsumo(insumo) {
    const claseDeAlerta = insumo.alertaDeExistenciaBaja || insumo.alertaDeCaducidadProxima ? 'alerta' : '';
    return `
      <tr class="${claseDeAlerta}">
        <td>${this.escaparTextoParaHtml(insumo.nombre)}</td>
        <td>${insumo.existenciaActual} ${this.escaparTextoParaHtml(insumo.unidadDeMedida)}</td>
        <td>${insumo.existenciaMinima}</td>
        <td>$${Number(insumo.costoPorUnidad).toFixed(2)}</td>
        <td>${insumo.fechaDeCaducidad || '—'}</td>
        <td>
          <button class="boton-accion boton-ajustar" data-id="${insumo.id}" data-delta="10">+10</button>
          <button class="boton-accion boton-ajustar" data-id="${insumo.id}" data-delta="-10">-10</button>
          <button class="boton-accion boton-peligro boton-eliminar" data-id="${insumo.id}">Eliminar</button>
        </td>
      </tr>
    `;
  }

  registrarEscuchadoresDeEventos() {
    this.contenedorDeVista
      .querySelector('#formularioDeNuevoInsumo')
      .addEventListener('submit', (evento) => this.manejarEnvioDeNuevoInsumo(evento));

    this.contenedorDeVista.querySelectorAll('.boton-ajustar').forEach((boton) => {
      boton.addEventListener('click', () => this.manejarAjusteDeStock(boton.dataset.id, Number(boton.dataset.delta)));
    });

    this.contenedorDeVista.querySelectorAll('.boton-eliminar').forEach((boton) => {
      boton.addEventListener('click', () => this.manejarEliminacionDeInsumo(boton.dataset.id));
    });
  }

  async manejarEnvioDeNuevoInsumo(evento) {
    evento.preventDefault();
    const datosDelFormulario = new FormData(evento.target);
    try {
      await ClienteApi.registrarInsumo({
        nombre: datosDelFormulario.get('nombre'),
        unidad: datosDelFormulario.get('unidad'),
        stock_actual: Number(datosDelFormulario.get('stock_actual')),
        stock_minimo: Number(datosDelFormulario.get('stock_minimo')),
        costo_unitario: Number(datosDelFormulario.get('costo_unitario')),
        fecha_caducidad: datosDelFormulario.get('fecha_caducidad') || null,
      });
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }

  async manejarAjusteDeStock(identificador, delta) {
    try {
      await ClienteApi.ajustarStockDelInsumo(identificador, delta);
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }

  async manejarEliminacionDeInsumo(identificador) {
    try {
      await ClienteApi.eliminarInsumo(identificador);
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }
}
