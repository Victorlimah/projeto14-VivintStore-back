import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";

import {
  getCategory,
  getProduct,
  getProducts,
} from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.get("/products", verifyJWT, getProducts);
productsRouter.get("/products/:id", verifyJWT, getProduct);
productsRouter.get("/category/:type", verifyJWT, getCategory);

export default productsRouter;
