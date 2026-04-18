import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/restaurant/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/restaurant/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'restaurant',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
