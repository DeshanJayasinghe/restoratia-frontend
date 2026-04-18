<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useTag } from '@/modules/blog/composables/tag.ts'
  import { useForm } from '@/modules/core/composables/form.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { update, store } = useTag()
  const router = useRouter()

  const form = useForm({
    name: props.item?.name || {},
    slug: props.item?.slug || '',
    description: props.item?.description || {},
    is_active: props.item?.is_active || false,
  })

  const submit = async () => {
    if (
      !form.loading.value
      && await form.submit(() => props.action == 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.blog_tags.index' } as unknown as RouteLocationRaw)
    }
  }
</script>

<template>
  <BaseForm
    v-slot="{ currentLanguage }"
    :action="action"
    has-multiple-language
    :loading="form.loading.value"
    resource="blog_tags"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-info-circle" size="20" />
              <span>{{ t('blog::blog_tags.form.cards.tag_information') }}</span>
            </div>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.name[currentLanguage.id]"
                  :error="!!form.errors.value?.[`name.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`name.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_tags.name') + ` ( ${currentLanguage.name} )`"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.slug"
                  :error="!!form.errors.value?.slug"
                  :error-messages="form.errors.value?.slug"
                  :label="t('blog::attributes.blog_tags.slug')"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="form.state.description[currentLanguage.id]"
                  auto-grow
                  :error="!!form.errors.value?.[`description.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`description.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_tags.description') + ` ( ${currentLanguage.name} )`"
                  rows="3"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_active"
                  :label="t('blog::attributes.blog_tags.is_active')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
