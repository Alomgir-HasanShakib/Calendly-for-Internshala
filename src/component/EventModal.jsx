import React from "react";
import { Dialog } from "../../shadcn-ui/components/ui/dialog";
import { Input } from "../../shadcn-ui/components/ui/input";
import { Button } from "../../shadcn-ui/components/ui/button";
import { Card } from "../../shadcn-ui/components/ui/card";

const EventModal = ({
  isOpen,
  onClose,
  selectedDay,
  eventForm,
  setEventForm,
  handleEventSubmit,
  filteredEvents,
  handleEventEdit,
  handleEventDelete,
  filterKeyword,
  setFilterKeyword,
  editingEventIndex,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="modal-container p-6 bg-white rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">
          {editingEventIndex !== null
            ? `Edit Event for ${selectedDay}`
            : `Add Event for ${selectedDay}`}
        </h2>

        <div className="filter-input mb-4">
          <Input
            className="w-full p-2 border rounded"
            placeholder="Search events"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>

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

        <Input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Event Name"
          value={eventForm.name}
          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
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
  );
};

export default EventModal;
