import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ChatProvider } from "@/contexts/chat-context";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
