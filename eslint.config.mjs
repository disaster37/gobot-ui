import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.dagger/**', 'coverage/**', '.output/**', 'dist/**', 'playwright-report/**']
})
