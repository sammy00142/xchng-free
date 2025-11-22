import { v4 } from "uuid";

export const downloadMedia = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], `GreatExchangeco_${v4()}`, {
      type: blob.type,
    });
    const newUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = newUrl;
    link.download = file.name;
    link.click();
  } catch (err) {
    console.error(err);
  }
};
