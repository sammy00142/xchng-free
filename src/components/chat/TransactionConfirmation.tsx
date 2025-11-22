import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const TransactionConfirmation = () => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-6 divide-y divide-neutral-300">
            <div className="flex align-middle pt-6 place-items-start justify-between">
              <div className="grid gap-1">
                <p className="text-neutral-500">Card</p>
                <h4 className="font-bold">Steam - Hong Kong Steam</h4>
              </div>
              <div className="grid gap-1 text-right">
                <p className="text-neutral-500">Price</p>
                <h4 className="font-bold">$39</h4>
              </div>
            </div>
            <div className="flex align-middle pt-4 place-items-start justify-between">
              <div className="grid gap-1">
                <p className="text-neutral-500">Account</p>
                <h4 className="font-bold">2002072357</h4>
                <h4 className="font-bold">Ahmed Abdullahi</h4>
              </div>
              <div className="grid gap-1 text-right">
                <p className="text-neutral-500">Bank</p>
                <h4 className="font-bold">Kuda MFB</h4>
              </div>
            </div>
            <div className="flex align-middle pt-4 place-items-start justify-between">
              <div className="grid gap-1">
                <p className="text-neutral-500">Our Rate</p>
                <h4 className="font-bold">$1 = N1,300</h4>
              </div>
              <div className="grid gap-1 text-right">
                <p className="text-neutral-500">Amount</p>
                <h4 className="font-bold">N44,500</h4>
              </div>
            </div>
          </div>
          <div className="pt-4 grid">
            <AlertDialogAction>
              <Button>I agree</Button>
            </AlertDialogAction>
            <AlertDialogCancel className="border-primary text-primary hover:text-secondary hover:bg-pink-100">
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionConfirmation;
