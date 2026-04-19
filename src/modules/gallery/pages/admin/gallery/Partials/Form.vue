<script lang="ts" setup>
  import type { RouteLocationRaw } from 'vue-router'
  import { onBeforeMount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useGallery } from '@/modules/gallery/composables/gallery.ts'
  import { useForm } from '@/modules/core/composables/form.ts'

  const props = defineProps<{
    item?: Record<string, any> | null
    action: 'update' | 'create'
  }>()

  const { t } = useI18n()
  const { getFormMeta, update, store } = useGallery()
  const router = useRouter()

  const meta = ref<{ statuses: { id: string; name: string }[] }>({ statuses: [] })

  const form = useForm({
    name: props.item?.name ?? '',
    description: props.item?.description ?? '',
    image: props.item?.image ?? '',
    images: props.item?.images ?? [],
    is_featured: props.item?.is_featured ?? false,
    order: props.item?.order ?? 0,
    status: props.item?.status?.id ?? props.item?.status ?? 'published',
    is_active: props.item?.is_active ?? true,
  })

  const newImageUrl = ref('')

  function addImage () {
    if (newImageUrl.value.trim()) {
      form.state.images = [...form.state.images, newImageUrl.value.trim()]
      newImageUrl.value = ''
    }
  }

  function removeImage (index: number) {
    form.state.images = form.state.images.filter((_: string, i: number) => i !== index)
  }

  async function submit () {
    if (
      !form.loading.value
      && await form.submit(() => props.action === 'create' ? store(form.state) : update(props.item?.id, form.state))
    ) {
      await router.push({ name: 'admin.galleries.index' } as unknown as RouteLocationRaw)
    }
  }

  onBeforeMount(async () => {
    try {
      const response = (await getFormMeta()).data.body
      meta.value.statuses = response.statuses
    } catch {
      /* Empty */
    }
  })
</script>

<template>
  <BaseForm
    :action="action"
    :loading="form.loading.value"
    resource="galleries"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-photo" size="20" />
            <span>{{ t('gallery::galleries.form.cards.gallery_information') }}</span>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.name"
                  :error="!!form.errors.value?.name"
                  :error-messages="form.errors.value?.name"
                  :label="t('gallery::attributes.galleries.name')"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="form.state.description"
                  :error="!!form.errors.value?.description"
                  :error-messages="form.errors.value?.description"
                  :label="t('gallery::attributes.galleries.description')"
                  rows="3"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.image"
                  :error="!!form.errors.value?.image"
                  :error-messages="form.errors.value?.image"
                  :label="t('gallery::attributes.galleries.image')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <VCard class="mt-4">
          <VCardTitle class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <VIcon class="me-2" icon="tabler-photos" size="20" />
              <span>{{ t('gallery::galleries.form.cards.images') }}</span>
            </div>
          </VCardTitle>
          <VCardText>
            <VRow align="center" class="mb-3">
              <VCol cols="12" md="10">
                <VTextField
                  v-model="newImageUrl"
                  :label="t('gallery::attributes.galleries.images')"
                  :placeholder="t('gallery::attributes.galleries.image')"
                  @keyup.enter="addImage"
                />
              </VCol>
              <VCol cols="12" md="2">
                <VBtn block color="primary" variant="tonal" @click="addImage">
                  {{ t('admin::admin.add') }}
                </VBtn>
              </VCol>
            </VRow>
            <VRow v-if="form.state.images.length" dense>
              <VCol
                v-for="(img, index) in form.state.images"
                :key="index"
                cols="12"
                md="6"
              >
                <VCard variant="outlined">
                  <VCardText class="d-flex align-center pa-2">
                    <VImg
                      class="rounded me-3 flex-shrink-0"
                      cover
                      height="56"
                      :src="img"
                      width="56"
                    />
                    <div class="text-body-2 text-truncate flex-grow-1">{{ img }}</div>
                    <VBtn
                      class="ms-2 flex-shrink-0"
                      color="error"
                      icon
                      size="small"
                      variant="text"
                      @click="removeImage(index)"
                    >
                      <VIcon icon="tabler-trash" />
                    </VBtn>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
            <div v-else class="text-medium-emphasis text-body-2">
              {{ t('admin::admin.no_records') }}
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VSelect
                  v-model="form.state.status"
                  :error="!!form.errors.value?.status"
                  :error-messages="form.errors.value?.status"
                  item-title="name"
                  item-value="id"
                  :items="meta.statuses"
                  :label="t('gallery::attributes.galleries.status')"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.state.order"
                  :error="!!form.errors.value?.order"
                  :error-messages="form.errors.value?.order"
                  :label="t('gallery::attributes.galleries.order')"
                  type="number"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_featured"
                  :label="t('gallery::attributes.galleries.is_featured')"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="form.state.is_active"
                  :label="t('gallery::attributes.galleries.is_active')"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </BaseForm>
</template>
