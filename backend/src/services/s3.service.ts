import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

import logger from "../logger";
import config from "../config";

const REGION = config.get("aws.s3Region");
const BUCKET_NAME = config.get("aws.s3Bucket");

function normalizePath(path: string) {
  path = path.trim();
  if (!path.endsWith("/")) {
    path += "/";
  }
  return path;
}

class S3Service {
  client: S3Client;

  constructor() {
    this.client = new S3Client({ region: REGION });
  }

  async list(path: string) {
    try {
      path = normalizePath(path);
      const data = await this.client.send(
        new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: path })
      );
      return data;
    } catch (err) {
      logger.error(err);
    }
  }
}

export default S3Service;
