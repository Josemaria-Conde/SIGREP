class ConstantesDelNegocio {
  constructor() {
    throw new Error('ConstantesDelNegocio es una clase abstracta y no puede instanciarse directamente');
  }

  static get diasDeAnticipacionParaAlertarCaducidad() {
    return 7;
  }

  static get margenDeGananciaPorDefecto() {
    return 0.3;
  }

  static get numeroDeRondasParaCifradoDeContrasenas() {
    return 10;
  }

  static get rolesDeUsuarioValidos() {
    return ['dueña', 'ayudante_produccion'];
  }

  static get estadosDePedidoValidos() {
    return ['pendiente', 'en_produccion', 'listo', 'entregado', 'cancelado'];
  }

  static get estadoInicialDePedido() {
    return 'pendiente';
  }
}

module.exports = ConstantesDelNegocio;
