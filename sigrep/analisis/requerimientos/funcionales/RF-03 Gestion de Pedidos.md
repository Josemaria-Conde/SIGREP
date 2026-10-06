# RF-03 Gestión de Pedidos

## Descripción

Se busca que el usuario del sistema pueda visualizar, registrar y gestionar los pedidos realizados por los clientes, el sistema debe permitir registrar y actualizar los pedidos, así como llevar un control del estado de cada pedido (pendiente, en preparación, listo para entrega, entregado, cancelado)

## Historia de usuario

**Como** Usuario del sistema
**Quiero** Una manera de visualizar, registrar y gestionar los pedidos realizados por los clientes, así como llevar un
control del estado de cada pedido
**Para** Garantizar un flujo adecuado en la preparación de los pedidos evitando retrasos y entregas erróneas, además, poder
llevar una mejor gestión de los pedidos

## Criterios de aceptación

- [ ] El sistema permite registrar nuevos pedidos con sus detalles (productos, cantidades, cliente, fecha de entrega), y por defecto el estado del pedido debe ser "pendiente"
- [ ] El sistema permite actualizar el estado de cada pedido (pendiente, en preparación, listo para entrega, entregado, cancelado)
- [ ] El sistema permite visualizar los pedidos y su estado actual

## Trazabilidad

Sección de trazabilidad para indicar más adelante los casos de uso o requerimientos no funcionales que dependen de este requerimiento funcional.

**Dependencia:**

- `RF-02 Catálogo de Productos`
- `RF-05 Verificador de disponibilidad`
- `RF-06 Gestión de Clientes`
