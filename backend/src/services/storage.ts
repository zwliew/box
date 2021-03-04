import { S3Service } from "@root/services";
import logger from "@root/logger";
import { FolderDetails, FileDetails } from "@root/interfaces";

class StorageService {
  client: S3Service;

  constructor() {
    this.client = new S3Service();
  }

  async list(path: string): Promise<FolderDetails | undefined> {
    try {
      const data = await this.client.listObjects(path);
      return data;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  async view(path: string): Promise<FileDetails | undefined> {
    try {
      const head = await this.client.headObject(path);
      if (!head) {
        return undefined;
      }

      const url = await this.client.getObject(path);
      return { ...head, url };
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  async remove(path: string): Promise<void> {
    try {
      await this.client.deleteObject(path);
    } catch (err) {
      logger.error(err);
    }
  }
}

export default StorageService;
