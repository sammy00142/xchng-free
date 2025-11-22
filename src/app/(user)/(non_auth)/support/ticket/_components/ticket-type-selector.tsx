import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ChevronDownIcon,
  BugAntIcon,
  CreditCardIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

type TicketTypeSelectorProps = {
  selectedType: string;
  onSelect: (type: string) => void;
};

const TicketTypeSelector: React.FC<TicketTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => (
  <Drawer>
    <DrawerTrigger className="p-3 bg-neutral-200 rounded-md flex justify-between">
      <div>
        <h6 className="text-[10px] text-neutral-500">Ticket type</h6>
        <h4>{selectedType}</h4>
      </div>
      <ChevronDownIcon width={14} />
    </DrawerTrigger>
    <DrawerContent className="p-4 max-w-md mx-auto">
      <DrawerClose onClick={() => onSelect("Bug report")}>
        <BugAntIcon width={24} /> Bug report
      </DrawerClose>
      <DrawerClose onClick={() => onSelect("Transaction issues")}>
        <CreditCardIcon width={24} /> Transaction issues
      </DrawerClose>
      <DrawerClose onClick={() => onSelect("Improvement suggestion")}>
        <SparklesIcon width={24} /> Improvement suggestion
      </DrawerClose>
      <DrawerClose onClick={() => onSelect("Question")}>
        <QuestionMarkCircleIcon width={24} /> Question
      </DrawerClose>
    </DrawerContent>
  </Drawer>
);

export default TicketTypeSelector;
