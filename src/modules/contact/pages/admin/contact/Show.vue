<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import { useContact } from '@/modules/contact/composables/contact.ts'

  const { getShowData, reply } = useContact()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()

  const loading = ref(false)
  const isNotFound = ref(false)
  const item = ref<Record<string, any> | null>(null)
  const replyMessage = ref('')
  const replyLoading = ref(false)

  onBeforeMount(async () => {
    loading.value = true
    const response = await getShowData(Number((route.params as Record<string, any>).id))
    if (response.status === 200) {
      item.value = response.data
    } else if (response.status === 404) {
      isNotFound.value = true
    }
    loading.value = false
  })

  async function submitReply () {
    if (!replyMessage.value.trim() || replyLoading.value) return
    replyLoading.value = true
    try {
      const response = await reply(item.value!.id, { message: replyMessage.value })
      item.value!.replies = [...(item.value!.replies || []), response.data.body]
      replyMessage.value = ''
      toast.success(t('admin::admin.saved_successfully'))
    } catch {
      toast.error(t('core::errors.an_unexpected_error_occurred'))
    } finally {
      replyLoading.value = false
    }
  }
</script>

<template>
  <PageStateWrapper :loading="loading" :not-found="isNotFound">
    <VRow v-if="item">
      <VCol cols="12" md="7">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-info-circle" size="20" />
            <span>{{ t('contact::contacts.form.cards.contact_information') }}</span>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('contact::contacts.table.name') }}</div>
                <div>{{ item.name }}</div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('contact::contacts.table.email') }}</div>
                <div>{{ item.email || '-' }}</div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('contact::contacts.table.phone') }}</div>
                <div>{{ item.phone || '-' }}</div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('contact::contacts.table.subject') }}</div>
                <div>{{ item.subject || '-' }}</div>
              </VCol>
              <VCol cols="12">
                <div class="text-caption text-medium-emphasis">{{ t('contact::attributes.contacts.content') }}</div>
                <div class="mt-1">{{ item.content }}</div>
              </VCol>
              <VCol v-if="item.custom_fields && Object.keys(item.custom_fields).length" cols="12">
                <div class="text-caption text-medium-emphasis mb-1">{{ t('contact::base.contact_custom_fields') }}</div>
                <VRow dense>
                  <VCol
                    v-for="(value, key) in item.custom_fields"
                    :key="key"
                    cols="12"
                    md="6"
                  >
                    <div class="text-caption text-medium-emphasis">{{ key }}</div>
                    <div>{{ value }}</div>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="5">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-message-reply" size="20" />
            <span>{{ t('contact::contacts.form.cards.replies') }}</span>
          </VCardTitle>
          <VCardText>
            <div v-if="item.replies && item.replies.length" class="mb-4">
              <div
                v-for="r in item.replies"
                :key="r.id"
                class="pa-3 mb-2 rounded bg-surface-variant"
              >
                <div class="text-body-2">{{ r.message }}</div>
                <div class="text-caption text-medium-emphasis mt-1">{{ r.created_at }}</div>
              </div>
            </div>
            <VTextarea
              v-model="replyMessage"
              :label="t('contact::contacts.reply')"
              rows="4"
            />
            <VBtn
              class="mt-2"
              color="primary"
              :disabled="!replyMessage.trim()"
              :loading="replyLoading"
              @click="submitReply"
            >
              {{ t('contact::contacts.reply') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </PageStateWrapper>
</template>
