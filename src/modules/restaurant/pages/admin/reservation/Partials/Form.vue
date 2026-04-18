<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useForm } from '@/modules/core/composables/form.ts'
  import { useReservation } from '@/modules/restaurant/composables/reservation.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { update, store, getFormMeta } = useReservation()
  const router = useRouter()
  const route = useRoute()

  const formMeta = ref<Record<string, any>>({ statuses: [], branches: [] })

  const form = useForm({
    branch_id: props.item?.branch?.id || null,
    name: props.item?.name || '',
    email: props.item?.email || '',
    phone: props.item?.phone || '',
    reservation_date: props.item?.reservation_date || '',
    reservation_time: props.item?.reservation_time || '',
    number_of_guests: props.item?.number_of_guests || 1,
    special_requests: props.item?.special_requests || '',
    admin_notes: props.item?.admin_notes || '',
    status: props.item?.status || 'pending',
    is_active: props.item?.is_active ?? true,
  })

  onMounted(async () => {
    if (props.action === 'create' && typeof route.query.date === 'string') {
      form.state.reservation_date = route.query.date
    }

    const response = await getFormMeta()
    formMeta.value = response.data.body
  })

  const submit = async () => {
    if (
      !form.loading.value
      && await form.submit(() => props.action === 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.reservations.index' } as unknown as RouteLocationRaw)
    }
  }
</script>

<template>
  <BaseForm
    :action="action"
    :loading="form.loading.value"
    resource="reservations"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="6">
        <VSelect
          v-model="form.state.branch_id"
          :items="formMeta.branches || []"
          item-title="name"
          item-value="id"
          :label="t('reservation::attributes.reservations.branch_id')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.name"
          :error="!!form.errors.value?.name"
          :error-messages="form.errors.value?.name"
          :label="t('reservation::attributes.reservations.name')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.email"
          :error="!!form.errors.value?.email"
          :error-messages="form.errors.value?.email"
          :label="t('reservation::attributes.reservations.email')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.state.phone"
          :error="!!form.errors.value?.phone"
          :error-messages="form.errors.value?.phone"
          :label="t('reservation::attributes.reservations.phone')"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="form.state.reservation_date"
          type="date"
          :error="!!form.errors.value?.reservation_date"
          :error-messages="form.errors.value?.reservation_date"
          :label="t('reservation::attributes.reservations.reservation_date')"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="form.state.reservation_time"
          type="time"
          :error="!!form.errors.value?.reservation_time"
          :error-messages="form.errors.value?.reservation_time"
          :label="t('reservation::attributes.reservations.reservation_time')"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="form.state.number_of_guests"
          type="number"
          :error="!!form.errors.value?.number_of_guests"
          :error-messages="form.errors.value?.number_of_guests"
          :label="t('reservation::attributes.reservations.number_of_guests')"
          min="1"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VSelect
          v-model="form.state.status"
          :items="formMeta.statuses || []"
          item-title="name"
          item-value="id"
          :label="t('reservation::attributes.reservations.status')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VCheckbox
          v-model="form.state.is_active"
          :label="t('reservation::attributes.reservations.is_active')"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="form.state.special_requests"
          :label="t('reservation::attributes.reservations.special_requests')"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="form.state.admin_notes"
          :label="t('reservation::attributes.reservations.admin_notes')"
        />
      </VCol>
    </VRow>
  </BaseForm>
</template>
