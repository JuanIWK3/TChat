"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const trpc_1 = require("@/utils/trpc");
const button_1 = require("../ui/button");
const message_1 = require("./message");
const send_message_1 = require("./send-message");
const Chat = ({ room }) => {
    const { data: messages, refetch } = trpc_1.trpc.message.get.useQuery({
        roomId: room.id,
    });
    trpc_1.trpc.message.onAdd.useSubscription(undefined, {
        onData: () => {
            void refetch();
        },
    });
    return (<div className="flex-1 p-4">
      <button_1.Button onClick={() => void refetch()}></button_1.Button>
      <div className=""></div>
      <section className="flex h-full flex-col justify-end space-y-4 p-4">
        <div className="flex flex-col space-y-4 overflow-y-auto">
          {messages === null || messages === void 0 ? void 0 : messages.items.map((item) => (<message_1.MessageContainer key={item.id} message={item}/>))}
        </div>
        <div className="w-full">
          <send_message_1.SendMessageForm />
        </div>
      </section>
    </div>);
};
exports.Chat = Chat;
