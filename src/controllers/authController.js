import db from "../db.js";
import bcrypt from "bcrypt";
import joi from "joi";
import jwt from "jsonwebtoken";
import { stripHtml } from "string-strip-html";

export async function signUp(req, res) {
  const { name, email, password, confirmationPassword } = req.body;
  const emailVerification = await db.collection("users").findOne({ email });
  const userId = Date.now();
  const sazitizedName = stripHtml(name).result.trim();
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmationPassword: joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((d) => d.message));

  if (emailVerification)
    return res.status(409).send({ message: "O email já está cadastrado" });

  if (password !== confirmationPassword)
    return res.status(401).send({ message: "As senhas não conferem" });

  try {
    await db.collection("users").insertOne({
      name: sazitizedName,
      email,
      password: await bcrypt.hash(password, 10),
      userId,
    });

    res.status(201).json({ message: "Usuário cadastrado" });
  } catch {
    res.status(500).send({ message: "Erro ao cadastrar usuário" });
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  const secretKey = process.env.JWT_SECRET;

  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((d) => d.message));

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(401).send({ message: "Email não cadastrado" });

    const isValid = await bcrypt.compare(password, user.password);

    if (user && isValid) {
      const data = { userId: user._id, name: user.name };
      const token = jwt.sign(data, secretKey);

      await db.collection("sections").insertOne({ token, user: user.email });
      res.status(200).send({ token });
    } else res.status(401).send({ message: "Usuário ou senha incorretos" });
  } catch (e) {
    res
      .status(500)
      .send({ message: "Erro ao realizar login. Tente novamente." });
  }
}
