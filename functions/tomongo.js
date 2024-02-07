import { getUpdates, start } from "../functions/weathers.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { prov } from "../schema/prov.js";
import Logging from "../logging/Logging.js";
import { kab } from "./../schema/kab.js";
let L = new Logging();
dotenv.config();
let url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.PASSWORD}@train.cqspyb4.mongodb.net/?retryWrites=true&w=majority`;
let cek;
let allProv;
let allKab;

export let findRegency = async (req, res) => {
    let q = req.params;
    L.info("this is q " + q.kabupaten);
    let obj = await kab.findOne({ name: q.kabupaten }, "name data -_id").lean();
    obj.length === 0 ? res.status(404).json({ message: "Kabupaten tidak ditemukan" }) : res.status(200).json(obj);
};
export let collectionExist = async () => {
    let data;
    if (cek) {
        L.info("collection found");
    } else {
        L.info("collection not found");
        L.info("creating new collection");
        data = await start();
    }
    return data;
};

export let run = async () => {
    allKab = await collectionExist();
    allProv = await getUpdates();
    cek ? L.info("model found") : await createNew(allProv, allKab);
};

export let conn = async () => {
    await mongoose.connect(url, { w: "majority", retryWrites: true });
    cek = await prov.findOne({ name: "aceh" });
};

export let createNew = async (data, k) => {
    try {
        let exist = await prov.findOne({ name: data.aceh.name });
        if (exist) {
            L.info("data already exists in database");
        } else {
            Object.keys(data).forEach((k) => {
                let Prov = new prov(data[k]);
                Prov.save();
            });
            Object.keys(k).forEach((d) => {
                k[d].forEach((v) => {
                    let Kab = new kab(v);
                    Kab.save();
                });
            });
        }
    } catch (e) {
        L.error("Cannot Save data to database");
    }
};
