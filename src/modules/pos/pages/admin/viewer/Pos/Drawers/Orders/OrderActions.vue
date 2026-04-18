<script lang="ts" setup>
  import type { AxiosError } from 'axios'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import { useAuth } from '@/modules/auth/composables/auth.ts'
  import { useOrder } from '@/modules/sale/composables/order.ts'

  const props = defineProps<{
    order: Record<string, any>
    cartId: string
    isBillingMerged: boolean
    isTableViewer: boolean
  }>()

  const emit = defineEmits<{
    (e: 'refresh'): void
    (e: 'store-payment' | 'refund-order' | 'cancel-order' | 'view-order' | 'print-order', value: string | number): void
    (e: 'init-order', response: Record<string, any>): void
  }>()

  const { t } = useI18n()
  const { can } = useAuth()
  const toast = useToast()
  const { moveToNextStatus, edit } = useOrder()

  const isPaid = computed(() => props.order.payment_status.id === 'paid')
  const showPaymentButton = computed(() => props.order.type.id !== 'dine_in' || (props.order.type.id === 'dine_in' && props.order.next_status?.id === 'completed'))

  const loadings = ref({
    updateStatus: false,
    edit: false,
  })

  const actionDisabled = computed(() => loadings.value.updateStatus || loadings.value.edit)

  const updateStatus = async () => {
    try {
      loadings.value.updateStatus = true
      const response = await moveToNextStatus(props.order.id)
      emit('refresh')
      toast.success(response.data.message)
    } catch (error) {
      toast.error((error as AxiosError<{
        message?: string
      }>).response?.data?.message || t('core::errors.an_unexpected_error_occurred'))
    } finally {
      loadings.value.updateStatus = false
    }
  }

  const editOrder = async () => {
    try {
      loadings.value.edit = true
      const response = (await edit(props.cartId, props.order.id)).data.body
      emit('init-order', response)
    } catch (error) {
      toast.error((error as AxiosError<{
        message?: string
      }>).response?.data?.message || t('core::errors.an_unexpected_error_occurred'))
    } finally {
      loadings.value.edit = false
    }
  }

  const storePayment = () => {
    if (can('admin.orders.receive_payment')) {
      emit('store-payment', props.order.reference_no)
    }
  }

  const viewOrder = () => {
    if (can('admin.orders.show')) {
      emit('view-order', props.order.reference_no)
    }
  }

  const cancelOrder = () => {
    if (can('admin.orders.cancel')) {
      emit('cancel-order', props.order.reference_no)
    }
  }

  const refundOrder = () => {
    if (can('admin.orders.refund')) {
      emit('refund-order', props.order.reference_no)
    }
  }
  const print = () => {
    if (can('admin.orders.print')) {
      emit('print-order', props.order.reference_no)
    }
  }
</script>

<template>
  <div class="actions d-flex justify-space-between" :class="{'mt-2':!isTableViewer}">
    <div class="d-flex ga-2">
      <VTooltip v-if="can('admin.orders.show')" :text="t('pos::pos_viewer.order_actions.view')">
        <template #activator="{ props:tooltipProps }">
          <VBtn
            color="grey"
            icon="tabler-eye"
            rounded
            v-bind="tooltipProps"
            variant="tonal"
            @click="viewOrder"
          />
        </template>
      </VTooltip>
      <VTooltip v-if="order.allow_edit && can('admin.orders.edit')" :text="t('pos::pos_viewer.order_actions.edit')">
        <template #activator="{ props:tooltipProps }">
          <VBtn
            color="grey"
            :disabled="actionDisabled"
            icon="tabler-edit"
            :loading="loadings.edit"
            rounded
            v-bind="tooltipProps"
            variant="tonal"
            @click="editOrder"
          />
        </template>
      </VTooltip>
      <VTooltip
        v-if="order.allow_cancel && can('admin.orders.cancel')"
        :text="t('pos::pos_viewer.order_actions.cancel')"
      >
        <template #activator="{ props:tooltipProps }">
          <VBtn
            color="grey"
            :disabled="actionDisabled"
            icon="tabler-x"
            rounded
            v-bind="tooltipProps"
            variant="tonal"
            @click="cancelOrder"
          />
        </template>
      </VTooltip>
      <VTooltip
        v-if="order.allow_refund && can('admin.orders.refund')"

        :text="t('pos::pos_viewer.order_actions.refund')"
      >
        <template #activator="{ props:tooltipProps }">
          <VBtn
            color="grey"
            :disabled="actionDisabled"
            icon="tabler-arrow-back-up"
            rounded
            v-bind="tooltipProps"
            variant="tonal"
            @click="refundOrder"
          />
        </template>
      </VTooltip>
      <VBtn
        v-if="can('admin.orders.print')"
        color="grey"
        :disabled="actionDisabled"
        variant="tonal"
        @click="print"
      >
        <VIcon icon="tabler-printer" start />
        {{ t('pos::pos_viewer.order_actions.print') }}
      </VBtn>
    </div>
    <div class="primary-action d-flex ga-1">
      <VBtn
        v-if="can('admin.orders.receive_payment') && !isBillingMerged && !isPaid && showPaymentButton"
        color="success"
        :disabled="actionDisabled"
        variant="tonal"
        @click="storePayment"
      >
        <VIcon icon="tabler-cash" start />
        {{
          t(`pos::pos_viewer.order_actions.${order.payment_status.id === 'partially_paid' ? 'complete_payment' : 'pay_now'}`)
        }}
      </VBtn>

      <VBtn
        v-if="order.allow_update_status"
        :color="order.next_status.color"
        :disabled="actionDisabled"
        :loading="loadings.updateStatus"
        variant="tonal"
        @click="updateStatus"
      >
        <VIcon :icon="order.next_status.icon" start />
        {{ t(`pos::pos_viewer.order_actions.update_status.${order.status.id}`) }}
      </VBtn>
    </div>
  </div>
</template>
