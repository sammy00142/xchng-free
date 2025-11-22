import React from "react";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ChevronLeft, MoreVertical, Share } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { PresenceUser } from "@/app/(admin)/admin/(non-auth)/chat/[chatId]/page";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { presenceAtom } from "@/lib/stores/presence-store";

interface ChatHeaderProps {
  onBack?: () => void;
  activeUsers: PresenceUser[];
}

export const ChatHeader: React.FC<Omit<ChatHeaderProps, "activeUsers">> = ({
  onBack,
}) => {
  const activeUsers = useAtomValue(presenceAtom);

  // Memoize admin lookup
  const admin = useMemo(
    () => activeUsers.find((u) => u.isAdmin),
    [activeUsers]
  );

  return (
    <div className="px-4 py-2 flex items-center justify-between relative">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ChevronLeft />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={admin ? "admin" : "bot"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className=""
        >
          <span className="text-[10px] opacity-70">Chatting with</span>
          <h4
            className={
              "text-[12px] flex align-middle place-items-center gap-1 font-semibold capitalize"
            }
          >
            {admin ? (
              <BadgeCheck className="text-primary" size={14} />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
              >
                <path
                  d="M14.5001 2.25V5.25M16.0001 3.75H13.0001M2.50008 12.75V14.25M3.25008 13.5H1.75008M6.95283 11.625C6.88587 11.3654 6.75058 11.1286 6.56104 10.939C6.3715 10.7495 6.13463 10.6142 5.87508 10.5473L1.27383 9.36075C1.19533 9.33847 1.12623 9.29119 1.07704 9.22609C1.02784 9.16098 1.00122 9.08161 1.00122 9C1.00122 8.9184 1.02784 8.83902 1.07704 8.77392C1.12623 8.70881 1.19533 8.66153 1.27383 8.63925L5.87508 7.452C6.13454 7.38511 6.37135 7.24993 6.56088 7.06053C6.75041 6.87113 6.88575 6.63442 6.95283 6.375L8.13933 1.77375C8.16138 1.69494 8.20861 1.62551 8.27382 1.57605C8.33902 1.52659 8.41861 1.49982 8.50045 1.49982C8.58229 1.49982 8.66188 1.52659 8.72709 1.57605C8.79229 1.62551 8.83952 1.69494 8.86158 1.77375L10.0473 6.375C10.1143 6.63456 10.2496 6.87143 10.4391 7.06097C10.6287 7.25051 10.8655 7.3858 11.1251 7.45275L15.7263 8.6385C15.8055 8.66033 15.8752 8.70751 15.925 8.77281C15.9747 8.83811 16.0016 8.91792 16.0016 9C16.0016 9.08208 15.9747 9.16189 15.925 9.2272C15.8752 9.2925 15.8055 9.33968 15.7263 9.3615L11.1251 10.5473C10.8655 10.6142 10.6287 10.7495 10.4391 10.939C10.2496 11.1286 10.1143 11.3654 10.0473 11.625L8.86083 16.2263C8.83877 16.3051 8.79154 16.3745 8.72634 16.424C8.66113 16.4734 8.58154 16.5002 8.4997 16.5002C8.41786 16.5002 8.33827 16.4734 8.27307 16.424C8.20787 16.3745 8.16063 16.3051 8.13858 16.2263L6.95283 11.625Z"
                  stroke="url(#paint0_linear_312_2248)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_312_2248"
                    x1="10.5002"
                    y1="-1.5"
                    x2="-1.99976"
                    y2="16"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2662D9" />
                    <stop offset="1" stopColor="#FF00C7" />
                  </linearGradient>
                </defs>
              </svg>
            )}
            {admin ? "Agent" : "Bot"}
          </h4>
        </motion.div>
      </AnimatePresence>
      <Drawer>
        <DrawerTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical />
                  <span className="sr-only">More options</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DrawerTrigger>

        <DrawerContent>
          <Button
            variant={"ghost"}
            className="flex w-full place-items-center justify-start gap-4"
          >
            <Share size={16} />
            Share
          </Button>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
