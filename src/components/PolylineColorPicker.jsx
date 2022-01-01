import React from 'react';

const PolylineColorPicker = ({ handleChange, value }) => {
  return <input onChange={handleChange} type="color" value={value}></input>;
};

export default PolylineColorPicker;
