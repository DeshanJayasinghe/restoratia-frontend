<script lang="ts" setup>

  import type {
    FilesystemSettings,
    FilesystemSettingsMeta,
    FilesystemSettingsResponse,
  } from '@/modules/setting/contracts/Settings.ts'
  import { useI18n } from 'vue-i18n'
  import PageLoader from '@/modules/core/components/PageLoader.vue'
  import { useForm } from '@/modules/core/composables/form.ts'
  import { useSetting } from '@/modules/setting/composables/setting.ts'

  onMounted(async () => {
    const response: FilesystemSettingsResponse | false = await getSettings('filesystem')
    if (response !== false) {
      meta.value = response.meta
      Object.assign(form.state, response.settings)
    }
  })

  const { getSettings, store, update } = useSetting()
  const { t } = useI18n()

  const meta = ref<FilesystemSettingsMeta>({
    disks: [],
  })

  const form = useForm<FilesystemSettings>({
    default_filesystem_disk: '',
    filesystem_s3_use_path_style_endpoint: false,
    filesystem_s3_url: null,
    filesystem_s3_endpoint: null,
    filesystem_s3_region: null,
    filesystem_s3_bucket: null,
    encryptable: {
      filesystem_s3_key: null,
      filesystem_s3_secret: null,
    },
  })

  function submit () {
    form.submit(() => update('filesystem', form.state))
  }
</script>

<template>
  <PageLoader :loading="store.loading" />
  <VForm v-if="!store.loading" @submit.prevent="submit">
    <VRow>
      <VCol cols="12" md="6">
        <VCol cols="12">
          <VSelect
            v-model="form.state.default_filesystem_disk"
            :error="!!form.errors.value?.default_filesystem_disk"
            :error-messages="form.errors.value?.default_filesystem_disk"
            item-title="name"
            item-value="id"
            :items="meta.disks"
            :label="t('setting::attributes.settings.default_filesystem_disk')"
          />
        </VCol>
        <template v-if="form.state.default_filesystem_disk==='s3'">
          <VCol cols="12">
            <VTextField
              v-model="form.state.encryptable.filesystem_s3_key"
              :error="!!form.errors.value?.['encryptable.filesystem_s3_key']"
              :error-messages="form.errors.value?.['encryptable.filesystem_s3_key']"
              :label="t('setting::attributes.settings.encryptable.filesystem_s3_key')"
              type="password"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.state.encryptable.filesystem_s3_secret"
              :error="!!form.errors.value?.['encryptable.filesystem_s3_secret']"
              :error-messages="form.errors.value?.['encryptable.filesystem_s3_secret']"
              :label="t('setting::attributes.settings.encryptable.filesystem_s3_secret')"
              type="password"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.state.filesystem_s3_url"
              :error="!!form.errors.value?.filesystem_s3_url"
              :error-messages="form.errors.value?.filesystem_s3_url"
              :label="t('setting::attributes.settings.filesystem_s3_url')"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.state.filesystem_s3_endpoint"
              :error="!!form.errors.value?.filesystem_s3_endpoint"
              :error-messages="form.errors.value?.filesystem_s3_endpoint"
              :label="t('setting::attributes.settings.filesystem_s3_endpoint')"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.state.filesystem_s3_region"
              :error="!!form.errors.value?.filesystem_s3_region"
              :error-messages="form.errors.value?.filesystem_s3_region"
              :label="t('setting::attributes.settings.filesystem_s3_region')"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.state.filesystem_s3_bucket"
              :error="!!form.errors.value?.filesystem_s3_bucket"
              :error-messages="form.errors.value?.filesystem_s3_bucket"
              :label="t('setting::attributes.settings.filesystem_s3_bucket')"
            />
          </VCol>
          <VCheckbox
            v-model="form.state.filesystem_s3_use_path_style_endpoint"
            :label="t('setting::attributes.settings.filesystem_s3_use_path_style_endpoint')"
          />
        </template>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VBtn
          :disabled="form.loading.value"
          :loading="form.loading.value"
          type="submit"
        >
          <VIcon icon="tabler-database-cog" start />
          {{ t('admin::admin.buttons.save') }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
