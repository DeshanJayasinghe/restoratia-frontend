<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { onBeforeMount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useCustomField } from '@/modules/contact/composables/custom-field.ts'
  import { useForm } from '@/modules/core/composables/form.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { getFormMeta, update, store } = useCustomField()
  const router = useRouter()

  const meta = ref<{ types: { id: string; name: string }[] }>({ types: [] })

  const typesRequiringOptions = ['dropdown', 'checkbox', 'radio']

  const form = useForm({
    name: props.item?.name ?? '',
    type: props.item?.type ?? 'text',
    required: props.item?.required ?? false,
    placeholder: props.item?.placeholder ?? '',
    order: props.item?.order ?? 999,
    status: props.item?.status ?? 'published',
    options: props.item?.options ?? [],
  })

  function addOption () {
    form.state.options = [...form.state.options, { label: '', value: '', order: form.state.options.length * 10 }]
  }

  function removeOption (index: number) {
    form.state.options = form.state.options.filter((_: any, i: number) => i !== index)
  }

  async function submit () {
    if (
      !form.loading.value
      && await form.submit(() => props.action === 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.contact_custom_fields.index' } as unknown as RouteLocationRaw)
    }
  }

  onBeforeMount(async () => {
    try {
      const response = (await getFormMeta()).data.body
      meta.value.types = response.types
    } catch {
      /* Empty */
    }
  })
</script>

<template>
  <BaseForm
    :action="action"
    :loading="form.loading.value"
    resource="contact_custom_fields"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-forms" size="20" />
            <span>{{ t('contact::custom_fields.form.cards.field_information') }}</span>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.name"
                  :error="!!form.errors.value?.name"
                  :error-messages="form.errors.value?.name"
                  :label="t('contact::attributes.custom_fields.name')"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VSelect
                  v-model="form.state.type"
                  :error="!!form.errors.value?.type"
                  :error-messages="form.errors.value?.type"
                  item-title="name"
                  item-value="id"
                  :items="meta.types"
                  :label="t('contact::attributes.custom_fields.type')"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.placeholder"
                  :error="!!form.errors.value?.placeholder"
                  :error-messages="form.errors.value?.placeholder"
                  :label="t('contact::attributes.custom_fields.placeholder')"
                />
              </VCol>
              <VCol cols="12" md="3">
                <VTextField
                  v-model="form.state.order"
                  :error="!!form.errors.value?.order"
                  :error-messages="form.errors.value?.order"
                  :label="t('contact::attributes.custom_fields.order')"
                  type="number"
                />
              </VCol>
              <VCol cols="12" md="3">
                <VSelect
                  v-model="form.state.status"
                  :error="!!form.errors.value?.status"
                  :error-messages="form.errors.value?.status"
                  :items="[{ id: 'published', title: t('contact::enums.custom_field_status.published') }, { id: 'unpublished', title: t('contact::enums.custom_field_status.unpublished') }]"
                  item-title="title"
                  item-value="id"
                  :label="t('contact::attributes.custom_fields.status')"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.required"
                  :label="t('contact::attributes.custom_fields.required')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <VCard v-if="typesRequiringOptions.includes(form.state.type)" class="mt-4">
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-list" size="20" />
              <span>{{ t('contact::custom_fields.form.cards.options') }}</span>
            </div>
            <VBtn size="small" variant="tonal" @click="addOption">
              {{ t('admin::admin.add') }}
            </VBtn>
          </VCardTitle>
          <VCardText>
            <VRow
              v-for="(option, index) in form.state.options"
              :key="index"
              align="center"
            >
              <VCol cols="12" md="4">
                <VTextField
                  v-model="option.label"
                  :error="!!form.errors.value?.[`options.${index}.label`]"
                  :error-messages="form.errors.value?.[`options.${index}.label`]"
                  :label="t('contact::attributes.custom_fields.options.*.label')"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VTextField
                  v-model="option.value"
                  :error="!!form.errors.value?.[`options.${index}.value`]"
                  :error-messages="form.errors.value?.[`options.${index}.value`]"
                  :label="t('contact::attributes.custom_fields.options.*.value')"
                />
              </VCol>
              <VCol cols="12" md="3">
                <VTextField
                  v-model="option.order"
                  :label="t('contact::attributes.custom_fields.options.*.order')"
                  type="number"
                />
              </VCol>
              <VCol cols="12" md="1">
                <VBtn color="error" icon size="small" variant="text" @click="removeOption(index)">
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </VCol>
            </VRow>
            <div v-if="!form.state.options.length" class="text-medium-emphasis text-body-2">
              {{ t('admin::admin.no_records') }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
