import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import BASE_URL from '../config';

const Timesheet = () => {
  const [shift, setShift] = useState('');
  const [employeeID, setEmployeeID] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shift) {
      alert('Vui lòng chọn một shift!');
      return;
    }
    
    const data = {
      shift,
      employeeID: parseInt(employeeID, 10),
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/timesheet/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = response.data;
      if (responseData.status) {
        alert(`Check-in thành công! \nTimesheet ID: ${responseData.data.timesheetID}`);
        console.log('Response:', responseData);
        // Reset form
        setShift('');
        setEmployeeID('');
      } else {
        alert(`Check in thất bại: ${responseData.message}`);
        console.error('Error Response:', responseData);
        // Reset form
        setShift('');
        setEmployeeID('');
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Có lỗi xảy ra khi kết nối đến server!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Check-In</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Shift:
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              style={{ marginLeft: '10px' }}
              required
            >
              <option value="" disabled>--Choose shift--</option>
              <option value="DAY">DAY</option>
              <option value="NIGHT">NIGHT</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Employee ID:
            <input
              type="number"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              style={{ marginLeft: '10px' }}
              required
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Check-In</button>
      </form>
    </div>
  );
};

export default Timesheet;
