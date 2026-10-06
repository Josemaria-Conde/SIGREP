# RF-04 Control de Ventas

## Descripción

Se busca que el sistema permita registrar y actualizar las ventas realizadas, y el sistema debe llevar el control del estado de cada pedido (pendiente, en preparación, listo para entrega, entregado, cancelado) de acuerdo a la información proporcionada en el `RF-03 visualización de pedidos`, además, debe generar reportes de ventas por fechas **(por determinar si se requiere que sea por mes, semana o día)** y por producto, permitiendo al usuario analizar el desempeño de las ventas y tomar decisiones para mejorar la rentabilidad del negocio

## Historia de usuario

**Como** administrador de ventas
**Quiero** Poder registrar y actualizar las ventas realizadas para poder generar reportes de ventas por fechas y por producto
**Para** Analizar el desempeño de las ventas y tomar decisiones estratégicas para mejorar la rentabilidad del negocio

## Criterios de aceptación

- [ ] El sistema permite registrar nuevas ventas con sus detalles (productos, cantidades, cliente, fecha de venta)
- [ ] El sistema debe actualizar el estado del pedido a "entregado" cuando concluya la venta
- [ ] El sistema permite generar reportes de ventas por fechas y por producto
- [ ] El sistema permite visualizar las ventas registradas

## Trazabilidad

Sección de trazabilidad para indicar más adelante los casos de uso o requerimientos no funcionales que dependen de este requerimiento funcional.

**Dependencia:**

- `RF-03 Gestión de Pedidos`
- `RF-06 Gestión de Clientes`
