import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";

import authRouter from "./routes/authRouter.js";
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";

const app = express();
dotenv.config();

app.use(json());
app.use(cors());

app.use(authRouter);
app.use(productsRouter);
app.use(cartRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
