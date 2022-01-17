import React from 'react';

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
  return (
    <>
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
    </>
  );
};

export default Widgets;
