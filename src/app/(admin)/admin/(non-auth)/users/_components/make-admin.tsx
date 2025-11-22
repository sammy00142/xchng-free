import { postToast } from "@/components/postToast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { makeAdminAction as originalMakeAdminAction } from "@/lib/utils/adminActions/getAllUsers";
import { Loader2, UserCheck2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

type User = {
  id: string;
  username: string;
  isAdmin: boolean;
  email: string;
  image: string | undefined;
  role: string;
  messages: string[];
  transactions: string[];
  disabled: boolean;
  customClaims:
    | {
        [key: string]: any;
      }
    | undefined;
};

const initialState = {
  message: "",
  success: false,
};

const wrappedMakeAdminAction = async (
  _prevState: typeof initialState,
  formData: FormData
) => {
  const userId = formData.get("userId") as string;
  const result = await originalMakeAdminAction(userId);
  return { message: result.message, success: result.ok };
};

const MakeAdmin = ({ user, working }: { user: User; working: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [randomId, setRandomId] = useState("");
  const [state, formAction] = useFormState(
    wrappedMakeAdminAction,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setRandomId(Math.random().toString(36).substring(2, 15));
    }
  }, [isOpen]);

  useEffect(() => {
    if (state.success) {
      postToast(state.message || "User made admin successfully");
      setIsOpen(false);
      router.refresh();
    } else if (state.message) {
      postToast(state.message);
    }
  }, [state, router]);

  const handleSubmit = async (formData: FormData) => {
    if (formData.get("randomId") !== randomId) {
      postToast("Incorrect ID");
      return;
    }

    formData.set("userId", user.id);
    formAction(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={working}
          className="w-full flex gap-2 justify-start duration-300 transition-all ease-in dark:hover:bg-neutral-900 text-red-500"
        >
          <UserCheck2 size={20} /> <h4>Make admin</h4>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl">Are you sure?</DialogTitle>
          <DialogDescription className="text-left md:text-sm">
            Confirm you want to make{" "}
            <span className="font-bold capitalize text-primary">
              {user.username}
            </span>{" "}
            an admin by typing this ID:
            <br />
            <h4 className="font-bold mt-4 text-sm tracking-wide dark:text-white text-black">
              {randomId}
            </h4>
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit}>
          <div className="mb-8">
            <Input
              name="randomId"
              required
              type="text"
              className="text-sm pointer-events-auto"
              placeholder={randomId}
            />
          </div>
          {state.message && <p className="text-xs">{state.message}</p>}
          <SubmitButton />
        </form>

        <DialogClose asChild>
          <Button type="button">Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={"outline"}
      className="w-full"
      disabled={pending}
    >
      Confirm
      {pending && <Loader2 size={16} className="animate-spin ml-2" />}
    </Button>
  );
}

export default MakeAdmin;
