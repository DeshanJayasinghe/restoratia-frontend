<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{ item: any }>()
  const { t } = useI18n()

  const copied = ref(false)

  const MAX_LENGTH = 12

  const shortSecret = computed(() => {
    const secret = props.item.secret
    if (!secret) return ''
    return secret.length > MAX_LENGTH
      ? `${secret.slice(0, MAX_LENGTH)}…`
      : secret
  })

  const copySecret = async () => {
    await navigator.clipboard.writeText(props.item.secret)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
</script>

<template>
  <VTooltip
    location="top"
    :text="t(`printer::print_agents.${copied?'copied':'click_to_copy_secret'}`)"
  >
    <template #activator="{ props:tooltipProps }">
      <VChip
        class="font-weight-bold"
        color="primary"
        style="cursor: pointer; max-width: 220px"
        v-bind="tooltipProps"
        variant="outlined"
        @click="copySecret"
      >
        <span class="text-truncate">
          {{ shortSecret }}
        </span>

        <VIcon class="ml-2" icon="tabler-copy" size="18" />
      </VChip>
    </template>
  </VTooltip>
</template>

<style scoped>
.text-truncate {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
