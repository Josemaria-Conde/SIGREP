# SIGREP — Sistema Integral de Gestión para Repostería

Proyecto para Alcarusi (Carrusel de Sabor). Universidad Autónoma de Yucatán —
Construcción y Evolución de Software.


## Estructura del proyecto

```
sigrep/
├── backend/
│   ├── server.js          # Servidor Express (API + sirve el frontend)
│   ├── db/
│   │   ├── schema.sql   
│   │   └── init.js        # Inicializa SQLite y datos de ejemplo
│   └── routes/
│       ├── insumos.js     
│       ├── productos.js 
│       ├── clientes.js    
│       ├── pedidos.js    
│       ├── ventas.js     
│       └── usuarios.js    
└── frontend/
   
```


## Notas técnicas

- Es una aplicación web (no nativa), por lo que funciona igual en Pc y
  iPad desde el navegador, como pide el cliente.
- Base de datos: SQLite vía `better-sqlite3` 
- Autenticación: las contraseñas se guardan encriptadas con `bcryptjs`
 

