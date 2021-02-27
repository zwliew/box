import S3Service from "./s3.service";
import logger from "../logger";

class StorageService {
  client: S3Service;

  constructor() {
    this.client = new S3Service();
  }

  async list(path: string) {
    try {
      const data = await this.client.list(path);
      return data;
    } catch (err) {
      logger.error(err);
    }
  }
}

export default StorageService;
