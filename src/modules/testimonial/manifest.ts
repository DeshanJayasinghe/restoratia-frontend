import type { ModuleManifest } from '@/modules/core/contracts/ModuleManifest.ts'
import adminRoutes from '@/modules/testimonial/routes/admin.routes.ts'
import { adminSidebar } from '@/modules/testimonial/sidebars/admin.sidebar.ts'

const manifest: ModuleManifest = {
  name: 'testimonial',
  routes: [
    {
      target: 'admin',
      routes: adminRoutes,
    },
  ],
  sidebars: [adminSidebar],
}

export default manifest
