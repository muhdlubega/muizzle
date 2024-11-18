export const getNextGameTime = () => {
  const now = new Date();
  const malaysiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  
  const baseTime = new Date(malaysiaTime);
  baseTime.setHours(11, 0, 0, 0);
  
  let nextGameTime = new Date(baseTime);
  
  while (nextGameTime <= malaysiaTime) {
    nextGameTime.setHours(nextGameTime.getHours() + 6);
  }
  
  return nextGameTime;
};

export const getCurrentMinuteIndex = () => {
  const now = new Date();
  const malaysiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  
  // Set reference time to the first game of the day (11:00 AM Malaysia time)
  const referenceTime = new Date(malaysiaTime);
  referenceTime.setHours(11, 0, 0, 0);
  
  // If current time is before 11:00 AM, use previous day's 11:00 AM as reference
  if (malaysiaTime < referenceTime) {
    referenceTime.setDate(referenceTime.getDate() - 1);
  }
  
  // Calculate how many 6-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - referenceTime.getTime();
  const periodsPassed = Math.floor(diffTime / (6 * 60 * 60 * 1000));
  
  return (periodsPassed % 7) + 1;
};