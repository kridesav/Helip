// Utility functions to parse date and time strings
export const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
export const parseTime = (timeStr, currentDate) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(currentDate.getTime());
    date.setHours(hours, minutes, 0);
    return date;
  };
  