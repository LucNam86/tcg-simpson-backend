import { Router } from "express";
import postRoutes from "./user.post";
import getRoutes from "./user.get";
import putRoutes from "./user.put";

const router = Router();

router.use(postRoutes);
router.use(getRoutes);
router.use(putRoutes);

export default router;