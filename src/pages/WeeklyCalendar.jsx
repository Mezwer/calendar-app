// import DraggableEvent from "../components/DraggableEvent";
import DroppableHourSlot from "../components/DroppableHourSlot";
import styles from "../styles/weeklycal.module.css";
import { getDaysOfWeek } from "../utils/dateFns.js";
import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const WeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Team Meeting', 
      start: new Date(2024, 0, 15, 10, 10), 
      end: new Date(2024, 0, 15, 12, 0),
      color: 'blue'
    },
    { 
      id: 2, 
      title: 'Product Review', 
      start: new Date(2024, 0, 15, 10, 10), 
      end: new Date(2024, 0, 15, 12, 0),
      color: 'green'
    }
  ]);

  const daysOfWeek = getDaysOfWeek(currentDate);
  const hourSlots = Array.from({ length: 24 }, (_, hour) => hour);

  // Move event to a new time slot
  const handleEventMove = useCallback((eventId, newStart, newEnd) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, start: newStart, end: newEnd } 
          : event
      )
    );
  }, []);

  // Week navigation
  const moveWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Render events for a specific day and time
  const renderEventsForSlot = (day, hour) => {
    return events.filter(event => 
      event.start.getDate() === day.getDate() && 
      event.start.getHours() === hour
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.weeklyCalendar}>
        {/* Header (same as previous version) */}
        <div className={styles.calendarHeader}>
          <button onClick={() => moveWeek(-1)} className={styles.navButton}>
            <ChevronLeft />
          </button>
          
          <h2 className={styles.currentMonth}>
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button onClick={() => moveWeek(1)} className={styles.navButton}>
            <ChevronRight />
          </button>
        </div>

        {/* Day and Date Header (same as previous version) */}
        <div className={styles.daysHeader}>
          <div className={styles.hourSpacer}>
            <Plus />
          </div>
          {daysOfWeek.map((day) => (
            <div key={day.toISOString()} className={styles.dayColumn}>
              <div className={styles.dayName}>{day.toLocaleDateString('default', { weekday: 'short' })}</div>
              <div className={styles.dayDate}>{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={styles.calendarGrid}>
          {/* Hour Column */}
          <div className={styles.hoursColumn}>
            {hourSlots.map((hour) => (
              <div key={hour} className={styles.hourSlot}>
                {hour === 0 ? '12 AM' : 
                 hour < 12 ? `${hour} AM` : 
                 hour === 12 ? '12 PM' : 
                 `${hour - 12} PM`}
              </div>
            ))}
          </div>
          
          {daysOfWeek.map((day) => (
            <div className={styles.dayGridColumn}>
              {hourSlots.map((hour) => (
                <DroppableHourSlot
                  key={hour}
                  day={day}
                  hour={hour}
                  events={renderEventsForSlot(day, hour)}
                  onEventMove={handleEventMove}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default WeeklyCalendar;