import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./theme";
import Explore from "./pages/Explore";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/">
            <Explore />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
