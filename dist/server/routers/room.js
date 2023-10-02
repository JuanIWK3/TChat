"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const zod_1 = require("zod");
const db_1 = require("../db");
const trpc_1 = require("../trpc");
exports.roomRouter = (0, trpc_1.router)({
    getAll: trpc_1.authedProcedure.query(async () => {
        const posts = await db_1.db.room.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return posts;
    }),
    add: trpc_1.authedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1),
    }))
        .mutation(async ({ input }) => {
        const post = await db_1.db.room.create({
            data: {
                ...input,
            },
        });
        return post;
    }),
});
