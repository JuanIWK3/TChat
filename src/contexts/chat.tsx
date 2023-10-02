import { type Room } from '@prisma/client';
import { User } from 'next-auth';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

type ChatContextData = {
  selectedRoom: Room | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Room | null>>;
};

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export const useRoomContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const value = {
    selectedRoom,
    setSelectedRoom,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
