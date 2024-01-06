const { log } = require('console');
const fs = require('fs');

class ProductManager {
  // Array that holds all the products
  #products = [];
  // id for the products
  #id = 0;
  #path = 'productos.json';

  constructor(pathToProductos) {
    this.#path = pathToProductos;
    /*    this.loadProductsFromFile(this.#path);
    console.log('products loaded from file');
    console.log(this.#products); */
  }

  // returns the array that contains the products
  getProducts() {
    return this.#products;
  }

  validateProductFields(product) {
    if (product.code == undefined)
      throw new Error('Code of the product is missing or invalid');
    if (product.name == undefined)
      throw new Error('Name of the product is missing or invalid');
    if (product.description == undefined)
      throw new Error('Description of the product is missing or invalid');
    if (product.price == undefined)
      throw new Error('Price of the product is missing or invalid');
    if (product.stock == undefined)
      throw new Error('Stock of the product is missing or invalid');
    if (product.thumbnail == undefined)
      throw new Error('Thumbnail of the product is missing or invalid');
  }

  // Add a product created with the parameters received if it pass some validations
  addProduct(code, name, description, price, stock, thumbnail) {
    let product = {
      code: code,
      name: name,
      description: description,
      price: price,
      stock: stock,
      thumbnail: thumbnail,
    };
    try {
      // validate that all all fields were received
      this.validateProductFields(product);
      const isCodeFound = (element) => element.code == product.code;
      const codeFound = this.#products.findIndex(isCodeFound);
      // Validate if the code already exists, -1 means the code was not found and can be inserted
      if (codeFound < 0) {
        this.#id = this.#id + 1;
        product.id = this.#id;
        this.#products.push(product);
        console.log(
          'The product with id ' + product.id + ' was added scuessfully'
        );
      } else {
        throw new Error(
          'The code ' +
            product.code +
            ' for the product you are trying to insert already exists'
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateProduct(product) {
    try {
      const isIdFound = (element) => element.id == product.id;
      const productIndex = this.#products.findIndex(isIdFound);
      this.#products[productIndex] = product;
    } catch (error) {
      console.error(error);
    }
  }

  // returns a prodcust that matches an id, otherwise will return "Not found"
  getProductById(id) {
    const isIdFound = (element) => element.id == id;
    const productIdFound = this.#products.find(isIdFound);
    // if id is not found, an undefined is returned
    return productIdFound;
  }

  deleteProductById(id) {
    const isIdFound = (element) => element.id == id;
    const productIndex = this.#products.findIndex(isIdFound);
    // if id is not found, an undefined is returned
    if (productIndex >= 0) {
      this.#products.splice(productIndex, 1);
    } else {
      console.log(
        'The product with id ' + id + ' is not found in the products'
      );
    }
  }

  async loadProductsFromFile(pathToProducts) {
    try {
      if (fs.existsSync(pathToProducts)) {
        console.log(
          'The json file ' + pathToProducts + ' exists and will be loaded'
        );
        const data = await fs.promises.readFile(pathToProducts, 'utf-8');
        if (data) {
          const obj = JSON.parse(data); //now it an object
          if (obj) {
            this.#products = obj.products;
            this.#id = obj.id;
          }
        }
        console.log('The file was read');
      }
    } catch (err) {
      console.error(err);
    }
  }

  persistProductsToFile() {
    try {
      const obj = {
        id: this.#id,
        products: this.#products,
      };
      const json = JSON.stringify(obj);
      fs.writeFile(this.#path, json, (err) => {
        if (err) {
          console.log(err.message);
          throw err;
        }
      });
      console.log('Products persisted to file');
    } catch (err) {
      console.error(err);
    }
  }
}

// const productManager = new ProductManager('products.json');
module.exports = new ProductManager('products.json');
