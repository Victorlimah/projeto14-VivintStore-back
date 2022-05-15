import db from "../db.js";
import axios from "axios";

export async function getCart(req, res) {
  try {
    const collection = db.collection("cart");
    const { userId } = req;
    let total = 0;
    let lengthCart = 0;

    let cart = await collection.findOne({ userId });
    if (!cart) {
      await collection.insertOne({
        userId,
        products: [],
        total,
        lengthCart,
      });
    }
    cart = await collection.findOne({ userId });

    const products = cart.products;

    products.forEach((product) => {
      total += product.price * product.quantity;
      lengthCart += 1;
    });
    res.status(200).send({
      userId,
      products,
      total,
      lengthCart,
    });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Erro ao pegar carrinho" });
  }
}

export async function addProduct(req, res) {
  try {
    const collection = db.collection("cart");
    const productsDB = db.collection("products");
    const { userId } = req;
    const { productId } = req.body;

    let cart = await collection.findOne({ userId });
    if (!cart) {
      await collection.insertOne({
        userId,
        products: [],
        total: 0,
        lengthCart: 0,
      });
    }

    cart = await collection.findOne({ userId });
    const products = cart.products;

    // ver se no carrinho já tem esse produto
    const product = products.find((p) => p.productId === productId);

    //pegar informações do produto
    const infoProduct = await productsDB.findOne({ id: productId });

    const { price, image, title } = infoProduct;

    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({
        id: productId,
        quantity: 1,
        title,
        price,
        image,
      });
    }

    cart.total += 1;
    cart.lengthCart += 1;

    await collection.updateOne(
      { userId },
      {
        $set: {
          products,
          total: cart.total,
          lengthCart: cart.lengthCart,
        },
      }
    );

    res.status(200).send({ message: "Produto adicionado ao carrinho" });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Erro ao adicionar produto" });
  }
}

export async function putProduct(req, res) {
  try {
    const collection = db.collection("cart");
    const { userId } = req;
    const { productId, quantity } = req.body;

    const cart = await collection.findOne({ userId });
    const products = cart.products;

    const product = products.find((product) => product.id === productId);

    if (product) product.quantity = quantity;

    await collection.updateOne({ userId }, { $set: { products } });

    res.status(200).send({ message: "Produto atualizado" });
  } catch (err) {
    res.status(401).send({ message: "Erro ao atualizar produto" });
  }
}

export async function removeProduct(req, res) {
  try {
    const collection = db.collection("cart");
    const { userId } = req;
    const { id } = req.params;

    const cart = await collection.findOne({ userId });
    const products = cart.products;

    const product = products.find((product) => product.id === id);

    if (product) products.splice(products.indexOf(product), 1);

    await collection.updateOne({ userId }, { $set: { products } });

    res.status(200).send({ message: "Produto removido do carrinho" });
  } catch (err) {
    res.status(401).send({ message: "Erro ao remover produto" });
  }
}

export async function buyOrder(req, res) {
  try {
    const collection = db.collection("cart");
    const orders = db.collection("orders");
    const { userId } = req;
    const { adress, zipCode, localidade, uf } = req.body;

    const cart = await collection.findOne({ userId });
    const products = cart.products;

    //id será Date.now()

    const order = {
      id: Date.now(),
      userId,
      adress,
      zipCode,
      localidade,
      uf,
      products,
    };

    await collection.updateOne({ userId }, { $set: { products: [] } });
    await orders.insertOne(order);

    res.status(200).send({ orderID: order.id });
  } catch (err) {
    res.status(401).send({ message: "Erro ao realizar compra" });
  }
}

export async function getCity(req, res) {
  const { zipCode } = req.params;

  try {
    const url = `https://viacep.com.br/ws/${zipCode}/json/`;
    const response = await axios.get(url);
    if (response.data.erro)
      return res.status(401).send({ message: "Cep não encontrado" });

    const { localidade, uf, cep } = response.data;
    res.status(200).send({ localidade, uf, cep });
  } catch (err) {
    res.status(401).send({ message: "Erro ao buscar cep" });
  }
}
