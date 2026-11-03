class VistaReportes extends VistaBase {
  async renderizarEnElContenedor() {
    const [resumenDeReportes, productosDisponibles] = await Promise.all([
      ClienteApi.obtenerResumenDeReportes(),
      ClienteApi.listarProductosConCosto(),
    ]);
    this.contenedorDeVista.innerHTML = `
      <h2>Ventas y reportes</h2>
      <p class="mensaje-error-vista alerta"></p>
      <div class="resumen-metricas">
        <div class="metrica"><div class="valor">$${resumenDeReportes.totalDeVentas.toFixed(2)}</div><div>Total vendido</div></div>
        <div class="metrica"><div class="valor">${resumenDeReportes.numeroDeVentas}</div><div>Ventas registradas</div></div>
        <div class="metrica"><div class="valor">${resumenDeReportes.insumosConExistenciaBaja.length}</div><div>Insumos con stock bajo</div></div>
      </div>
      <div class="tarjeta">
        <h3>Registrar venta de mostrador</h3>
        <form id="formularioDeNuevaVenta" class="formulario-en-linea">
          <select name="producto_id" required>
            <option value="">Producto…</option>
            ${productosDisponibles.map((item) => `<option value="${item.producto.id}">${this.escaparTextoParaHtml(item.producto.nombre)}</option>`).join('')}
          </select>
          <input type="number" step="1" min="1" name="cantidad" placeholder="Cantidad" required />
          <button type="submit">Registrar venta</button>
        </form>
      </div>
      <div class="tarjeta">
        <h3>Productos más vendidos</h3>
        <table>
          <thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr></thead>
          <tbody>
            ${resumenDeReportes.productosMasVendidos
              .map(
                (productoMasVendido) =>
                  `<tr><td>${this.escaparTextoParaHtml(productoMasVendido.nombre)}</td><td>${productoMasVendido.unidades}</td><td>$${Number(productoMasVendido.ingresos).toFixed(2)}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
    this.registrarEscuchadoresDeEventos();
  }

  registrarEscuchadoresDeEventos() {
    this.contenedorDeVista
      .querySelector('#formularioDeNuevaVenta')
      .addEventListener('submit', (evento) => this.manejarEnvioDeNuevaVenta(evento));
  }

  async manejarEnvioDeNuevaVenta(evento) {
    evento.preventDefault();
    const datosDelFormulario = new FormData(evento.target);
    try {
      await ClienteApi.registrarVenta(datosDelFormulario.get('producto_id'), Number(datosDelFormulario.get('cantidad')));
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }
}
