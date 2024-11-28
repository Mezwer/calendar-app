import React from 'react';
import styles from "../styles/draggable.module.css";
import { formatTime } from "../utils/dateFns.js";
import { useDrag } from 'react-dnd';

const EventTypes = {
  EVENT: 'event'
};

// Draggable Event Component
const DraggableEvent = ({ event, onEventMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: EventTypes.EVENT,
    item: { 
      id: event.id, 
      start: event.start, 
      end: event.end 
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  // Calculate event height and position
  const eventHeight = ((event.end - event.start) / (1000 * 60 * 60)) * 100;
  const topPosition = (event.start.getMinutes() / 60) * 100;
  const colors = {
    green: styles.eventGreen,
    blue: styles.eventBlue,
  }

  return (
    <div 
      ref={drag}
      className={`${styles.eventBlock} ${colors[event.color]} ${isDragging ? 'opacity-50' : ''}`}
      style={{ 
        top: `${topPosition}%`,
        height: `${eventHeight}%`,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <div className={styles.eventTitle}>{event.title}</div>
      <div className={styles.eventTime}>
        {formatTime(event.start)} - {formatTime(event.end)}
      </div>
    </div>
  );
};

export default DraggableEvent;