import "@fontsource/geist/400";
import "@fontsource/geist/500";
import "@fontsource/geist/600";
import "@fontsource/caveat/600";
import "@fontsource/geist-mono/400";
import "@fontsource/geist-mono/500";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
