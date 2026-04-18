<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import SinglePicker from '@/modules/media/components/SinglePicker.vue'
  import { usePost } from '@/modules/blog/composables/post.ts'
  import { useForm } from '@/modules/core/composables/form.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { getFormMeta, update, store } = usePost()
  const router = useRouter()

  const form = useForm({
    title: props.item?.title || {},
    slug: props.item?.slug || '',
    description: props.item?.description || {},
    content: props.item?.content || {},
    status: props.item?.status?.id || 'draft',
    author_id: props.item?.author?.id || null,
    categories: (props.item?.categories || []).map((item: Record<string, any>) => item.id),
    tags: (props.item?.tags || []).map((item: Record<string, any>) => item.id),
    is_featured: props.item?.is_featured || false,
    published_at: props.item?.published_at || null,
    is_active: props.item?.is_active || false,
    files: {
      thumbnail: props.item?.thumbnail?.id || null,
    },
  })

  const meta = ref({
    statuses: [],
    authors: [],
    categories: [],
    tags: [],
  })

  const submit = async () => {
    if (
      !form.loading.value
      && await form.submit(() => props.action == 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.blog_posts.index' } as unknown as RouteLocationRaw)
    }
  }

  onBeforeMount(async () => {
    try {
      const response = (await getFormMeta()).data.body
      meta.value.statuses = response.statuses
      meta.value.authors = response.authors
      meta.value.categories = response.categories
      meta.value.tags = response.tags
    } catch {
    /* Empty */
    }
  })
</script>

<template>
  <BaseForm
    v-slot="{ currentLanguage }"
    :action="action"
    has-multiple-language
    :loading="form.loading.value"
    resource="blog_posts"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-info-circle" size="20" />
              <span>{{ t('blog::blog_posts.form.cards.general_information') }}</span>
            </div>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.title[currentLanguage.id]"
                  :error="!!form.errors.value?.[`title.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`title.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_posts.title') + ` ( ${currentLanguage.name} )`"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.slug"
                  :error="!!form.errors.value?.slug"
                  :error-messages="form.errors.value?.slug"
                  :label="t('blog::attributes.blog_posts.slug')"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="form.state.description[currentLanguage.id]"
                  auto-grow
                  :error="!!form.errors.value?.[`description.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`description.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_posts.description') + ` ( ${currentLanguage.name} )`"
                  rows="3"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="form.state.content[currentLanguage.id]"
                  auto-grow
                  :error="!!form.errors.value?.[`content.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`content.${currentLanguage.id}`]"
                  :label="t('blog::attributes.blog_posts.content') + ` ( ${currentLanguage.name} )`"
                  rows="8"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-settings" size="20" />
              <span>{{ t('blog::blog_posts.form.cards.relations') }}</span>
            </div>
          </VCardTitle>
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
                  :label="t('blog::attributes.blog_posts.status')"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.state.author_id"
                  clearable
                  :error="!!form.errors.value?.author_id"
                  :error-messages="form.errors.value?.author_id"
                  item-title="name"
                  item-value="id"
                  :items="meta.authors"
                  :label="t('blog::attributes.blog_posts.author_id')"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.state.categories"
                  chips
                  clearable
                  :error="!!form.errors.value?.categories"
                  :error-messages="form.errors.value?.categories"
                  item-title="name"
                  item-value="id"
                  :items="meta.categories"
                  :label="t('blog::attributes.blog_posts.categories')"
                  multiple
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.state.tags"
                  chips
                  clearable
                  :error="!!form.errors.value?.tags"
                  :error-messages="form.errors.value?.tags"
                  item-title="name"
                  item-value="id"
                  :items="meta.tags"
                  :label="t('blog::attributes.blog_posts.tags')"
                  multiple
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.published_at"
                  :error="!!form.errors.value?.published_at"
                  :error-messages="form.errors.value?.published_at"
                  :label="t('blog::attributes.blog_posts.published_at')"
                  type="datetime-local"
                />
              </VCol>
              <VCol cols="12">
                <SinglePicker v-model="form.state.files.thumbnail" :label="t('blog::attributes.blog_posts.files.thumbnail')"
                  :media="item?.thumbnail" mime="image" />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_featured"
                  :label="t('blog::attributes.blog_posts.is_featured')"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_active"
                  :label="t('blog::attributes.blog_posts.is_active')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
