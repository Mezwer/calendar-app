import React from 'react';
import styles from "../styles/droppable.module.css";
import DraggableEvent from './DraggableEvent';
import { useDrop } from 'react-dnd';
import { handleConflicts } from '../utils/dateFns';

const EventTypes = {
  EVENT: 'event'
};

// Droppable Hour Slot Component
const DroppableHourSlot = React.forwardRef(( props, ref ) => {
  const { day, hour, events, onEventMove, cellSize, setEvents } = props;
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

  const mergeRefs = (...refs) => (element) => {
    refs.forEach((ref1) => {
      if (typeof ref1 === 'function') {
        ref1(element);
      } else if (ref) {
        ref1.current = element;
      }
    });
  }

  return (
    <div 
      ref={mergeRefs(ref, drop)}
      className={`${styles.hourGridSlot}`}
      style={{
        backgroundColor: isOver ? "#E3F2FD" : 'transparent',
      }}
    >
      {events.map((event) => (
        <DraggableEvent 
          event={event} 
          onEventMove={onEventMove} 
          cellSize={cellSize}
          setEvents={setEvents}
        />
      ))}
    </div>
  );
});

export default DroppableHourSlot;
