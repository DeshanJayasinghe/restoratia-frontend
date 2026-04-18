<script lang="ts" setup>
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import listPlugin from '@fullcalendar/list'
  import interactionPlugin from '@fullcalendar/interaction'
  import type { EventClickArg, EventSourceFuncArg } from '@fullcalendar/core'
  import type { DateClickArg } from '@fullcalendar/interaction'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useReservation } from '@/modules/restaurant/composables/reservation.ts'

  const router = useRouter()
  const { locale, t } = useI18n()
  const { getCalendarEvents } = useReservation()

  const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
  const isLoading = ref(false)

  const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: locale.value || 'en',
    height: 650,
    contentHeight: 600,
    aspectRatio: 1.8,
    navLinks: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    events: async (fetchInfo: EventSourceFuncArg, successCallback: (events: any[]) => void, failureCallback: (error: Error) => void) => {
      isLoading.value = true
      try {
        const events = await getCalendarEvents({
          start: fetchInfo.startStr,
          end: fetchInfo.endStr,
        })
        successCallback(events)
      } catch (error: any) {
        failureCallback(error)
      } finally {
        isLoading.value = false
      }
    },
    dateClick: async (info: DateClickArg) => {
      await router.push({
        name: 'admin.reservations.create',
        query: { date: info.dateStr },
      })
    },
    eventClick: async (info: EventClickArg) => {
      await router.push({
        name: 'admin.reservations.edit',
        params: { id: info.event.id },
      })
    },
  }))

  const navigateCreate = async () => {
    await router.push({ name: 'admin.reservations.create' })
  }
</script>

<template>
  <div class="booking-calendar-wrapper">
    <VAlert
      class="mb-4"
      color="info"
      variant="tonal"
    >
      <strong>Quick Tip:</strong>
      {{ t('reservation::reservations.booking_calendar_tip') }}
    </VAlert>

    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center gap-3 flex-wrap">
        <span>{{ t('reservation::reservations.booking_calendar') }}</span>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          @click="navigateCreate"
        >
          {{ t('reservation::reservations.create_reservation') }}
        </VBtn>
      </VCardTitle>
      <VCardText :class="{ 'calendar-loading': isLoading }">
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
  .booking-calendar-wrapper :deep(.fc) {
    max-width: 100%;
    min-height: 600px;
  }

  .booking-calendar-wrapper :deep(.fc-header-toolbar) {
    margin-bottom: 1rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .booking-calendar-wrapper :deep(.fc-button) {
    border-radius: 6px;
  }

  .booking-calendar-wrapper :deep(.fc-daygrid-day.fc-day-today) {
    background-color: #fff3cd;
  }

  .booking-calendar-wrapper :deep(.fc-daygrid-day:hover) {
    background-color: #f8f9fa;
  }

  .calendar-loading {
    position: relative;
    min-height: 400px;
  }

  .calendar-loading::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.75);
    z-index: 8;
  }

  .calendar-loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    margin-left: -16px;
    margin-top: -16px;
    border-radius: 50%;
    border: 4px solid #d5dbe1;
    border-top-color: #0d6efd;
    animation: spin 0.8s linear infinite;
    z-index: 9;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
