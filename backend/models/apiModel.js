import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    secretKey:{ type:String, required:true}
})

const apiModel = mongoose.models.api || mongoose.model("api", apiSchema);
export default apiModel;