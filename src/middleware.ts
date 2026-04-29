import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    // Protect the admin root and all sub-routes except the login page
    "/admin",
    "/admin/((?!login).*)",
  ],
};
