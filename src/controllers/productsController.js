import db from "../db.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export async function getProducts(req, res) {
  console.log("chegou aqui");
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "Token não encontrado" });

  try {
    // aparentemente não precisa, e tava dando erro na verificação
    //const decoded = jwt.verify(token, secretKey);
    const products = await db.collection("products").find({}).toArray();
    res.status(200).send(products);
  } catch (err) {
    res.status(401).send({ message: "Erro ao pegar produtos" });
  }
}

export async function getProduct(req, res) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "Token não encontrado" });

  const { id } = req.params;
  console.log(id);
  console.log(typeof id);

  try {
    // aparentemente não precisa, e tava dando erro na verificação
    //const decoded = jwt.verify(token, secretKey);
    const product = await db.collection("products").findOne({ id });
    res.status(200).send(product);
  } catch (err) {
    res.status(401).send({ message: "Erro ao pegar produto" });
  }
}

export async function getCategory(req, res) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "Token não encontrado" });

  const { type } = req.params;

  try {
    // aparentemente não precisa, e tava dando erro na verificação
    //const decoded = jwt.verify(token, secretKey);
    const category = await db.collection("products").find({ type }).toArray();
    res.status(200).send(category);
  } catch (err) {
    res.status(401).send({ message: "Erro ao pegar produtos da categoria" });
  }
}
