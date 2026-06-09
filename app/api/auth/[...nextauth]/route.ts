import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const ALLOWED_EMAIL = 'sumaproyect19@gmail.com'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === ALLOWED_EMAIL
    },
    async session({ session }) {
      return session
    },
  },
  pages: {
    signIn:  '/admin',
    error:   '/admin',
  },
})

export { handler as GET, handler as POST }
