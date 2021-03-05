import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import Explore from "./explore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Switch>
            <Route path="/">
              <Explore />
            </Route>
          </Switch>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
