import type { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { S3Service } from "@root/services";
import logger from "@root/logger";
import { Folder } from "@root/interfaces";

class StorageService {
  client: S3Service;

  constructor() {
    this.client = new S3Service();
  }

  async list(path: string): Promise<Folder | undefined> {
    try {
      const data = await this.client.listObjects(path);
      return data;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  async view(path: string): Promise<GetObjectCommandOutput | undefined> {
    try {
      const data = await this.client.getObject(path);
      return data;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }
}

export default StorageService;
