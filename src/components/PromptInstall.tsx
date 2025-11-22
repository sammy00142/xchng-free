"use client";

import {
  ArrowDownOnSquareIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { postToast } from "./postToast";

export default function PromptInstall() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      setInstallPrompt(e as BeforeInstallPromptEvent);
    });
  }, []);

  if (!installPrompt) return null;

  return (
    // <div className="banner hidden justify-center gap-4 align-middle place-items-center px-4 py-2">
    //   <Button id="dissmissInstall" variant={"ghost"} size={"icon"}>
    //     <XMarkIcon width={14} />
    //   </Button>
    //   <p>Install for better experience!</p>
    //   <Button
    //     className="flex align-middle place-items-center justify-between gap-2"
    //     id="installButton"
    //   >
    //     <ArrowDownTrayIcon width={18} /> Install
    //   </Button>
    // </div>
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent>
        <DialogHeader>Insall App</DialogHeader>
        <DialogDescription>
          Install the app to get better experience!
        </DialogDescription>
        <div className="my-4 grid gap-2 place-items-center w-full">
          <Button
            onClick={async () => {
              if (installPrompt) {
                console.log("INSTALL PROMPT ACTIVE");
                await installPrompt.prompt();

                const result = await installPrompt.userChoice;
                if (result.outcome === "dismissed") {
                  postToast("App not installed!", {
                    action: {
                      label: "Undo",
                      onClick: () => {
                        installPrompt.prompt(), setOpen(true);
                      },
                    },
                  });
                } else {
                  postToast("App installed!", {
                    action: {
                      label: "Open",
                      onClick: () => {},
                    },
                  });
                }
              }
            }}
            className="w-full"
          >
            Install
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="w-full"
            variant={"ghost"}
          >
            Not now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
