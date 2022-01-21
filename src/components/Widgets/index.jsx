import React, { useState } from 'react';

import WidgetActivityType from './WidgetActivityType';
import WidgetCenter from './WidgetCenter';
import WidgetLine from './WidgetLine';
import WidgetLinks from './WidgetLinks';
import WidgetZoom from './WidgetZoom';

const Widgets = ({
  activityType,
  handleLineChange,
  handleActivitySelect,
  lineOptions,
  mapCenter,
  mapRef,
  userLocation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className="widgets"
      style={isExpanded ? { transform: 'translateX(-212px)' } : {}}
    >
      <button
        className="widgets-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        {isExpanded ? '↪' : '↩'}
      </button>
      <WidgetActivityType
        desiredOptions={[
          'All',
          'Ride',
          'Hike',
          'Walk',
          'Canoe',
          'Kayaking',
          'Rowing',
        ]}
        handleSelect={handleActivitySelect}
        selected={activityType}
      />
      <WidgetLine onChange={handleLineChange} options={lineOptions} />
      {mapRef.current && (
        <>
          <WidgetZoom map={mapRef.current} />
          <WidgetCenter
            center={mapCenter}
            map={mapRef.current}
            userLocation={userLocation}
          />
        </>
      )}
      <WidgetLinks />
    </aside>
  );
};

export default Widgets;
