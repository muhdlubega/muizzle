export const REFERENCE_TIME = new Date("2024-12-01T12:30:00+08:00"); // 12:30 PM Malaysia time on Nov 19, 2024

export const getNextGameTime = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  // Calculate how many 24-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const periodsPassed = Math.floor(diffTime / (24 * 60 * 60 * 1000));

  const nextGameTime = new Date(
    REFERENCE_TIME.getTime() + (periodsPassed + 1) * 24 * 60 * 60 * 1000
  );

  return nextGameTime;
};

export const getCurrentMinuteIndex = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  // Calculate how many 24-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const periodsPassed = Math.floor(diffTime / (24 * 60 * 60 * 1000));

  return (periodsPassed % 7) + 1;
};
