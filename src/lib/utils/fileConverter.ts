export const fileToArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Error converting file to ArrayBuffer"));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const arrayBufferToFile = async (
  arrayBuffer: ArrayBuffer,
  fileName: string,
  fileType: string
) => {
  const blob = new Blob([arrayBuffer], { type: fileType });
  return new File([blob], fileName);
};

export const fileToObject = async (
  file: File
): Promise<{ name: string; type: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const plainObject = {
          name: file.name,
          type: file.type,
          data: reader.result,
        };

        resolve(plainObject);
      } else {
        reject(new Error("Failed to convert File to plain object"));
      }
    };

    reader.readAsDataURL(file);
  });
};

export const objectToFile = (obj: {
  name: string;
  type: string;
  data: string;
}) => {
  const binaryString = atob(obj.data.split(",")[1] as string);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: obj.type });
  const file = new File([blob], obj.name, { type: obj.type });
  // const file = Buffer.from(obj.data.split(",")[1], "base64");
  return file;
};

// create a utility function to convert a BLOB type to FILE type
export const blobToFile = async (blob: Blob, fileName: string) => {
  return new File([blob], fileName);
};

// create a utility function to convert a BLOB type to FILE type
export const fileToBlob = (file: File, type: string) => {
  return new Blob([file], { type: type });
};

// create a utility function to convert a FILE type to base64
export const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Error converting file to base64"));
      }
    };
    reader.readAsDataURL(file);
  });
};

// create a utility function to convert a base64 to FILE type
export const base64ToFile = async (
  base64: string,
  fileName: string
): Promise<File> => {
  const arrayBuffer = base64ToArrayBuffer(base64);
  const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
  return new File([blob], fileName);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64.split(",")[1] as string);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
};

// CLIEND SIDE CODE##
// export     const imageToUnit8 = async (image: File) => {
//   return new Promise<Uint8Array>((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target?.result as ArrayBuffer;
//       const unit8 = new Uint8Array(data);
//       resolve(unit8);
//     };
//     reader.onerror = (e) => {
//       reject(e);
//     };

//     reader.readAsArrayBuffer(image);
//   });
// };

export const dataURLtoFile = (dataurl: string, filename: string) => {
  var arr = dataurl.split(","),
    mime = arr[0]?.match(/:(.*?);/)?.[1],
    bstr = atob(arr[arr.length - 1] as string),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
