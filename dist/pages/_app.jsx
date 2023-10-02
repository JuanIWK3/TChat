"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../styles/global.css");
const react_1 = require("next-auth/react");
const trpc_1 = require("@/utils/trpc");
const room_1 = require("@/contexts/room");
const MyApp = ({ Component, pageProps, }) => {
    return (<react_1.SessionProvider session={pageProps.session}>
      <room_1.RoomProvider>
        <Component {...pageProps}/>
      </room_1.RoomProvider>
    </react_1.SessionProvider>);
};
MyApp.getInitialProps = async ({ ctx }) => {
    return {
        session: await (0, react_1.getSession)(ctx),
    };
};
exports.default = trpc_1.trpc.withTRPC(MyApp);
