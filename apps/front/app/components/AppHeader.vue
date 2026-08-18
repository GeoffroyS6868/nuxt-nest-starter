<script setup lang="ts">
const { locale, setLocale } = useI18n();
const localePath = useLocalePath();
const user = useUser();

async function onLogout() {
  await logout();
}

async function toggleLocale() {
  await setLocale(locale.value === "fr" ? "en" : "fr");
}
</script>

<template>
  <header class="border-default border-b">
    <div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
      <NuxtLink :to="localePath('/')" class="font-semibold">
        {{ $t("common.appName") }}
      </NuxtLink>
      <nav class="flex items-center gap-2">
        <UButton variant="ghost" color="neutral" size="sm" @click="toggleLocale">
          {{ locale === "fr" ? "EN" : "FR" }}
        </UButton>
        <template v-if="user">
          <UButton :to="localePath('/profile')" variant="ghost" color="neutral" size="sm">
            {{ $t("nav.profile") }}
          </UButton>
          <UButton variant="ghost" color="neutral" size="sm" @click="onLogout">
            {{ $t("nav.logout") }}
          </UButton>
        </template>
        <template v-else-if="user === null">
          <UButton :to="localePath('/login')" variant="ghost" color="neutral" size="sm">
            {{ $t("nav.login") }}
          </UButton>
          <UButton :to="localePath('/register')" size="sm">
            {{ $t("nav.register") }}
          </UButton>
        </template>
      </nav>
    </div>
  </header>
</template>
