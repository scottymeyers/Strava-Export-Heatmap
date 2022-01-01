import React, { useEffect, useState } from 'react';

const Zoom = ({ map }) => {
  const [currentZoom, setCurrentZoom] = useState(map._zoom);

  const handleZoom = (desiredZoom, event) => {
    event.preventDefault();
    setCurrentZoom(desiredZoom);
  };

  useEffect(() => {
    map.setZoom(currentZoom);
  }, [currentZoom]);

  return (
    <div className="flex zoom">
      <div>
        <button
          disabled={currentZoom >= 20}
          onClick={handleZoom.bind(null, currentZoom + 1)}
          type="button"
        >
          +
        </button>
        <button
          disabled={currentZoom <= 1}
          onClick={handleZoom.bind(null, currentZoom - 1)}
          type="button"
        >
          -
        </button>
      </div>
      <div className="color-trans-white">{currentZoom}</div>
    </div>
  );
};

export default Zoom;
