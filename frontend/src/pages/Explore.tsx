import { Box, Heading, List, ListIcon, ListItem } from "@chakra-ui/react";
import React from "react";
import { useLocation } from "react-router-dom";
import FolderIcon from "../components/icons/FolderIcon";

function Explore() {
  const { pathname } = useLocation();
  const folders = ["asdf/", "abc/"];
  const folderListItems = folders.map((folder) => (
    <ListItem>
      <ListIcon as={FolderIcon} />
      {folder}
    </ListItem>
  ));

  return (
    <div>
      <Box>
        <Heading>{pathname}</Heading>
      </Box>
      <Box>
        <List>{folderListItems}</List>
      </Box>
    </div>
  );
}

export default Explore;
