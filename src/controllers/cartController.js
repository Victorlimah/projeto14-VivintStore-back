import db from "../db.js";
import axios from "axios";

export async function getCart(req, res) {
  try {
    const collection = db.collection("cart");
    const { userId } = req.params;
    let total = 0;
    let lengthCart = 0;

    const cart = await collection.findOne({ userId });
    if (!cart) {
      await collection.insertOne({
        userId,
        products: [],
        total,
        lengthCart,
      });
    }

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
    res.status(401).send({ message: "Erro ao pegar carrinho" });
  }
}

export async function addProduct(req, res) {
  try {
    const collection = db.collection("cart");
    const token = req.headers.authorization;
    console.log(token);
    const { productId, price, quantity } = req.body;

    const cart = await collection.findOne({ userId });
    const products = cart.products;

    const product = products.find((product) => product.id === productId);

    if (product) product.quantity += quantity;
    else {
      products.push({
        id: productId,
        price,
        quantity,
      });
    }

    await collection.updateOne({ userId }, { $set: { products } });

    res.status(200).send({ message: "Produto adicionado ao carrinho" });
  } catch (err) {
    res.status(401).send({ message: "Erro ao adicionar produto" });
  }
}

export async function removeOneProduct(req, res) {
  try {
    const collection = db.collection("cart");
    const { userId } = req.params;
    const { productId } = req.body;

    const cart = await collection.findOne({ userId });

    const products = cart.products;

    const product = products.find((product) => product.id === productId);

    if (!product)
      return res.status(401).send({ message: "Produto não existe" });

    if (product.quantity === 1) products.splice(products.indexOf(product), 1);
    else product.quantity -= 1;

    await collection.updateOne({ userId }, { $set: { products } });

    res.status(200).send({ message: "Produto removido do carrinho" });
  } catch (err) {
    res.status(401).send({ message: "Erro ao remover produto" });
  }
}

export async function removeProduct(req, res) {
  try {
    const collection = db.collection("cart");
    const { userId } = req.params;
    const { productId } = req.body;

    const cart = await collection.findOne({ userId });
    const products = cart.products;

    const product = products.find((product) => product.id === productId);

    if (product) products.splice(products.indexOf(product), 1);

    await collection.updateOne({ userId }, { $set: { products } });

    res.status(200).send({ message: "Produto removido do carrinho" });
  } catch (err) {
    res.status(401).send({ message: "Erro ao remover produto" });
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
