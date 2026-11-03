class VistaCalculadora extends VistaBase {
  async renderizarEnElContenedor() {
    const productosConCosto = await ClienteApi.listarProductosConCosto();
    const insumosDisponibles = await ClienteApi.listarInsumos();
    this.contenedorDeVista.innerHTML = `
      <h2>Calculadora de precios</h2>
      <p class="mensaje-error-vista alerta"></p>
      <div class="tarjeta">
        <h3>Nuevo producto</h3>
        <form id="formularioDeNuevoProducto" class="formulario-en-linea">
          <input type="text" name="nombre" placeholder="Nombre" required />
          <input type="number" step="0.01" name="costo_mano_obra" placeholder="Costo mano de obra" required />
          <input type="number" step="0.01" name="margen_deseado" placeholder="Margen (0.3 = 30%)" />
          <button type="submit">Crear producto</button>
        </form>
      </div>
      ${productosConCosto.map((item) => this.construirTarjetaDeProducto(item, insumosDisponibles)).join('')}
    `;
    this.registrarEscuchadoresDeEventos(insumosDisponibles);
  }

  construirTarjetaDeProducto(itemConCosto, insumosDisponibles) {
    const { producto, receta, costoTotal, precioDeVentaSugerido } = itemConCosto;
    return `
      <div class="tarjeta">
        <h3>${this.escaparTextoParaHtml(producto.nombre)}</h3>
        <p>Costo total por unidad: $${costoTotal.toFixed(2)} · Precio sugerido: $${precioDeVentaSugerido.toFixed(2)}</p>
        <table>
          <thead><tr><th>Insumo</th><th>Cantidad por unidad</th></tr></thead>
          <tbody>
            ${receta
              .map(
                (itemReceta) =>
                  `<tr><td>${this.escaparTextoParaHtml(itemReceta.nombreDelInsumo)}</td><td>${itemReceta.cantidadRequeridaPorUnidad}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
        <form class="formulario-en-linea formulario-agregar-insumo" data-producto-id="${producto.id}">
          <select name="insumo_id" required>
            <option value="">Insumo…</option>
            ${insumosDisponibles.map((insumo) => `<option value="${insumo.id}">${this.escaparTextoParaHtml(insumo.nombre)}</option>`).join('')}
          </select>
          <input type="number" step="0.01" name="cantidad" placeholder="Cantidad" required />
          <button type="submit">Agregar a receta</button>
        </form>
      </div>
    `;
  }

  registrarEscuchadoresDeEventos(insumosDisponibles) {
    const formularioDeNuevoProducto = this.contenedorDeVista.querySelector('#formularioDeNuevoProducto');
    formularioDeNuevoProducto.addEventListener('submit', (evento) => this.manejarEnvioDeNuevoProducto(evento));

    this.contenedorDeVista.querySelectorAll('.formulario-agregar-insumo').forEach((formulario) => {
      formulario.addEventListener('submit', (evento) => this.manejarEnvioDeNuevoItemDeReceta(evento, insumosDisponibles));
    });
  }

  async manejarEnvioDeNuevoProducto(evento) {
    evento.preventDefault();
    const datosDelFormulario = new FormData(evento.target);
    try {
      await ClienteApi.registrarProducto({
        nombre: datosDelFormulario.get('nombre'),
        costo_mano_obra: Number(datosDelFormulario.get('costo_mano_obra')),
        margen_deseado: datosDelFormulario.get('margen_deseado') ? Number(datosDelFormulario.get('margen_deseado')) : undefined,
      });
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }

  async manejarEnvioDeNuevoItemDeReceta(evento, insumosDisponibles) {
    evento.preventDefault();
    const identificadorDeProducto = evento.target.dataset.productoId;
    const datosDelFormulario = new FormData(evento.target);
    try {
      await ClienteApi.agregarInsumoALaReceta(
        identificadorDeProducto,
        datosDelFormulario.get('insumo_id'),
        Number(datosDelFormulario.get('cantidad'))
      );
      await this.renderizarEnElContenedor();
    } catch (error) {
      this.mostrarMensajeDeError(error.message);
    }
  }
}
