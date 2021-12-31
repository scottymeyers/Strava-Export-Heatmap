import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import debounce from 'lodash.debounce';

import ActivityTypeSelector from './components/ActivityTypeSelector';
import PolylineColorPicker from './components/PolylineColorPicker';

const Map = () => {
  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('1');
  const [polylineColor, setPolylineColor] = useState('#ff69bf');

  useEffect(() => {
    fetch('/activities')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      });
  }, []);

  const filteredActivities = useMemo(
    () =>
      activities.map((activity) => {
        return {
          color:
            activityType === '0' || activityType === activity.type[0]
              ? polylineColor
              : 'transparent',
          ...activity,
        };
      }),
    [activities, activityType, polylineColor]
  );

  const handleColorChange = useCallback(
    debounce((color) => {
      setPolylineColor(color);
    }, 500),
    []
  );

  return (
    <>
      {activities.length === 0 && (
        <div className="loading">
          <span>Loading Activities...</span>
        </div>
      )}
      <>
        <div className="tools">
          <ActivityTypeSelector
            handleSelect={(e) => setActivityType(e.target.value)}
            selected={activityType}
          />
          <PolylineColorPicker
            handleChange={(e) => handleColorChange(e.target.value)}
            selected={polylineColor}
          />
        </div>
        <MapContainer
          style={{ zIndex: 1 }}
          center={[40.73061, -73.935242]}
          zoom={11}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          />
          {filteredActivities.map((activity) => {
            return (
              <Polyline
                key={activity.name}
                pathOptions={{ color: activity.color }}
                positions={activity.points}
                opacity={0.5}
                smoothFactor={1}
                weight={1}
              />
            );
          })}
        </MapContainer>
      </>
    </>
  );
};

ReactDOM.render(<Map />, document.getElementById('root'));
