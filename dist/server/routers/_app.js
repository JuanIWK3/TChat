"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
/**
 * This file contains the root router of your tRPC-backend
 */
const trpc_1 = require("../trpc");
const message_1 = require("./message");
const room_1 = require("./room");
exports.appRouter = (0, trpc_1.router)({
    message: message_1.postRouter,
    room: room_1.roomRouter,
});
