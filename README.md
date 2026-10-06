# SIGREP — Sistema Integral de Gestión para Repostería

Proyecto para Alcarusi (Carrusel de Sabor). Universidad Autónoma de Yucatán —
Construcción y Evolución de Software.


## Estructura del proyecto

```
sigrep/
├── backend/
│   ├── db/
│   │   └── init.js        # Inicializa SQLite y datos de ejemplo
│   └── routes/
│       ├── insumos.js     
│       ├── productos.js 
│       ├── clientes.js    
│       ├── pedidos.js    
│       ├── ventas.js     
│       └── usuarios.js    
└── frontend/
│   ├── css/
│   │   └── style.css
│   └── index.html   
```


## Notas técnicas

- Base de datos: SQLite vía `better-sqlite3` 
- Autenticación: las contraseñas se guardan encriptadas con `bcryptjs`
 

