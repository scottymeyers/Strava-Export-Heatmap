import React from 'react';

const PolylineColorPicker = ({ handleChange, selected }) => {
  return (
    <div className="tool">
      <label htmlFor="polylineColorPicker">Line color</label>
      <input
        id="polylineColorPicker"
        onChange={handleChange}
        type="color"
        value={selected}
      ></input>
    </div>
  );
};

export default PolylineColorPicker;
