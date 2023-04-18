import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { Josefin_Sans } from "next/font/google";

import { api } from "~/utils/api";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <main className={`${josefin.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
