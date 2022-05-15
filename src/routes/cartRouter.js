import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  getCart,
  getCity,
  addProduct,
  removeProduct,
  removeOneProduct,
} from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.get("/city/:zipCode", getCity);
cartRouter.get("/cart", verifyJWT, getCart);
cartRouter.post("/cart-add", verifyJWT, addProduct);
cartRouter.post("/cart-remove", verifyJWT, removeProduct);
cartRouter.post("/cart-remove-one", verifyJWT, removeOneProduct);

export default cartRouter;
