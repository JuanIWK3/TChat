import { type Room } from '@prisma/client';
import { type PropsWithChildren, createContext, useContext, useState } from 'react';

type RoomContextData = {
  selectedRoom: Room | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Room | null>>;
};

const RoomContext = createContext<RoomContextData>({} as RoomContextData);

export const useRoomContext = () => {
  return useContext(RoomContext);
};

export const RoomProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const value = {
    selectedRoom,
    setSelectedRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
