import React from 'react';

const PolylineColorPicker = ({ handleChange, value }) => {
  return (
    <div className="flex justify-space-between">
      <div className="color-picker" style={{ background: value }}>
        <input onChange={handleChange} type="color" value={value}></input>
      </div>
      <span className="color-trans-white">{value}</span>
    </div>
  );
};

export default PolylineColorPicker;
