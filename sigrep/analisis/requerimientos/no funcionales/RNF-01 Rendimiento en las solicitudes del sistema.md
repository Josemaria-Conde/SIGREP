# RNF-01 Rendimiento en las solicitudes del sistema

## Descripción

Se busca que el sistema sea capaz de procesar y responder a las solicitudes de los usuarios del sistema en un tiempo medible, garantizando una experiencia de usuario fluida y eficiente. El sistema debe ser capaz de manejar múltiples solicitudes concurrentes sin degradar su rendimiento

## Métrica

- El tiempo de respuesta del sistema debe ser menor a 2 segundos para el 95% de las solicitudes (insumos, clientes, recetas, pedidos)
- El tiempo de respuesta del sistema debe ser menor a 5 segundos para el 99% de las solicitudes (insumos, clientes, recetas, pedidos)
- El tiempo de respuesta del sistema debe ser menor a 5 segundos para el 95% de las solicitudes de creación de reportes
- El tiempo de respuesta del sistema debe ser menor a 10 segundos para el 99% de las solicitudes de creación de reportes
- El sistema debe ser capaz de manejar al menos 100 solicitudes por segundo sin degradar su rendimiento
- La tasa de éxito en la ejecución de las solicitudes debe ser del 99%, para esto se debe considerar una solicitud exitosa si y solo si el sistema devuelve el valor esperado y en tiempo, de lo contrario, se considera una solicitud fallida
- El sistema debe estar preparado para considerar fechas de alta demanda (festivales, eventos especiales...) y garantizar que el sistema pueda manejar un aumento de al menos un 50% en la cantidad de solicitudes por segundo sin degradar su rendimiento

## Condiciones

- El tiempo de respuesta se mide desde que el usuario realiza la solicitud hasta que recibe la respuesta del sistema
- La medición de la tasa de éxito se realiza en base a la cantidad de solicitudes exitosas frente a la cantidad total de solicitudes realizadas
- El sistema debe ser capaz de manejar la cantidad de solicitudes por segundo establecida en la métrica sin degradar su rendimiento, incluso en situaciones de alta demanda

## Criterios de aceptación

- [ ] El sistema cumple con los tiempos de respuesta establecidos en la métrica
- [ ] El sistema es capaz de manejar la cantidad de solicitudes por segundo establecida en la métrica sin degradar su rendimiento
- [ ] La tasa de éxito en la ejecución de las solicitudes cumple con el porcentaje establecido en la métrica
- [ ] El sistema puede manejar un aumento del 50% en la cantidad de solicitudes por segundo durante fechas de alta demanda
