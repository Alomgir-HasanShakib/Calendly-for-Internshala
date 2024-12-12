import React from "react";
import { Card } from "../../shadcn-ui/components/ui/card";
import { daysInMonth, startDayOfMonth, isToday } from "../utils/dateUtils";

const Calendar = ({
  currentDate,
  selectedDay,
  setSelectedDay,
  handleDayClick,
}) => {
  const generateCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <main className="calendar grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="calendar-header text-center font-bold text-gray-600"
        >
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => (
        <Card
          key={index}
          className={`calendar-day p-4 border rounded shadow-sm text-center ${
            day ? "bg-white" : "bg-gray-200"
          } ${
            isToday(day, currentDate) ? "bg-yellow-300" : ""
          } hover:border-blue-500 cursor-pointer`}
          onClick={() => day && handleDayClick(day)}
        >
          {day}
        </Card>
      ))}
    </main>
  );
};

export default Calendar;
