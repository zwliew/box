import type { Request, Response, NextFunction } from "express";
import { ApiService } from "../services";
import logger from "../logger";

async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ApiService.list(req.path);
    logger.info(result);
    res.send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

async function view(req: Request, res: Response, next: NextFunction) {
  try {
    res.end();
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

export default {
  list,
  view,
};
