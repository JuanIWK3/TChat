import { type RoomWithUsersAndMessages } from "@/server/api/routers/room";
import { type Room } from "@prisma/client";
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type ChatContextType = {
  selectedRoom: RoomWithUsersAndMessages | null;
  setSelectedRoom: (room: RoomWithUsersAndMessages | null) => void;
};

const ChatContext = createContext<ChatContextType>({
  selectedRoom: null,
  setSelectedRoom: () => {
    throw new Error("setSelectedRoom was not initialized");
  },
});

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] =
    useState<RoomWithUsersAndMessages | null>(null);

  const value = { selectedRoom, setSelectedRoom };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
