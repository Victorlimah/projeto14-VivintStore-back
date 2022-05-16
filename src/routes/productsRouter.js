import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";

import {
  getCategory,
  getProduct,
  getProducts,
  postProduct,
} from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.get("/products", getProducts);
productsRouter.get("/products/:id", getProduct);
productsRouter.get("/category/:type", getCategory);
productsRouter.post("/products", postProduct);

export default productsRouter;
