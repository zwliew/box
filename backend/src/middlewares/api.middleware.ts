import type { Request, Response, NextFunction } from "express";
import { ApiService } from "../services";
import logger from "../logger";

async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApiService.list(req.path);
    res.json(data);
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

async function view(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApiService.view(req.path);
    res.json(data);
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

export default {
  list,
  view,
};
