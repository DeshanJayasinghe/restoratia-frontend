import type { SidebarList } from '@/modules/core/contracts/SidebarItem.ts'

export const adminSidebar: SidebarList = {
  target: 'admin',
  items: [
    {
      key: 'admin.blog',
      label: 'blog::base.blog',
      icon: 'tabler-article',
      permission: ['admin.blog_reports.index', 'admin.blog_posts.index', 'admin.blog_categories.index', 'admin.blog_tags.index'],
      sort: 6,
      children: [
        {
          key: 'admin.blog_posts.index',
          label: 'blog::base.blog_posts',
          to: { name: 'admin.blog_posts.index' },
          permission: 'admin.blog_posts.index',
        },
        {
          key: 'admin.blog_categories.index',
          label: 'blog::base.blog_categories',
          to: { name: 'admin.blog_categories.index' },
          permission: 'admin.blog_categories.index',
        },
        {
          key: 'admin.blog_tags.index',
          label: 'blog::base.blog_tags',
          to: { name: 'admin.blog_tags.index' },
          permission: 'admin.blog_tags.index',
        },
                {
          key: 'admin.blog_reports.index',
          label: 'blog::base.blog_reports',
          to: { name: 'admin.blog_reports.index' },
          permission: 'admin.blog_reports.index',
        },
      ],
    },
  ],
}
