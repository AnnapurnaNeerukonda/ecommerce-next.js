import NextAuth from "next-auth"
import { options } from "../../auth/nextauth/options"

const handler = NextAuth(options)

export { handler as GET, handler as POST }
