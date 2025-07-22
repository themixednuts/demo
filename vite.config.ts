import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        "buffers/index": "src/buffers/index.ts", // Add this
      },
      formats: ["es"],
    },
    sourcemap: true,
    rollupOptions: {
      external: ["@bufbuild/protobuf"],
      output: {
        preserveModules: true, // Key setting!
        preserveModulesRoot: "src",
      },
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
