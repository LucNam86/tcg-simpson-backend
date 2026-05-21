import { Router } from "express";
import getRoutes from "./card.get";

const router = Router();

router.use(getRoutes);;

export default router;