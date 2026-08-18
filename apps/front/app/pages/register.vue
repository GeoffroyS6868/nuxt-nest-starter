<script lang="ts" setup>
import { getApiErrorMessage } from "~/utils/apiError";

const config = useRuntimeConfig();
const toast = useToast();
const { t } = useI18n();
const localePath = useLocalePath();

interface RegisterState {
  email: string;
  userName: string;
  password: string;
}

const state = reactive<RegisterState>({
  email: "",
  userName: "",
  password: "",
});

const pending = ref(false);

onMounted(async () => {
  const user = useUser();
  if (user.value === undefined) {
    user.value = await getProfile();
  }
  if (user.value) {
    await navigateTo(localePath("/"));
  }
});

async function onSubmit(event: Event) {
  event.preventDefault();
  if (pending.value) {
    return;
  }

  pending.value = true;

  try {
    const res = await $fetch<{ success?: boolean }>(`${config.public.apiBase}/auth/signup`, {
      method: "POST",
      body: {
        email: state.email.trim(),
        userName: state.userName.trim(),
        password: state.password,
      },
      credentials: "include",
    });

    if (res.success === true) {
      const user = useUser();
      user.value = await getProfile();
      await navigateTo(localePath("/"));
      return;
    }

    toast.add({
      title: t("page.authentication.errors.signupFailed"),
      color: "error",
    });
  } catch (error) {
    toast.add({
      title: getApiErrorMessage(error) ?? t("page.authentication.errors.signupFailed"),
      color: "error",
    });
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center px-4">
    <div class="border-default w-full max-w-sm rounded-lg border p-6">
      <h1 class="text-2xl font-semibold">{{ $t("page.authentication.register") }}</h1>
      <p class="text-muted mt-2 mb-6 text-sm">
        {{ $t("page.authentication.hasAccount") }}
        <ULink class="text-primary" :to="$localePath('/login')">
          {{ $t("page.authentication.login") }}
        </ULink>
      </p>

      <form class="flex flex-col gap-3" @submit="onSubmit">
        <UFormField :label="$t('page.authentication.userName')">
          <UInput v-model="state.userName" autocomplete="username" class="w-full" />
        </UFormField>
        <UFormField :label="$t('page.authentication.email')">
          <UInput v-model="state.email" type="email" autocomplete="email" class="w-full" />
        </UFormField>
        <UFormField :label="$t('page.authentication.password')">
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" :loading="pending" block>
          {{ $t("page.authentication.register") }}
        </UButton>
      </form>
    </div>
  </div>
</template>
