import { Router } from "express";
import { findRegency } from "../functions/tomongo.js";

let apiRoutes = Router();

// apiRoutes.get('/region/:provinsi', getKabupaten);
apiRoutes.get("/regency/:kabupaten", findRegency);

export { apiRoutes };
