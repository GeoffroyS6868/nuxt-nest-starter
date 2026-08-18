export default defineAppConfig({
  title: "Nuxt Nest Starter",
  toaster: {
    position: "bottom-right" as const,
    expand: true,
    duration: 5000,
  },
  ui: {
    colors: {
      primary: "blue",
      neutral: "ink",
    },
  },
});
