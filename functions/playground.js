import dotenv from "dotenv";
import mongoose from "mongoose";
import { kab } from "../schema/kab.js";
import { getProvinsiUpdate, getUpdates } from "./weathers.js";

dotenv.config();
let url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.PASSWORD}@train.cqspyb4.mongodb.net/?retryWrites=true&w=majority`;

// await mongoose.connect(url, { w: "majority", retryWrites: true });
console.log(await getUpdates());
// let aceh = await kab.findOne({ name: "tulungagung" }, "name data.hu -_id");
// let kabupaten = aceh.find({ kabupaten });
// console.log(aceh);
