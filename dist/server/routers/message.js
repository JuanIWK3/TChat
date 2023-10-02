"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const observable_1 = require("@trpc/server/observable");
const events_1 = require("events");
const zod_1 = require("zod");
const db_1 = require("../db");
const trpc_1 = require("../trpc");
class MyEventEmitter extends events_1.EventEmitter {
}
// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter();
exports.postRouter = (0, trpc_1.router)({
    add: trpc_1.authedProcedure
        .input(zod_1.z.object({
        text: zod_1.z.string().min(1),
        roomId: zod_1.z.string().uuid(),
    }))
        .mutation(async ({ input, ctx }) => {
        const post = await db_1.db.message.create({
            data: {
                ...input,
                userId: ctx.user.id,
            },
            include: {
                user: true,
            },
        });
        ee.emit('add', post);
        return post;
    }),
    get: trpc_1.publicProcedure
        .input(zod_1.z.object({
        roomId: zod_1.z.string().uuid(),
    }))
        .query(async ({ input }) => {
        const page = await db_1.db.message.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
            },
            where: {
                roomId: input.roomId,
            },
        });
        const items = page.reverse();
        return {
            items,
        };
    }),
    onAdd: trpc_1.publicProcedure.subscription(() => {
        return (0, observable_1.observable)((emit) => {
            const onAdd = (data) => {
                emit.next(data);
            };
            ee.on('add', onAdd);
            return () => {
                ee.off('add', onAdd);
            };
        });
    }),
});
