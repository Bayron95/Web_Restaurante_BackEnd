const express = require('express');
const cors = require('cors');
const mesas = require('../src/routes/mesas');
const menus = require('../src/routes/menus');

const port = 3001; // Puedes cambiar el puerto según tus necesidades
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Servidor backend funcionando!');
});

app.use('/api/mesas', mesas);
app.use('/api/menus', menus);
    

app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto http://localhost:${port}`);
});

// Configurar otros middlewares y rutas de la API...
