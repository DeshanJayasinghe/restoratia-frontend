import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/contact/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/contact/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'contact',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
