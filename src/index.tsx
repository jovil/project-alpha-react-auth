import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider } from "./context/Context";
import { UserProvider } from "./context/UserContext";
import { PostsProvider } from "./context/PostsContext";
import { ProductsProvider } from "./context/ProductsContext";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <UserProvider>
        <PostsProvider>
          <ProductsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ProductsProvider>
        </PostsProvider>
      </UserProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
