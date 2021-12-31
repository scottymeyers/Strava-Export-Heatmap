import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';

import ActivityTypeSelector from './components/ActivityTypeSelector';

const App = () => {
  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('1');

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
              ? '#fF69BF'
              : 'transparent',
          ...activity,
        };
      }),
    [activities, activityType]
  );

  return (
    <>
      {activities.length === 0 && (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            color: 'white',
            display: 'flex',
            fontFamily: 'monospace',
            height: '100vh',
            justifyContent: 'center',
            left: 0,
            position: 'fixed',
            top: 0,
            width: '100vw',
            zIndex: 3,
          }}
        >
          <span>Loading Activities...</span>
        </div>
      )}
      <>
        <ActivityTypeSelector
          handleSelect={(e) => setActivityType(e.target.value)}
          selected={activityType}
        />
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

ReactDOM.render(<App />, document.getElementById('root'));
