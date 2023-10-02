"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const react_1 = require("next-auth/react");
const button_1 = require("../ui/button");
const trpc_1 = require("@/utils/trpc");
const create_room_1 = require("./create-room");
const room_1 = require("@/contexts/room");
const Sidebar = () => {
    const { data: rooms, refetch } = trpc_1.trpc.room.getAll.useQuery();
    const { setSelectedRoom } = (0, room_1.useRoomContext)();
    return (<aside className="border-r p-4">
      <button_1.Button variant={'default'} onClick={() => void (0, react_1.signOut)()}>
        Logout
      </button_1.Button>
      <div className="border-b border-gray-300 mt-4"></div>
      <h3 className="font-bold my-4 text-center">Rooms</h3>

      <create_room_1.CreateRoom refetch={refetch}/>

      {rooms === null || rooms === void 0 ? void 0 : rooms.map((room) => (<div key={room.id} className="mt-4">
          <button_1.Button variant={'outline'} className="w-full" onClick={() => {
                setSelectedRoom(room);
            }}>
            {room.name}
          </button_1.Button>
        </div>))}
    </aside>);
};
exports.Sidebar = Sidebar;
