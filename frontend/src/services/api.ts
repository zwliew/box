const API_URL = "http://localhost:4000/api";

async function view(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json();
  return data;
}

async function list(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json();
  return data;
}

async function remove(path: string) {
  await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });
}

export default {
  view,
  remove,
  list,
};
