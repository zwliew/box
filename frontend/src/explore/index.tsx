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
  useTheme,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useQuery } from "react-query";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { FileIcon, FolderIcon } from "./icons";
import Api from "./api";
import { FileDetails, FolderDetails, PathFragment } from "./interfaces";

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
  data,
  root,
  handleFileClick,
}: {
  data?: FolderDetails;
  root: string;
  handleFileClick: (path: string) => void;
}) {
  const { folders = [], files = [] } = data ?? {};
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
  isOpen,
  onClose,
}: {
  path?: string;
  data?: FileDetails;
  isLoading: boolean;
  error: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  function camelCaseToWords(camelCased: string) {
    const REGEX = /([^A-Z])([A-Z])/g;
    const pascalCased = camelCased[0].toUpperCase() + camelCased.slice(1);
    return pascalCased.replaceAll(REGEX, "$1 $2");
  }

  let content;
  if (!path) {
    content = null;
  } else if (isLoading) {
    return <>Loading...</>;
  } else if (error) {
    content = <Error error={error} />;
  } else if (data) {
    content = (
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
                  <Text as="b">{camelCaseToWords(k)}</Text>: {v.toString()}
                </ListItem>
              );
            })}
          </List>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={() => Api.remove(path)}>
            Delete
          </Button>
          <Link
            isExternal
            href={data.url}
            _hover={{ textDecoration: "none" }}
            ml={4}
          >
            <Button>Download</Button>
          </Link>
        </DrawerFooter>
      </>
    );
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          {content}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

function useFileDetails() {
  const [path, setPath] = useState<string | undefined>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isLoading, error, data } = useQuery(
    ["file", path],
    async () => {
      if (!path) return;

      const data = await Api.view(path);
      return {
        ...data,
        lastModified: new Date(data.lastModified),
        size: `${data.size} bytes`,
      };
    },
    {
      enabled: !!path,
    }
  );
  return {
    onOpen,
    onClose,
    isOpen,
    path,
    setPath,
    isLoading,
    error,
    data,
  };
}

function FolderHeader({
  fragments,
}: {
  fragments: { display: string; actual: string }[];
}) {
  return (
    <Breadcrumb>
      {fragments.map(({ display, actual }, index) => (
        <BreadcrumbItem
          key={actual}
          isCurrentPage={index === fragments.length - 1}
        >
          <BreadcrumbLink as={RouterLink} to={actual}>
            {display}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}

function useFolder() {
  function normalizePath(path: string): string {
    path = path.replaceAll(/\/+/g, "/");
    if (!path.endsWith("/")) {
      path = `${path}/`;
    }
    return path;
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

  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const { isLoading, error, data } = useQuery(path, () => Api.list(path));
  const fragments = decomposePathIntoFragments(path);
  return { isLoading, error, data, path, fragments };
}

function FileUpload({ path }: { path: string }) {
  async function handleDrop(files: File[]) {
    console.log(files);
    const uploads = files.map((file) => Api.upload(path, file));
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles: 1,
  });
  const theme = useTheme();

  return (
    <Box
      {...getRootProps()}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      minHeight={20}
      _hover={{
        cursor: "pointer",
        backgroundColor: theme.colors.brand[50],
      }}
    >
      <input {...getInputProps()} />
      <Text>
        {isDragActive
          ? "Drop the files here..."
          : "Drag and drop some files here, or click to select file"}
      </Text>
    </Box>
  );
}

function Explore() {
  const fileDetails = useFileDetails();
  const { path, fragments, isLoading, error, data } = useFolder();
  function handleFileClick(path: string) {
    fileDetails.onOpen();
    fileDetails.setPath(path);
  }

  return (
    <>
      <Box p={4} minHeight="100vh">
        <FolderHeader fragments={fragments} />
        <Error error={error} />
        {isLoading ? (
          <>Loading...</>
        ) : (
          <FolderView
            handleFileClick={handleFileClick}
            root={path}
            data={data}
          />
        )}
        <FileUpload path={path} />
      </Box>
      <FileDetailsDrawer {...fileDetails} />
    </>
  );
}

export default Explore;
