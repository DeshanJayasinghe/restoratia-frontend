<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('fob-comment::comments.table.name'), value: 'name', sortable: true },
    { title: t('fob-comment::comments.table.email'), value: 'email', sortable: true },
    { title: t('fob-comment::comments.table.content'), value: 'content', sortable: false },
    { title: t('fob-comment::comments.table.status'), value: 'status', sortable: true },
    { title: t('admin::admin.table.created_at'), value: 'created_at', sortable: true },
  ]

  const actions: TableAction[] = [
    { key: 'show' },
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
    api-uri="/v1/comments"
    :bulk-actions="bulkActions"
    :headers="headers"
    module="fob-comment"
    name="comment"
    resource="comments"
  />
</template>
