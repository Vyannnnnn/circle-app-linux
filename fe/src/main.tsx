import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";
import App from "./App.jsx";
import { WebSocketProvider } from "./pages/WebSocketProvider.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
