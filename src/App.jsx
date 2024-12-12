import React, { useState, useEffect } from "react";
import { Button } from "../shadcn-ui/components/ui/button";
import { Card } from "../shadcn-ui/components/ui/card";
import { Dialog } from "../shadcn-ui/components/ui/dialog";
import { Input } from "../shadcn-ui/components/ui/input";
// import { SearchIcon } from "@heroicons/react/solid";
import "./App.css";    
const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState(
    () => JSON.parse(localStorage.getItem("calendarEvents")) || {}
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [filterKeyword, setFilterKeyword] = useState("");

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);

    for (let i = 0; i < startDay; i++) {
      days.push(null); // Fill empty slots for previous month
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(day);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setModalOpen(true);
    setEditingEventIndex(null); // Clear any editing state
  };

  const isEventOverlapping = (newEvent, existingEvents) => {
    for (const event of existingEvents) {
      const existingStart = new Date(
        `${currentDate.toDateString()} ${event.startTime}`
      );
      const existingEnd = new Date(
        `${currentDate.toDateString()} ${event.endTime}`
      );
      const newStart = new Date(
        `${currentDate.toDateString()} ${newEvent.startTime}`
      );
      const newEnd = new Date(
        `${currentDate.toDateString()} ${newEvent.endTime}`
      );

      // Check if the new event overlaps with any existing event
      if (
        (newStart >= existingStart && newStart < existingEnd) || // New event starts during an existing event
        (newEnd > existingStart && newEnd <= existingEnd) || // New event ends during an existing event
        (newStart <= existingStart && newEnd >= existingEnd) // New event covers the entire existing event
      ) {
        return true; // Overlap found
      }
    }
    return false; // No overlap
  };

  const handleEventSubmit = () => {
    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    const existingEvents = events[dayKey] || [];

    // Check if the new event overlaps with existing events
    if (isEventOverlapping(eventForm, existingEvents)) {
      alert(
        "This event overlaps with an existing event. Please choose a different time."
      );
      return; // Prevent adding/updating the event if there's an overlap
    }

    const updatedEvents = {
      ...events,
      [dayKey]:
        editingEventIndex !== null
          ? events[dayKey].map((event, index) =>
              index === editingEventIndex ? eventForm : event
            )
          : [...existingEvents, eventForm],
    };

    setEvents(updatedEvents);
    setModalOpen(false);
    setEventForm({ name: "", startTime: "", endTime: "", description: "" });
  };

  const handleEventEdit = (index) => {
    const eventToEdit =
      events[
        `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`
      ][index];
    setEventForm(eventToEdit);
    setEditingEventIndex(index);
  };

  const handleEventDelete = (index) => {
    const updatedEvents = { ...events };
    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    updatedEvents[dayKey].splice(index, 1); // Remove the event at the specified index
    setEvents(updatedEvents);
  };

  const calendarDays = generateCalendarDays();
  const monthYear = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getFullYear()}`;

  const today = new Date();

  // Check if the current day is today's date in the same month and year
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const filteredEvents = (
    events[
      `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`
    ] || []
  ).filter(
    (event) =>
      event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      event.description.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="app-container bg-gray-100 min-h-screen p-4 flex">
      {/* Calendar Section */}
      <div className="calendar-container flex-1">
        <header className="header flex justify-between items-center mb-6">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handlePreviousMonth}
          >
            Previous
          </Button>
          <h1 className="text-xl font-bold text-gray-700">{monthYear}</h1>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleNextMonth}
          >
            Next
          </Button>
        </header>

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
              } ${day === selectedDay ? "" : "border-gray-300"} ${
                isToday(day) ? "bg-yellow-300" : ""
              } hover:border-blue-500 cursor-pointer`}
              onClick={() => day && handleDayClick(day)}
            >
              {day}
            </Card>
          ))}
        </main>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setModalOpen(false)}>
          <div className="modal-container p-6 bg-white rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">
              {editingEventIndex !== null
                ? `Edit Event for ${selectedDay}`
                : `Add Event for ${selectedDay}`}
            </h2>

            {/* Filter Input */}
            <div className="filter-input mb-4">
              <Input
                className="w-full p-2 border rounded"
                placeholder="Search events"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>

            {/* Display filtered events */}
            {filteredEvents.length > 0 ? (
              <ul className="event-list space-y-4 mb-4">
                {filteredEvents.map((event, index) => (
                  <Card
                    key={index}
                    className="event-card p-4 border rounded shadow-sm hover:bg-gray-50"
                  >
                    <h4 className="font-semibold">{event.name}</h4>
                    <p>
                      {event.startTime} - {event.endTime}
                    </p>
                    <p>{event.description}</p>
                    <div className="mt-2 flex space-x-2">
                      <Button
                        className="bg-yellow-500 text-white"
                        onClick={() => handleEventEdit(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => handleEventDelete(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </ul>
            ) : (
              <p>No events found</p>
            )}

            {/* Event Form */}
            <Input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Event Name"
              value={eventForm.name}
              onChange={(e) =>
                setEventForm({ ...eventForm, name: e.target.value })
              }
            />
            <Input
              className="w-full mb-4 p-2 border rounded"
              type="time"
              value={eventForm.startTime}
              onChange={(e) =>
                setEventForm({ ...eventForm, startTime: e.target.value })
              }
            />
            <Input
              className="w-full mb-4 p-2 border rounded"
              type="time"
              value={eventForm.endTime}
              onChange={(e) =>
                setEventForm({ ...eventForm, endTime: e.target.value })
              }
            />
            <Input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Description (Optional)"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
            />
            <Button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleEventSubmit}
            >
              {editingEventIndex !== null ? "Update Event" : "Add Event"}
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default App;
