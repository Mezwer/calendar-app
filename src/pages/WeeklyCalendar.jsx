import DroppableHourSlot from "../components/DroppableHourSlot";
import styles from "../styles/weeklycal.module.css";
import { getDaysOfWeek, handleConflicts } from "../utils/dateFns.js";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bot, CalendarSync } from 'lucide-react';
import SchedulePopup from "../components/SchedulePopup.jsx";
import TextField from "../components/TextField.jsx";

const WeeklyCalendar = () => {
  const cellRef = useRef(null);
  const [cellHeight, setCellHeight] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [numEvents, setNumEvents] = useState(0);
  const [popup, setPopup] = useState(false);
  const [gen, setGen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const updateHeight = () => {
      if (cellRef.current) {
        setCellHeight(cellRef.current.offsetHeight);
      }
    }

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      window.removeEventListener("resize", updateHeight);
    }
  }, [cellHeight]);

  let daysOfWeek = getDaysOfWeek(currentDate);
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
    daysOfWeek = getDaysOfWeek(newDate);
    setCurrentDate(newDate);
  };

  // Render events for a specific day and time
  const renderEventsForSlot = (day, hour) => {
    return events.filter(event => 
      event.start.getDate() === day.getDate() && 
      event.start.getHours() === hour && 
      event.start.getFullYear() === day.getFullYear() &&
      event.start.getMonth() === day.getMonth()
    );
  };

  return (
      <div className={styles.weeklyCalendar}>
        {/* Header */}
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

        {/* Day and Date Header */}
        <div className={styles.daysHeader}>
          <div className={styles.hourSpacer}>
            <Plus 
              onClick={() => {
                setPopup(true);
              }}
            />
            <Bot 
              onClick={() => {
                setGen(true);
              }}
            />
            <CalendarSync 
              onClick={() => {
                const newEvents = handleConflicts(events, numEvents, setNumEvents);
                setEvents(newEvents);
              }}
            />
          </div>
          {daysOfWeek.map((day) => (
            <div className={styles.dayColumn}>
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
              <div className={styles.hourSlot}>
                {hour === 0 ? '12 AM' : 
                 hour < 12 ? `${hour} AM` : 
                 hour === 12 ? '12 PM' : 
                 `${hour - 12} PM`}
              </div>
            ))}
          </div>
          
          {daysOfWeek.map((day, indexD) => (
            <div className={styles.dayGridColumn}>
              {hourSlots.map((hour, indexH) => (
                <DroppableHourSlot
                  day={day}
                  hour={hour}
                  events={renderEventsForSlot(day, hour)}
                  onEventMove={handleEventMove}
                  cellSize={cellHeight}
                  ref={(indexD === 1 && indexH === 1 ? cellRef : null)}
                  setEvents={setEvents}
                />
              ))}
            </div>
          ))}
        </div>
        <SchedulePopup 
          trigger={popup}
          setEvents={setEvents}
          numEvents={numEvents}
          setNumEvents={setNumEvents}
          setPopup={setPopup}
        />
        <TextField 
          gen={gen}
          setGen={setGen}
          events={events}
          setEvents={setEvents}
          numEvents={numEvents}
          setNumEvents={setNumEvents}
        />
      </div>
  );
};

export default WeeklyCalendar;