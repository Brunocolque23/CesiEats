import express from 'express';
import { getAllApis, createApi, updateApi, deleteApi } from '../controllers/apiController.js';
import authMiddleware from '../middleware/auth.js';

const apirouter = express.Router();

// Ruta para obtener todos los registros de API
apirouter.get('/getall', getAllApis);

// Ruta para crear un nuevo registro de API
apirouter.post('/createapis', createApi);

// Ruta para actualizar un registro de API por su ID
apirouter.patch('/updateapis/:id', updateApi);

// Ruta para eliminar un registro de API por su ID
apirouter.delete('/deleteapis/:id', deleteApi);

export default apirouter;
