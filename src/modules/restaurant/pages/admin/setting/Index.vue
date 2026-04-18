<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useForm } from '@/modules/core/composables/form.ts'
  import { useRestaurantSetting } from '@/modules/restaurant/composables/restaurantSetting.ts'

  const { t } = useI18n()
  const { load, save } = useRestaurantSetting()

  const form = useForm({
    restaurant_opening_hours: [],
    restaurant_max_seating_capacity: 100,
    restaurant_min_party_size: 1,
    restaurant_max_party_size: 12,
    restaurant_notify_on_new_reservation: false,
    restaurant_notify_on_cancellation: false,
    restaurant_notification_email: '',
  })

  onMounted(async () => {
    const data = await load()
    Object.assign(form.state, data)
  })

  const submit = async () => {
    if (form.loading.value) {
      return
    }

    await form.submit(() => save(form.state))
  }
</script>

<template>
  <BaseForm
    action="update"
    :loading="form.loading.value"
    resource="settings"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="4">
        <VTextField
          v-model="form.state.restaurant_max_seating_capacity"
          type="number"
          :label="t('setting::attributes.settings.restaurant_max_seating_capacity')"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="form.state.restaurant_min_party_size"
          type="number"
          :label="t('setting::attributes.settings.restaurant_min_party_size')"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="form.state.restaurant_max_party_size"
          type="number"
          :label="t('setting::attributes.settings.restaurant_max_party_size')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VCheckbox
          v-model="form.state.restaurant_notify_on_new_reservation"
          :label="t('setting::attributes.settings.restaurant_notify_on_new_reservation')"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VCheckbox
          v-model="form.state.restaurant_notify_on_cancellation"
          :label="t('setting::attributes.settings.restaurant_notify_on_cancellation')"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="form.state.restaurant_notification_email"
          :label="t('setting::attributes.settings.restaurant_notification_email')"
        />
      </VCol>
    </VRow>
  </BaseForm>
</template>
