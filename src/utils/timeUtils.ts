export const REFERENCE_TIME = new Date("2024-12-08T16:30:00+08:00"); // 4:30 PM Malaysia time on Nov 19, 2024

export const getNextGameTime = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  // Calculate how many 24-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const periodsPassed = Math.floor(diffTime / (48 * 60 * 60 * 1000));

  const nextGameTime = new Date(
    REFERENCE_TIME.getTime() + (periodsPassed + 1) * 48 * 60 * 60 * 1000
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
  const periodsPassed = Math.floor(diffTime / (48 * 60 * 60 * 1000));

  return periodsPassed + 1;
};

export const getArchives = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  return diffTime > 48 * 60 * 60 * 1000;
};
