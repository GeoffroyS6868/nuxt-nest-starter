<script setup lang="ts">
import { getApiErrorMessage } from "~/utils/apiError";

definePageMeta({
  middleware: [
    function () {
      const user = useUser();
      if (user.value === null) {
        return navigateTo("/login");
      }
    },
  ],
});

const toast = useToast();
const { t } = useI18n();
const user = useUser();
const userName = ref(user.value?.userName ?? "");
const pending = ref(false);

watch(
  user,
  (profile) => {
    if (profile) {
      userName.value = profile.userName;
    }
  },
  { immediate: true },
);

async function onSave() {
  if (pending.value) {
    return;
  }
  pending.value = true;
  try {
    const updated = await updateUserName(userName.value.trim());
    user.value = updated;
    toast.add({ title: t("page.profile.saved"), color: "success" });
  } catch (error) {
    toast.add({
      title: getApiErrorMessage(error) ?? t("page.profile.saveFailed"),
      color: "error",
    });
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div v-if="user" class="flex max-w-sm flex-col gap-4">
    <h1 class="text-2xl font-semibold">{{ $t("page.profile.title") }}</h1>
    <p class="text-muted text-sm">{{ user.email }}</p>
    <UFormField :label="$t('page.authentication.userName')">
      <UInput v-model="userName" class="w-full" />
    </UFormField>
    <UButton :loading="pending" @click="onSave">
      {{ $t("page.profile.save") }}
    </UButton>
  </div>
</template>
