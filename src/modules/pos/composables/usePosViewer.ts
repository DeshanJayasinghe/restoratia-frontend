import type { AxiosError } from 'axios'
import type { Cart, UseCart } from '@/modules/cart/composables/cart.ts'
import type { PosForm, PosMeta } from '@/modules/pos/contracts/posViewer.ts'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useCart } from '@/modules/cart/composables/cart.ts'
import { getConfiguration, getMenuItems } from '@/modules/pos/api/posViewer.api.ts'

const defaultMeta: PosMeta = {
  branches: [],
  menus: [],
  registers: [],
  orderTypes: [],
  categories: [],
  products: [],
  waiters: [],
  customers: [],
  discounts: [],
  refundPaymentMethods: [],
  directions: [],
  reasons: {},
  order: null,
  currency: 'JOD',
}

const defaultForm: PosForm = {
  mode: 'create',
  branchId: null,
  menuId: null,
  registerId: null,
  waiter: null,
  sessionId: null,
  table: null,
  skipFirst: false,
  refundPaymentMethod: null,
  meta: {
    notes: null,
    guestCount: 1,
    carPlate: null,
    carDescription: null,
    scheduledAt: null,
  },
  loading: false,
  loadingMenuItems: false,
  reloadBranchData: false,
}

export function usePosViewer (cartId: string) {
  const cart: UseCart = useCart(cartId)

  const toast = useToast()
  const { t } = useI18n()

  const meta = ref<PosMeta>(structuredClone(defaultMeta))
  const form = ref<PosForm>(structuredClone(defaultForm))

  const hasOpenSession = computed(() => meta.value.registers.length > 0 && form.value.sessionId != null)

  const hasConfigurationErrors = computed(() =>
    meta.value.branches.length === 0
    || meta.value.menus.length === 0
    || meta.value.registers.length === 0
    || !form.value.registerId
    || !form.value.sessionId,
  )

  watch(
    () => form.value.branchId,
    async (newValue, oldValue) => {
      if (oldValue && newValue !== oldValue) {
        await loadConfiguration((newValue as number))
      }
    })

  watch(
    () => form.value.registerId,
    async newValue => {
      const register = meta.value.registers.find((register: Record<string, any>) => register.id === newValue)
      form.value.sessionId = register && register?.session ? register.session.id : null
    })

  watch(
    () => form.value.menuId,
    async () => {
      if (!hasConfigurationErrors.value) {
        await loadMenuItems()
      }
    })

  const loadConfiguration = async (branchId?: number) => {
    if (branchId) {
      form.value.reloadBranchData = true
    }
    form.value.loading = true
    try {
      const response = (await getConfiguration(cartId, branchId)).data.body
      if (!branchId) {
        meta.value.branches = response.branches
        meta.value.customers = response.customers
        meta.value.directions = response.directions
        meta.value.reasons = response.reasons
      }

      await cart.getCart()
      meta.value.waiters = response.waiters
      meta.value.orderTypes = response.order_types
      meta.value.menus = response.menus
      meta.value.discounts = response.discounts
      meta.value.registers = response.registers
      meta.value.currency = response.currency
      form.value.branchId = response.branch_id
      form.value.menuId = response.menu_id
      form.value.registerId = response.register_id
      form.value.sessionId = response.session_id
    } catch (error: any) {
      toast.error((error as AxiosError<{
        message?: string
      }>).response?.data?.message || t('core::errors.an_unexpected_error_occurred'))
    } finally {
      form.value.loading = false
      form.value.reloadBranchData = false
    }
  }

  const loadMenuItems = async () => {
    if (!form.value.menuId) {
      return
    }
    form.value.loadingMenuItems = true
    try {
      const response = (await getMenuItems(cartId, form.value.menuId)).data.body
      meta.value.products = response.products
      meta.value.categories = response.categories
    } catch (error: any) {
      toast.error((error as AxiosError<{
        message?: string
      }>).response?.data?.message || t('core::errors.an_unexpected_error_occurred'))
    } finally {
      form.value.loadingMenuItems = false
    }
  }

  const initOrder = (response: Record<string, any>) => {
    cart.resetCart(response.cart)
    meta.value.order = response.order
    meta.value.refundPaymentMethods = response.refund_payment_methods

    form.value = { ...form.value, ...response.form, mode: 'edit', skipFirst: true }
  }

  const reset = (cartData?: Cart) => {
    if (cartData) {
      cart.resetCart(cartData)
    }
    form.value = {
      ...form.value,
      meta: { ...structuredClone(defaultForm).meta },
      mode: 'create',
      waiter: null,
      table: null,
    }
  }

  return {
    cart,
    reset,
    initOrder,
    loadConfiguration,
    loadMenuItems,
    hasConfigurationErrors,
    hasOpenSession,
    meta,
    form,
  }
}
