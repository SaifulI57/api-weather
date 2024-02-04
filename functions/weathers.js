import { JSDOM as jdom } from 'jsdom';
import { DOMParser as xdom } from 'xmldom';
import axios from 'axios';
// import fs from 'fs';

let jd = new jdom();
let xd = new xdom();

let url = 'https://data.bmkg.go.id/prakiraan-cuaca/';

let getUpdates = async () => {
    let data = await axios.get(url).then((r) => {
        jd = new jdom(r.data);
        let obj = {};
        let tr = jd.window.document.getElementsByTagName('tr');
        for (let i = 1; i < tr.length; i++) {
            obj[tr[i].cells[1].textContent.split(' ').join('').toLowerCase().replace('provinsi', '').replaceAll(',', '')] = {
                name: tr[i].cells[1].textContent.split(' ').join().toLowerCase().replace('provinsi', '').replaceAll(',', ''),
                path: tr[i].cells[2].textContent,
                update: tr[i].cells[3].textContent
            };
        }
        return obj;
    });

    return data;
};

let getData = async (d) => {
    let obj = {};
    let arr = [];
    let path = [];
    let getParam = (pr) => {
        let obj = {};
        for (let i = 0; i < pr.length; i++) {
            let attr = {};
            let desc = pr[i].getAttribute('id');
            let timerange = pr[i].getElementsByTagName('timerange');
            for (let j = 0; j < timerange.length; j++) {
                let value = timerange[j].getElementsByTagName('value');
                let type = timerange[j].getAttribute('type');
                let hour = timerange[j].getAttribute('h');
                let day = timerange[j].getAttribute('day');
                let daily;
                try {
                    daily = day.split('')[day.length - 2].concat(day.split('')[day.length - 1]);
                } catch (e) {
                    daily = undefined;
                }
                let time = type === 'hourly' ? hour : daily;
                let temp = [];
                for (let h = 0; h < value.length; h++) {
                    let val = value[h].textContent + ' ' + value[h].getAttribute('unit');
                    temp.push(val);
                }
                attr[time] = {
                    type: type,
                    time: time,
                    data: temp
                };
            }
            obj[desc] = attr;
        }
        return obj;
    };
    let getArea = (fr) => {
        let obj = {};
        for (let i = 0; i < fr.length; i++) {
            let desc = fr[i].getAttribute('description').replaceAll(' ', '_').replaceAll('.', '').replaceAll('-', '').toLowerCase();
            obj[desc] = getParam(fr[i].getElementsByTagName('parameter'));
        }
        return obj;
    };
    let fetch = async (n, p, i) => {
        await axios
            .get(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/${p[i]}`)
            .then((fc) => xd.parseFromString(fc.data, 'text/xml'))
            .then((ft) => {
                let forecast = ft.getElementsByTagName('area');
                obj[n[i]] = {
                    ...d[n[i]],
                    kab: getArea(forecast)
                };
            });
        if (i === p.length - 1) {
            console.log('done fetching');
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
let start = async () => {
    let u = await getUpdates();
    let y = await getData(u);
    return y;
};

export { start };

// fs.writeFileSync('foracast.json', JSON.stringify(y));
