import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'testimonials',
    name: 'admin.testimonials',
    meta: {
      title: 'testimonial::base.testimonials',
      icon: 'tabler-quote',
    },
    children: [
      {
        path: '',
        name: 'admin.testimonials.index',
        component: () => import('@/modules/testimonial/pages/admin/testimonial/Index.vue'),
        meta: {
          permission: 'admin.testimonials.index',
        },
      },
      {
        path: 'create',
        name: 'admin.testimonials.create',
        component: () => import('@/modules/testimonial/pages/admin/testimonial/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'testimonial::testimonials.testimonial' },
          permission: 'admin.testimonials.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.testimonials.edit',
        component: () => import('@/modules/testimonial/pages/admin/testimonial/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'testimonial::testimonials.testimonial' },
          permission: 'admin.testimonials.edit',
        },
      },
    ],
  },
]

export default adminRoutes
