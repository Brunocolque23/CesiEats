import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, listOrders, listOrders2, userOrders, updateStatus, verifyOrder, listOrderStates, listOrders3, receiveOrder, updateLivreurId } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.get("/list2", listOrders2);
orderRouter.get("/list3", listOrders3);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/states", listOrderStates);
orderRouter.get("/received", receiveOrder);
orderRouter.post("/update-livreur", updateLivreurId);  // New route for updating livreurid

export default orderRouter;
