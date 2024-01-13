const express = require('express');
const app = express();

const routerProducts = require('./routes/products.router');
const routerCarts = require('./routes/carts.router');

//Middlewares
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routers
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

//reglas
app.get('/ping', (req, res) => {
  res.send('Pong');
});

app.listen(8080, () => console.log('Listo para probar caso practico'));
