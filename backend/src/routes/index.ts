import { Router } from "express";
import { ApiMiddleware } from "../middlewares";

const router = Router({ caseSensitive: true, strict: true });

router.get("*/", ApiMiddleware.list);
router.get("*", ApiMiddleware.view);

export default router;
