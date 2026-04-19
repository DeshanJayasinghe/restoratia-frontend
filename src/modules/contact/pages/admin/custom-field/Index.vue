<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('contact::custom_fields.table.name'), value: 'name', sortable: true },
    { title: t('contact::custom_fields.table.type'), value: 'type', sortable: true },
    { title: t('contact::custom_fields.table.required'), value: 'required', sortable: false },
    { title: t('contact::custom_fields.table.order'), value: 'order', sortable: true },
    { title: t('contact::custom_fields.table.status'), value: 'status', sortable: true },
    { title: t('admin::admin.table.created_at'), value: 'created_at', sortable: true },
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
    api-uri="/v1/contact-custom-fields"
    :bulk-actions="bulkActions"
    :header-actions="[{ key: 'create' }]"
    :headers="headers"
    module="contact"
    name="contact_custom_field"
    resource="contact_custom_fields"
  />
</template>
