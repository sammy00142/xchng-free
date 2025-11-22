import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical, Share } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { UserSelect } from "@/server/db/schema";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { adminPresenceAtom } from "@/lib/stores/admin-presence-store";

interface ChatHeaderProps {
  onBack?: () => void;
  user: UserSelect;
}

export const AdminChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  user,
}) => {
  const activeUsers = useAtomValue(adminPresenceAtom);

  const isActive = useMemo(
    () =>
      activeUsers.some(
        (activeUser) => activeUser.userId === user?.id && !activeUser.isAdmin
      ),
    [activeUsers, user?.id]
  );

  return (
    <div className="px-4 py-2 flex items-center justify-between relative">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ChevronLeft />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-fit">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex align-middle gap-1 place-items-center"
            >
              <div className="relative w-2 h-2">
                <motion.div
                  className="absolute w-full h-full bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute w-1 h-1 bg-green-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[12px] font-medium text-green-500">
                Active now
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex align-middle gap-1 place-items-center justify-center"
            >
              <div className="relative w-2 h-2">
                <div className="absolute w-1 h-1 bg-gray-400 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[12px] font-medium text-gray-500">
                Offline
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <h4 className="text-[13px] flex align-middle place-items-center gap-1 font-semibold capitalize">
          {user?.username}
        </h4>
      </div>
      <Drawer>
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
