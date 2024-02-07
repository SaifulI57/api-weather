import dotenv from "dotenv";
import mongoose from "mongoose";
import { prov } from "../schema/prov.js";

dotenv.config();
let url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.PASSWORD}@train.cqspyb4.mongodb.net/?retryWrites=true&w=majority`;

await mongoose.connect(url, { w: "majority", retryWrites: true });

let aceh = await prov.find({}, "path update kabupaten.data kabupaten.name").lean();
let y = [];

aceh.forEach((d) => {
    y.push(...d.kabupaten);
});
// let kabupaten = aceh.find({ kabupaten });
console.log(y.filter((x) => x.name === "tulungagung"));
