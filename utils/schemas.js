import mongoose from "mongoose";

const {model, Schema} = mongoose;

const LeadSchema = new Schema({
    name: String,
    email: [String]
})

const Lead = model("Lead", LeadSchema)

export default Lead