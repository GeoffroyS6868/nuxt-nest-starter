import { addComponentsDir, createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "@starter/ui",
    configKey: "starterUi",
  },
  setup() {
    const { resolve } = createResolver(import.meta.url);
    addComponentsDir({
      path: resolve("./runtime/components"),
      pathPrefix: false,
      prefix: "App",
    });
  },
});
