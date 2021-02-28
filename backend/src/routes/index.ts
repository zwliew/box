import { Router } from "express";
import apiRouter from "./api";

const router = Router({ caseSensitive: true, strict: true });

router.use("/api", apiRouter);

export default router;
