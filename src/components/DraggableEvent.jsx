import React from 'react';
import styles from "../styles/draggable.module.css";
import { formatTime } from "../utils/dateFns.js";
import { useDrag, useDragLayer } from 'react-dnd';
import { TriangleAlert, CircleAlert, CircleEllipsis, CircleChevronUp, Trash, GripHorizontal } from 'lucide-react';

const EventTypes = {
  EVENT: 'event'
};

const DraggableEvent = ({ event, onEventMove, cellSize, setEvents }) => {
  const [ {isDragging}, drag, dragPreview] = useDrag({
    type: EventTypes.EVENT,
    item: { 
      id: event.id, 
      start: event.start, 
      end: event.end,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const { isDragging: anyDrag } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  // Calculate event height and position
  const eventHeight = ((event.end - event.start) / (1000 * 60 * 60)) * cellSize - 9;
  const topPosition = (event.start.getMinutes() / 60) * 100;
  const colors = {
    green: styles.eventGreen,
    blue: styles.eventBlue,
    yellow: styles.eventYellow,
    red: styles.eventRed,
  };

  const icons = {
    green: (<CircleChevronUp size={13}/>), 
    blue: (<CircleEllipsis size={13}/>), 
    yellow: (<CircleAlert size={13}/>), 
    red: (<TriangleAlert size={13}/>), 
  };

  const prios = {
    green: 2, 
    blue: 1, 
    yellow: 3, 
    red: 4, 
  };

  return (
    <div 
      ref={drag}
      className={`${styles.eventBlock} ${colors[event.color]}`}
      style={{ 
        top: `${topPosition}%`,
        height: `${eventHeight}px`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: (isDragging || anyDrag) ? 0 : 1 + prios[event.color],
      }}
    >
      <GripHorizontal 
        className={styles.grip}
        size={12}
      />
      <div 
        className={styles.eventTitle}
        onMouseDown={(e) => e.stopPropagation()} // Prevent interference with drag
      >
        <span> {event.title} </span>
        {icons[event.color]}
      </div>
      <div 
        className={styles.eventInfo}
        onMouseDown={(e) => e.stopPropagation()} // Prevent interference with drag
      >
        {formatTime(event.start)} - {formatTime(event.end)}
      </div>
      <div 
        className={styles.eventInfo}
        onMouseDown={(e) => e.stopPropagation()} // Prevent interference with drag
      >
        {event.location}
      </div>
      <Trash 
        className={styles.trash} 
        size={13}
        onClick={() => {
          setEvents(prev => prev.filter(e => e.id !== event.id));
        }}
        onMouseDown={(e) => e.stopPropagation()} // Prevent interference with drag
      />
    </div>
  );
};

export default DraggableEvent;