import "@fontsource/besley/800.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
