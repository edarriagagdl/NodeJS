const express = require('express');
const app = express();
const productManager = require('./ProductManager');
app.use(express.urlencoded({ extended: true }));
app.listen(8080, () => console.log('Listo para probar caso practico'));

productManager.loadProductsFromFile('products.json').then(() => {
  console.log('products are loaded');
});

app.get('/products', (req, res) => {
  let limit = req.query.limit;
  console.log('Limit is ' + limit);
  if (limit && !isNaN(limit)) {
    let productLimited = productManager.getProducts().slice(0, limit);
    return res.send(productLimited);
  } else {
    return res.status(400).send({
      error:
        'the limit value was not provided or it is invalid, valid values are 1-10',
    });
  }
  return res.send(productManager.getProducts());
});

app.get('/products/:idProduct', (req, res) => {
  let idProduct = req.params.idProduct;
  if (idProduct && !isNaN(idProduct)) {
    let product = productManager.getProductById(idProduct);
    if (product !== undefined) {
      return res.send(product);
    }
    return res.status(404).send({
      error:
        'The product with id ' +
        idProduct +
        ' is not found in the products catalog',
    });
  } else {
    return res.status(404).send({
      error:
        'The product with id ' +
        idProduct +
        ' is invalid or not a numeric value',
    });
  }
});
