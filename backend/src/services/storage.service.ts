import type {
  GetObjectCommandOutput,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import S3Service from "./s3.service";
import logger from "../logger";

class StorageService {
  client: S3Service;

  constructor() {
    this.client = new S3Service();
  }

  async list(path: string): Promise<string[] | undefined> {
    try {
      const data = await this.client.listObjects(path);
      return data;
    } catch (err) {
      logger.error(err);
    }
  }

  async view(path: string): Promise<GetObjectCommandOutput | undefined> {
    try {
      const data = await this.client.getObject(path);
      return data;
    } catch (err) {
      logger.error(err);
    }
  }
}

export default StorageService;
