import {
  Box,
  List,
  ListIcon,
  ListItem,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Drawer,
  Text,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
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
  handleFileClick,
}: {
  folders: string[];
  files: string[];
  root: string;
  handleFileClick: (path: string) => void;
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
          <Link key={file} onClick={() => handleFileClick(`${root}${file}`)}>
            <FolderViewItem icon={FileIcon}>{file}</FolderViewItem>
          </Link>
        ))}
      </List>
    </>
  );
}

function FileDetailsDrawer({
  path,
  data,
  isLoading,
  error,
}: {
  path?: string;
  data: Record<string, any>;
  isLoading: boolean;
  error: any;
}) {
  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!path) {
    return null;
  }

  return (
    <>
      <DrawerHeader>{path.slice(path.lastIndexOf("/") + 1)}</DrawerHeader>
      <DrawerBody>
        <List>
          {Object.entries(data).map(([k, v]) => {
            if (k === "url") {
              return null;
            }
            return (
              <ListItem key={k}>
                <Text as="b">{k}</Text>: {v}
              </ListItem>
            );
          })}
        </List>
      </DrawerBody>
      <DrawerFooter>
        <Link rel="noopener noreferrer" target="_blank" href={data.url}>
          <Button>Download</Button>
        </Link>
      </DrawerFooter>
    </>
  );
}

function Explore() {
  const [file, setFile] = useState<string | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const url = `${API_URL}${path}`;

  const { isLoading, error, data } = useQuery(path, async () => {
    const res = await fetch(url);
    return res.json();
  });
  const {
    isLoading: isFileLoading,
    error: fileError,
    data: fileData,
  } = useQuery(
    ["file", file],
    async () => {
      const res = await fetch(`${API_URL}${file}`);
      const data = await res.json();
      if (data.hasOwnProperty("lastModified")) {
        data.lastModified = new Date(data.lastModified).toString();
      }
      if (data.hasOwnProperty("size")) {
        data.size = `${data.size} bytes`;
      }
      return data;
    },
    {
      enabled: !!file,
    }
  );

  const pathFragments = decomposePathIntoFragments(path);

  function handleFileClick(path: string) {
    setFile(path);
    onOpen();
  }

  return (
    <>
      <Box p={4}>
        <Breadcrumb>
          {pathFragments.map(({ display, actual }, index) => (
            <BreadcrumbItem
              key={actual}
              isCurrentPage={index === pathFragments.length - 1}
            >
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
          <FolderView
            handleFileClick={handleFileClick}
            root={path}
            files={data.files}
            folders={data.folders}
          />
        )}
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <FileDetailsDrawer
              path={file}
              data={fileData}
              isLoading={isFileLoading}
              error={fileError}
            />
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default Explore;
