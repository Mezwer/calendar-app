import React, { useState, useEffect } from 'react';
import { Minimize2 } from 'lucide-react';
import styles from '../styles/schedulepopup.module.css';
import { createEventObject } from '../utils/dateFns';


const SchedulePopup = ({ trigger, setEvents, numEvents, setNumEvents, setPopup }) => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    priority: '',
  });

  useEffect(() => {
    const keyHandler = (e) => {
      if(e.keyCode === 27){
        setPopup(false);
      }
    }

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

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

  const handleSubmit = () => {
    const newEvent = createEventObject(eventDetails, true, numEvents);
    setNumEvents(prev => prev + 1);
    setEvents(events => [...events, newEvent]);
    setPopup(false);
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
              type="text"
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
            <label>Event Priority</label>
            <select 
              value={eventDetails.priority}
              onChange={(e) => setEventDetails(prev => ({
                ...prev,
                priority: e.target.value
              }))}
              className={styles.formControl}
            >
              <option value="" style={{fontWeight: 100}}>Select category</option>
              
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Location</label>
            <input 
              type="text"
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