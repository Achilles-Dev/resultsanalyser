export { default } from 'next-auth/middleware'

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
