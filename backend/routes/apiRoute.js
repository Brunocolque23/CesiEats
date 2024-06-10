import express from 'express';
import { listAPI } from '../controllers/apiController.js';
import authMiddleware from '../middleware/auth.js';

const apiRouter = express.Router();

apiRouter.post("/listAPI",listAPI);

export default apiRouter;