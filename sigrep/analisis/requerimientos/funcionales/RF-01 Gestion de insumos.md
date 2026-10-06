# RF-01 Gestión de Insumos

## Descripción

Se busca el control de existencias, unidades de medida estándar, costos y alertas preventivas de stock mínimo, el sistema debe permitir registrar y actualizar los insumos disponibles, sus cantidades, unidades de medida y costos asociados, además, debe generar alertas automáticas cuando el stock de un insumo alcance un nivel mínimo predefinido **(por definir la cantidad predeterminada mínima)**, permitiendo al usuario tomar acciones preventivas para evitar desabastecimientos

## Historia de usuario

**Como** Administrador de inventario
**Quiero** Poder registrar y actualizar los insumos disponibles, sus cantidades, unidades de medida y costos asociados, así como recibir alertas automáticas cuando el stock de un insumo alcance un nivel predefinido
**Para** Mantener un control eficiente del inventario, evitar desabastecimientos y garantizar la disponibilidad de insumos necesarios para la operación del negocio

## Criterios de aceptación

- [ ] El sistema permite registrar nuevos insumos con sus nombres, cantidades y sus unidades de medida (unidades, kilogramos, litros, paquetes...)
- [ ] El sistema permite asignar costos a cada insumo de acuerdo a sus unidades de medida correspondientes
- [ ] El sistema permite actualizar la cantidad de insumos disponibles
- [ ] El sistema debe permitir personalizar un nivel mínimo de stock para cada insumo individualmente
- [ ] El sistema genera alertas automáticas cuando el stock de un insumo alcanza el nivel mínimo predefinido
- [ ] El sistema debe ser capaz de consultar los insumos en el inventario (con o sin stock) y visualizarlo para el cliente
- [ ] El sistema debe ser capaz de archivar insumos y recuperar insumos archivados

## Trazabilidad

Sección de trazabilidad para indicar más adelante los casos de uso o requerimientos no funcionales que dependen de este requerimiento funcional.

**Dependencia:**

Lista de las dependencias de este requerimiento funcional con otros requerimientos funcionales o no funcionales, solo si aplica.
