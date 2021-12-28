import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';

const App = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('/activities')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      });
  }, []);

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
            zIndex: 2,
          }}
        >
          <span>Loading Activities...</span>
        </div>
      )}
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
        {activities.map((activity) => {
          const tracks = activity;
          return tracks.map((track) => {
            return (
              <Polyline
                color="#fF69BF"
                key={track.name}
                positions={track.points}
                opacity={0.5}
                smoothFactor={1}
                weight={1}
              />
            );
          });
        })}
      </MapContainer>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
