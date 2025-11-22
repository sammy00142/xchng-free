import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type ImageUploaderProps = {
  images: { data: string; name: string; type: string }[] | null;
  setImages: (images: { data: string; name: string; type: string }[]) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  if (!images) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((img, idx) => (
        <div key={idx} className="relative">
          <Button onClick={() => setImages(images.filter((_, i) => i !== idx))}>
            <XMarkIcon width={16} />
          </Button>
          <Image
            src={URL.createObjectURL(new Blob([img.data], { type: img.type }))}
            alt="Uploaded image"
          />
        </div>
      ))}
      {images.length < 3 && (
        <label className="p-6 border-dashed">
          <PlusIcon width={16} />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImages([
                  ...images,
                  {
                    data: URL.createObjectURL(file),
                    name: file.name,
                    type: file.type,
                  },
                ]);
              }
            }}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
