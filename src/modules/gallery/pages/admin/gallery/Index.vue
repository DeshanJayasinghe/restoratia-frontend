<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('gallery::galleries.table.name'), value: 'name', sortable: true },
    { title: t('gallery::galleries.table.is_featured'), value: 'is_featured', sortable: true },
    { title: t('gallery::galleries.table.order'), value: 'order', sortable: true },
    { title: t('admin::admin.table.activation'), value: 'is_active', sortable: true },
    { title: t('gallery::galleries.table.status'), value: 'status', sortable: true },
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
    api-uri="/v1/galleries"
    :bulk-actions="bulkActions"
    :header-actions="[{ key: 'create' }]"
    :headers="headers"
    module="gallery"
    name="gallery"
    resource="galleries"
  />
</template>
