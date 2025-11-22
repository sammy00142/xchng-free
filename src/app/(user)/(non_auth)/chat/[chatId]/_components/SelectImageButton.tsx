import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SelectImageButtonProps = {
  setImgSrc: React.Dispatch<React.SetStateAction<string>>;
  setRealUrl: React.Dispatch<React.SetStateAction<string>>;
  setImage: React.Dispatch<React.SetStateAction<File | null | undefined>>;
};

/**
 * Component for selecting an image from the user's device.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setImgSrc - The function to set the image source.

* @returns {JSX.Element} The SelectImageButton component.
 */
export const SelectImageButton = ({
  setImgSrc,
  setImage,
}: SelectImageButtonProps) => {
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
  };

  return (
    <div className="p-2 grid place-items-center">
      <Label
        htmlFor="gallery"
        className="p-8 rounded-xl border-2 border-dashed cursor-pointer hover:bg-purple-100 dark:hover:bg-opacity-30 dark:hover:bg-purple-900 hover:border-purple-300 dark:hover:border-purple-950 duration-300"
      >
        Select an Image
      </Label>
      <Input
        className="hidden"
        id="gallery"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setImgSrc(url);
          }
          onSelectFile(e);
        }}
      />
    </div>
  );
};
