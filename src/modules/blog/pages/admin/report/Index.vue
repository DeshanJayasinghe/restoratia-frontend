<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getBlogReport } from '@/modules/blog/api/report.api.ts'

  const { t, locale } = useI18n()
  const loading = ref(true)

  const summary = ref({
    total_posts: 0,
    total_categories: 0,
    total_tags: 0,
    published_posts: 0,
    draft_posts: 0,
    featured_posts: 0,
  })

  const topCategories = ref<Record<string, any>[]>([])
  const recentPosts = ref<Record<string, any>[]>([])

  async function load () {
    loading.value = true

    try {
      const body = (await getBlogReport()).data.body
      summary.value = body.summary || summary.value
      topCategories.value = body.top_categories || []
      recentPosts.value = body.recent_posts || []
    } finally {
      loading.value = false
    }
  }

  function textValue (value: any): string {
    if (value == null) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      return value[locale.value] || value.en || Object.values(value)[0] || ''
    }

    return String(value)
  }

  onBeforeMount(load)
</script>

<template>
  <PageStateWrapper :loading="loading">
    <VRow>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <div class="text-caption">{{ t('blog::reports.total_posts') }}</div>
            <div class="text-h4 font-weight-bold">{{ summary.total_posts }}</div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <div class="text-caption">{{ t('blog::reports.total_categories') }}</div>
            <div class="text-h4 font-weight-bold">{{ summary.total_categories }}</div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <div class="text-caption">{{ t('blog::reports.total_tags') }}</div>
            <div class="text-h4 font-weight-bold">{{ summary.total_tags }}</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <div class="text-caption">{{ t('blog::reports.published_posts') }}</div>
            <div class="text-h5 font-weight-bold">{{ summary.published_posts }}</div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <div class="text-caption">{{ t('blog::reports.draft_posts') }}</div>
            <div class="text-h5 font-weight-bold">{{ summary.draft_posts }}</div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <div class="text-caption">{{ t('blog::reports.featured_posts') }}</div>
            <div class="text-h5 font-weight-bold">{{ summary.featured_posts }}</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>{{ t('blog::reports.top_categories') }}</VCardTitle>
          <VTable>
            <thead>
              <tr>
                <th>{{ t('blog::reports.category') }}</th>
                <th>{{ t('blog::reports.posts_count') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in topCategories" :key="item.id">
                <td>{{ textValue(item.name) }}</td>
                <td>{{ item.posts_count }}</td>
              </tr>
              <tr v-if="topCategories.length === 0">
                <td class="text-medium-emphasis" colspan="2">{{ t('blog::reports.no_data') }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>{{ t('blog::reports.recent_posts') }}</VCardTitle>
          <VTable>
            <thead>
              <tr>
                <th>{{ t('blog::reports.post') }}</th>
                <th>{{ t('blog::reports.status') }}</th>
                <th>{{ t('blog::reports.created_at') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recentPosts" :key="item.id">
                <td>{{ textValue(item.title) }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.created_at }}</td>
              </tr>
              <tr v-if="recentPosts.length === 0">
                <td class="text-medium-emphasis" colspan="3">{{ t('blog::reports.no_data') }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>
    </VRow>
  </PageStateWrapper>
</template>
