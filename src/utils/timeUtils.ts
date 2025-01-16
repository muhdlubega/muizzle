export const REFERENCE_TIME = new Date("2025-01-01T16:30:00+08:00"); // 4:30 PM Malaysia time on January 1, 2025

export const getNextGameTime = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  // Calculate how many 24-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const totalDaysPassed = Math.floor(diffTime / (24 * 60 * 60 * 1000));

  const nextGameTime = new Date(
    REFERENCE_TIME.getTime() +
    (totalDaysPassed + 1) * 24 * 60 * 60 * 1000
  );

  return nextGameTime;
};

export const getCurrentGameIndex = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  // Calculate how many 24-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const totalDaysPassed = Math.floor(diffTime / (24 * 60 * 60 * 1000));
  const currentGameIndex = (totalDaysPassed % 20) + 1; // Reset to 1 after 20 days

  return currentGameIndex;
};

export const getArchives = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  return diffTime > 24 * 60 * 60 * 1000;
};