import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.restaurant',
      label: 'setting::settings.sections.restaurant',
      icon: 'tabler-tools-kitchen-2',
      permission: ['admin.reservations.index', 'admin.chefs.index', 'admin.restaurant_currencies.index', 'admin.settings.edit'],
      sort: 7,
      children: [
        {
          key: 'admin.reservations.index',
          label: 'reservation::reservations.reservations',
          to: { name: 'admin.reservations.index' },
          permission: 'admin.reservations.index',
        },
        {
          key: 'admin.booking_calendar.index',
          label: 'reservation::reservations.booking_calendar',
          to: { name: 'admin.booking_calendar.index' },
          permission: 'admin.booking_calendar.index',
        },
        {
          key: 'admin.chefs.index',
          label: 'chef::chefs.chefs',
          to: { name: 'admin.chefs.index' },
          permission: 'admin.chefs.index',
        },
        {
          key: 'admin.restaurant_currencies.index',
          label: 'currency::restaurant_currencies.restaurant_currencies',
          to: { name: 'admin.restaurant_currencies.index' },
          permission: 'admin.restaurant_currencies.index',
        },
        {
          key: 'admin.restaurant_settings.index',
          label: 'setting::settings.sections.restaurant',
          to: { name: 'admin.restaurant_settings.index' },
          permission: 'admin.settings.edit',
        },
      ],
    },
  ],
}
