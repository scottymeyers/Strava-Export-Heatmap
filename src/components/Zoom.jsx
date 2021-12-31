import React, { useEffect, useState } from 'react';

const buttonStyles = {
  background: 'black',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  borderRadius: 0,
  color: 'white',
  marginRight: '2px',
  width: '30px',
};

const Zoom = ({ map }) => {
  const [currentZoom, setCurrentZoom] = useState(map._zoom);

  useEffect(() => {
    map.setZoom(currentZoom);
  }, [currentZoom]);

  return (
    <div className="tool">
      <label htmlFor="zoom">
        Zoom:&nbsp;
        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{currentZoom}</span>
      </label>
      <div>
        <button
          disabled={currentZoom >= 20}
          onClick={(e) => {
            e.preventDefault();
            setCurrentZoom(currentZoom + 1);
          }}
          style={buttonStyles}
        >
          +
        </button>
        <button
          disabled={currentZoom <= 1}
          onClick={(e) => {
            e.preventDefault();
            setCurrentZoom(currentZoom - 1);
          }}
          style={buttonStyles}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Zoom;
