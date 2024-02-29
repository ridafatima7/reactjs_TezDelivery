import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ClockComponent from './ClockComponent';
import 'react-clock/dist/Clock.css';
const CalendarComponent = ({ onClose, onDateSelect, onDateTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showClock, setShowClock] = useState(false);
  
  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleCancel = () => {
    onClose();
  };
  const handleOk = () => {
    onDateSelect(selectedDate);
    setShowClock(true);
  };
  const handleClockClose = () => {
    setShowClock(false);
  };
  const handleDateTimeSelect = (selectedTime) => {
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(selectedTime.getHours());
    selectedDateTime.setMinutes(selectedTime.getMinutes());
     console.log(selectedDateTime);
     onDateTimeSelect(selectedDateTime);
    onClose();
  };
  const today = new Date();
  const nextTwoDays = new Date(today);
  nextTwoDays.setDate(today.getDate() + 2);
  return (
    <div className="calendar-container">
      <div className='calendar-popup'>
      <Calendar onChange={handleDateChange} value={selectedDate} minDate={today}
          maxDate={nextTwoDays} />
      <div className="buttons-container">
        <button className='calendar_button1' onClick={handleCancel}>Cancel</button>
        <button className='calendar_button2' onClick={handleOk}>OK</button>
      </div>
      </div> 
         {showClock && 
         <ClockComponent onClose={handleClockClose} onTimeSelect={handleDateTimeSelect} selectedDate={selectedDate} />}
    </div>
  );
};

export default CalendarComponent;
