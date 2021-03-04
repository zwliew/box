import { Router } from "express";
import { ApiMiddleware } from "@root/middlewares";

const router = Router({ strict: true, caseSensitive: true });

router.get("*/", ApiMiddleware.list);
router.get("*", ApiMiddleware.view);
router.delete("*", ApiMiddleware.remove);

export default router;
