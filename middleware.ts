// export { default } from 'next-auth/middleware'

// export const config = {
//   matcher: [
//     '/results',
//     '/results/analyse',
//     '/courses',
//     '/students',
//     '/subjects',
//     '/dashboard',
//   ],
// }

// @ts-ignore: no type declarations for 'middleware-chain'
import { chain } from 'middleware-chain'
import { default as authMiddleware } from 'next-auth/middleware'
// import { tenantMiddleware } from './middleware/tenant';

// Order matters: auth first → tenant second
// export default chain(authMiddleware, tenantMiddleware)
export default authMiddleware

// Keep your existing matcher (next-auth + your custom pages)
export const config = {
  matcher: [
    '/results',
    '/results/analyse',
    '/courses',
    '/students',
    '/subjects',
    '/dashboard',
  ],
}
