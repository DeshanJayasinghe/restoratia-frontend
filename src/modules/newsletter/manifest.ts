import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/newsletter/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/newsletter/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'newsletter',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
