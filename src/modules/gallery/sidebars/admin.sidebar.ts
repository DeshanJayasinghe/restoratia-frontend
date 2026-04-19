import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.galleries',
      label: 'gallery::base.galleries',
      icon: 'tabler-photo',
      permission: ['admin.galleries.index'],
      sort: 13,
      children: [
        {
          key: 'admin.galleries.index',
          label: 'gallery::base.galleries',
          to: { name: 'admin.galleries.index' },
          permission: 'admin.galleries.index',
        },
      ],
    },
  ],
}
