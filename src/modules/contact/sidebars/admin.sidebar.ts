import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.contact',
      label: 'contact::base.contact',
      icon: 'tabler-mail',
      permission: ['admin.contacts.index', 'admin.contact_custom_fields.index'],
      sort: 10,
      children: [
        {
          key: 'admin.contacts.index',
          label: 'contact::base.contacts',
          to: { name: 'admin.contacts.index' },
          permission: 'admin.contacts.index',
        },
        {
          key: 'admin.contact_custom_fields.index',
          label: 'contact::base.contact_custom_fields',
          to: { name: 'admin.contact_custom_fields.index' },
          permission: 'admin.contact_custom_fields.index',
        },
      ],
    },
  ],
}
