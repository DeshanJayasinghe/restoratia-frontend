<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('blog::blog_posts.table.thumbnail'), value: 'thumbnail', sortable: false },
    { title: t('blog::blog_posts.table.title'), value: 'title', sortable: true },
    { title: t('blog::blog_posts.table.slug'), value: 'slug', sortable: true },
    { title: t('blog::blog_posts.table.author'), value: 'author.name', sortable_key: 'author_id', sortable: true },
    { title: t('blog::blog_posts.table.status'), value: 'status', sortable: true },
    { title: t('blog::blog_posts.table.featured'), value: 'is_featured', sortable: true },
    { title: t('admin::admin.table.activation'), value: 'is_active', sortable: true },
    { title: t('admin::admin.table.created_at'), value: 'created_at', sortable: true },
    { title: t('admin::admin.table.updated_at'), value: 'updated_at', sortable: true },
  ]

  const actions: TableAction[] = [
    { key: 'edit' },
    {
      key: 'destroy',
      confirm: {
        message: t('admin::admin.delete.confirmation_message'),
        confirmButtonText: t('admin::admin.delete.confirm_button_text'),
      },
    },
  ]

  const bulkActions: TableAction[] = [
    {
      key: 'destroy',
      confirm: {
        message: t('admin::admin.delete.confirmation_message'),
        confirmButtonText: t('admin::admin.delete.confirm_button_text'),
      },
    },
  ]
</script>

<template>
  <SmartDataTable
    :actions="actions"
    api-uri="/v1/blog-posts"
    :bulk-actions="bulkActions"
    :header-actions="[{ key: 'create' }]"
    :headers="headers"
    module="blog"
    name="post"
    resource="blog_posts"
  />
</template>
