export const timeStamper = () => {
  const date = new Date();

  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1e6,
  };
};
