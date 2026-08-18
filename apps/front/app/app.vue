<script setup lang="ts">
import { en, fr } from "@nuxt/ui/locale";
import { uiComponentDefaults } from "~/config/ui-component-defaults";

const appConfig = useAppConfig();
const { locale } = useI18n();

const uiLocale = computed(() => (locale.value.toLowerCase().startsWith("fr") ? fr : en));

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
  htmlAttrs: {
    lang: computed(() => (locale.value === "fr" ? "fr" : "en")),
  },
});
</script>

<template>
  <UApp :toaster="appConfig.toaster" :locale="uiLocale" :scroll-body="false">
    <UTheme :props="uiComponentDefaults">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UTheme>
  </UApp>
</template>
