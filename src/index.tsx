import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
