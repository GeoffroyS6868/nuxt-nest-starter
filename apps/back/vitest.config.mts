import { fileURLToPath } from "node:url";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [swc.vite({ tsconfigFile: "./tsconfig.spec.json", module: { type: "es6" } })],
  resolve: {
    alias: {
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts"],
    setupFiles: ["./test/setup.ts"],
    maxWorkers: process.env.CI ? "50%" : 2,
    coverage: {
      provider: "v8",
      include: [
        "src/auth/auth.guard.ts",
        "src/auth/auth.service.ts",
        "src/common/environment/cors-origins.ts",
        "src/common/environment/secrets.ts",
        "src/user/user.service.ts",
        "src/user/domain/staff-access.ts",
      ],
    },
  },
});
