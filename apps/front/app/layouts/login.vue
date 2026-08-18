<template>
  <div class="relative flex min-h-svh flex-col">
    <UButton
      icon="lucide:x"
      to="/"
      variant="ghost"
      color="neutral"
      class="absolute top-4 left-4"
      size="lg"
    />
    <slot />
  </div>
</template>
