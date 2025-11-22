export function dataURLToBlob(dataURL: string): Blob {
  const [header, base64Data] = dataURL.split(",");
  const contentType = header?.match(/:(.*?);/)?.[1] || "";
  const byteString = atob(base64Data as string);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}
