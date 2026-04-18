<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useCategory } from '@/modules/blog/composables/category.ts'
  import { useForm } from '@/modules/core/composables/form.ts'
  import { http } from '@/modules/core/api/http.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { update, store } = useCategory()
  const router = useRouter()

  const form = useForm({
    name: props.item?.name || {},
    slug: props.item?.slug || '',
    description: props.item?.description || {},
    parent_id: props.item?.parent?.id || null,
    is_active: props.item?.is_active || false,
  })

  const meta = ref({ categories: [] })

  onBeforeMount(async () => {
    try {
      const response = (await http.get('/v1/blog-categories', { params: { per_page: 500 } })).data.body
      meta.value.categories = response.data?.map((item: Record<string, any>) => ({ id: item.id, name: item.name })) || []
    } catch {
    /* Empty */
    }
  })

  const submit = async () => {
    if (
      !form.loading.value
      && await form.submit(() => props.action == 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.blog_categories.index' } as unknown as RouteLocationRaw)
    }
  }
</script>

<template>
  <BaseForm
    v-slot="{ currentLanguage }"
    :action="action"
    has-multiple-language
    :loading="form.loading.value"
    resource="blog_categories"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-info-circle" size="20" />
              <span>{{ t('blog::blog_categories.form.cards.category_information') }}</span>
            </div>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.name[currentLanguage.id]"
                  :error="!!form.errors.value?.[`name.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`name.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_categories.name') + ` ( ${currentLanguage.name} )`"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.state.slug"
                  :error="!!form.errors.value?.slug"
                  :error-messages="form.errors.value?.slug"
                  :label="t('blog::attributes.blog_categories.slug')"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VSelect
                  v-model="form.state.parent_id"
                  clearable
                  :error="!!form.errors.value?.parent_id"
                  :error-messages="form.errors.value?.parent_id"
                  item-title="name"
                  item-value="id"
                  :items="meta.categories"
                  :label="t('blog::attributes.blog_categories.parent_id')"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="form.state.description[currentLanguage.id]"
                  auto-grow
                  :error="!!form.errors.value?.[`description.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`description.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_categories.description') + ` ( ${currentLanguage.name} )`"
                  rows="3"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_active"
                  :label="t('blog::attributes.blog_categories.is_active')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
