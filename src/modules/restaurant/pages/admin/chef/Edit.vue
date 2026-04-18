<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useChef } from '@/modules/restaurant/composables/chef.ts'
  import Form from './Partials/Form.vue'

  const route = useRoute()
  const router = useRouter()
  const { getShowData } = useChef()

  const item = ref<Record<string, any> | null>(null)

  onMounted(async () => {
    const response = await getShowData(Number(route.params.id))
    if (response.status !== 200) {
      await router.push({ name: 'admin.chefs.index' })
      return
    }

    item.value = response.data
  })
</script>

<template>
  <Form
    v-if="item"
    action="update"
    :item="item"
  />
</template>
