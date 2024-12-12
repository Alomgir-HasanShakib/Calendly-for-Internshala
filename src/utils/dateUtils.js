
export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
export const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export const isToday = (day, currentDate) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

export const formatDayKey = (year, month, day) => `${year}-${month}-${day}`;