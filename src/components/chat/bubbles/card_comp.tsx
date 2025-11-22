import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  desc?: ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  color?: string;
};

const CardComponent = ({ children, title, desc, footer, color }: Props) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className={`${color && `text-${color}-500 `} md:text-lg`}>
          {title}
        </CardTitle>
        {desc && <CardDescription className="text-xs">{desc}</CardDescription>}
      </CardHeader>
      {children && <CardContent className="">{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CardComponent;
