import "~/styles/globals.css";

import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { type AppType } from "next/app";
import { Josefin_Sans } from "next/font/google";
import { useRouter } from "next/router";

import { AppLayout } from "~/layout/AppLayout";
import { api } from "~/utils/api";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
});

//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages = ["/"];

const MyApp: AppType = ({ Component, pageProps }) => {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  // If the current route is listed as public, render it directly
  // Otherwise, use Clerk to require authentication
  return (
    <ClerkProvider {...pageProps}>
      <div className={`${josefin.variable} font-sans`}>
        <AppLayout>
          {isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <>
              <SignedIn>
                <Component {...pageProps} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          )}
        </AppLayout>
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
