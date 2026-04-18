<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useForm } from '@/modules/core/composables/form.ts'
  import { useChef } from '@/modules/restaurant/composables/chef.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { update, store } = useChef()
  const router = useRouter()

  const form = useForm({
    name: props.item?.name || '',
    email: props.item?.email || '',
    phone: props.item?.phone || '',
    specialization: props.item?.specialization || '',
    bio: props.item?.bio || '',
    is_active: props.item?.is_active ?? true,
  })

  const submit = async () => {
    if (
      !form.loading.value
      && await form.submit(() => props.action === 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.chefs.index' } as unknown as RouteLocationRaw)
    }
  }
</script>

<template>
  <BaseForm
    :action="action"
    :loading="form.loading.value"
    resource="chefs"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.name"
          :error="!!form.errors.value?.name"
          :error-messages="form.errors.value?.name"
          :label="t('chef::attributes.chefs.name')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.specialization"
          :error="!!form.errors.value?.specialization"
          :error-messages="form.errors.value?.specialization"
          :label="t('chef::attributes.chefs.specialization')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.email"
          :error="!!form.errors.value?.email"
          :error-messages="form.errors.value?.email"
          :label="t('chef::attributes.chefs.email')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.phone"
          :error="!!form.errors.value?.phone"
          :error-messages="form.errors.value?.phone"
          :label="t('chef::attributes.chefs.phone')"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="form.state.bio"
          :label="t('chef::attributes.chefs.bio')"
        />
      </VCol>
      <VCol cols="12">
        <VCheckbox
          v-model="form.state.is_active"
          :label="t('chef::attributes.chefs.is_active')"
        />
      </VCol>
    </VRow>
  </BaseForm>
</template>
