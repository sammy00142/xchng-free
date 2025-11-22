import Image from "next/image";
import React, { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./canvasPreview";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@radix-ui/react-icons";
import Loading from "@/app/loading";
import { dataURLToBlob } from "@/lib/utils/dataURLToBlob";

type Props = {
  setImgSrc: React.Dispatch<React.SetStateAction<string>>;
  imgSrc: string;
  ASPECT_RATIO: number | undefined;
  MIN_DIMENSION: number;
  setImage: React.Dispatch<React.SetStateAction<File | null | undefined>>;
  image: File | null | undefined;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
  loading: boolean;
};

const ImageCropper = ({
  setImgSrc,
  imgSrc,
  ASPECT_RATIO,
  MIN_DIMENSION,
  setImage,
  image,
  setEdit,
  edit,
  loading,
}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      1 / 1,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const finishEdit = () => {
    if (imgRef.current && previewCanvasRef.current) {
      setCanvasPreview(
        imgRef.current, // HTMLImageElement
        previewCanvasRef.current, // HTMLCanvasElement
        convertToPixelCrop(
          crop as Crop,
          imgRef.current.width,
          imgRef.current.height
        )
      );

      const dataUrl = previewCanvasRef.current.toDataURL();
      const blob = dataURLToBlob(dataUrl);
      const url = URL.createObjectURL(blob);
      const toFile = new File([blob], image?.name as string, {
        type: image?.type,
        lastModified: new Date().getTime(),
      });
      setImgSrc(url);
      setImage(toFile);
      setEdit(false);
    }
  };

  return (
    <div className=" w-fit mx-auto">
      <div className="relative w-fit ">
        <div className="absolute top-2 right-2 z-50 bg-white dark:bg-black bg-opacity-50 backdrop-blur-md rounded-sm">
          {edit ? (
            <div className="flex align-middle place-items-center justify-between">
              <button
                title="Cancel edit"
                className="p-1.5 rounded-l-sm hover:bg-white dark:hover:bg-neutral-600 hover:bg-opacity-50 dark:hover:bg-opacity-50"
                onClick={() => setEdit(false)}
              >
                <XMarkIcon width={16} />
              </button>
              <button
                disabled={loading}
                title="Finish edit"
                className="p-1.5 rounded-r-sm hover:bg-white dark:hover:bg-neutral-600 hover:bg-opacity-50 dark:hover:bg-opacity-50"
                onClick={() => finishEdit()}
              >
                <CheckIcon width={16} />
              </button>
            </div>
          ) : (
            <button
              disabled={loading}
              title="Edit image"
              className="p-1.5 rounded-sm hover:bg-white dark:hover:bg-neutral-600 hover:bg-opacity-50 dark:hover:bg-opacity-50"
              onClick={() => setEdit(true)}
            >
              <PencilIcon width={16} />
            </button>
          )}
        </div>
        <div className="w-fit">
          {loading && <Loading />}
          {edit ? (
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop) => {
                setCrop(pixelCrop);
              }}
              aspect={ASPECT_RATIO}
              keepSelection
              minWidth={MIN_DIMENSION}
              minHeight={MIN_DIMENSION}
              className="w-full m-0 p-0 max-h-[50vh]"
            >
              <Image
                ref={imgRef}
                src={imgSrc}
                width={500}
                height={500}
                className="w-full max-h-[50vh]"
                alt="Upload"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <Image
              src={imgSrc}
              alt=""
              width={200}
              height={200}
              className="w-full max-h-[50vh]"
            />
          )}
        </div>
      </div>

      {crop && <canvas ref={previewCanvasRef} className="mt-4 hidden" />}
    </div>
  );
};

export default ImageCropper;
