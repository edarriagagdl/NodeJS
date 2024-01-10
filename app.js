const express = require('express');
const app = express();
const productManager = require('./ProductManager');
app.use(express.urlencoded({ extended: true }));
app.listen(8080, () => console.log('Listo para probar caso practico'));

productManager.loadProductsFromFile('products.json').then(() => {
  if (!productManager.isFileLoaded())
    console.log('The products file could not be loaded, please try later');
});

app.get('/products', (req, res) => {
  if (!productManager.isFileLoaded())
    return res.status(500).send({
      error: 'The products file could not be loaded, please try later',
    });
  let limit = req.query.limit;
  console.log('Limit is ' + limit);
  if (limit) {
    if (!isNaN(limit)) {
      let productLimited = productManager.getProducts().slice(0, limit);
      return res.send(productLimited);
    } else {
      return res.status(400).send({
        error: 'The limit is not a numeric value',
      });
    }
  } else {
    if (productManager.getProducts().length > 0)
      return res.send(productManager.getProducts());
    else
      return res.status(500).send({
        error: 'The products catalog is empty',
      });
  }
});

app.get('/products/:idProduct', (req, res) => {
  if (!productManager.isFileLoaded())
    return res.status(500).send({
      error: 'The products file could not be loaded, please try later',
    });
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
