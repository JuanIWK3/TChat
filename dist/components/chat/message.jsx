"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContainer = void 0;
const react_1 = require("next-auth/react");
const MessageContainer = ({ message }) => {
    var _a, _b, _c, _d;
    const { data: session } = (0, react_1.useSession)();
    return (<div key={message.id} className={`flex flex-col border p-4 max-w-max rounded-md ${message.userId === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id) ? 'self-end' : ''}`}>
      <header className="flex space-x-2 text-sm">
        <h3 className="text-base">
          {(_c = (_b = message.user) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : (_d = message.user) === null || _d === void 0 ? void 0 : _d.email}
        </h3>
        <span className="">
          {new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(message.createdAt)}
        </span>
      </header>
      <p className="whitespace-pre-line text-xl leading-tight">
        {message.text}
      </p>
    </div>);
};
exports.MessageContainer = MessageContainer;
