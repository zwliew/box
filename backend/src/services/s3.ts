import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import logger from "@root/logger";
import config from "@root/config";
import { FileDetails, FolderDetails } from "@root/interfaces";
import { NotFoundError } from "@root/errors";

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

  async headObject(path: string): Promise<FileDetails> {
    path = normalizePath(path);
    logger.info(`Getting details of ${path}`);

    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });
    const data = await this.client.send(command);
    const { ContentType, ContentLength, LastModified } = data;

    // File does not exist
    if (!ContentType || !ContentLength || !LastModified) {
      throw new NotFoundError();
    }

    return {
      type: ContentType,
      size: ContentLength,
      lastModified: new Date(LastModified),
    };
  }

  async listObjects(path: string): Promise<FolderDetails> {
    path = normalizePath(path);
    logger.info(`Listing objects at ${path}`);

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: path,
      Delimiter: "/",
    });
    const data = await this.client.send(command);

    // Folder does not exist
    if (!data.Contents && !data.CommonPrefixes) {
      throw new NotFoundError();
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
  }

  async getObject(path: string): Promise<string> {
    path = normalizePath(path);
    logger.info(`Getting object at ${path}`);

    const EXPIRY_SEC = 5 * 60; // 5 minutes
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: path });
    const url = await getSignedUrl(this.client, command, {
      expiresIn: EXPIRY_SEC,
    });
    return url;
  }

  async deleteObject(path: string): Promise<void> {
    path = normalizePath(path);
    logger.info(`Deleting object at ${path}`);

    const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: path });
    await this.client.send(command);
  }
}

export default S3Service;
