export const formatTime = (dateString: string): string => {
  const messageDate = new Date(dateString);

  const difference = Date.now() - messageDate.getTime();

  if (difference < 30000) {
    return "just now";
  } else if (difference < 86400000) {
    return `${messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  } else {
    // also show date when time is beyond 24 hrs
    return `${messageDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })}`;
  }
};

export const formatDate = (dateString: string): string => {
  const messageDate = new Date(dateString);

  const difference = Date.now() - messageDate.getTime();

  if (difference < 30000) {
    return "just now";
  } else {
    // Use a locale-axware method for formatting time
    return `${messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} on ${messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
};

export const formatDateOnly = (dateString: string): string => {
  const messageDate = new Date(dateString);

  const difference = Date.now() - messageDate.getTime();

  // Use a locale-axware method for formatting time
  return `${messageDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  })}`;
};

// else if (difference < 300000) {
//     const minutes = Math.floor(difference / 60000);
//     return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
//   } else if (difference < 86400000) {
//     const hours = Math.floor(difference / 3600000);
//     return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
//   } else if (difference < 172800000) {
//     return "Yesterday";
//   } else if (difference < 259200000) {
//     const days = Math.floor(difference / 86400000);
//     return `${days} days ago`;
//   }
