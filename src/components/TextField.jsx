import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import styles from '../styles/textfield.module.css';
import { eventMake } from '../utils/aigen';
import { createEventObject } from '../utils/dateFns';

const TextField = ({ gen, setGen, events, setEvents, numEvents, setNumEvents }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const keyHandler = (e) => {
      if(e.keyCode === 27){
        setGen(false);
      }
    }

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    const enter = async (e) => {
      if (e.keyCode === 13) {
        const stringOfEvents = events.map(e => JSON.stringify(e)).toString();
        const response = await eventMake(searchTerm, stringOfEvents);
        const event = JSON.parse(response);
        
        let newEvent;
        if (event["id"] === null) {
          newEvent = createEventObject(event, false, numEvents);
          setNumEvents(numEvents + 1);
          setEvents(prev => [...prev, newEvent]);
        } else if (Object.prototype.hasOwnProperty.call(event, 'start')) {
          const id = event.id;
          newEvent = createEventObject(event, false, id - 1);
          setEvents(prev => prev.filter(e => e.id !== newEvent.id));
          setEvents(prev => [...prev, newEvent]);
        } else {
          setEvents(prev => prev.filter(e => e.id !== event.id));
        }
      }
    }

    window.addEventListener('keydown', enter);
    return () => window.removeEventListener('keydown', enter);
  }, [searchTerm]);

  return (gen) ? (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <input 
          type="text" 
          placeholder="Type to manage events (enter to send)..." 
          value={searchTerm}
          onChange={handleSearch}
          className={styles.input}
        />
        <LogOut 
          size={45} 
          className={styles.exit}
          onClick={() => {
            setGen(false);
          }}
        />
      </div>
    </div>
  ) : null;
};

export default TextField;