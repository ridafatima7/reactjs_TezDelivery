import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
const ClockComponent = ({ onClose, onTimeSelect ,selectedDate}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState(currentTime.getHours() % 12 || 12);
  const [selectedMinutes, setSelectedMinutes] = useState(currentTime.getMinutes());
  const [selectedPeriod, setSelectedPeriod] = useState(currentTime.getHours() < 12 ? 'AM' : 'PM');
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const handleTimeChange = (newTime) => {
    setCurrentTime(newTime);
  };

  // const handleOk = () => {
  //   onTimeSelect(time);
  //   onClose();
  // };
   const onCloseClock = () => {
    onClose();
  };
  const handleTimeSelect = () => {
    const selectedTime = new Date();
    selectedTime.setHours(selectedPeriod === 'PM' ? selectedHours + 12 : selectedHours);
    selectedTime.setMinutes(selectedMinutes);
    onTimeSelect(selectedTime);
    onClose();
  };
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    // <div className="clock-container">
    //   <Clock value={time} onChange={handleTimeChange} />

    //   <div className="buttons-container">
    //     <button onClick={handleOk}>OK</button>
    //   </div>
    // </div>
    <div className="clock-container">
      <div className="clock-popup">
        {/* {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} */}
        <span >Enter Time</span>
        <div className="time-inputs">
          <input
            type="text"
            className='clock-input'
            inputMode="numeric"
            pattern="[0-9]{1,2}"
            value={selectedHours}
            onChange={(e) => setSelectedHours(e.target.value)}
          />
          <span style={{fontSize:'46px',paddingTop:'20px'}}>:</span>
          <input
            type='text'
            className='clock-input'
            inputMode="numeric"
            pattern="[0-9]{1,2}"
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(e.target.value)}
          />
          <div className="period-buttons">
          <button className={`period-button1 ${selectedPeriod === 'AM' ? 'selected' : ''}`} onClick={() => handlePeriodChange('AM')}>AM</button>
          <button className={`period-button2 ${selectedPeriod === 'PM' ? 'selected' : ''}`} onClick={() => handlePeriodChange('PM')}>PM</button>
        </div>
        </div>
        <div style={{marginTop:'15px',justifyContent:'flex-start', gap:'2.6rem'}} className='time-inputs'>
            <span >Hours</span>
            <span style={{marginBottom:'35px'}}>Minutes</span>
        </div>
        <div className="buttons-container">
        <button className="calendar_button1" onClick={onCloseClock}>
          Cancel
        </button>
        <button className="calendar_button2" onClick={handleTimeSelect}>
          OK
        </button>
      </div>
    </div>
    </div>
  );
};


export default ClockComponent
