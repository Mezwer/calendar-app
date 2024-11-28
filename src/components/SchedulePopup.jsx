import React, { useState } from 'react';
import { Minimize2 } from 'lucide-react';
import styles from '../styles/schedulepopup.module.css';


const SchedulePopup = ({ trigger, setEvents, numEvents, setNumEvents, setPopup }) => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (selectedDate) => {
    setEventDetails(prev => ({
      ...prev,
      date: selectedDate
    }));
  };

  const createEventObject = () => {
    let eventObj = {
      id: numEvents + 1,
      title: eventDetails.title,
      color: 'blue'
    };

    eventObj.start = new Date(eventDetails.date.getTime());
    eventObj.end = new Date(eventDetails.date.getTime());

    let hour = Number(eventDetails.startTime.slice(0, 2));
    let minute = Number(eventDetails.startTime.slice(3, 5));
    eventObj.start.setHours(hour);
    eventObj.start.setMinutes(minute);

    hour = Number(eventDetails.endTime.slice(0, 2));
    minute = Number(eventDetails.endTime.slice(3, 5));
    eventObj.end.setHours(hour);
    eventObj.end.setMinutes(minute);

    return eventObj;
  }

  const handleSubmit = () => {
    const newEvent = createEventObject();
    setNumEvents(prev => prev + 1);
    setEvents(events => [...events, newEvent]);
    setPopup(false);
    console.log(newEvent);
  };

  return (trigger) ? (
    <div className={styles.popup}>
      <div className={`${styles.eventSchedulingCard} ${styles.popupInner}`}>
        <div className={styles.eventCardHeader}>
          <h2>Schedule New Event</h2>
          <Minimize2 
            className={styles.minimize}
            onClick={() => {
              setPopup(false);
            }}
          />
        </div>
        <div className={styles.eventCardContent}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Event Title</label>
            <input 
              id="title"
              name="title"
              placeholder="Enter event title"
              value={eventDetails.title}
              onChange={handleInputChange}
              className={styles.formControl}
            />
          </div>

          <div className={styles.timeGroup}>
            <div className={styles.formGroup}>
              <label>Start Time</label>
              <input 
                type="time"
                name="startTime"
                value={eventDetails.startTime}
                onChange={handleInputChange}
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>End Time</label>
              <input 
                type="time"
                name="endTime"
                value={eventDetails.endTime}
                onChange={handleInputChange}
                className={styles.formControl}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Date</label>
            <input 
              type="date"
              name="date"
              value={eventDetails.date.toISOString().split('T')[0]}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                handleDateSelect(selectedDate);
              }}
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Location</label>
            <input 
              name="location"
              placeholder="Enter event location"
              value={eventDetails.location}
              onChange={handleInputChange}
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea 
              name="description"
              placeholder="Enter event details"
              value={eventDetails.description}
              onChange={handleInputChange}
              className={`${styles.formControl} ${styles.textarea}`}
            />
          </div>

          <button 
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            Schedule Event
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SchedulePopup;