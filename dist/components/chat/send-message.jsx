"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageForm = void 0;
const form_1 = require("@/components/ui/form");
const room_1 = require("@/contexts/room");
const trpc_1 = require("@/utils/trpc");
const zod_1 = require("@hookform/resolvers/zod");
const lucide_react_1 = require("lucide-react");
const react_1 = require("next-auth/react");
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
function SendMessageForm({}) {
    var _a;
    const { selectedRoom } = (0, room_1.useRoomContext)();
    const sendMessage = trpc_1.trpc.message.add.useMutation();
    const { data: session } = (0, react_1.useSession)();
    const formSchema = zod_2.z.object({
        text: zod_2.z.string(),
    });
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
    });
    async function onSubmit(values) {
        var _a;
        try {
            await sendMessage.mutateAsync({
                text: values.text,
                roomId: (_a = selectedRoom === null || selectedRoom === void 0 ? void 0 : selectedRoom.id) !== null && _a !== void 0 ? _a : '',
            });
        }
        catch { }
        console.log(values);
        form.reset({
            text: '',
        });
    }
    const userName = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name;
    if (!userName) {
        return (<div className="flex w-full justify-between rounded px-3 py-2 text-lg">
        <p className="font-bold">
          You have to{' '}
          <button_1.Button className="inline font-bold underline" onClick={() => void (0, react_1.signIn)()}>
            sign in
          </button_1.Button>{' '}
          to write.
        </p>
        <button_1.Button onClick={() => void (0, react_1.signIn)()} data-testid="signin" className="h-full rounded px-4">
          Sign In
        </button_1.Button>
      </div>);
    }
    return (<form_1.Form {...form}>
      <form onSubmit={void form.handleSubmit(onSubmit)} className=" flex w-full items-center justify-center gap-2">
        <form_1.FormField control={form.control} name="text" render={({ field }) => (<form_1.FormItem className="w-full">
              <form_1.FormControl className="">
                <input_1.Input className="w-full" placeholder="Type here" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <button_1.Button type="submit" variant={'ghost'}>
          <lucide_react_1.SendHorizontal />
        </button_1.Button>
      </form>
    </form_1.Form>);
}
exports.SendMessageForm = SendMessageForm;
