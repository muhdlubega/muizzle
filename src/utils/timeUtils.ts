const REFERENCE_TIME = new Date('2024-11-19T11:00:00+08:00'); // 11 AM Malaysia time on Nov 19, 2024

export const getNextGameTime = () => {
  const now = new Date();
  const malaysiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  
  // Calculate how many 12-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const periodsPassed = Math.floor(diffTime / (12 * 60 * 60 * 1000));
  
  const nextGameTime = new Date(REFERENCE_TIME.getTime() + (periodsPassed + 1) * 12 * 60 * 60 * 1000);
  
  return nextGameTime;
};

export const getCurrentMinuteIndex = () => {
  const now = new Date();
  const malaysiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  
  // Calculate how many 12-hour periods have passed since reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const periodsPassed = Math.floor(diffTime / (12 * 60 * 60 * 1000));
  
  return (periodsPassed % 7) + 1;
};