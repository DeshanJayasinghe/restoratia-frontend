import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'galleries',
    name: 'admin.galleries',
    meta: {
      title: 'gallery::base.galleries',
      icon: 'tabler-photo',
    },
    children: [
      {
        path: '',
        name: 'admin.galleries.index',
        component: () => import('@/modules/gallery/pages/admin/gallery/Index.vue'),
        meta: {
          permission: 'admin.galleries.index',
        },
      },
      {
        path: 'create',
        name: 'admin.galleries.create',
        component: () => import('@/modules/gallery/pages/admin/gallery/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'gallery::galleries.gallery' },
          permission: 'admin.galleries.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.galleries.edit',
        component: () => import('@/modules/gallery/pages/admin/gallery/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'gallery::galleries.gallery' },
          permission: 'admin.galleries.edit',
        },
      },
    ],
  },
]

export default adminRoutes
