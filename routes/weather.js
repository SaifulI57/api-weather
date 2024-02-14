import { Router } from "express";
import { findRegency, getAllprovinsi, updating } from "../v1/functions/tomongo.js";
import { allRegency, regency } from "../v2/controllers/weather.js";
let apiRoutes = Router();

apiRoutes.get("/v1/update", updating);
apiRoutes.get("/v1/regency/:kabupaten", findRegency);
apiRoutes.get("/v1/region/", getAllprovinsi);
apiRoutes.get("/v2/regency/:kabupaten", regency);
apiRoutes.get("/v2/:provinsi", allRegency);

export { apiRoutes };
