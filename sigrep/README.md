# SIGREP — Sistema Integral de Gestión para Repostería

Proyecto para Alcarusi (Carrusel de Sabor). Universidad Autónoma de Yucatán —
Construcción y Evolución de Software.

## Requisitos
- Node.js 18 o superior (incluye npm)

## Instalación

```bash
cd backend
npm install
```

## Ejecutar

```bash
cd backend
npm start
```

Abre el navegador en **http://localhost:3001**

La base de datos SQLite se crea automáticamente en `backend/db/sigrep.db`
la primera vez que se ejecuta, con datos de ejemplo:

- Usuarios: `duena` / `duena123` (rol dueña) y `ayudante1` / `ayudante123` (ayudante de producción)
- Insumos: harina, azúcar, mantequilla, huevo
- Producto de ejemplo: "Pastel de vainilla (chico)" con su receta y precio calculado

Para reiniciar con datos limpios, borra `backend/db/sigrep.db*` y vuelve a
ejecutar `npm start`.

## Estructura del proyecto

```
sigrep/
├── backend/
│   ├── server.js          # Servidor Express (API + sirve el frontend)
│   ├── db/
│   │   ├── schema.sql     # Esquema de la base de datos (ver ERD del avance 1)
│   │   └── init.js        # Inicializa SQLite y datos de ejemplo
│   └── routes/
│       ├── insumos.js     # Módulo de inventario
│       ├── productos.js   # Módulo de calculadora de precios (+ recetas)
│       ├── clientes.js    # Módulo de clientes
│       ├── pedidos.js     # Módulo de pedidos
│       ├── ventas.js      # Ventas de mostrador + módulo de reportes
│       └── usuarios.js    # Módulo de usuarios y roles (login simple)
└── frontend/
    └── public/
        ├── index.html
        ├── css/style.css
        └── js/
            ├── api.js            # Cliente que consume la API
            ├── app.js            # Login y navegación
            └── views/            # Una vista por módulo
```

## Módulos implementados (según el avance 1)

1. **Calculadora de precios**: registra productos, arma su receta (insumos +
   cantidades), y calcula automáticamente costo total y precio sugerido
   (costo insumos + mano de obra) × (1 + margen).
2. **Inventario**: control de existencias, alertas visuales de stock bajo y
   de insumos próximos a caducar (7 días). El endpoint de "producir" y las
   ventas de mostrador descuentan insumos automáticamente según la receta.
3. **Pedidos**: registro con fecha de entrega, especificaciones y estado
   (pendiente → en producción → listo → entregado).
4. **Clientes**: historial de pedidos y datos de contacto.
5. **Reportes**: panel con ventas totales, productos más vendidos e insumos
   bajo stock mínimo.
6. **Usuarios y roles**: login simple con rol dueña / ayudante de producción.

## Notas técnicas

- Es una aplicación web (no nativa), por lo que funciona igual en Mac y
  iPad desde el navegador, como pide el cliente.
- Base de datos: SQLite vía `better-sqlite3` — sin necesidad de instalar un
  servidor de base de datos aparte, ideal para un negocio pequeño de 3
  personas.
- Autenticación: las contraseñas se guardan encriptadas con `bcryptjs`
  (nunca en texto plano). Sigue sin usar sesiones/JWT porque el alcance
  del proyecto no lo requiere aún; sería el siguiente paso natural si se
  agrega control de acceso más fino entre roles.

## Estructura de código limpio (refactor)

Tras una revisión de buenas prácticas, el backend se reorganizó así:

- **`services/inventarioService.js`**: concentra en un solo lugar la
  lógica de "calcular costo → verificar stock → descontar insumos", que
  antes estaba duplicada entre el endpoint de producción y el de venta
  de mostrador (violación de DRY). Si cambia la fórmula de costeo, ahora
  solo se edita en un archivo.
- **`middleware/errorHandler.js`** + **`utils/errors.js`**: manejo de
  errores centralizado. Las rutas usan `throw new AppError(mensaje,
  codigoHttp)` en vez de construir `res.status().json()` en cada
  validación; Express lo captura automáticamente y el middleware decide
  la respuesta. Los errores no anticipados devuelven un mensaje genérico
  al cliente (sin exponer detalles internos) y se registran en consola.
- **`utils/validar.js`**: funciones reutilizables de programación
  defensiva (`requerirNumeroPositivo`, `requerirNumeroNoNegativo`,
  `requerirTexto`, `requerirEnumerado`) usadas en todas las rutas para
  rechazar cantidades negativas o cero, textos vacíos, y valores fuera de
  catálogo antes de tocar la base de datos.
- **`constants.js`**: reemplaza números "mágicos" (como los 7 días de
  alerta de caducidad) por constantes con nombre.
