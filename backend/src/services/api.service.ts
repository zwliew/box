import { StorageService } from "@root/services";
import logger from "@root/logger";
import { FolderDetails, FileDetails } from "@root/interfaces";

async function list(path: string): Promise<FolderDetails | undefined> {
  const storageService = new StorageService();
  try {
    const folder = await storageService.list(path);
    return folder;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

async function view(path: string): Promise<FileDetails | undefined> {
  const storageService = new StorageService();
  try {
    const file = await storageService.view(path);
    return file;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

export default {
  list,
  view,
};
