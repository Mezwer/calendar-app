import React from 'react';
import styles from "../styles/droppable.module.css";
import DraggableEvent from './DraggableEvent';
import { useDrop } from 'react-dnd';

const EventTypes = {
  EVENT: 'event'
};

// Droppable Hour Slot Component
const DroppableHourSlot = ({ day, hour, events, onEventMove }) => {
  const [{ isOver }, drop] = useDrop({
    accept: EventTypes.EVENT,
    drop: (item) => {
      // Calculate new start time based on drop location
      const newStart = new Date(day);
      newStart.setHours(hour, 0, 0, 0);
      
      // Calculate time difference to maintain event duration
      const duration = item.end - item.start;
      const newEnd = new Date(newStart.getTime() + duration);

      // Call move event handler
      onEventMove(item.id, newStart, newEnd);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <div 
      ref={drop}
      className={`${styles.hourGridSlot} ${isOver ? 'bg-blue-50' : ''}`}
    >
      {events.map((event) => (
        <DraggableEvent 
          key={event.id} 
          event={event} 
          onEventMove={onEventMove} 
        />
      ))}
    </div>
  );
};

export default DroppableHourSlot;
