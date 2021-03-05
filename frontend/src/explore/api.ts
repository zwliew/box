import { ListApiResponse, ViewApiResponse } from "./interfaces";

const API_URL = "http://localhost:4000/api";

async function view(path: string): Promise<ViewApiResponse> {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json();
  return data;
}

async function list(path: string): Promise<ListApiResponse> {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json();
  return data;
}

async function remove(path: string): Promise<void> {
  await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });
}

async function upload(path: string, file: File): Promise<void> {}

export default {
  view,
  remove,
  list,
  upload,
};
