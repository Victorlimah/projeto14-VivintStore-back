import db from "../db.js";

export async function getProducts(req, res) {
  try {
    const products = await db.collection("products").find({}).toArray();
    res.status(200).send(products);
  } catch (err) {
    res.status(401).send({ message: "Erro ao pegar produtos" });
  }
}

export async function getProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await db.collection("products").findOne({ id });
    res.status(200).send(product);
  } catch (err) {
    res.status(401).send({ message: "Erro ao pegar produto" });
  }
}

export async function getCategory(req, res) {
  const { type } = req.params;

  try {
    const category = await db.collection("products").find({ type }).toArray();
    res.status(200).send(category);
  } catch (err) {
    res.status(401).send({ message: "Erro ao pegar produtos da categoria" });
  }
}
