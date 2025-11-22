import { useRef } from "react";

const useScrollRef = () => {
  const scrollToBottom = useRef<HTMLDivElement>(null);

  return { scrollToBottom };
};

export default useScrollRef;
