import { JSDOM as jdom } from "jsdom";
import { DOMParser as xdom } from "xmldom";
import axios from "axios";
import Logging from "../logging/Logging.js";
import { prov } from "../schema/prov.js";
// import fs from "fs";
import { kab } from "../schema/kab.js";
let L = new Logging();
let jd = new jdom();
let xd = new xdom();

let url = "https://data.bmkg.go.id/prakiraan-cuaca/";

export let getUpdates = async () => {
    let data = await axios.get(url).then((r) => {
        jd = new jdom(r.data);
        let obj = {};
        let tr = jd.window.document.getElementsByTagName("tr");
        for (let i = 1; i < tr.length; i++) {
            obj[tr[i].cells[1].textContent.split(" ").join("").toLowerCase().replace("provinsi", "").replaceAll(",", "")] = {
                name: tr[i].cells[1].textContent.split(" ").join().toLowerCase().replace("provinsi", "").replaceAll(",", ""),
                path: tr[i].cells[2].textContent,
                update: tr[i].cells[3].textContent
            };
        }
        return obj;
    });

    return data;
};

export let getProvinsiUpdate = async () => {
    let data = await axios.get(url);
    let df = new jdom(data.data);
    let tr = df.window.document.getElementsByTagName("tr");
    return tr[1].cells[3].textContent;
};

export let updateAll = async () => {
    let provs = await getUpdates();
    let kabs = await start();

    try {
        Object.keys(provs).forEach((e) => {
            (async (a, b) => {
                await prov.findOneAndUpdate({ name: a }, { update: b });
            })(e, provs[e].update);
        });
        L.info("Province Updated");
    } catch (e) {
        L.error("error on updating date");
    }
    try {
        Object.keys(kabs).forEach((e) => {
            kabs[e].forEach((d) => {
                (async (a, b) => {
                    await kab.findOneAndUpdate({ name: a }, { data: b });
                })(d.name, d.data);
            });
        });
        L.info("Kabupaten Updated");
    } catch (e) {
        L.error("error on updating data");
    }
};

let getData = async (d) => {
    let obj = {};
    let arr = [];
    let path = [];
    let getParam = (pr, n) => {
        let obj = {};
        for (let i = 0; i < pr.length; i++) {
            let attr = [];
            let desc = pr[i].getAttribute("id");
            let timerange = pr[i].getElementsByTagName("timerange");
            let type = pr[i].getAttribute("type");
            for (let j = 0; j < timerange.length; j++) {
                let value = timerange[j].getElementsByTagName("value");
                let hour = timerange[j].getAttribute("h");
                let day = timerange[j].getAttribute("day");
                let daily;
                try {
                    daily = day.split("")[day.length - 2].concat(day.split("")[day.length - 1]);
                } catch (e) {
                    daily = undefined;
                }
                let cek = type === "hourly";
                let time = cek ? hour : daily;
                let temp = [];
                for (let h = 0; h < value.length; h++) {
                    let val = value[h].textContent + " " + value[h].getAttribute("unit");
                    temp.push(val);
                }
                if (cek) {
                    attr.push({
                        h: time,
                        value: temp
                    });
                } else {
                    attr.push({
                        d: time,
                        value: temp
                    });
                }
            }
            obj[desc] = {
                format: type,
                t: attr
            };
        }

        return {
            name: n,
            data: obj
        };
    };
    let getArea = (fr) => {
        let obj = [];
        for (let i = 0; i < fr.length; i++) {
            let desc = fr[i].getAttribute("description").toLowerCase();
            obj.push(getParam(fr[i].getElementsByTagName("parameter"), desc));
        }
        return obj;
    };
    let fetch = async (n, p, i) => {
        await axios
            .get(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/${p[i]}`)
            .then((fc) => xd.parseFromString(fc.data, "text/xml"))
            .then((ft) => {
                let forecast = ft.getElementsByTagName("area");
                obj[n[i]] = getArea(forecast, n[i]);
            });
        if (i === p.length - 1) {
            L.info("done fetching");
        } else {
            await fetch(n, p, i + 1);
        }
    };
    Object.keys(d).forEach((dt) => {
        arr.push(d[dt].name);
        path.push(d[dt].path);
    });
    await fetch(arr, path, 0);
    return obj;
};
export let start = async () => {
    let u = await getUpdates();
    let y = await getData(u);
    return y;
};

// fs.writeFileSync("foracast.json", JSON.stringify(y));
