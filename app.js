// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./db');
const path = require('path');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/jkx', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      res.send('<h1>Login exitoso</h1><a href="/">Ir al inicio</a>');
    } else {
      res.send('<h1>Login inválido</h1><a href="/jkx">Volver</a>');
    }
  } catch (err) {
    console.error(' Error al ejecutar la consulta SQL:', err);
    res.status(500).send('Error al procesar login');
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(' Error al obtener usuarios:', err);
    res.status(500).send('Error al obtener usuarios');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
