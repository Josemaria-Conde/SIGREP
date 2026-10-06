# RNF-03 Disponibilidad del sistema

## Descripción

El sistema debe estar disponible para que los usuarios puedan consultar y modificar la información registrada sin interrupciones fuera de los periodos de mantenimiento programado

## Métrica

- El sistema debe estar disponible el 99.99% del tiempo durante el horario laboral (8:00 am a 6:00 pm) y el 99% del tiempo durante el horario no laboral (6:00 pm a 8:00 am)
- Los periodos de mantenimiento programado no deben durar más de 2 horas
- Los usuarios deben recibir una notificación con anticipación sobre el mantenimiento programado y su duración estimada

## Condiciones

- La disponibilidad del sistema se mide con base en el tiempo en que la aplicación está operativa y accesible para los usuarios
- Los periodos de mantenimiento programado deben registrarse como indisponibilidad planificada

## Criterios de aceptación

- [ ] El sistema cumple con los porcentajes de disponibilidad establecidos en la métrica
- [ ] Los periodos de mantenimiento programado no superan las 2 horas
- [ ] El sistema permite notificar a los usuarios sobre el mantenimiento programado y su duración estimada
