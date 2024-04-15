import mongoose from "mongoose";

const {model, Schema, models} = mongoose;

const LeadSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: false
    }
})

const Lead = models.Lead || model("Lead", LeadSchema)

export default Lead