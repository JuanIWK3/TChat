import { useChatContext } from "@/contexts/chat-context";
import { type Room } from "@prisma/client";
import { MoreVertical, SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { type RoomWithUsersAndMessages } from "@/server/api/routers/room";
import { useState } from "react";
import { Input } from "../ui/input";

export function Chat() {
  const { selectedRoom: room } = useChatContext();

  if (!room) {
    return <div>Select a chat to start messaging</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <ChatHeader room={room} />
      <Messages room={room} />
      <Footer />
    </div>
  );
}

const Messages = ({ room }: { room: RoomWithUsersAndMessages }) => {
  return (
    <div className="h-full w-full">
      {room.messages.map((msg) => (
        <div key={msg.id}>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
};

const Footer = () => {
  const [message, setMessage] = useState("");

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
  };

  return (
    <div className="flex justify-between p-4">
      <form onSubmit={sendMsg} className="flex w-full">
        <Input
          type="text"
          placeholder="Type a message"
          className="w-full rounded-md p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          variant={"link"}
          onClick={() => {
            setMessage("");
          }}
        >
          <SendHorizontal />
        </Button>
      </form>
    </div>
  );
};

const ChatHeader = ({ room }: { room: Room }) => {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <h1 className="font-medium">{room.name}</h1>
      <Button variant={"link"}>
        <MoreVertical />
      </Button>
    </div>
  );
};
