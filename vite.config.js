import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { name } from "./package.json";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: name,
    },
  },
});
