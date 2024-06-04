import apiModel from "../models/apiModel.js";


const listAPI = async (req, res) => {
    try {
        const apis = await apiModel.find({});
        res.json({ success: true, data: apis });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { listAPI }