export const formatFileSize = (fileSizeInBytes: number): string => {
  if (fileSizeInBytes < 1024) {
    return fileSizeInBytes + " bytes";
  } else if (fileSizeInBytes < 1048576) {
    return (fileSizeInBytes / 1024).toFixed(2) + " KB";
  } else if (fileSizeInBytes < 1073741824) {
    return (fileSizeInBytes / 1048576).toFixed(2) + " MB";
  } else {
    return (fileSizeInBytes / 1073741824).toFixed(2) + " GB";
  }
};
