import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const createHandler = () =>
  NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    providers: [
      GoogleProvider({
        clientId: googleClientId as string,
        clientSecret: googleClientSecret as string
      })
    ]
  })

const missingEnvResponse = () =>
  NextResponse.json(
    { error: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET' },
    { status: 500 }
  )

export const GET = async (request: Request, context: unknown) => {
  if (!googleClientId || !googleClientSecret) {
    return missingEnvResponse()
  }
  const handler = createHandler()
  return handler(request, context as never)
}

export const POST = async (request: Request, context: unknown) => {
  if (!googleClientId || !googleClientSecret) {
    return missingEnvResponse()
  }
  const handler = createHandler()
  return handler(request, context as never)
}
