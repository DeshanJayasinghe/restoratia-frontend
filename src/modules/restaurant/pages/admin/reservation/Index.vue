<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('reservation::reservations.table.name'), value: 'name', sortable: true },
    { title: t('reservation::reservations.table.email'), value: 'email', sortable: true },
    { title: t('reservation::reservations.table.phone'), value: 'phone', sortable: true },
    { title: t('reservation::reservations.table.reservation_date'), value: 'reservation_date', sortable: true },
    { title: t('reservation::reservations.table.reservation_time'), value: 'reservation_time', sortable: true },
    { title: t('reservation::reservations.table.number_of_guests'), value: 'number_of_guests', sortable: true },
    { title: t('reservation::reservations.table.status'), value: 'status', sortable: true },
    { title: t('admin::admin.table.activation'), value: 'is_active', sortable: true },
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
    api-uri="/v1/reservations"
    :bulk-actions="bulkActions"
    :header-actions="[{ key: 'create' }]"
    :headers="headers"
    module="reservation"
    name="reservation"
    resource="reservations"
  />
</template>
