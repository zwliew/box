import StorageService from "./storage.service";
import logger from "../logger";

async function list(path: string) {
  const storageService = new StorageService();
  try {
    const fileNames = await storageService.list(path);
    return fileNames;
  } catch (err) {
    logger.error(err);
  }
}

export default {
  list,
};
