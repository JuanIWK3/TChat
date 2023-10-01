import { api } from "@/utils/api";
import { CreateRoom } from "./create-room";
import { Button } from "../ui/button";
import { useChatContext } from "@/contexts/chat-context";

export function RoomList() {
  const { data: rooms, refetch } = api.room.getAll.useQuery();
  const { selectedRoom, setSelectedRoom } = useChatContext();

  if (!rooms) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col rounded-lg py-4">
      <CreateRoom refetch={refetch} />
      {rooms.map((room) => (
        <Button
          key={room.id}
          variant={"ghost"}
          className="rounded-none p-4 text-center hover:bg-slate-100"
          onClick={() => {
            setSelectedRoom(room);
          }}
        >
          {room.name}
        </Button>
      ))}
    </div>
  );
}
