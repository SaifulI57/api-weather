import express from "express";
import env from "dotenv";
import bodyParser from "body-parser";
import Logging from "./logging/Logging.js";
import { apiRoutes } from "./routes/weather.js";

import { conn, run } from "./functions/tomongo.js";
let app = express();

const L = new Logging();
env.config();

await conn()
    .then(() => {
        L.info("connection established");
    })
    .catch((err) => {
        L.error("failed to connect");
        L.error(`${err.message}`);
    });
await run();

const startApp = () => {
    app.use((req, res, next) => {
        L.info(` Incoming Request -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            L.info(` Incoming Request Finish -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - StatusCode: [${res.statusCode}] - Status: [${res.statusMessage}]`);
        });
        next();
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get("/", (req, res, next) => {
        res.send({ message: "Worked" });
    });

    app.use("/api", apiRoutes);
    app.use((req, res, next) => {
        L.info(req.route);
        if (!req.route) {
            res.status(404).json({ message: "endpoint tidak ditemukan" });
        } else {
            next();
        }
    });

    app.listen(process.env.PORT, () => {
        L.info(`listening on ${process.env.PORT}`);
    });
};

startApp();
