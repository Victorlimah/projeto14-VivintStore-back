import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  getCart,
  getCity,
  addProduct,
  removeProduct,
  putProduct,
  buyOrder,
  getOrders,
} from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.get("/city/:zipCode", getCity);
cartRouter.get("/cart", verifyJWT, getCart);
cartRouter.post("/cart", verifyJWT, addProduct);
cartRouter.delete("/cart/:id", verifyJWT, removeProduct);
cartRouter.put("/cart/:id", verifyJWT, putProduct);
cartRouter.post("/order", verifyJWT, buyOrder);
cartRouter.get("/order", verifyJWT, getOrders);

export default cartRouter;
