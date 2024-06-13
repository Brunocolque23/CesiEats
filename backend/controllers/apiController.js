import apiModel from '../models/apiModel.js'; // Asegúrate de que la ruta sea correcta según tu estructura de archivos

// Controlador para obtener todos los registros
const getAllApis = async (req, res) => {
    try {
        const apis = await apiModel.find();
        res.json({ success: true, data: apis })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
};

// Controlador para crear un nuevo registro
const createApi = async (req, res) => {
    const api = req.body;

    
    const newApi = new apiModel({
        name: req.body.name,
        secretKey: req.body.secretKey,
        iddevelop: req.body.iddevelop,
    })

    try {
        await newApi.save();
        res.json({ success: true, message: "API Added" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
};

// Controlador para actualizar un registro existente
const updateApi = async (req, res) => {
    const { id } = req.params;
    const { name, secretKey, iddevelop } = req.body;
  
    try {
      const api = await apiModel.findById(id);
  
      if (!api) {
        return res.status(404).json({ success: false, message: 'API not found' });
      }
  
      api.name = name || api.name;
      api.secretKey = secretKey || api.secretKey;
      api.iddevelop = iddevelop || api.iddevelop;
  
      await api.save();
      res.status(200).json({ success: true, message: 'API updated successfully' });
    } catch (error) {
      console.error('Error updating API:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
// Controlador para eliminar un registro
const deleteApi = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No API with id: ${id}`);

    await apiModel.findByIdAndRemove(id);

    res.json({ message: "API deleted successfully." });
};


export { getAllApis, createApi, updateApi, deleteApi };
