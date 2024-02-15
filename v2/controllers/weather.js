import { getId } from "../utils/getId.js";
import { getRegency } from "../utils/weathers.js";
import Logging from "../../logging/Logging.js";
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
let redis = new Redis(process.env.REDIS_URI);
let data;
let id = await redis.get("idForecast").then((e) => {
    return e;
});
let L = new Logging();
L.info(`id ${id ? true : false}`);
id
    ? (data = JSON.parse(id))
    : (async () => {
          let is = await getId();
          L.info("here");
          redis.set("idForecast", JSON.stringify(is));
      })();
export const regency = async (req, res) => {
    let q = req.params;
    let re = new RegExp(`${q.kabupaten.toLowerCase()}`);
    let result;
    let cache = false;
    try {
        try {
            const cacheRes = await redis.get(q.kabupaten).then((e) => {
                e === null ? (cache = false) : (cache = true);
                return e;
            });
            // L.info(cache);
            if (cacheRes) {
                result = JSON.parse(cacheRes);
            } else {
                let fn = data.filter((e) => e.name.match(re));
                result = await getRegency(fn[0].id, fn[0].path);
                await redis.set(q.kabupaten, JSON.stringify(result.data), "EX", 3600);
            }
            // await redis.del(q.kabupaten);
        } catch (e) {
            L.error(e);
        }

        res.status(200).json({ status: "success", message: "null", data: cache ? result : result.data });
    } catch (e) {
        L.error(e);
        res.status(404).json({ status: "failed", message: "not found" });
    }
};
export const allRegency = async (req, res) => {
    let q = req.params;
    let re = new RegExp(`${q.provinsi.toLowerCase()}`);
    let result = [];
    let cache;
    let o = {};
    try {
        let cacheRedis = await redis.get(q.provinsi.toLowerCase()).then((e) => {
            e === null ? (cache = false) : (cache = true);
            return e;
        });
        // L.info(`cache is ${cache}`);
        // L.info(`cache is ${cacheRedis}`);
        if (cacheRedis) {
            result = cacheRedis;
            o = await redis.get("issued").then((e) => {
                return e;
            });
        } else {
            let fn = [];

            data.filter((e) => {
                // console.log(e);
                // console.log(e.domain.toLowerCase().replaceAll("provinsi ", "").match(re));
                e.domain.toLowerCase().replaceAll("provinsi ", "").match(re) ? fn.push(e) : false;
            });
            for (let i = 0; i < fn.length; i++) {
                let u = await getRegency(fn[i].id, fn[i].path);
                o = u.issued;
                result.push(u.data);
            }
            await redis.set("issued", JSON.stringify(o), "EX", 3600);
            await redis.set(q.provinsi.toLowerCase(), JSON.stringify(result), "EX", 3600);
        }
        res.status(200).json({ status: "success", message: "null", data: cache === false ? { issued: o, area: result } : { issued: JSON.parse(o), area: JSON.parse(result) } });
    } catch (e) {
        console.log(e);
        res.status(404).json({ status: "failed", message: "not found" });
    }
};
