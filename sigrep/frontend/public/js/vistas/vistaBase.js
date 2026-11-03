class VistaBase {
  constructor(contenedorDeVista) {
    if (new.target === VistaBase) {
      throw new Error('VistaBase es una clase abstracta y no puede instanciarse directamente');
    }
    this.contenedorDeVista = contenedorDeVista;
  }

  renderizarEnElContenedor() {
    throw new Error('renderizarEnElContenedor debe implementarse en la subclase');
  }

  mostrarMensajeDeError(mensaje) {
    const contenedorDeErrores = this.contenedorDeVista.querySelector('.mensaje-error-vista');
    if (contenedorDeErrores) {
      contenedorDeErrores.textContent = mensaje;
    }
  }

  escaparTextoParaHtml(texto) {
    const elementoTemporal = document.createElement('div');
    elementoTemporal.textContent = texto ?? '';
    return elementoTemporal.innerHTML;
  }
}
