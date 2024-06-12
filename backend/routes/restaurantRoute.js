import express from 'express';
import multer from 'multer';
import { addrestaurant, listrestaurant, removerestaurant, upgradeRestaurant, findRestaurantByName, getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct, getTotalItems, getOrdersPerState } from '../controllers/restaurantController.js';

const restaurantRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

restaurantRouter.get("/list", listrestaurant);
restaurantRouter.post("/add", addrestaurant);
restaurantRouter.post("/remove", removerestaurant);

// Ruta para actualizar el restaurante por ID
restaurantRouter.put('/upgrade/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    
    // Agregar el campo de la imagen si se está subiendo una nueva
    if (req.file) {
        newData.image = req.file.filename;
    }

    try {
        const result = await upgradeRestaurant(id, newData);
        res.json(result);
    } catch (error) {
        console.error("Error updating restaurant:", error);
        res.status(500).json({ success: false, message: "Error updating restaurant" });
    }
});

restaurantRouter.post("/findByName", findRestaurantByName);

// Ruta para obtener las estadísticas de pedidos
restaurantRouter.get("/statsOrder", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        // Obtener el total de pedidos llamando a la función getTotalOrders con los filtros de fecha y producto
        const totalOrders = await getTotalOrders(startDate, endDate, product);

        res.json({ success: true, totalOrders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de pedidos" });
    }
});

// Resto del código para las otras rutas...

export default restaurantRouter;
