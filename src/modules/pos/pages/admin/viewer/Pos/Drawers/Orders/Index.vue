<script lang="ts" setup>
  import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import { useAuth } from '@/modules/auth/composables/auth.ts'
  import Tabs from '@/modules/pos/pages/admin/viewer/Pos/Drawers/Orders/Tabs.vue'
  import { useAppStore } from '@/modules/core/stores/appStore.ts'
  import { useOrder } from '@/modules/sale/composables/order.ts'
  import Empty from './Empty.vue'
  import Filters from './Filters.vue'
  import Order from './Order.vue'

  const props = defineProps<{
    modelValue: boolean
    branchId: number | null
    cartId: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'store-payment' | 'refund-order' | 'cancel-order' | 'view-order' | 'print-order', value: string | number): void
    (e: 'init-order', response: Record<string, any>): void
  }>()

  const open = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  const { activeOrders, upcomingOrders } = useOrder()
  const { t } = useI18n()
  const { can } = useAuth()
  const toast = useToast()
  const { isRtl } = useAppStore()

  const tab = ref<string>('active')
  const loading = ref(false)

  const orders = ref<any[]>([])

  const meta = reactive({
    statuses: [] as { id: string, name: string }[],
    orderTypes: [] as { id: string, name: string }[],
    paymentStatuses: [] as { id: string, name: string }[],
  })

  const filters = reactive({
    search: '',
    types: [] as string[],
    statuses: [] as string[],
    paymentStatuses: [] as string[],
  })

  onBeforeMount(() => {
    if (can('admin.orders.active')) tab.value = 'active'
    else if (can('admin.orders.upcoming')) tab.value = 'upcoming'
  })

  const close = () => emit('update:modelValue', false)

  watch(
    () => props.modelValue,
    async newVal => {
      if (newVal) await loadData()
    },
  )

  const resetFilters = () => {
    filters.search = ''
    filters.types = []
    filters.statuses = []
    filters.paymentStatuses = []
  }
  const loadData = async (refreshing?: boolean) => {
    try {
      if (!refreshing) {
        loading.value = true
        resetFilters()
      }

      const response = tab.value === 'upcoming'
        ? await upcomingOrders(props.branchId)
        : await activeOrders(props.branchId)

      const data = response.data.body

      orders.value = data.orders
      meta.statuses = data.filters.statuses || []
      meta.orderTypes = data.filters.order_types || []
      meta.paymentStatuses = data.filters.payment_statuses || []
    } catch {
      toast.error(t('core::errors.an_unexpected_error_occurred'))
    } finally {
      loading.value = false
    }
  }

  const matchesSearch = (order: Record<string, any>) => {
    if (!filters.search) return true
    return order.order_number?.toLowerCase().includes(filters.search)
      || order.reference_no?.toLowerCase().includes(filters.search)
  }

  const ordersFiltered = computed(() => orders.value.filter((order: Record<string, any>) => {
    let match = true

    if (filters.types.length > 0) {
      match = match && filters.types.includes(order.type.id)
    }

    if (filters.statuses.length > 0) {
      match = match && filters.statuses.includes(order.status.id)
    }

    if (filters.paymentStatuses.length > 0) {
      match = match && filters.paymentStatuses.includes(order.payment_status.id)
    }

    return matchesSearch(order) && match
  }))

  const refresh = async () => {
    await loadData(true)
  }

  defineExpose({ refresh })

  const initOrder = (response: Record<string, any>) => {
    emit('init-order', response)
    close()
  }
</script>

<template>
  <v-navigation-drawer
    v-model="open"
    color="grey-light"
    :location="isRtl?'left':'right'"
    temporary
    transition="slide-x-reverse-transition"
    :width="600"
  >
    <VCard color="grey-light">
      <VCardText>
        <div class="d-flex mb-4 justify-space-between align-center">
          <h3 class="d-flex align-center ga-1">
            <VIcon color="#2980b9" icon="tabler-salad" size="25" />
            {{ t('pos::pos_viewer.order_management') }}
          </h3>
          <VBtn
            color="grey-200"
            icon="tabler-x"
            @click="close"
          />
        </div>

        <Tabs v-model="tab" :disabled="loading" @on-click="loadData" />
        <Filters
          v-if="orders.length>0"
          :disabled="loading"
          :filters="filters"
          :loading="loading"
          :meta="meta"
        />
        <div class="orders-wrapper mt-3">
          <template v-if="!loading && orders.length>0">
            <Order
              v-for="order in ordersFiltered"
              :key="order.id"
              :cart-id="cartId"
              :order="order"
              @cancel-order="(orderId:number|string)=>$emit('cancel-order',orderId)"
              @init-order="initOrder"
              @print-order="(orderId:number|string)=>$emit('print-order',orderId)"
              @refresh="refresh"
              @refund-order="(orderId:number|string)=>$emit('refund-order',orderId)"
              @store-payment="(orderId:number|string)=>$emit('store-payment',orderId)"
              @view-order="(orderId:number|string)=>$emit('view-order',orderId)"
            />
          </template>
          <template v-else-if="!loading && orders.length === 0">
            <Empty :tab="tab" />
          </template>
          <div v-else-if="loading" class="orders-loading">
            <VProgressCircular color="primary" indeterminate size="50" />
          </div>
        </div>
      </VCardText>
    </VCard>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.orders-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}

.orders-wrapper {
  height: 79vh;
  overflow: auto;
}
</style>
