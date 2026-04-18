import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'reservations',
    name: 'admin.reservations',
    meta: {
      title: 'reservation::reservations.reservations',
      icon: 'tabler-calendar-event',
    },
    children: [
      {
        path: '',
        name: 'admin.reservations.index',
        component: () => import('@/modules/restaurant/pages/admin/reservation/Index.vue'),
        meta: {
          permission: 'admin.reservations.index',
        },
      },
      {
        path: 'create',
        name: 'admin.reservations.create',
        component: () => import('@/modules/restaurant/pages/admin/reservation/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'reservation::reservations.reservation' },
          permission: 'admin.reservations.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.reservations.edit',
        component: () => import('@/modules/restaurant/pages/admin/reservation/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'reservation::reservations.reservation' },
          permission: 'admin.reservations.edit',
        },
      },
    ],
  },
  {
    path: 'booking-calendar',
    name: 'admin.booking_calendar.index',
    component: () => import('@/modules/restaurant/pages/admin/bookingCalendar/Index.vue'),
    meta: {
      title: 'reservation::reservations.booking_calendar',
      icon: 'tabler-calendar-time',
      permission: 'admin.booking_calendar.index',
    },
  },
  {
    path: 'chefs',
    name: 'admin.chefs',
    meta: {
      title: 'chef::chefs.chefs',
      icon: 'tabler-chef-hat',
    },
    children: [
      {
        path: '',
        name: 'admin.chefs.index',
        component: () => import('@/modules/restaurant/pages/admin/chef/Index.vue'),
        meta: {
          permission: 'admin.chefs.index',
        },
      },
      {
        path: 'create',
        name: 'admin.chefs.create',
        component: () => import('@/modules/restaurant/pages/admin/chef/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'chef::chefs.chef' },
          permission: 'admin.chefs.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.chefs.edit',
        component: () => import('@/modules/restaurant/pages/admin/chef/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'chef::chefs.chef' },
          permission: 'admin.chefs.edit',
        },
      },
    ],
  },
  {
    path: 'restaurant-currencies',
    name: 'admin.restaurant_currencies.index',
    component: () => import('@/modules/restaurant/pages/admin/currency/Index.vue'),
    meta: {
      title: 'currency::restaurant_currencies.restaurant_currencies',
      icon: 'tabler-currency-dollar',
      permission: 'admin.restaurant_currencies.index',
    },
  },
  {
    path: 'restaurant-settings',
    name: 'admin.restaurant_settings.index',
    component: () => import('@/modules/restaurant/pages/admin/setting/Index.vue'),
    meta: {
      title: 'setting::settings.sections.restaurant',
      icon: 'tabler-settings',
      permission: 'admin.settings.edit',
    },
  },
]

export default adminRoutes
