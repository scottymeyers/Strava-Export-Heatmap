import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';

const App = () => {
  const [activities, setActivities] = useState([]);
  // const [activityType, setActivityType] = useState('0');

  useEffect(() => {
    fetch('/activities')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      });
  }, []);

  // const filteredActivities = useMemo(
  //   () =>
  //     activities.filter((activity) => {
  //       if (activityType === '0') {
  //         return activity;
  //       }
  //       if (activityType === activity.type[0]) {
  //         return activity;
  //       }
  //     }),
  //   [activities, activityType]
  // );

  // <div>
  //   <select
  //     onChange={(e) => {
  //       setActivityType(e.target.value);
  //     }}
  //   >
  //     <option value="0">All</option>
  //     <option value="1">Ride</option>
  //     <option value="2">Alpine Ski</option>
  //     <option value="3">Backcountry Ski</option>
  //     <option value="4">Hike</option>
  //     <option value="5">Ice Skate</option>
  //     <option value="6">Inline Skate</option>
  //     <option value="7">Nordic Ski</option>
  //     <option value="8">Roller Ski</option>
  //     <option value="9">Run</option>
  //     <option value="10">Walk</option>
  //     <option value="11">Workout</option>
  //     <option value="12">Snowboard</option>
  //     <option value="13">Snowshoe</option>
  //     <option value="14">Kitesurf</option>
  //     <option value="15">Windsurf</option>
  //     <option value="16">Swim</option>
  //     <option value="17">Virtual Ride</option>
  //     <option value="18">E-Bike Ride</option>
  //     <option value="19">Velomobile</option>
  //     <option value="21">Canoe</option>
  //     <option value="22">Kayaking</option>
  //     <option value="23">Rowing</option>
  //     <option value="24">Stand Up Paddling</option>
  //     <option value="25">Surfing</option>
  //     <option value="26">Crossfit</option>
  //     <option value="27">Elliptical</option>
  //     <option value="28">Rock Climb</option>
  //     <option value="29">Stair-Stepper</option>
  //     <option value="30">Weight Training</option>
  //     <option value="31">Yoga</option>
  //     <option value="51">Handcycle</option>
  //     <option value="52">Wheelchair</option>
  //     <option value="53">Virtual Run</option>
  //   </select>
  // </div>;

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
          return (
            <Polyline
              color="#fF69BF"
              key={activity.name}
              positions={activity.points}
              opacity={0.5}
              smoothFactor={1}
              weight={1}
            />
          );
        })}
      </MapContainer>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
