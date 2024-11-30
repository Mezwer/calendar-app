# Public URL

This app was deployed with Vercel, so you can visit the public page here:
https://calendar-app-beryl.vercel.app/

# Setup

You can set this project up yourself locally very quickly, but you need to make sure that you have a 
OpenAI key to use the AI feature for this project. Once you have that, make a `.env` file in the root 
directory after you clone the repo, and follow this format:

```
REACT_APP_OPENAPIKEY={key}
```

Use these commands to set up the project:
```
git clone https://github.com/Mezwer/calendar-app.git
npm install
npm start
```

# Overview

This app has a few core features, which include drag and drop calendar events, priority resolution, and an AI assistant.

You can make events manually with the `+` button in the top left, and they will show up on the calendar. You can navigate with the arrow
keys on either side of the month and year. The calendar is in a weekly view, with 7 columns representing days and 24 rows per column
representing each hour of the day.

## Drag and Drop Events

One of the main features of this calendar is the drag and drop events, which allow you to grab any event and change the time
of the event easily within the week by dragging it to any cell. 

Events can also be deleted by clicking the trash button on the bottom right of the event.

## Priorities

Events are differentiated by priority by their color and an icon. The lowest priority is "Low", which has a blue color, and the highest priority is "Urgent", which is a red color. They also have different symbols indicating their priority. 

One of the features associated with the priorities is priority resolution. If there are multiple overlapping events, you can click the
calendar sync icon in the functions group on the top left of the calendar. This will automatically resolve conflicts with a pre-determined algorithm. It works by first trying to trim the events based on priority (lower priority events will be trimmed to make room for higher priority events) or even splitting events if necessary.

## AI Assistant

The AI assistant can be prompted by clicking the robot icon. You can type a prompt in, such as "Schedule my interview tomorrow, 10am to 11am", and the AI assistant will automatically create the event and place it on your calendar for you. You can do various other things, such
as "Reschedule my dentist appointment to tomorrow 11am to 1pm" or "Delete the interview that's on November 10th". 
