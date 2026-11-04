<script setup lang="ts">
import { ref } from 'vue'
import { loginSchema, type LoginInput } from '~/utils/validation'

const authStore = useAuthStore()
const route = useRoute()

const form = ref<LoginInput>({ username: '', password: '' })
const fieldErrors = ref<string[]>([])

async function authenticate(): Promise<void> {
  const parsed = loginSchema.safeParse(form.value)
  if (!parsed.success) {
    fieldErrors.value = parsed.error.issues.map((issue) => issue.message)
    return
  }
  fieldErrors.value = []
  const success = await authStore.login(parsed.data)
  if (success) {
    const redirect = route.query.redirect
    await navigateTo(typeof redirect === 'string' ? redirect : '/')
  }
}
</script>

<template>
  <div class="col-sm max-w-md">
    <UCard>
      <template #header>
        <span>Login</span>
      </template>

      <UForm :schema="loginSchema" :state="form" @submit="authenticate">
        <UFormField label="Login">
          <UInput v-model="form.username" data-test="username" placeholder="Enter username" />
        </UFormField>
        <UFormField label="Password">
          <UInput
            v-model="form.password"
            data-test="password"
            type="password"
            placeholder="Enter password"
          />
        </UFormField>
        <UButton data-test="login-submit" type="submit" color="primary">Login</UButton>
      </UForm>

      <UAlert
        v-if="authStore.error"
        data-test="login-error"
        class="mt-4"
        color="error"
        :title="authStore.error"
      />
      <div v-for="(message, index) in fieldErrors" :key="index" class="text-error">
        {{ message }}
      </div>
    </UCard>
  </div>
</template>
