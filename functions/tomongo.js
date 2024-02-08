import { getProvinsiUpdate, getUpdates, start, updateAll } from "../functions/weathers.js";
import mongoose from "mongoose";
import { prov } from "../schema/prov.js";
import Logging from "../logging/Logging.js";
import { kab } from "./../schema/kab.js";
import { url } from "./../config.js";
let L = new Logging();
let cek;
let allProv;
let allKab;

export let updating = async (req, res) => {
    try {
        let update = cek.update;
        let now = await getProvinsiUpdate();
        if (update === now) {
            res.status(200).json({ message: "Up to date, Nothing to update" });
        } else {
            await updateAll();
            L.info("Up to date");
            res.status(200).json({ message: "Updated" });
        }
    } catch (err) {
        L.info("Failed to Update");
    }
};

export let findRegency = async (req, res) => {
    let q = req.params;
    let que = req.query;
    if (!q.kabupaten) res.status(404).json({ message: "silahkan masukkan kabupaten" });
    let obj;
    try {
        if (que) {
            let filter = `name data.${que.f} -_id`;
            que.onlyData
                ? (async () => {
                      filter = `name data.${que.f}.t -_id`;
                      try {
                          let temp = que.f.split(" ");
                          if (temp.length === 1) obj = await kab.findOne({ name: q.kabupaten }, filter).lean();
                          if (temp.length > 1) {
                              filter = "name ";
                              temp.forEach((e) => {
                                  filter += `data.${e}.t `;
                              });

                              filter += "-_id";
                              obj = await kab.findOne({ name: q.kabupaten }, filter).lean();
                          }
                      } catch (err) {
                          res.status(400).json({ message: "Bad request, Silahkan cek query kamu" });
                      }
                      try {
                          obj.length === 0 && obj !== undefined ? res.status(404).json({ message: "Kabupaten tidak ditemukan" }) : res.status(200).json(obj);
                      } catch (e) {
                          L.error("kesalahan init obj");
                      }
                  })()
                : (async () => {
                      try {
                          let temp = que.f.split(" ");
                          if (que.f.length === 2) obj = await kab.findOne({ name: q.kabupaten }, filter).lean();
                          if (temp.length > 1) {
                              filter = "name ";
                              temp.forEach((e) => {
                                  filter += `data.${e} `;
                              });

                              filter += "-_id";
                              obj = await kab.findOne({ name: q.kabupaten }, filter).lean();
                          }
                      } catch (err) {
                          res.status(400).json({ message: "Bad request, Silahkan cek query kamu" });
                      }
                      try {
                          obj.length === 0 && obj !== undefined ? res.status(404).json({ message: "Kabupaten tidak ditemukan" }) : res.status(200).json(obj);
                      } catch (e) {
                          L.error("kesalahan init obj");
                      }
                  })();
        } else {
            obj = await kab.findOne({ name: q.kabupaten }, "name data -_id").lean();
            obj.length === 0 && obj !== undefined ? res.status(404).json({ message: "Kabupaten tidak ditemukan" }) : res.status(200).json(obj);
        }
    } catch (er) {
        res.status(400).json({ message: "Bad request, Silahkan cek query kamu" });
    }
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
    if (cek) {
        L.info("model found");
        L.info("checking an update");
        let update = cek.update;
        let now = await getProvinsiUpdate();

        if (now !== update) {
            await updateAll();
            L.info("Up to date");
        } else {
            L.info("Up to date");
        }
    } else {
        await createNew(allProv, allKab);
    }
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
