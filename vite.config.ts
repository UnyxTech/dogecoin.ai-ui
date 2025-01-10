/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      nodePolyfills({
        crypto: true,
        stream: true,
        buffer: true,
        process: true,
      }),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ".vitest/setup",
      include: ["**/test.{ts,tsx}"],
    },
    server: {
      port: 4090,
      host: "0.0.0.0",
    },
  };
});
