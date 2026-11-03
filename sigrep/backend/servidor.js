const express = require('express');
const cors = require('cors');
const path = require('path');

const ConexionBaseDeDatos = require('./configuracion/ConexionBaseDeDatos');
const SembradorDeDatosIniciales = require('./configuracion/SembradorDeDatosIniciales');
const ManejadorDeErrores = require('./middleware/ManejadorDeErrores');

const RepositorioUsuarios = require('./repositorios/RepositorioUsuarios');
const RepositorioClientes = require('./repositorios/RepositorioClientes');
const RepositorioInsumos = require('./repositorios/RepositorioInsumos');
const RepositorioProductos = require('./repositorios/RepositorioProductos');
const RepositorioPedidos = require('./repositorios/RepositorioPedidos');
const RepositorioVentas = require('./repositorios/RepositorioVentas');

const ServicioAutenticacion = require('./servicios/ServicioAutenticacion');
const ServicioClientes = require('./servicios/ServicioClientes');
const ServicioInsumos = require('./servicios/ServicioInsumos');
const ServicioInventario = require('./servicios/ServicioInventario');
const ServicioPedidos = require('./servicios/ServicioPedidos');
const ServicioVentas = require('./servicios/ServicioVentas');

const ControladorUsuarios = require('./controladores/ControladorUsuarios');
const ControladorClientes = require('./controladores/ControladorClientes');
const ControladorInsumos = require('./controladores/ControladorInsumos');
const ControladorProductos = require('./controladores/ControladorProductos');
const ControladorPedidos = require('./controladores/ControladorPedidos');
const ControladorVentas = require('./controladores/ControladorVentas');

class AplicacionSigrep {
  constructor() {
    this.aplicacionExpress = express();
    this.puertoDeEscucha = process.env.PORT || 3001;
    this.conexionBaseDeDatos = new ConexionBaseDeDatos(path.join(__dirname, 'base_de_datos', 'sigrep.db'));
  }

  inicializarBaseDeDatos() {
    this.conexionBaseDeDatos.inicializarEsquemaDesdeArchivo(path.join(__dirname, 'base_de_datos', 'esquema.sql'));
    new SembradorDeDatosIniciales(this.conexionBaseDeDatos).sembrarSiLaBaseDeDatosEstaVacia();
  }

  construirRepositorios() {
    this.repositorioUsuarios = new RepositorioUsuarios(this.conexionBaseDeDatos);
    this.repositorioClientes = new RepositorioClientes(this.conexionBaseDeDatos);
    this.repositorioInsumos = new RepositorioInsumos(this.conexionBaseDeDatos);
    this.repositorioProductos = new RepositorioProductos(this.conexionBaseDeDatos);
    this.repositorioPedidos = new RepositorioPedidos(this.conexionBaseDeDatos);
    this.repositorioVentas = new RepositorioVentas(this.conexionBaseDeDatos);
  }

  construirServicios() {
    this.servicioAutenticacion = new ServicioAutenticacion(this.repositorioUsuarios);
    this.servicioClientes = new ServicioClientes(this.repositorioClientes, this.repositorioPedidos);
    this.servicioInsumos = new ServicioInsumos(this.repositorioInsumos);
    this.servicioInventario = new ServicioInventario(this.repositorioProductos, this.repositorioInsumos);
    this.servicioPedidos = new ServicioPedidos(this.repositorioPedidos, this.repositorioProductos);
    this.servicioVentas = new ServicioVentas(this.repositorioVentas, this.repositorioInsumos, this.servicioInventario);
  }

  registrarMiddlewareGlobal() {
    this.aplicacionExpress.use(cors());
    this.aplicacionExpress.use(express.json());
  }

  registrarRutasDeLaApi() {
    const mapaDeRutasYControladores = [
      ['/api/usuarios', new ControladorUsuarios(this.servicioAutenticacion)],
      ['/api/clientes', new ControladorClientes(this.servicioClientes)],
      ['/api/insumos', new ControladorInsumos(this.servicioInsumos)],
      ['/api/productos', new ControladorProductos(this.servicioInventario)],
      ['/api/pedidos', new ControladorPedidos(this.servicioPedidos)],
      ['/api/ventas', new ControladorVentas(this.servicioVentas)],
    ];
    mapaDeRutasYControladores.forEach(([rutaBase, controlador]) => {
      const enrutadorExpress = express.Router();
      controlador.registrarRutas(enrutadorExpress);
      this.aplicacionExpress.use(rutaBase, enrutadorExpress);
    });
    this.aplicacionExpress.get('/api/health', (peticion, respuesta) => respuesta.json({ status: 'ok', sistema: 'SIGREP' }));
  }

  registrarServidorDeArchivosEstaticos() {
    const rutaDelFrontend = path.join(__dirname, '..', 'frontend', 'public');
    this.aplicacionExpress.use(express.static(rutaDelFrontend));
    this.aplicacionExpress.get('*', (peticion, respuesta) => {
      if (peticion.path.startsWith('/api/')) {
        respuesta.status(404).json({ error: 'Ruta no encontrada.' });
        return;
      }
      respuesta.sendFile(path.join(rutaDelFrontend, 'index.html'));
    });
  }

  registrarManejadorDeErrores() {
    this.aplicacionExpress.use(ManejadorDeErrores.manejar);
  }

  iniciarEscucha() {
    this.aplicacionExpress.listen(this.puertoDeEscucha, () => {
      console.log(`SIGREP corriendo en http://localhost:${this.puertoDeEscucha}`);
    });
  }

  ejecutar() {
    this.inicializarBaseDeDatos();
    this.construirRepositorios();
    this.construirServicios();
    this.registrarMiddlewareGlobal();
    this.registrarRutasDeLaApi();
    this.registrarServidorDeArchivosEstaticos();
    this.registrarManejadorDeErrores();
    this.iniciarEscucha();
  }
}

if (require.main === module) {
  new AplicacionSigrep().ejecutar();
}

module.exports = AplicacionSigrep;
