"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = require("@/components/chat");
const sidebar_1 = require("@/components/sidebar");
const room_1 = require("@/contexts/room");
const react_1 = require("next-auth/react");
const head_1 = __importDefault(require("next/head"));
function IndexPage() {
    const { data: session, status } = (0, react_1.useSession)();
    const { selectedRoom } = (0, room_1.useRoomContext)();
    if (status === 'loading') {
        return (<div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>);
    }
    if (!(session === null || session === void 0 ? void 0 : session.user)) {
        return (<div className="flex w-full min-h-screen justify-center rounded px-3 py-2 text-lg items-center">
        <button onClick={() => void (0, react_1.signIn)()} data-testid="signin" className="">
          Sign In
        </button>
      </div>);
    }
    return (<>
      <head_1.default>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico"/>
      </head_1.default>
      <div className="flex h-screen">
        <sidebar_1.Sidebar />
        {!selectedRoom ? (<div className="flex w-full min-h-screen justify-center rounded px-3 py-2 text-lg items-center">
            <p className="font-bold">Select a room to start chatting</p>
          </div>) : (<chat_1.Chat room={selectedRoom}/>)}
      </div>
    </>);
}
exports.default = IndexPage;
