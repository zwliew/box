import type { Request, Response, NextFunction } from "express";
import { ApiService } from "@root/services";
import logger from "@root/logger";
import { normalizePath } from "@root/utils";

async function list(_: Request, res: Response, next: NextFunction) {
  if (!res.locals["path"]) {
    res.status(400).json({ message: "Invalid path" });
    return;
  }
  const path = res.locals["path"];
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

async function view(_: Request, res: Response, next: NextFunction) {
  if (!res.locals["path"]) {
    res.status(400).json({ message: "Invalid path" });
    return;
  }
  const path = res.locals["path"];
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

async function remove(_: Request, res: Response, next: NextFunction) {
  if (!res.locals["path"]) {
    res.status(400).json({ message: "Invalid path" });
    return;
  }
  const path = res.locals["path"];
  logger.info(`Removing ${path}`);
  try {
    await ApiService.remove(path);
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

function parseFilePath(req: Request, res: Response, next: NextFunction) {
  const path = normalizePath(req.path, false);
  res.locals["path"] = path;
  next();
}

function parseFolderPath(req: Request, res: Response, next: NextFunction) {
  const path = normalizePath(req.path, true);
  res.locals["path"] = path;
  next();
}

export default {
  list,
  view,
  remove,
  parseFolderPath,
  parseFilePath,
};
