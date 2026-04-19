import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.comments',
      label: 'fob-comment::base.comments',
      icon: 'tabler-message',
      permission: ['admin.comments.index'],
      sort: 14,
      children: [
        {
          key: 'admin.comments.index',
          label: 'fob-comment::base.comments',
          to: { name: 'admin.comments.index' },
          permission: 'admin.comments.index',
        },
      ],
    },
  ],
}
