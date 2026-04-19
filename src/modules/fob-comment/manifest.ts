import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/fob-comment/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/fob-comment/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'fob-comment',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
