import mongoose from "mongoose";

const {model, Schema} = mongoose;

const LeadSchema = new Schema({
    name: String,
    email: [String]
})

export default const Lead = model("Lead", LeadSchema)