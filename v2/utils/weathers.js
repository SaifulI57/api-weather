import { parseString } from "xml2js";
import axios from "axios";

// url = "https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/";

let refactorWd = (a) => {
    let p0 = {
        N: "North",
        NNE: "North-Northeast",
        NE: "Northeast",
        ENE: "East-Northeast",
        E: "East",
        ESE: "East-Southeast",
        SE: "Southeast",
        SSE: "South-Southeast",
        S: "South",
        SSW: "South-Southwest",
        SW: "Southwest",
        WSW: "West-Southwest",
        W: "West",
        WNW: "West-Northwest",
        NW: "Northwest",
        NNW: "North-Northwest"
    };
    return p0[a];
};
let refactorW = (a) => {
    let y8 = {
        0: "Cerah",
        1: "Cerah Berawan",
        2: "Cerah Berawan",
        3: "Berawan",
        4: "Berawan Tebal",
        5: "Udara Kabur",
        10: "Asap",
        45: "Kabut",
        60: "Hujan Ringan",
        61: "Hujan Sedang",
        63: "Hujan Lebat",
        80: "Hujan Lokal",
        95: "Hujan Petir"
    };
    return a >= 95
        ? y8[95]
        : a >= 80 && a < 95
        ? y8[80]
        : a >= 63 && a < 80
        ? y8[63]
        : a >= 61 && a < 63
        ? y8[61]
        : a === 60
        ? y8[60]
        : a >= 45 && a < 60
        ? y8[45]
        : a >= 10 && a < 45
        ? y8[10]
        : a >= 5 && a < 10
        ? y8[5]
        : y8[a];
};
export let getRegency = async (id, path) => {
    let stored = {};
    let kabupaten;
    let issued;
    await (async () => {
        let d = await axios.get(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/${path}`);
        parseString(d.data, (e, res) => {
            kabupaten = res.data.forecast[0].area;
            issued = res.data.forecast[0].issue[0];
        });
        issued = {
            timestamp: issued.timestamp[0],
            year: issued.year[0],
            month: issued.month[0],
            day: issued.day[0],
            hour: issued.hour[0],
            minute: issued.minute[0],
            second: issued.second[0]
        };
        let a = "$";
        let keyArea = ["id", "latitude", "longitude", "coordinate", "type", "region", "level", "description", "domain", "tags"];
        let keyParam = ["id", "description", "type"];
        let keyTimerange = ["h", "datetime"];
        let re = new RegExp(id);
        let find = kabupaten.filter((e) => e[a].id.match(re))[0];
        ((area, param, timerange) => {
            if (Object.keys(find).length > 0) {
                area.forEach((e) => {
                    stored[e] = find[a][e];
                });
                let type = "";
                try {
                    find.parameter.forEach((k) => {
                        let params = [];
                        let obj = {};
                        param.forEach((e) => {
                            type = e === "hourly" ? "hourly" : k[a][e];
                            obj[e] = k[a][e];
                        });
                        k["timerange"].forEach((tr) => {
                            let temp = {};
                            let x = [];
                            timerange.forEach((e) => {
                                if (e === "datetime") {
                                    let parsed = tr[a][e];
                                    temp[e] = parsed[parsed.length - 6].concat(parsed[parsed.length - 5]);
                                } else {
                                    if (type === "hourly") {
                                        temp[e] = tr[a][e];
                                    } else {
                                        e = "day";
                                        let prs = tr[a][e].split("");
                                        temp[e] = prs[prs.length - 2].concat(prs[prs.length - 1]);
                                    }
                                }
                            });
                            tr.value.forEach((q) => {
                                obj["id"] === "tmin" || obj["id"] === "tmax" || obj["id"] === "t"
                                    ? q[a]["unit"] === "C"
                                        ? (temp["celcius"] = `${q["_"]} °C`)
                                        : (temp["fahrenheit"] = `${q["_"]} °F`)
                                    : obj["id"] === "ws"
                                    ? q[a]["unit"] === "Kt"
                                        ? (temp["kt"] = q["_"])
                                        : q[a]["unit"] === "MPH"
                                        ? (temp["mph"] = q["_"])
                                        : q[a]["unit"] === "KPH"
                                        ? (temp["kph"] = q["_"])
                                        : (temp["ms"] = q["_"])
                                    : obj["id"] === "wd"
                                    ? q[a]["unit"] === "deg"
                                        ? (temp["deg"] = q["_"])
                                        : q[a]["unit"] === "CARD"
                                        ? (() => {
                                              temp["card"] = q["_"];
                                              temp["alias"] = refactorWd(q["_"]);
                                          })()
                                        : (temp["sexa"] = q["_"])
                                    : obj["id"] === "weather"
                                    ? (() => {
                                          temp["code"] = q["_"];
                                          temp["name"] = refactorW(q["_"]);
                                      })()
                                    : (temp["value"] = q["_"]);
                            });
                            params.push(temp);
                        });
                        obj["times"] = params;
                        delete obj["id"];
                        stored[k[a]["id"]] = obj;
                    });
                } catch (e) {
                    stored = [];
                }
            }
        })(keyArea, keyParam, keyTimerange);
    })();
    return {
        issued: issued,
        data: stored
    };
};
