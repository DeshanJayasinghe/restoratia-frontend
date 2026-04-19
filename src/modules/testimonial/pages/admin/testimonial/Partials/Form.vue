<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { onBeforeMount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useTestimonial } from '@/modules/testimonial/composables/testimonial.ts'
  import { useForm } from '@/modules/core/composables/form.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { getFormMeta, update, store } = useTestimonial()
  const router = useRouter()

  const meta = ref<{ statuses: { id: string; name: string }[] }>({ statuses: [] })

  const form = useForm({
    name: props.item?.name ?? '',
    company: props.item?.company ?? '',
    content: props.item?.content ?? '',
    image: props.item?.image ?? '',
    status: props.item?.status?.id ?? props.item?.status ?? 'published',
    is_active: props.item?.is_active ?? true,
  })

  async function submit () {
    if (
      !form.loading.value
      && await form.submit(() => props.action === 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.testimonials.index' } as unknown as RouteLocationRaw)
    }
  }

  onBeforeMount(async () => {
    try {
      const response = (await getFormMeta()).data.body
      meta.value.statuses = response.statuses
    } catch {
      /* Empty */
    }
  })
</script>

<template>
  <BaseForm
    :action="action"
    :loading="form.loading.value"
    resource="testimonials"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-quote" size="20" />
            <span>{{ t('testimonial::testimonials.form.cards.testimonial_information') }}</span>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.name"
                  :error="!!form.errors.value?.name"
                  :error-messages="form.errors.value?.name"
                  :label="t('testimonial::attributes.testimonials.name')"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.company"
                  :error="!!form.errors.value?.company"
                  :error-messages="form.errors.value?.company"
                  :label="t('testimonial::attributes.testimonials.company')"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="form.state.content"
                  :error="!!form.errors.value?.content"
                  :error-messages="form.errors.value?.content"
                  :label="t('testimonial::attributes.testimonials.content')"
                  rows="4"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.image"
                  :error="!!form.errors.value?.image"
                  :error-messages="form.errors.value?.image"
                  :label="t('testimonial::attributes.testimonials.image')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VSelect
                  v-model="form.state.status"
                  :error="!!form.errors.value?.status"
                  :error-messages="form.errors.value?.status"
                  item-title="name"
                  item-value="id"
                  :items="meta.statuses"
                  :label="t('testimonial::attributes.testimonials.status')"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_active"
                  :label="t('testimonial::attributes.testimonials.is_active')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
