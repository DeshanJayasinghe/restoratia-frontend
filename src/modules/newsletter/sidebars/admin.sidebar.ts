import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.newsletters',
      label: 'newsletter::base.newsletters',
      icon: 'tabler-mail-forward',
      permission: ['admin.newsletters.index'],
      sort: 12,
      children: [
        {
          key: 'admin.newsletters.index',
          label: 'newsletter::base.newsletters',
          to: { name: 'admin.newsletters.index' },
          permission: 'admin.newsletters.index',
        },
      ],
    },
  ],
}
