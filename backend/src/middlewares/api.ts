import type { Request, Response, NextFunction } from "express";
import { ApiService } from "@root/services";
import logger from "@root/logger";

async function list(req: Request, res: Response, next: NextFunction) {
  const { path } = req;
  logger.info(`Listing ${path}`);
  try {
    const folder = await ApiService.list(path);
    if (folder) {
      res.status(200).json(folder);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

async function view(req: Request, res: Response, next: NextFunction) {
  const { path } = req;
  logger.info(`Viewing ${path}`);
  try {
    const file = await ApiService.view(path);
    if (file) {
      res.status(200).json(file);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  const { path } = req;
  logger.info(`Removing ${path}`);
  try {
    await ApiService.remove(path);
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

export default {
  list,
  view,
  remove,
};
