import express from 'express';
import { addrestaurant, listrestaurant, removerestaurant, updaterestaurant } from '../controllers/restaurantController.js';
import multer from 'multer';
const restaurantRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

restaurantRouter.get("/list",listrestaurant);
restaurantRouter.post("/add",addrestaurant);
restaurantRouter.post("/remove",removerestaurant);
restaurantRouter.post("/update",updaterestaurant);

export default restaurantRouter;