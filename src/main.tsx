import "@fontsource/bricolage-grotesque/600";
import "@fontsource/bricolage-grotesque/700";
import "@fontsource/hanken-grotesk/400";
import "@fontsource/hanken-grotesk/500";
import "@fontsource/hanken-grotesk/600";
import "@fontsource/caveat/600";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
