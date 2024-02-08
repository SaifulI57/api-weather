import { Router } from "express";
import { findRegency, getAllprovinsi, updating } from "../functions/tomongo.js";
let apiRoutes = Router();

apiRoutes.get("/update", updating);
apiRoutes.get("/regency/:kabupaten", findRegency);
apiRoutes.get("/region/", getAllprovinsi);

export { apiRoutes };
