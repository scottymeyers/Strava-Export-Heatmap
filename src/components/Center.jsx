import React, { useEffect, useState } from 'react';

const Center = ({ map, userLocation }) => {
  const [center, setCenter] = useState(map.getCenter());

  const locate = (e) => {
    e.preventDefault();
    map.panTo(userLocation);
  };

  useEffect(() => {
    map.on('moveend', () => {
      setCenter(map.getCenter());
    });
  }, []);

  return (
    <div className="flex justify-space-between">
      <button
        className="button"
        disabled={!userLocation}
        onClick={locate}
        type="button"
      >
        &#10166;
      </button>
      <div className="color-trans-white">
        {center.lat.toFixed(3)}, {center.lng.toFixed(3)}
      </div>
    </div>
  );
};

export default Center;
