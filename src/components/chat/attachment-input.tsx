"use client";

import React, { useMemo, useCallback, useRef, useState } from "react";
import Image from "next/image";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X, Send, Crop, Trash2, Check } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { v4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/utils/firebase";
import { useChatStore } from "@/lib/stores/chat-store";
import { api } from "@/trpc/react";

interface FileObject {
  file: File;
  url: string;
}

interface FileAttachmentProps {
  chatId: string;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ chatId }) => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cropperRef = useRef<Cropper>();
  const imageRef = useRef<HTMLImageElement>(null);
  const { user } = useUser();
  const chatStore = useChatStore();

  const utils = api.useUtils();

  // Add sendMessage mutation
  const sendMessage = api.chat.sendMessage.useMutation({
    retry(failureCount) {
      if (failureCount > 3) return false;
      return true;
    },
    retryDelay(failureCount) {
      return failureCount * 1000;
    },
    onSuccess: () => {
      utils.chat.getChat.invalidate({ chatId });
      utils.chat.getMessages.invalidate({ chatId });
      utils.chat.listChats.invalidate();
    },
  });

  // Memoized handlers
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles) return;

      const newFiles = Array.from(selectedFiles).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index]!.url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const startEditing = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const finishEditing = useCallback(() => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
    });

    canvas.toBlob((blob) => {
      if (!blob) return;

      const newFile = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      setFiles((prev) => {
        const newFiles = [...prev];
        URL.revokeObjectURL(newFiles[editingIndex!]!.url);
        newFiles[editingIndex!] = {
          file: newFile,
          url: URL.createObjectURL(blob),
        };
        return newFiles;
      });

      setEditingIndex(null);
    }, "image/jpeg");
  }, [editingIndex]);

  const handleUpload = useCallback(async () => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          const IMAGE_NAME = v4();
          const path = `/chatImages/${user.username}/${chatId}${file.file.name}_${IMAGE_NAME}`;
          const storageRef = ref(storage, path);
          const uploadTask = await uploadBytes(storageRef, file.file);
          const url = await getDownloadURL(uploadTask.ref);
          const messageId = v4();
          const mediaId = v4();

          chatStore.addMessage(chatId, {
            chatId,
            contentType: "MEDIA",
            text: caption,
            createdAt: new Date(),
            updatedAt: new Date(),
            deleted: false,
            deletedAt: null,
            deletedBy: null,
            id: messageId,
            isAdmin: false,
            metadata: {
              fileName: file.file.name,
              size: file.file.size.toString(),
              type: file.file.type,
              url,
              mimeType: file.file.type,
            },
            type: "STANDARD",
            parentId: null,
            status: "SENT",
            threadRoot: null,
            senderId: user?.id!,
            mediaUrl: url,
            media: [
              {
                fileName: file.file.name,
                size: file.file.size.toString(),
                type: file.file.type,
                url,
                mimeType: file.file.type,
                id: mediaId,
                deleted: false,
                metadata: {},
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                deletedBy: null,
                ownerId: user.id,
                messageId,
              },
            ],
          });

          await sendMessage.mutateAsync({
            chatId,
            text: caption,
            mediaId,
            mediaUrl: url,
            messageId,
            contentType: "MEDIA",
            isAdmin: false,
            mediaType: file.file.type,
            mediaFileName: file.file.name,
            mediaSize: file.file.size.toString(),
          });
        })
      );

      setFiles([]);
      setCaption("");
      setIsOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.username, user?.id, files, chatId, chatStore, caption, sendMessage]);

  // Memoized components
  const FileUploadButton = useMemo(
    () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="aspect-square w-[60px] rounded-sm h-full"
              onClick={() => setIsOpen(true)}
            >
              <Paperclip width={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Attach file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    []
  );

  const ImageEditor = useMemo(() => {
    if (editingIndex === null) return null;
    const file = files[editingIndex];

    return (
      <div className="relative w-full h-[60vh]">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            variant="outline"
            className="bg-neutral-200/40 backdrop-blur-md text-green-500"
            size="icon"
            onClick={finishEditing}
          >
            <Check width={16} />
          </Button>
          <Button
            variant="outline"
            className="bg-neutral-200/40 backdrop-blur-md text-red-500"
            size="icon"
            onClick={() => setEditingIndex(null)}
          >
            <X width={16} />
          </Button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={file?.url}
          alt="Edit preview"
          className="w-full h-full object-contain"
          onLoad={() => {
            if (imageRef.current) {
              cropperRef.current = new Cropper(imageRef.current, {
                viewMode: 1,
                dragMode: "move",
                aspectRatio: NaN,
                autoCropArea: 1,
                restore: false,
                modal: false,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
              });
            }
          }}
        />
      </div>
    );
  }, [editingIndex, files, finishEditing]);

  const ImageCarousel = useMemo(
    () => (
      <Carousel className="w-full">
        <CarouselContent>
          {files.map((file, index) => (
            <CarouselItem key={index} className="relative">
              {editingIndex === index ? (
                ImageEditor
              ) : (
                <ImagePreview
                  file={file}
                  index={index}
                  startEditing={startEditing}
                  removeFile={removeFile}
                />
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/50 dark:bg-white/10 px-3 py-1 rounded-lg">
                {index + 1} / {files.length}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {files.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    ),
    [files, editingIndex, startEditing, removeFile, ImageEditor]
  );

  const UploadArea = useMemo(
    () => (
      <div className="grid place-items-center h-[60vh]">
        <label className="cursor-pointer border-2 border-dashed border-primary/50 rounded-xl p-8 hover:bg-primary/5 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="text-center space-y-2">
            <Paperclip className="h-4 w-4 mx-auto mb-4" />
            <p className="text-sm">Click to upload images</p>
            <p className="text-xs text-muted-foreground">
              Upload one or more files
            </p>
          </div>
        </label>
      </div>
    ),
    [handleFileSelect]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setEditingIndex(null);
          cropperRef.current?.destroy();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{FileUploadButton}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          {files.length > 0 ? (
            <>
              {ImageCarousel}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Button disabled={isLoading}>
                  <Send width={16} />
                </Button>
              </form>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Clear all
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Clear all images?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        files.forEach((file) => URL.revokeObjectURL(file.url));
                        setFiles([]);
                      }}
                    >
                      Clear all
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            UploadArea
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Memoized ImagePreview component
const ImagePreview = React.memo(
  ({
    file,
    index,
    startEditing,
    removeFile,
  }: {
    file: FileObject;
    index: number;
    startEditing: (index: number) => void;
    removeFile: (index: number) => void;
  }) => (
    <div className="relative w-full h-[60vh]">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          className="bg-white/60 backdrop-blur-md text-black"
          size="icon"
          onClick={() => startEditing(index)}
        >
          <Crop width={16} />
        </Button>
        <Button
          className="bg-white/60 backdrop-blur-md text-black"
          size="icon"
          onClick={() => removeFile(index)}
        >
          <Trash2 width={16} />
        </Button>
      </div>
      <Image src={file.url} alt="Preview" fill className="object-contain" />
    </div>
  )
);

ImagePreview.displayName = "ImagePreview";

export default React.memo(FileAttachment);
