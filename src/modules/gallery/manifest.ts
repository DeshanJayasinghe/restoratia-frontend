import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/gallery/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/gallery/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'gallery',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
