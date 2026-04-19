import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'newsletters',
    name: 'admin.newsletters',
    meta: {
      title: 'newsletter::base.newsletters',
      icon: 'tabler-mail-forward',
    },
    children: [
      {
        path: '',
        name: 'admin.newsletters.index',
        component: () => import('@/modules/newsletter/pages/admin/newsletter/Index.vue'),
        meta: {
          permission: 'admin.newsletters.index',
        },
      },
    ],
  },
]

export default adminRoutes
