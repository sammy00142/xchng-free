import { Button } from "@/components/ui/button";
import { UserPlus2, BarChartBig, Lock } from "lucide-react";
import React from "react";

const settings = [
  {
    title: "Manage users",
    link: "/admin/users",
    icon: <UserPlus2 size={20} className={"text-green-500"} />,
    disabled: false,
    latest: false,
  },
  {
    title: "View analytics",
    link: "",
    icon: <BarChartBig size={20} className={"text-violet-500"} />,
    disabled: true,
    latest: true,
  },
];

const AdvancedSettings = () => {
  return (
    <div className="max-w-screen-md mx-auto p-2 md:p-16">
      <h4 className="mb-4 font-bold text-xl">Advanced settings</h4>
      {settings.map(({ title, icon, latest }, idx) => (
        <Button
          key={idx}
          className="flex place-items-center justify-between align-middle gap-4 rounded-none w-full dark:hover:bg-neutral-900 border-b dark:border-b-neutral-700 outline-2 dark:hover:outline-neutral-600 border-b-neutral-200 h-12 hover:ring-0 transition-all duration-300 ease-in-out"
          variant={"ghost"}
          disabled={title === "View analytics"}
        >
          <div className="flex gap-2">
            {icon}
            <h4 className="">{title}</h4>
          </div>

          <div className="flex gap-2">
            {title === "View analytics" && (
              <Lock size={14} className="text-neutral-500" />
            )}
            {latest && (
              <div
                className="text-[8px] h-3 w-5 grid place-items-center justify-center text-white bg-violet-400 rounded-[4px] !opacity-100"
                style={{ lineHeight: "1px" }}
              >
                NEW
              </div>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default AdvancedSettings;
