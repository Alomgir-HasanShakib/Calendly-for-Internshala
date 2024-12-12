export const isEventOverlapping = (
  newEvent,
  existingEvents,
  currentDate,
  excludeIndex = null
) => {
  for (const [index, event] of existingEvents.entries()) {
    // Skip checking overlap for the event currently being edited
    if (index === excludeIndex) continue;

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

    if (
      (newStart >= existingStart && newStart < existingEnd) || // New starts within existing
      (newEnd > existingStart && newEnd <= existingEnd) || // New ends within existing
      (newStart <= existingStart && newEnd >= existingEnd) // New spans existing
    ) {
      return true; // Overlap found
    }
  }
  return false; // No overlap
};
