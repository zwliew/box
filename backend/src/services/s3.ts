import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import logger from "@root/logger";
import config from "@root/config";
import { FileDetails, FolderDetails } from "@root/interfaces";

const REGION = config.get("aws.s3Region");
const BUCKET_NAME = config.get("aws.s3Bucket");

function normalizePath(path: string): string {
  // Remove all leading slashes
  let leadingCnt = 0;
  for (let i = 0; i < path.length && path[i] === "/"; ++i, ++leadingCnt);
  path = path.substring(leadingCnt);

  return path;
}

class S3Service {
  client: S3Client;

  constructor() {
    this.client = new S3Client({ region: REGION });
  }

  async headObject(path: string): Promise<FileDetails | undefined> {
    path = normalizePath(path);
    logger.info(`Getting details of ${path}`);
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });
    try {
      const {
        ContentType,
        ContentLength,
        LastModified,
      } = await this.client.send(command);
      if (!ContentType || !ContentLength || !LastModified) {
        return undefined;
      }
      return {
        type: ContentType,
        size: ContentLength,
        lastModified: new Date(LastModified),
      };
    } catch (err) {
      logger.error(err);
    }
    return undefined;
  }

  async listObjects(path: string): Promise<FolderDetails | undefined> {
    path = normalizePath(path);
    logger.info(`Listing objects at ${path}`);

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: path,
      Delimiter: "/",
    });
    try {
      const data = await this.client.send(command);

      // Folder does not exist
      if (!data.Contents) {
        return undefined;
      }

      // Extract files and folders
      const folders: string[] = [];
      const files: string[] = [];
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
      return undefined;
    }
  }

  async getObject(path: string): Promise<string | undefined> {
    path = normalizePath(path);
    logger.info(`Getting object at ${path}`);

    const EXPIRY_SEC = 5 * 60; // 5 minutes
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: path });
    try {
      const url = await getSignedUrl(this.client, command, {
        expiresIn: EXPIRY_SEC,
      });
      return url;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }
}

export default S3Service;
