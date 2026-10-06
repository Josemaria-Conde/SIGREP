# RF-06 Gestión de Clientes

## Descripción

El usuario del sistema debe ser capaz de guardar la información de contacto de los clientes, incluyendo nombre, teléfono, correo electrónico (opcional), además, el sistema debe permitir consultar el historial de pedidos de cada cliente, buscar clientes por nombre o teléfono, asociar un cliente con varios pedidos y actualizar los datos del cliente

## Historia de usuario

**Como** Administrador del sistema
**Quiero** Poder guardar la información de contacto de los clientes, poder consultar su historial de pedidos y buscar clientes por nombre o teléfono
**Para** Mantener un registro ordenado de los clientes, sus pedidos (1 o varios) y poder contactarlos en caso de ser necesario

## Criterios de aceptación

- [ ] El sistema permite registrar nuevos clientes con su información de contacto (nombre, teléfono, correo electrónico)
- [ ] El sistema permite buscar clientes por nombre o teléfono
- [ ] El sistema permite consultar el historial de pedidos de cada cliente
- [ ] El sistema permite asociar un cliente con varios pedidos
- [ ] El sistema permite actualizar los datos del cliente

## Trazabilidad

Sección de trazabilidad para indicar más adelante los casos de uso o requerimientos no funcionales que dependen de este requerimiento funcional.

**Dependencia:**

- `RF-03 Gestión de Pedidos`
