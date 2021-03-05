// API responses
export interface ListApiResponse {
  folders: string[];
  files: string[];
}

export interface ViewApiResponse {
  type: string;
  size: number;
  lastModified: string;
  url?: string;
}

export interface FolderDetails {
  folders: string[];
  files: string[];
}

export interface FileDetails {
  type: string;
  size: string;
  lastModified: Date;
  url?: string;
}

export interface PathFragment {
  display: string;
  actual: string;
}
