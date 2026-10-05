const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/insumos', require('./routes/insumos'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/usuarios', require('./routes/usuarios'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', sistema: 'SIGREP' }));

// Servir el frontend (archivos estáticos)
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(FRONTEND_PATH));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Ruta no encontrada.' });
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// Middleware de errores: SIEMPRE al final, después de todas las rutas.
// Como las rutas usan better-sqlite3 (síncrono) y funciones normales
// (no async), cualquier "throw new AppError(...)" dentro de ellas es
// capturado automáticamente por Express y llega hasta aquí.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SIGREP corriendo en http://localhost:${PORT}`);
});
