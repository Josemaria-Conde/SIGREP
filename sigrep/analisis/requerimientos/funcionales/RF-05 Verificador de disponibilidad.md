# RF-05 Verificador de disponibilidad

## Descripción

Para calcular si un producto está disponible para la venta, el sistema debe poder comparar los insumos registrados en las recetas y poder llamar la información inventario para hacer una comparativa y determinar si hay suficientes insumos para preparar la receta para la venta, en caso de que no haya suficientes insumos, el sistema debe mostrar una alerta para que el usuario pueda tomar acciones preventivas y evitar desabastecimientos

## Historia de usuario

**Como** Cocinero
**Quiero** Que el sistema sea capaz de avisarme si puedo preparar una receta con mis insumos actuales
**Para** No tener que checar a mano la disponibilidad de mi producto

## Criterios de aceptación

- [ ] El sistema debe poder visualizar la receta de un producto y los insumos que se requieren para prepararlo
- [ ] El sistema debe poder comparar los insumos registrados en las recetas con la información del inventario
- [ ] El sistema debe poder mostrar una alerta cuando no haya suficientes insumos para preparar una receta

## Trazabilidad

Sección de trazabilidad para indicar más adelante los casos de uso o requerimientos no funcionales que dependen de este requerimiento funcional.

**Dependencia:**

- `RF-01 Gestión de Insumos`
- `RF-02 Catálogo de Productos`
