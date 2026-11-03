class AplicacionCliente {
  constructor() {
    this.pantallaDeAcceso = document.getElementById('pantallaDeAcceso');
    this.aplicacionPrincipal = document.getElementById('aplicacionPrincipal');
    this.contenedorDeVista = document.getElementById('contenedorDeVista');
    this.nombreDeUsuarioActivo = document.getElementById('nombreDeUsuarioActivo');
    this.mapaDeVistasDisponibles = {
      calculadora: VistaCalculadora,
      inventario: VistaInventario,
      pedidos: VistaPedidos,
      clientes: VistaClientes,
      reportes: VistaReportes,
    };
    this.usuarioActivo = null;
  }

  registrarEscuchadoresDeEventos() {
    document.getElementById('formularioDeAcceso').addEventListener('submit', (evento) => this.manejarEnvioDeAcceso(evento));
    document.getElementById('botonCerrarSesion').addEventListener('click', () => this.manejarCierreDeSesion());
    document.querySelectorAll('.boton-nav').forEach((boton) => {
      boton.addEventListener('click', () => this.manejarCambioDeVista(boton.dataset.vista, boton));
    });
  }

  async manejarEnvioDeAcceso(evento) {
    evento.preventDefault();
    const usuario = document.getElementById('campoUsuario').value;
    const password = document.getElementById('campoContrasena').value;
    const mensajeDeError = document.getElementById('mensajeDeErrorDeAcceso');
    try {
      this.usuarioActivo = await ClienteApi.iniciarSesion(usuario, password);
      mensajeDeError.textContent = '';
      this.mostrarAplicacionPrincipal();
    } catch (error) {
      mensajeDeError.textContent = error.message;
    }
  }

  manejarCierreDeSesion() {
    this.usuarioActivo = null;
    this.aplicacionPrincipal.classList.add('oculto');
    this.pantallaDeAcceso.classList.remove('oculto');
  }

  manejarCambioDeVista(nombreDeLaVista, botonPresionado) {
    document.querySelectorAll('.boton-nav').forEach((boton) => boton.classList.remove('activo'));
    botonPresionado.classList.add('activo');
    this.renderizarVistaActiva(nombreDeLaVista);
  }

  mostrarAplicacionPrincipal() {
    this.pantallaDeAcceso.classList.add('oculto');
    this.aplicacionPrincipal.classList.remove('oculto');
    this.nombreDeUsuarioActivo.textContent = `${this.usuarioActivo.nombre} (${this.usuarioActivo.rol})`;
    this.renderizarVistaActiva('calculadora');
  }

  renderizarVistaActiva(nombreDeLaVista) {
    const ClaseDeLaVista = this.mapaDeVistasDisponibles[nombreDeLaVista];
    const instanciaDeLaVista = new ClaseDeLaVista(this.contenedorDeVista);
    instanciaDeLaVista.renderizarEnElContenedor();
  }

  iniciar() {
    this.registrarEscuchadoresDeEventos();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AplicacionCliente().iniciar();
});
