export function normalizePath(path: string, isFolder: boolean): string {
  // Remove excess trailing slashes
  let trailingCnt = 0;
  for (let i = path.length - 1; i >= 0 && path[i] === "/"; --i, ++trailingCnt);
  if (isFolder && trailingCnt) {
    --trailingCnt;
  }
  path = path.substring(0, path.length - trailingCnt);

  // Remove excess leading slashes
  let leadingCnt = 0;
  for (let i = 0; i < path.length && path[i] == "/"; ++i, ++leadingCnt);
  if (leadingCnt > 1) {
    path = path.substring(leadingCnt - 1);
  } else if (!leadingCnt) {
    path = `/${path}`;
  }

  return path;
}
