// import { modelP } from "./q/schema";
import axios from "axios";
import { JSDOM } from "jsdom";
import { parseString } from "xml2js";
// import { getRegency } from "./utils/weathers.js";

export let getId = async () => {
    let url = "https://data.bmkg.go.id/prakiraan-cuaca/";
    let data = await axios.get(url);
    let dom = new JSDOM(data.data);
    let path = [];
    let domain = [];
    let idname = [];
    let dd = dom.window.document.getElementsByTagName("tr");
    for (let i of dd) {
        path.push(i.cells[2].textContent);
        domain.push(i.cells[1].textContent.replace("provinsi", "").replaceAll(",", ""));
    }
    path.shift();
    domain.shift();

    let gy = async (d, j) => {
        let prov;
        await (async () => {
            let get = await axios.get(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/${d}`);
            parseString(get.data, (err, res) => {
                prov = res.data.forecast[0].area;
            });
        })();
        prov.forEach((e) => {
            idname.push({ id: e["$"].id, name: e["$"].description.toLowerCase().replaceAll("kabupaten ", ""), path: d, domain: domain[j] });
        });
    };
    for (let i = 0; i < path.length; i++) {
        await gy(path[i], i);
    }
    return idname;
};
