import React from "react";

type DescriptionInputProps = {
  description: string;
  setDescription: (description: string) => void;
};

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  setDescription,
}) => (
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="p-2 w-full bg-neutral-200 rounded-md"
    placeholder="Explain here..."
  />
);

export default DescriptionInput;
