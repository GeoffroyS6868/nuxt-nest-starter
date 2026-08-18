<script lang="ts" setup>
import { getApiErrorMessage } from "~/utils/apiError";

const config = useRuntimeConfig();
const toast = useToast();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

interface LoginState {
  email: string;
  password: string;
}

const state = reactive<LoginState>({
  email: "",
  password: "",
});

const pending = ref(false);

function safeRedirectTarget(): string {
  const raw = route.query.redirect;
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return localePath("/");
  }
  return raw;
}

onMounted(async () => {
  const user = useUser();

  if (user.value === undefined) {
    const profile = await getProfile();
    user.value = profile;
  }

  if (!user.value) {
    return;
  }

  await navigateTo(safeRedirectTarget());
});

async function onSubmit(event: Event) {
  event.preventDefault();
  if (pending.value) {
    return;
  }

  pending.value = true;

  try {
    const res = await $fetch<{ success?: boolean }>(`${config.public.apiBase}/auth/login`, {
      method: "POST",
      body: {
        email: state.email.trim(),
        password: state.password,
      },
      credentials: "include",
    });

    if (res.success === true) {
      const user = useUser();
      user.value = await getProfile();
      await navigateTo(safeRedirectTarget());
      return;
    }

    toast.add({
      title: t("page.authentication.errors.loginFailed"),
      color: "error",
    });
  } catch (error) {
    toast.add({
      title: getApiErrorMessage(error) ?? t("page.authentication.errors.loginFailed"),
      color: "error",
    });
  } finally {
    pending.value = false;
  }
}

function googleLogin() {
  window.location.href = `${config.public.apiBase}/auth/google`;
}
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center px-4">
    <div class="border-default w-full max-w-sm rounded-lg border p-6">
      <h1 class="text-2xl font-semibold">{{ $t("page.authentication.login") }}</h1>
      <p class="text-muted mt-2 mb-6 text-sm">
        {{ $t("page.authentication.noAccount") }}
        <ULink class="text-primary" :to="$localePath('/register')">
          {{ $t("page.authentication.register") }}
        </ULink>
      </p>

      <form class="flex flex-col gap-3" @submit="onSubmit">
        <UFormField :label="$t('page.authentication.email')">
          <UInput v-model="state.email" type="email" autocomplete="email" class="w-full" />
        </UFormField>
        <UFormField :label="$t('page.authentication.password')">
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" :loading="pending" block>
          {{ $t("page.authentication.login") }}
        </UButton>
      </form>

      <UButton
        v-if="config.public.googleAuth"
        class="mt-3"
        variant="outline"
        color="neutral"
        block
        @click="googleLogin"
      >
        {{ $t("page.authentication.google") }}
      </UButton>
    </div>
  </div>
</template>
