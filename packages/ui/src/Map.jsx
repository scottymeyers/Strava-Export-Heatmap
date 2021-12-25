import React, { useEffect, Suspense, useState } from "react";
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'

const Map = () => {
  const center = [40.730610, -73.935242];
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('./output.json')
      .then(response => response.json())
      .then(data => setActivities(data));
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} >
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
          />
        {activities.map((activity) => {
          const tracks = activity;        
          return tracks.map((track) => {
            return <Polyline color="#fF69BF" key={track.name} positions={track.points} opacity={0.5} smoothFactor={1} weight={1} />
          })
        })}
      </MapContainer>
    </Suspense>
  )
};

export default Map;