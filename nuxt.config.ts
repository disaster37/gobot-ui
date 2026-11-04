const backendUrl =
  (
    globalThis as {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process?.env?.BACKEND_URL || 'http://127.0.0.1:4040'

export default defineNuxtConfig({
  ssr: false,

  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  devtools: { enabled: false },

  app: {
    head: {
      title: 'Pond',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: '/backend/api',
      authEndpoint: '/backend/token-auth'
    }
  },

  nitro: {
    devProxy: {
      '/backend': {
        target: backendUrl,
        changeOrigin: true
      }
    }
  },

  compatibilityDate: '2025-01-01'
})
