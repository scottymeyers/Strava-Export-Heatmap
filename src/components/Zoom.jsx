import React, { useEffect, useState } from 'react';

const Zoom = ({ map }) => {
  const [currentZoom, setCurrentZoom] = useState(map._zoom);

  const handleZoom = (desiredZoom, event) => {
    event.preventDefault();
    map.setZoom(desiredZoom);
  };

  useEffect(() => {
    map.on('zoomend', () => setCurrentZoom(map.getZoom()));
  }, []);

  return (
    <div className="flex zoom">
      <div>
        <button
          className="button"
          disabled={currentZoom >= 18}
          onClick={handleZoom.bind(null, currentZoom + 1)}
          type="button"
        >
          +
        </button>
        <button
          className="button"
          disabled={currentZoom <= 3}
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
