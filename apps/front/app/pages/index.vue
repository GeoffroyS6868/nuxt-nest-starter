<script setup lang="ts">
const user = useUser();
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-semibold tracking-tight">
      {{ $t("page.home.title") }}
    </h1>
    <p class="text-muted max-w-xl">
      {{ $t("page.home.subtitle") }}
    </p>
    <p v-if="user" class="text-sm">
      {{ $t("page.home.signedInAs", { name: user.userName }) }}
    </p>
  </div>
</template>
