import {
  Box,
  List,
  ListIcon,
  ListItem,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useQuery } from "react-query";
import { useLocation, Link as RouterLink } from "react-router-dom";
import FileIcon from "../components/icons/FileIcon";
import FolderIcon from "../components/icons/FolderIcon";

interface PathFragment {
  display: string;
  actual: string;
}

const API_URL = "http://localhost:4000/api";

function normalizePath(path: string): string {
  return path.replaceAll(/\/+/g, "/");
}

function decomposePathIntoFragments(path: string): PathFragment[] {
  const fragments = [{ display: "root", actual: "/" }];
  let curPath = "/";
  const splitPaths = path.split("/").slice(1, -1);
  for (const fragment of splitPaths) {
    curPath += `${fragment}/`;
    fragments.push({
      display: fragment,
      actual: curPath,
    });
  }
  return fragments;
}

function Error({ error }: { error: any }) {
  if (!error) return null;
  return <div>{error}</div>;
}

function FolderViewItem({
  icon,
  children,
}: {
  icon: any;
  children: ReactNode;
}) {
  return (
    <ListItem py={2}>
      <ListIcon as={icon} />
      <Box as="span" pl={2}>
        {children}
      </Box>
    </ListItem>
  );
}

function FolderView({
  folders = [],
  files = [],
  root,
}: {
  folders: string[];
  files: string[];
  root: string;
}) {
  return (
    <>
      <List>
        {folders.map((folder: string) => (
          <Link as={RouterLink} key={folder} to={`${root}${folder}`}>
            <FolderViewItem icon={FolderIcon}>{folder}</FolderViewItem>
          </Link>
        ))}
      </List>
      <List>
        {files.map((file: string) => (
          <Link as={RouterLink} key={file} to={`${root}${file}`}>
            <FolderViewItem icon={FileIcon}>{file}</FolderViewItem>
          </Link>
        ))}
      </List>
    </>
  );
}

function Explore() {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);

  const url = `${API_URL}${path}`;
  const { isLoading, error, data } = useQuery(`explore:${path}`, async () => {
    const res = await fetch(url);
    return res.json();
  });

  const pathFragments = decomposePathIntoFragments(path);

  return (
    <Box p={4}>
      <Breadcrumb>
        {pathFragments.map(({ display, actual }, index) => (
          <BreadcrumbItem isCurrentPage={index === pathFragments.length - 1}>
            <BreadcrumbLink as={RouterLink} to={actual}>
              {display}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Error error={error} />
      {isLoading ? (
        <>Loading...</>
      ) : (
        <FolderView root={path} files={data.files} folders={data.folders} />
      )}
    </Box>
  );
}

export default Explore;
