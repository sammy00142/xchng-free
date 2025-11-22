import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

type SubmitButtonProps = {
  description: string;
  sent: boolean;
  onSentChange: (sent: boolean) => void;
  onSubmit: () => void;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  description,
  sent,
  onSentChange,
  onSubmit,
}) => (
  <AlertDialog open={sent} onOpenChange={onSentChange}>
    {description.length > 2 ? (
      <AlertDialogTrigger asChild>
        <button className="w-full sm:w-auto rounded-md text-white bg-primary">
          Submit
        </button>
      </AlertDialogTrigger>
    ) : (
      <button disabled className="w-full sm:w-auto rounded-md bg-gray-300">
        Submit
      </button>
    )}
    <AlertDialogContent>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
          onSentChange(false);
        }}
      >
        <input type="text" placeholder="Fullname" required />
        <input type="email" placeholder="Email" required />
        <button type="submit" className="bg-primary text-white">
          Submit
        </button>
      </form>
    </AlertDialogContent>
  </AlertDialog>
);

export default SubmitButton;
