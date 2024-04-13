import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth, { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log(credentials)
        const authResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        )
      
        if (!authResponse.ok) {
          return null
        }

        const user = await authResponse.json()
        return user.response
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
}

export default NextAuth(authOptions)
