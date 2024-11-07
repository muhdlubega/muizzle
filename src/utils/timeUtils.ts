export const getNextGameTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
 };
 
 
 export const getCurrentDay = () => {
    const testDate = new Date();
    testDate.setHours(testDate.getHours() - 3);
   
    const startDate = new Date(
        testDate.getFullYear(),
        testDate.getMonth(),
        testDate.getDate(),
        testDate.getHours()
    );
   
    // const startDate = new Date('2024-11-08');
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
   
    return diffDays;
 };
 