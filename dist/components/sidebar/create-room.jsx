"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoom = void 0;
const zod_1 = require("@hookform/resolvers/zod");
const dialog_1 = require("@/components/ui/dialog");
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const trpc_1 = require("@/utils/trpc");
const lucide_react_1 = require("lucide-react");
function CreateRoom({ refetch: refetchRooms, }) {
    const createRoom = trpc_1.trpc.room.add.useMutation({
        onSuccess: () => {
            refetchRooms();
            window.location.reload();
        },
    });
    const formSchema = zod_2.z.object({
        name: zod_2.z.string().min(2).max(50),
    });
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {},
    });
    function onSubmit(values) {
        createRoom.mutate(values);
    }
    return (<div className="text-center">
      <dialog_1.Dialog>
        <dialog_1.DialogTrigger className="w-full flex items-center justify-center py-2">
          <lucide_react_1.FolderPlus />
        </dialog_1.DialogTrigger>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Create a new room</dialog_1.DialogTitle>
            <form_1.Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
                <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem>
                      <form_1.FormLabel>Name</form_1.FormLabel>
                      <form_1.FormControl>
                        <input_1.Input placeholder="arch btw" {...field}/>
                      </form_1.FormControl>
                      <form_1.FormDescription>
                        This is the name of the room. It cannot be changed
                        later.
                      </form_1.FormDescription>
                      <form_1.FormMessage />
                    </form_1.FormItem>)}/>
                <button_1.Button type="submit">Create</button_1.Button>
              </form>
            </form_1.Form>
          </dialog_1.DialogHeader>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
exports.CreateRoom = CreateRoom;
