"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerAuthSession = exports.authOptions = void 0;
const prisma_adapter_1 = require("@next-auth/prisma-adapter");
const next_auth_1 = require("next-auth");
const github_1 = __importDefault(require("next-auth/providers/github"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const db_1 = require("./db");
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
exports.authOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: (0, prisma_adapter_1.PrismaAdapter)(db_1.db),
    providers: [
        (0, github_1.default)({
            clientId: (_a = process.env.GITHUB_CLIENT_ID) !== null && _a !== void 0 ? _a : '',
            clientSecret: (_b = process.env.GITHUB_CLIENT_SECRET) !== null && _b !== void 0 ? _b : '',
        }),
        (0, google_1.default)({
            clientId: (_c = process.env.GOOGLE_CLIENT_ID) !== null && _c !== void 0 ? _c : '',
            clientSecret: (_d = process.env.GOOGLE_CLIENT_SECRET) !== null && _d !== void 0 ? _d : '',
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
const getServerAuthSession = (ctx) => {
    return (0, next_auth_1.getServerSession)(ctx.req, ctx.res, exports.authOptions);
};
exports.getServerAuthSession = getServerAuthSession;
