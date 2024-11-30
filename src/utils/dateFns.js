export const getDaysOfWeek = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
};

export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const colors = {
  Urgent: 'red',
  High: 'yellow',
  Medium: 'green',
  Low: 'blue'
};

export const createEventObject = (details, popup, numEvents) => {
  let eventObj = {
    id: numEvents + 1,
    title: details.title,
    priority: details.priority,
    location: details.location,
  };

  eventObj.color = colors[details.priority];
  if (popup) {
    eventObj.start = new Date(details.date.getTime());
    eventObj.end = new Date(details.date.getTime());
  
    let hour = Number(details.startTime.slice(0, 2));
    let minute = Number(details.startTime.slice(3, 5));
    eventObj.start.setHours(hour);
    eventObj.start.setMinutes(minute);
  
    hour = Number(details.endTime.slice(0, 2));
    minute = Number(details.endTime.slice(3, 5));
    eventObj.end.setHours(hour);
    eventObj.end.setMinutes(minute);
  } else {
    eventObj.start = new Date(details.start);
    eventObj.end = new Date(details.end);
  }

  return eventObj;
}

const eventsOverlap = (event1, event2) => {
  return event1.start < event2.end && event2.start < event1.end;
}

const trimEvent = (eventToTrim, blockingEvent, numEvents, setNumEvents) => {
  const trimmedEvents = [];
  let eventsNum = numEvents;

  // Check if event starts before blocking event
  if (eventToTrim.start < blockingEvent.start) {
    trimmedEvents.push({
      ...eventToTrim,
      start: eventToTrim.start,
      end: blockingEvent.start,
      isTrimmed: true,
      id: eventsNum + 1,
    });
    eventsNum++;
  }

  // Check if event ends after blocking event
  if (eventToTrim.end > blockingEvent.end) {
    trimmedEvents.push({
      ...eventToTrim,
      start: blockingEvent.end,
      end: eventToTrim.end,
      isTrimmed: true,
      id: eventsNum + 1,
    });
    eventsNum++;
  }

  return [trimmedEvents, eventsNum];
}

export const handleConflicts = (events, numEvents, setNumEvents) => {
  const newEvents = [...events];
  let tempEvents = numEvents;
  const prioTranslate = {
    High: 3,
    Urgent: 4,
    Low: 1,
    Medium: 2,
  }

  for (const e of newEvents) {
    e.priority = prioTranslate[e.priority];
  }

  const sortedEvents = newEvents.sort((a, b) => b.priority - a.priority || a.start - b.start);
    
  const resolvedEvents = [];

  for (let i = 0; i < sortedEvents.length; i++) {
    const currentEvent = sortedEvents[i];
    let eventToAdd = currentEvent;

    // Check against higher priority events already in resolved list
    for (const resolvedEvent of resolvedEvents) {
      if (eventsOverlap(currentEvent, resolvedEvent)) {
        // If current event has lower priority, trim it
        if (currentEvent.priority < resolvedEvent.priority) {
          const [trimmedSegments, eventsNum] = trimEvent(currentEvent, resolvedEvent, tempEvents);
          console.log(trimmedSegments);
          setNumEvents(eventsNum);
          tempEvents = eventsNum;
          // Add non-blocked segments
          trimmedSegments.forEach(segment => {
            if (segment.start < segment.end) {
              resolvedEvents.push({
                ...segment,
                originalEvent: currentEvent
              });
            }
          });
          
          // Skip adding the original event
          eventToAdd = null;
          break;
        }
      }
    }

    // Add event if it wasn't completely blocked
    if (eventToAdd && eventToAdd.start < eventToAdd.end) {
      resolvedEvents.push(eventToAdd);
    }
  }

  const prioTranslateFlipped = {
    3: "High",
    4: "Urgent",
    1: "Low",
    2: "Medium",
  }

  for (const e of resolvedEvents) {
    e.priority = prioTranslateFlipped[e.priority];
  }
  return resolvedEvents;
}
