<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('blog::blog_categories.table.name'), value: 'name', sortable: true },
    { title: t('blog::blog_categories.table.slug'), value: 'slug', sortable: true },
    { title: t('blog::blog_categories.table.parent'), value: 'parent.name', sortable_key: 'parent_id', sortable: true },
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
    api-uri="/v1/blog-categories"
    :bulk-actions="bulkActions"
    :header-actions="[{ key: 'create' }]"
    :headers="headers"
    module="blog"
    name="category"
    resource="blog_categories"
  />
</template>
