import React, { useState, useEffect } from "react";
import Calendar from "./component/Calendar";
import EventModal from "./component/EventModal";
import { Button } from "../shadcn-ui/components/ui/button";
import { formatDayKey, isToday } from "./utils/dateUtils";
import { isEventOverlapping } from "./utils/eventUtils";
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
    setEditingEventIndex(null);
  };
  const handleEventSubmit = () => {
    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    const existingEvents = events[dayKey] || [];
  
    // Determine if the event overlaps
    if (isEventOverlapping(eventForm, existingEvents, currentDate, editingEventIndex)) {
      alert("This event overlaps with an existing event. Please choose a different time.");
      return;
    }
  
    const updatedEvents = {
      ...events,
      [dayKey]:
        editingEventIndex !== null
          ? existingEvents.map((event, index) =>
              index === editingEventIndex ? eventForm : event
            )
          : [...existingEvents, eventForm], // Add new event
    };
  
    setEvents(updatedEvents);
    setModalOpen(false);
    setEventForm({ name: "", startTime: "", endTime: "", description: "" });
    setEditingEventIndex(null); // Reset editing index
  };
  

  const handleEventEdit = (index) => {
    const dayKey = formatDayKey(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDay
    );
    setEventForm(events[dayKey][index]);
    setEditingEventIndex(index);
  };

  const handleEventDelete = (index) => {
    const dayKey = formatDayKey(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDay
    );
    const updatedEvents = { ...events };
    updatedEvents[dayKey].splice(index, 1);
    setEvents(updatedEvents);
  };

  const filteredEvents = (
    events[
      formatDayKey(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDay
      )
    ] || []
  ).filter(
    (event) =>
      event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      event.description.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  const monthYear = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getFullYear()}`;

  return (
    <div className="app-container bg-gray-100 min-h-screen p-4 flex">
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
        <Calendar
          currentDate={currentDate}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          handleDayClick={handleDayClick}
        />
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          selectedDay={selectedDay}
          eventForm={eventForm}
          setEventForm={setEventForm}
          handleEventSubmit={handleEventSubmit}
          filteredEvents={filteredEvents}
          handleEventEdit={handleEventEdit}
          handleEventDelete={handleEventDelete}
          filterKeyword={filterKeyword}
          setFilterKeyword={setFilterKeyword}
          editingEventIndex={editingEventIndex}
        />
      )}
    </div>
  );
};

export default App;
