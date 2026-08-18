import { addImportsDir, createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "@starter/composables",
    configKey: "starterComposables",
  },
  setup() {
    const { resolve } = createResolver(import.meta.url);
    addImportsDir(resolve("./runtime/composables"));
  },
});
