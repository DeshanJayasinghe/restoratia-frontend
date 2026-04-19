import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.testimonials',
      label: 'testimonial::base.testimonials',
      icon: 'tabler-quote',
      permission: ['admin.testimonials.index'],
      sort: 11,
      children: [
        {
          key: 'admin.testimonials.index',
          label: 'testimonial::base.testimonials',
          to: { name: 'admin.testimonials.index' },
          permission: 'admin.testimonials.index',
        },
      ],
    },
  ],
}
