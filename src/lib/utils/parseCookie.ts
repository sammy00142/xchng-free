import Cookies from "js-cookie";

export const parseCookie = (cookieName: string): string | object | null => {
  try {
    const cookieValue = Cookies.get(cookieName);

    if (cookieValue === undefined || cookieValue === "") {
      return null;
    }

    const decodedString = decodeURIComponent(cookieValue);

    const parsed = JSON.parse(decodedString);
    return parsed;
  } catch (error) {
    console.error("Error parsing cookie:", error);
    return null;
  }
};
