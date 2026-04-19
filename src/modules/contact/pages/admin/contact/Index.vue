<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('contact::contacts.table.name'), value: 'name', sortable: true },
    { title: t('contact::contacts.table.email'), value: 'email', sortable: true },
    { title: t('contact::contacts.table.phone'), value: 'phone', sortable: false },
    { title: t('contact::contacts.table.subject'), value: 'subject', sortable: false },
    { title: t('contact::contacts.table.status'), value: 'status', sortable: true },
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
    api-uri="/v1/contacts"
    :bulk-actions="bulkActions"
    :headers="headers"
    module="contact"
    name="contact"
    resource="contacts"
  />
</template>
