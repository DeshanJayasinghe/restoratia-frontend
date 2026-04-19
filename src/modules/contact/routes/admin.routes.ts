import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'contacts',
    name: 'admin.contacts',
    meta: {
      title: 'contact::base.contacts',
      icon: 'tabler-mail',
    },
    children: [
      {
        path: '',
        name: 'admin.contacts.index',
        component: () => import('@/modules/contact/pages/admin/contact/Index.vue'),
        meta: {
          permission: 'admin.contacts.index',
        },
      },
      {
        path: ':id/show',
        name: 'admin.contacts.show',
        component: () => import('@/modules/contact/pages/admin/contact/Show.vue'),
        meta: {
          title: 'contact::contacts.form.cards.contact_information',
          permission: 'admin.contacts.show',
        },
      },
    ],
  },
  {
    path: 'contact-custom-fields',
    name: 'admin.contact_custom_fields',
    meta: {
      title: 'contact::base.contact_custom_fields',
      icon: 'tabler-forms',
    },
    children: [
      {
        path: '',
        name: 'admin.contact_custom_fields.index',
        component: () => import('@/modules/contact/pages/admin/custom-field/Index.vue'),
        meta: {
          permission: 'admin.contact_custom_fields.index',
        },
      },
      {
        path: 'create',
        name: 'admin.contact_custom_fields.create',
        component: () => import('@/modules/contact/pages/admin/custom-field/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'contact::custom_fields.custom_field' },
          permission: 'admin.contact_custom_fields.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.contact_custom_fields.edit',
        component: () => import('@/modules/contact/pages/admin/custom-field/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'contact::custom_fields.custom_field' },
          permission: 'admin.contact_custom_fields.edit',
        },
      },
    ],
  },
]

export default adminRoutes
