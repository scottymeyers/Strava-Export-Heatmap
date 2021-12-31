import React from 'react';

const PolylineColorPicker = ({ handleChange, value }) => {
  return (
    <div className="tool">
      <label htmlFor="polylineColorPicker">
        Line color:{' '}
        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{value}</span>
      </label>
      <div>
        <input
          id="polylineColorPicker"
          onChange={handleChange}
          type="color"
          value={value}
        ></input>
      </div>
    </div>
  );
};

export default PolylineColorPicker;
