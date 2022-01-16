import React from 'react';
import Widget from './Widget';

const WidgetCenter = ({ center, map, userLocation }) => {
  const locate = (e) => {
    e.preventDefault();
    map.panTo(userLocation);
  };

  return (
    <Widget title="Center">
      <div className="flex justify-space-between">
        <button
          className="button"
          disabled={!userLocation}
          onClick={locate}
          type="button"
        >
          &#10166;
        </button>
        {center?.lat && center?.lng && (
          <div className="color-trans-white">
            {center.lat.toFixed(3)}, {center.lng.toFixed(3)}
          </div>
        )}
      </div>
    </Widget>
  );
};

export default WidgetCenter;
