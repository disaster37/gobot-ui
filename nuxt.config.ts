import type { Nuxt } from '@nuxt/schema'

const backendUrl =
  (
    globalThis as {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process?.env?.BACKEND_URL || 'http://127.0.0.1:4040'

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint',
    // Nuxt unconditionally injects `vue-router/volar/sfc-route-blocks` into the
    // generated tsconfig, but npm installs vue-router nested under `nuxt` (its
    // `vite` peer conflicts with Nuxt's own vite), so Volar cannot resolve it
    // from the project root and `vue-tsc` warns on every run. This app uses no
    // `<route>` SFC blocks, so dropping the entry keeps full type fidelity while
    // silencing the warning. Registered last so its `prepare:types` hook runs
    // after Nuxt's.
    function stripUnresolvableVolarRoutePlugin(_options: Record<string, never>, nuxt: Nuxt) {
      nuxt.hook('modules:done', () => {
        nuxt.hook('prepare:types', ({ tsConfig }) => {
          const vueCompilerOptions = tsConfig.vueCompilerOptions
          if (!vueCompilerOptions?.plugins) return
          vueCompilerOptions.plugins = vueCompilerOptions.plugins.filter((plugin) => {
            const name = typeof plugin === 'string' ? plugin : plugin.name
            return name !== 'vue-router/volar/sfc-route-blocks'
          })
        })
      })
    }
  ],

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
