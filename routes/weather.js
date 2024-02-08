import { Router } from "express";
import { findRegency, updating } from "../functions/tomongo.js";

let apiRoutes = Router();

apiRoutes.get("/update", updating);
apiRoutes.get("/regency/:kabupaten", findRegency);

export { apiRoutes };
