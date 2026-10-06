# SIGREP — Diseño del sistema

## 1. Arquitectura

Aplicación web cliente-servidor. 

```mermaid
flowchart TB
    subgraph Navegador["Navegador (Mac / iPad)"]
        app["app.js<br/>Login y navegación"]
        views["views/<br/>5 módulos"]
        api["api.js<br/>Cliente HTTP"]
        app --> views --> api
    end

    api -->|"REST / JSON"| routes

    subgraph Servidor["Servidor Node + Express"]
        routes["routes/<br/>6 routers REST"]
        service["services/inventarioService.js<br/>Costo, stock y descuento"]
        dbinit["db/init.js<br/>better-sqlite3"]
        errores["middleware/errorHandler.js<br/>utils/errors.js"]
        validar["utils/validar.js"]
        consts["constants.js"]

        routes --> service
        routes --> dbinit
        service --> dbinit
        routes -.-> validar
        service -.-> validar
        routes -.-> errores
        dbinit -.-> consts
    end

    dbinit --> sqlite[("SQLite<br/>sigrep.db")]
```


### Módulos y rutas 

| Módulo | Ruta base | Archivo |
|---|---|---|
| Inventario | `/api/insumos` | `routes/insumos.js` |
| Calculadora de precios y recetas | `/api/productos` | `routes/productos.js` |
| Clientes | `/api/clientes` | `routes/clientes.js` |
| Pedidos | `/api/pedidos` | `routes/pedidos.js` |
| Ventas y reportes | `/api/ventas` | `routes/ventas.js` |
| Usuarios y login | `/api/usuarios` | `routes/usuarios.js` |

## 2. Modelo entidad-relación

```mermaid
erDiagram
    clientes |o--o{ pedidos : "realiza"
    pedidos ||--|{ pedido_producto : "contiene"
    productos ||--o{ pedido_producto : "aparece en"
    productos ||--o{ producto_insumo : "tiene receta"
    insumos ||--o{ producto_insumo : "se usa en"
    productos ||--o{ ventas : "se vende en"

    usuarios {
        INTEGER id PK
        TEXT nombre
        TEXT rol "dueña | ayudante_produccion"
        TEXT usuario UK
        TEXT password "hash bcrypt"
    }

    clientes {
        INTEGER id PK
        TEXT nombre
        TEXT telefono
        TEXT email
        TEXT notas
        TEXT creado_en
    }

    insumos {
        INTEGER id PK
        TEXT nombre
        TEXT unidad "g, kg, ml, l, pieza"
        REAL stock_actual
        REAL stock_minimo
        REAL costo_unitario
        TEXT fecha_caducidad
        TEXT creado_en
    }

    productos {
        INTEGER id PK
        TEXT nombre
        TEXT descripcion
        REAL costo_mano_obra
        REAL margen_deseado "0.3 = 30%"
        TEXT creado_en
    }

    producto_insumo {
        INTEGER id PK
        INTEGER producto_id FK
        INTEGER insumo_id FK
        REAL cantidad "por unidad de producto"
    }

    pedidos {
        INTEGER id PK
        INTEGER cliente_id FK "opcional"
        TEXT fecha_entrega
        TEXT especificaciones
        TEXT estado "pendiente | en_produccion | listo | entregado | cancelado"
        TEXT creado_en
    }

    pedido_producto {
        INTEGER id PK
        INTEGER pedido_id FK
        INTEGER producto_id FK
        INTEGER cantidad
        REAL precio_unitario "precio al momento del pedido"
    }

    ventas {
        INTEGER id PK
        INTEGER producto_id FK
        INTEGER cantidad
        REAL total
        TEXT fecha
    }
```

