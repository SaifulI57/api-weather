import mongoose, { Schema } from "mongoose";

const Prov = new Schema({
    name: String,
    path: String,
    update: String
});

export let prov = mongoose.model("provinsi", Prov);
