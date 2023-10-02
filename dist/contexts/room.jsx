"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomProvider = exports.useRoomContext = void 0;
const react_1 = require("react");
const RoomContext = (0, react_1.createContext)({});
const useRoomContext = () => {
    return (0, react_1.useContext)(RoomContext);
};
exports.useRoomContext = useRoomContext;
const RoomProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = (0, react_1.useState)(null);
    const value = {
        selectedRoom,
        setSelectedRoom,
    };
    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
exports.RoomProvider = RoomProvider;
