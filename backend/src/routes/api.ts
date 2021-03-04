import { Router } from "express";
import { ApiMiddleware } from "@root/middlewares";

const router = Router({ strict: true, caseSensitive: true });

router.get("*/", ApiMiddleware.parseFolderPath, ApiMiddleware.list);
router.get("*", ApiMiddleware.parseFilePath, ApiMiddleware.view);
router.delete("*", ApiMiddleware.parseFilePath, ApiMiddleware.remove);

export default router;
