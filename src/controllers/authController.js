import db from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';

export async function signUp(req, res) {
    const { name, email, password, confirmationPassword } = req.body;
    const emailVerification = await db.collection('users').findOne({ email });

    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmationPassword: joi.string().required()
    });

    if (emailVerification) {
        return res.status(409).send("O email já está cadastrado");
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(422).send(error.details.map(d => d.message));
        return;
    }

    if (password !== confirmationPassword) {
        return res.status(401).send({ message: "As senhas não conferem" });
    }
    try {
        await db.collection('users').insertOne({ name, email, password: await bcrypt.hash(password, 10) });
        res.status(201).json({ message: 'Usuario cadastrado' });
    } catch {
        res.status(500).send({ message: 'Erro ao cadastrar usuario' });
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(422).send(error.details.map(d => d.message));
        return;
    }

    try {
        const user = await db.collection("users").findOne({ email });
        const isValid = await bcrypt.compare(password, user.password);

        if (user && isValid) {
            const token = uuid();
            await db.collection("sections").insertOne({ token, user: user.email });
            res.status(200).json({ token, user: user.name });
        }
        else {
            res.status(401).send('Usuario ou senha incorretos');
        }
    } catch {
        res.status(500).send('Erro ao logar');
    }
}
