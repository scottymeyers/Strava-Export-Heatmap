import React from 'react';

const PolylineColorPicker = ({ handleChange, value }) => {
  return (
    <div className="flex" style={{ justifyContent: 'space-between' }}>
      <input onChange={handleChange} type="color" value={value}></input>
      <div className="color-trans-white">{value}</div>
    </div>
  );
};

export default PolylineColorPicker;
