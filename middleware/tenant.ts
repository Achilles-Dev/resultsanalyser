import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { runWithTenant } from '@/libs/tenantContext';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function tenantMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Public paths – skip tenant logic
  if (pathname.startsWith('/login') || pathname.startsWith('/api') || pathname.startsWith('/')) {
    return NextResponse.next()
  }

  const session = await getServerSession(authOptions)

  let tenantId: string | null = null

  // if (session?.user?.schoolId) {
  //   tenantId = session.user.schoolId as string
  // }

  // Optional superadmin override
  // if (session?.user?.role === 'superadmin' && req.headers.get('x-tenant-override')) {
  //   tenantId = req.headers.get('x-tenant-override')
  // }

  if (!tenantId && !pathname.startsWith('/school')) {
    return NextResponse.redirect(new URL('/school', req.url))
  }

  // ← This is the key: wrap the rest of the chain in tenant context
  return runWithTenant(tenantId, () => NextResponse.next())
}