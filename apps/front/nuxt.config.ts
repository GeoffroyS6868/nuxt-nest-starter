const apiBase = process.env.NUXT_PUBLIC_API_BASE || process.env.API_BASE || "http://localhost:4001";

function apiOrigin(base: string): string | undefined {
  try {
    return new URL(base).origin;
  } catch {
    return undefined;
  }
}

const apiOriginUrl = apiOrigin(apiBase);

const apiHeadLinks = apiOriginUrl
  ? ([
      { rel: "preconnect", href: apiOriginUrl, crossorigin: "anonymous" },
      { rel: "dns-prefetch", href: apiOriginUrl },
    ] as const)
  : [];

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Nuxt Nest Starter",
      link: [...apiHeadLinks],
    },
  },

  compatibilityDate: "2026-07-01",

  css: ["~/assets/css/main.css"],

  devServer: {
    port: 4000,
  },

  devtools: { enabled: false },

  i18n: {
    langDir: "locales",
    locales: [
      { code: "en", language: "en", file: "en-US.json", name: "English" },
      { code: "fr", language: "fr", file: "fr-FR.json", name: "Français" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: "en",
    },
    compilation: {
      strictMessage: false,
    },
  },

  modules: ["@starter/composables", "@starter/ui", "evlog/nuxt", "@nuxtjs/i18n", "@nuxt/ui"],

  evlog: {
    env: {
      service: "starter-front",
    },
  },

  $production: {
    evlog: {
      console: false,
      sampling: {
        rates: {
          info: 5,
          warn: 50,
          debug: 0,
          error: 100,
        },
        keep: [{ duration: 1000 }, { status: 400 }],
      },
    },
  },

  nitro: {
    preset: "node-server",
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },

  ssr: true,

  typescript: {
    typeCheck: false,
  },

  routeRules: {
    "/login": { appLayout: "login" },
    "/fr/login": { appLayout: "login" },
    "/register": { appLayout: "login" },
    "/fr/register": { appLayout: "login" },
  },

  runtimeConfig: {
    public: {
      apiBase,
      googleAuth: process.env.NUXT_PUBLIC_GOOGLE_AUTH === "true",
    },
  },

  experimental: {
    writeEarlyHints: false,
    viewTransition: true,
  },
});
