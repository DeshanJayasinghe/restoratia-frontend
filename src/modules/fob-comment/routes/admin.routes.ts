import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'comments',
    name: 'admin.comments',
    meta: {
      title: 'fob-comment::base.comments',
      icon: 'tabler-message',
    },
    children: [
      {
        path: '',
        name: 'admin.comments.index',
        component: () => import('@/modules/fob-comment/pages/admin/comment/Index.vue'),
        meta: {
          permission: 'admin.comments.index',
        },
      },
      {
        path: ':id/show',
        name: 'admin.comments.show',
        component: () => import('@/modules/fob-comment/pages/admin/comment/Show.vue'),
        meta: {
          title: 'admin::resource.show',
          transParam: { resource: 'fob-comment::comments.comment' },
          permission: 'admin.comments.show',
        },
      },
    ],
  },
]

export default adminRoutes
