export interface FolderDetails {
  folders: string[];
  files: string[];
}

export interface FileDetails {
  type: string;
  size: number;
  lastModified: Date;
  url?: string;
}
