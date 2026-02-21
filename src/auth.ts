import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "E-post", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!password) return null;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          try {
            const supabase = createSupabaseAdminClient();
            const { data, error } = await supabase.auth.signInWithPassword({
              email: email || "",
              password,
            });
            if (error || !data.user) {
              throw new CredentialsSignin("E-post eller lösenord stämmer inte.");
            }

            return {
              id: data.user.id,
              name: data.user.user_metadata?.name ?? "Admin",
              email: data.user.email ?? email,
              role: "admin",
            };
          } catch (e) {
            if (e instanceof CredentialsSignin) throw e;
            return null;
          }
        }

        const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
        if (password === adminPassword) {
          return {
            id: "admin",
            name: "Admin",
            email: email ?? "admin@cateringtanne.se",
            role: "admin",
          };
        }
        throw new CredentialsSignin("E-post eller lösenord stämmer inte.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { role?: string }).role = (token.role as string) ?? "admin";
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        (user as { role?: string }).role = "guest";
      }
      if (account?.provider === "credentials") {
        (user as { role?: string }).role = "admin";
      }
      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
});
