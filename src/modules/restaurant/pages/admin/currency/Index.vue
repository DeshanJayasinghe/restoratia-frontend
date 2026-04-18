<script lang="ts" setup>
  import type { TableAction, TableHeader } from '@/modules/core/contracts/Table.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const headers: TableHeader[] = [
    { title: t('currency::restaurant_currencies.table.code'), value: 'code', sortable: true },
    { title: t('currency::restaurant_currencies.table.name'), value: 'name', sortable: true },
    { title: t('currency::restaurant_currencies.table.symbol'), value: 'symbol', sortable: true },
    { title: t('currency::restaurant_currencies.table.exchange_rate'), value: 'exchange_rate', sortable: true },
    { title: t('currency::restaurant_currencies.table.is_default'), value: 'is_default', sortable: true },
    { title: t('currency::restaurant_currencies.table.is_active'), value: 'is_active', sortable: true },
  ]
</script>

<template>
  <SmartDataTable
    :actions="[]"
    api-uri="/v1/restaurant-currencies"
    :header-actions="[]"
    :headers="headers"
    module="currency"
    name="restaurant_currency"
    resource="restaurant_currencies"
  />
</template>
