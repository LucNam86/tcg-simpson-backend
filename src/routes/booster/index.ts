import { Router } from "express";
import getRoutes from "./booster.get";

const router = Router();

router.use(getRoutes);

export default router;