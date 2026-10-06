# SIGREP — Diseño del sistema

## 1. Arquitectura

Aplicación web cliente-servidor. El mismo servidor Express expone la API REST y sirve el frontend estático. El backend se organiza en capas: rutas, servicio de negocio y acceso a la base de datos, con módulos transversales de errores, validación y constantes.

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

Las flechas punteadas son dependencias transversales: validación de entradas, manejo centralizado de errores y constantes de negocio.

### Módulos y rutas de la API

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

### Notas del modelo

- `producto_insumo` es la receta. Resuelve la relación N:N entre productos e insumos y tiene `UNIQUE(producto_id, insumo_id)`.
- `pedido_producto` guarda `precio_unitario` al momento del pedido, para que un cambio posterior de precio no altere pedidos ya registrados.
- `pedidos.cliente_id` es opcional.
- `usuarios` no se relaciona con otras tablas: hoy no se registra quién crea un pedido o una venta.
- `ventas` solo apunta a un producto (venta de mostrador); no se enlaza a clientes ni a pedidos.
- Restricciones: `CHECK` en `usuarios.rol` y `pedidos.estado`, claves foráneas activadas (`foreign_keys = ON`) y `ON DELETE CASCADE` en la receta y en el detalle de pedido.
- Fórmula de precio: `precio_sugerido = (costo_insumos + costo_mano_obra) × (1 + margen_deseado)`.
