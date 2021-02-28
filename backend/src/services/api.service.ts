import type { GetObjectOutput } from "@aws-sdk/client-s3";
import { StorageService } from "@root/services";
import logger from "@root/logger";
import { Folder } from "@root/interfaces";

async function list(path: string): Promise<Folder | undefined> {
  const storageService = new StorageService();
  try {
    const fileNames = await storageService.list(path);
    return fileNames;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

async function view(path: string): Promise<GetObjectOutput | undefined> {
  const storageService = new StorageService();
  try {
    const fileDetails = await storageService.view(path);
    return fileDetails;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

export default {
  list,
  view,
};
