import { api } from "@/utils/api";
import { Button } from "../ui/button";

export function UserList() {
  const { data: user } = api.user.getAll.useQuery();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col rounded-lg">
      {user.map((room) => (
        <Button
          variant={"ghost"}
          className="overflow-hidden text-ellipsis p-4"
          key={room.id}
        >
          {room.name}
        </Button>
      ))}
    </div>
  );
}
