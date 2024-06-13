import express from 'express';
import { getAllApis, createApi, updateApi, deleteApi, upgraapi } from '../controllers/apiController.js';
import authMiddleware from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import archiver from 'archiver';

const envFilePath = path.join(path.resolve(), '.env');

const apirouter = express.Router();

// Ruta para obtener todos los registros de API
apirouter.get('/getall', getAllApis);

// Ruta para crear un nuevo registro de API
apirouter.post('/createapis', createApi);

// Ruta para actualizar un registro de API por su ID
apirouter.put('/updateapis/:id', async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    try {
        const result = await upgraapi(id, newData);
        res.json(result);
    } catch (error) {
        console.error("Error updating develop:", error);
        res.status(500).json({ success: false, message: "Error updating develop" });
    }
});

// Ruta para eliminar un registro de API por su ID
apirouter.delete('/deleteapis/:id', deleteApi);

apirouter.post('/writeenv', async (req, res) => {
    const { name, secretKey } = req.body;

    if (!name || !secretKey) {
        return res.status(400).json({ success: false, message: 'Name and Secret Key are required' });
    }

    const envVar = `\n${name.toUpperCase()}_SECRET_KEY="${secretKey}"`;

    try {
        fs.appendFileSync(envFilePath, envVar);
        dotenv.config({ path: envFilePath }); // Reload environment variables
        res.status(200).json({ success: true, message: 'Environment variable added successfully' });
    } catch (error) {
        console.error('Error writing to .env file:', error);
        res.status(500).json({ success: false, message: 'Error writing to .env file' });
    }
});

// Helper function to create and send zip files
const sendZipFile = (res, dirPath) => {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    const outputPath = path.join(path.resolve(), `${path.basename(dirPath)}.zip`);

    const output = fs.createWriteStream(outputPath);
    output.on('close', () => {
        res.download(outputPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                fs.unlinkSync(outputPath); // Delete the file after sending
            }
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.directory(dirPath, false);
    archive.finalize();
};

// Routes to download directories
apirouter.get('/download/controllers', (req, res) => {
    const dirPath = path.join(path.resolve(), 'backend', 'controllers');
    sendZipFile(res, dirPath);
});

apirouter.get('/download/models', (req, res) => {
    const dirPath = path.join(path.resolve(), 'backend', 'models');
    sendZipFile(res, dirPath);
});

apirouter.get('/download/routes', (req, res) => {
    const dirPath = path.join(path.resolve(), 'backend', 'routes');
    sendZipFile(res, dirPath);
});

export default apirouter;

