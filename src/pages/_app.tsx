import { type AppType } from "next/app";
import { Geist } from "next/font/google";
// import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
    <div className={geist.className}>
      <Component {...pageProps} />
    </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
