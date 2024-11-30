import WeeklyCalendar from './pages/WeeklyCalendar.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <WeeklyCalendar />
    </DndProvider>
  );
}

export default App;
