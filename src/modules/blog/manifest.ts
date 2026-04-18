import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/blog/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/blog/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'blog',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
