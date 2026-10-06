# RNF-02 Disponibilidad de la base de datos

## Descripción

La base de datos encargada del almacenamiento de la información del sistema (insumos, clientes, recetas...) debe permanecer operativa para que la aplicación pueda consultar y modificar los datos sin interrupciones

## Métrica

- La base de datos debe estar disponible el 99.99% del tiempo durante el horario laboral (8:00 am a 6:00 pm) y el 99% del tiempo durante el horario no laboral (6:00 pm a 8:00 am)

## Condiciones

- La disponibilidad de la base de datos se mide con base en el tiempo en que la base de datos está operativa y accesible para la aplicación

## Criterios de aceptación

- [ ] La base de datos cumple con los tiempos de disponibilidad establecidos en la métrica
