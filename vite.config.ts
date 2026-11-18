import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Connect } from "vite";

/** Serve the built RescharAI demo at /rescharai-demo/ (Vite would answer with the site's own index.html). */
const demoIndex: Connect.NextHandleFunction = (req, _res, next) => {
  if (req.url && /^\/rescharai-demo\/?(\?.*)?$/.test(req.url)) req.url = "/rescharai-demo/index.html";
  next();
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "rescharai-demo-index",
      configureServer: (server) => void server.middlewares.use(demoIndex),
      configurePreviewServer: (server) => void server.middlewares.use(demoIndex),
    },
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
