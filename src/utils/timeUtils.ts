// export const getNextGameTime = () => {
//     const now = new Date();
//     const tomorrow = new Date(now);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     tomorrow.setHours(10, 0, 0, 0);
//     return tomorrow;
//  };

// export const getNextGameTime = () => {
//   const now = new Date();
//   const nextMinute = new Date(now.getTime() + (60 - now.getSeconds()) * 1000);
//   nextMinute.setMilliseconds(0);
//   return nextMinute;
// };

// export const getCurrentDay = () => {
//   const testDate = new Date();
//   testDate.setHours(testDate.getHours() - 3);

//   const startDate = new Date(
//     testDate.getFullYear(),
//     testDate.getMonth(),
//     testDate.getDate(),
//     testDate.getHours()
//   );

//   // const startDate = new Date('2024-11-08');
//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - startDate.getTime());
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

//   return diffDays;
// };

export const getNextGameTime = () => {
  const now = new Date();
  const nextMinute = new Date(now.getTime() + (60 - now.getSeconds()) * 1000);
  nextMinute.setMilliseconds(0);
  return nextMinute;
};

export const getCurrentMinuteIndex = () => {
  const now = new Date();
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0); // Start of the day
  
  const diffTime = now.getTime() - startTime.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  // If you want to cycle through your screenshot sets, use modulo
  // For example, if you have 7 sets of screenshots:
  return (diffMinutes % 7) + 1; // Returns 1-7
};
