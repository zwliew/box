import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";

import logger from "../logger";
import config from "../config";
import { Folder } from "../interfaces";

const REGION = config.get("aws.s3Region");
const BUCKET_NAME = config.get("aws.s3Bucket");

function normalizePath(path: string) {
  path = path.trim();
  if (!path.endsWith("/")) {
    path += "/";
  }
  while (path.startsWith("/")) {
    path = path.substring(1);
  }
  return path;
}

class S3Service {
  client: S3Client;

  constructor() {
    this.client = new S3Client({ region: REGION });
  }

  async listObjects(path: string): Promise<Folder | undefined> {
    try {
      path = normalizePath(path);
      const data = await this.client.send(
        new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: path,
          Delimiter: "/",
        })
      );
      let folders: string[] = [];
      let files: string[] = [];
      data.CommonPrefixes?.forEach((commonPrefix) => {
        if (commonPrefix.Prefix) {
          folders.push(commonPrefix.Prefix.substring(path.length));
        }
      });
      data.Contents?.forEach((content) => {
        if (content.Key && content.Key.length > path.length) {
          files.push(content.Key.substring(path.length));
        }
      });
      return { files, folders };
    } catch (err) {
      logger.error(err);
    }
  }

  async getObject(path: string): Promise<GetObjectCommandOutput | undefined> {
    try {
      path = normalizePath(path);
      const data = await this.client.send(
        new GetObjectCommand({ Bucket: BUCKET_NAME, Key: path })
      );
      return data;
    } catch (err) {
      logger.error(err);
    }
  }
}

export default S3Service;
