import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'blog-reports',
    name: 'admin.blog_reports',
    meta: {
      title: 'blog::base.blog_reports',
      icon: 'tabler-chart-histogram',
    },
    children: [
      {
        path: '',
        name: 'admin.blog_reports.index',
        component: () => import('@/modules/blog/pages/admin/report/Index.vue'),
        meta: {
          permission: 'admin.blog_reports.index',
        },
      },
    ],
  },
  {
    path: 'blog-posts',
    name: 'admin.blog_posts',
    meta: {
      title: 'blog::base.blog_posts',
      icon: 'tabler-article',
    },
    children: [
      {
        path: '',
        name: 'admin.blog_posts.index',
        component: () => import('@/modules/blog/pages/admin/post/Index.vue'),
        meta: {
          permission: 'admin.blog_posts.index',
        },
      },
      {
        path: 'create',
        name: 'admin.blog_posts.create',
        component: () => import('@/modules/blog/pages/admin/post/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'blog::blog_posts.post' },
          permission: 'admin.blog_posts.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.blog_posts.edit',
        component: () => import('@/modules/blog/pages/admin/post/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'blog::blog_posts.post' },
          permission: 'admin.blog_posts.edit',
        },
      },
    ],
  },
  {
    path: 'blog-categories',
    name: 'admin.blog_categories',
    meta: {
      title: 'blog::base.blog_categories',
      icon: 'tabler-folders',
    },
    children: [
      {
        path: '',
        name: 'admin.blog_categories.index',
        component: () => import('@/modules/blog/pages/admin/category/Index.vue'),
        meta: {
          permission: 'admin.blog_categories.index',
        },
      },
      {
        path: 'create',
        name: 'admin.blog_categories.create',
        component: () => import('@/modules/blog/pages/admin/category/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'blog::blog_categories.category' },
          permission: 'admin.blog_categories.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.blog_categories.edit',
        component: () => import('@/modules/blog/pages/admin/category/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'blog::blog_categories.category' },
          permission: 'admin.blog_categories.edit',
        },
      },
    ],
  },
  {
    path: 'blog-tags',
    name: 'admin.blog_tags',
    meta: {
      title: 'blog::base.blog_tags',
      icon: 'tabler-tags',
    },
    children: [
      {
        path: '',
        name: 'admin.blog_tags.index',
        component: () => import('@/modules/blog/pages/admin/tag/Index.vue'),
        meta: {
          permission: 'admin.blog_tags.index',
        },
      },
      {
        path: 'create',
        name: 'admin.blog_tags.create',
        component: () => import('@/modules/blog/pages/admin/tag/Create.vue'),
        meta: {
          title: 'admin::resource.create',
          transParam: { resource: 'blog::blog_tags.tag' },
          permission: 'admin.blog_tags.create',
        },
      },
      {
        path: ':id/edit',
        name: 'admin.blog_tags.edit',
        component: () => import('@/modules/blog/pages/admin/tag/Edit.vue'),
        meta: {
          title: 'admin::resource.edit',
          transParam: { resource: 'blog::blog_tags.tag' },
          permission: 'admin.blog_tags.edit',
        },
      },
    ],
  },
]

export default adminRoutes
