import { Router, type IRouter } from "express";
import healthRouter from "./health";
import geocodeRouter from "./geocode";
import shipmentsRouter from "./shipments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(geocodeRouter);
router.use(shipmentsRouter);

export default router;
