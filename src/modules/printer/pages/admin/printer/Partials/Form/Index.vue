<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { type RouteLocationRaw, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { usePrinter } from '@/modules/printer/composables/printer.ts'
  import { useForm } from '@/modules/core/composables/form.ts'
  import { useAuth } from '@/modules/auth/composables/auth.ts'
  import SpoolerOptions from './Options/Spooler.vue'
  import TcpOptions from './Options/Tcp.vue'
  import UsbRawOptions from './Options/UsbRaw.vue'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { user } = useAuth()
  const { getFormMeta, update, store } = usePrinter()
  const router = useRouter()

  const form = useForm({
    name: props.item?.name || {},
    connection_type: props.item?.connection_type?.id || 'tcp',
    branch_id: user?.assigned_to_branch ? user.branch_id : props.item?.branch?.id,
    options: {
      paper_size: '80mm',
      host: null,
      port: 9100,
      copies: null,
      timeout_ms: null,
      retries: null,
      cut_paper: false,
      beep: false,
      open_cash_drawer: false,
      vendor_id: null,
      product_id: null,
      endpoint: null,
      interface_index: null,
      detach_kernel_driver: false,
      spooler_name: null,
      sides: null,
      color_mode: null,
      raw: false,
      orientation: null,
      margins: {
        top: null,
        right: null,
        bottom: null,
        left: null,
      },
      fallback_text_mode: false,
      ...props.item?.options,
    },
    is_active: props.item?.is_active || false,
  })

  const meta = ref({
    branches: [],
    connectionTypes: [],
    spoolerOrientations: [],
    spoolerColorModes: [],
    spoolerSides: [],
    paperSizes: [],
    usbRawEndpoints: [],
  })

  const submit = async () => {
    if (
      !form.loading.value
      && await form.submit(() => props.action == 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.printers.index' } as unknown as RouteLocationRaw)
    }
  }

  onBeforeMount(() => {
    loadFormData()
  })

  const loadFormData = async (branchId?: number) => {
    try {
      const response = (await getFormMeta(branchId)).data.body
      meta.value.branches = response.branches
      meta.value.connectionTypes = response.connection_types
      meta.value.spoolerOrientations = response.spooler_orientations
      meta.value.spoolerColorModes = response.spooler_color_modes
      meta.value.spoolerSides = response.spooler_color_sides
      meta.value.paperSizes = response.paper_sizes
      meta.value.usbRawEndpoints = response.usb_raw_endpoints
    } catch {
    /* Empty */
    }
  }
</script>

<template>
  <BaseForm
    v-slot="{ currentLanguage }"
    :action="action"
    has-multiple-language
    :loading="form.loading.value"
    resource="printers"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="5">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-info-circle" size="20" />
              <span>{{ t('printer::printers.form.cards.printer_information') }}</span>
            </div>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.name[currentLanguage.id]"
                  :error="!!form.errors.value?.[`name.${currentLanguage.id}`]"
                  :error-messages="form.errors.value?.[`name.${currentLanguage.id}`]"
                  :label="t('printer::attributes.printers.name') + ` ( ${currentLanguage.name} )`"
                />
              </VCol>
              <VCol v-if="action=='create' && !user?.assigned_to_branch" cols="12">
                <VSelect
                  v-model="form.state.branch_id"
                  :error="!!form.errors.value?.branch_id"
                  :error-messages="form.errors.value?.branch_id"
                  item-title="name"
                  item-value="id"
                  :items="meta.branches"
                  :label="t('printer::attributes.printers.branch_id')"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.state.connection_type"
                  :error="!!form.errors.value?.connection_type"
                  :error-messages="form.errors.value?.connection_type"
                  item-title="name"
                  item-value="id"
                  :items="meta.connectionTypes"
                  :label="t('printer::attributes.printers.connection_type')"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_active"
                  :label="t('printer::attributes.printers.is_active')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="7">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-affiliate" size="20" />
              <span>{{ t('printer::printers.form.cards.connection_options') }}</span>
            </div>
          </VCardTitle>
          <VCardText>
            <TcpOptions v-if="form.state.connection_type==='tcp'" :form="form" :meta="meta" />
            <SpoolerOptions v-else-if="form.state.connection_type==='spooler'" :form="form" :meta="meta" />
            <UsbRawOptions v-else-if="form.state.connection_type==='usb_raw'" :form="form" :meta="meta" />
            <VAlert v-else type="info" variant="tonal">
              <template #prepend>
                <VIcon icon="tabler-info-circle" />
              </template>
              {{ t('printer::printers.form.no_configuration_available') }}
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
