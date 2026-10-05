// Constantes de negocio compartidas entre módulos.
// Centralizar estos valores evita "números mágicos" repetidos en el código
// y hace explícito el significado de cada regla de negocio.

module.exports = {
  // Días de anticipación para alertar que un insumo está por caducar.
  DIAS_ALERTA_CADUCIDAD: 7,

  // Margen de ganancia por defecto al crear un producto sin especificarlo (30%).
  MARGEN_DEFECTO: 0.3,

  // Rondas de hashing para bcrypt (costo computacional de las contraseñas).
  BCRYPT_SALT_ROUNDS: 10,

  ROLES_VALIDOS: ['dueña', 'ayudante_produccion'],
  ESTADOS_PEDIDO_VALIDOS: ['pendiente', 'en_produccion', 'listo', 'entregado', 'cancelado'],
};
