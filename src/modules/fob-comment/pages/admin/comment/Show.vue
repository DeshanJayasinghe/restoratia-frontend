<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import { useComment } from '@/modules/fob-comment/composables/comment.ts'

  const { getShowData, updateStatus } = useComment()
  const route = useRoute()
  const { t } = useI18n()
  const toast = useToast()

  const loading = ref(false)
  const isNotFound = ref(false)
  const item = ref<Record<string, any> | null>(null)
  const statusLoading = ref(false)

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

  async function changeStatus (status: string) {
    if (statusLoading.value || !item.value) return
    statusLoading.value = true
    try {
      const response = await updateStatus(item.value.id, status)
      item.value.status = response.data.body.status
      toast.success(t('admin::admin.saved_successfully'))
    } catch {
      toast.error(t('core::errors.an_unexpected_error_occurred'))
    } finally {
      statusLoading.value = false
    }
  }
</script>

<template>
  <PageStateWrapper :loading="loading" :not-found="isNotFound">
    <VRow v-if="item">
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-message" size="20" />
            <span>{{ t('fob-comment::comments.form.cards.comment_information') }}</span>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('fob-comment::comments.table.name') }}</div>
                <div>{{ item.name }}</div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('fob-comment::comments.table.email') }}</div>
                <div>{{ item.email || '-' }}</div>
              </VCol>
              <VCol v-if="item.website" cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('fob-comment::attributes.comments.website') }}</div>
                <div>{{ item.website }}</div>
              </VCol>
              <VCol v-if="item.reference_url" cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('fob-comment::attributes.comments.reference_url') }}</div>
                <a :href="item.reference_url" rel="noopener noreferrer" target="_blank">{{ item.reference_url }}</a>
              </VCol>
              <VCol v-if="item.ip_address" cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('fob-comment::attributes.comments.ip_address') }}</div>
                <div>{{ item.ip_address }}</div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ t('admin::admin.table.created_at') }}</div>
                <div>{{ item.created_at }}</div>
              </VCol>
              <VCol cols="12">
                <div class="text-caption text-medium-emphasis mb-1">{{ t('fob-comment::comments.table.content') }}</div>
                <div class="mt-1">{{ item.content }}</div>
              </VCol>
              <VCol v-if="item.parent" cols="12">
                <div class="text-caption text-medium-emphasis mb-1">{{ t('fob-comment::attributes.comments.reply_to') }}</div>
                <VCard variant="outlined">
                  <VCardText class="pa-3">
                    <div class="font-weight-medium">{{ item.parent.name }}</div>
                    <div class="text-body-2 text-medium-emphasis">{{ item.parent.content }}</div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <VCard v-if="item.replies && item.replies.length" class="mt-4">
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-messages" size="20" />
            <span>{{ t('fob-comment::comments.form.cards.replies') }}</span>
          </VCardTitle>
          <VCardText>
            <VCard
              v-for="reply in item.replies"
              :key="reply.id"
              class="mb-2"
              variant="outlined"
            >
              <VCardText class="pa-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="font-weight-medium">{{ reply.name }}</span>
                  <span class="text-caption text-medium-emphasis">{{ reply.created_at }}</span>
                </div>
                <div class="text-body-2">{{ reply.content }}</div>
              </VCardText>
            </VCard>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle class="d-flex align-center mb-2">
            <VIcon class="me-2" icon="tabler-settings" size="20" />
            <span>{{ t('fob-comment::comments.table.status') }}</span>
          </VCardTitle>
          <VCardText>
            <div class="mb-3">
              <VChip
                :color="item.status?.value === 'approved' ? 'success' : item.status?.value === 'spam' ? 'error' : item.status?.value === 'trash' ? 'secondary' : 'warning'"
                label
                size="small"
              >
                {{ item.status?.label ?? item.status }}
              </VChip>
            </div>
            <VRow dense>
              <VCol cols="12">
                <VBtn
                  block
                  color="success"
                  :loading="statusLoading"
                  variant="tonal"
                  @click="changeStatus('approved')"
                >
                  {{ t('fob-comment::comments.form.status_actions.approve') }}
                </VBtn>
              </VCol>
              <VCol cols="12">
                <VBtn
                  block
                  color="warning"
                  :loading="statusLoading"
                  variant="tonal"
                  @click="changeStatus('pending')"
                >
                  {{ t('fob-comment::comments.form.status_actions.pending') }}
                </VBtn>
              </VCol>
              <VCol cols="12">
                <VBtn
                  block
                  color="error"
                  :loading="statusLoading"
                  variant="tonal"
                  @click="changeStatus('spam')"
                >
                  {{ t('fob-comment::comments.form.status_actions.reject') }}
                </VBtn>
              </VCol>
              <VCol cols="12">
                <VBtn
                  block
                  color="secondary"
                  :loading="statusLoading"
                  variant="tonal"
                  @click="changeStatus('trash')"
                >
                  {{ t('fob-comment::comments.form.status_actions.trash') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </PageStateWrapper>
</template>
