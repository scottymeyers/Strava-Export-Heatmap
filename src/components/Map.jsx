import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import debounce from 'lodash.debounce';

import Widgets from './Widgets';

const Map = () => {
  const mapRef = useRef(null);

  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('1');
  const [errorMessage, setErrorMessage] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 40.73061,
    lng: -73.935242,
  });
  const [lineOptions, setLineOptions] = useState({
    color: '#ff69bf',
    dashArray: '0',
    dashOffset: '0',
    opacity: 0.5,
    weight: 1,
  });
  const [userLocation, setUserLocation] = useState(null);

  const filteredActivities = useMemo(
    () =>
      activities.map((activity) => {
        return {
          color:
            activityType === '0' || activityType === activity.type[0]
              ? lineOptions.color
              : 'transparent',
          opacity: lineOptions.opacity,
          dashArray: lineOptions.dashArray,
          dashOffset: lineOptions.dashOffset,
          weight: lineOptions.weight,
          ...activity,
        };
      }),
    [activities, activityType, lineOptions]
  );

  const handleLineChange = (event) => {
    const { id, value } = event.target;
    const delay = id === 'lineColor' ? 500 : 5;
    debounce(() => {
      switch (id) {
        case 'lineColor':
          setLineOptions((o) => ({ ...o, color: value }));
          break;
        case 'lineDashArray':
          setLineOptions((o) => ({ ...o, dashArray: value }));
          break;
        case 'lineDashOffset':
          setLineOptions((o) => ({ ...o, dashOffset: value }));
          break;
        case 'lineOpacity':
          setLineOptions((o) => ({ ...o, opacity: value }));
          break;
        case 'lineWeight':
          setLineOptions((o) => ({ ...o, weight: value }));
          break;
        default:
          break;
      }
    }, delay)();
  };

  // load data generated with convert script
  useEffect(() => {
    fetch('/activities')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Activities Not Found');
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setActivities(data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  // ask for user geolocation permissions
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition((currentPosition) => {
        const { latitude, longitude } = currentPosition.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  // keep track of map center coordinates
  useEffect(() => {
    mapRef?.current?.on('moveend', () => {
      setMapCenter(mapRef.current.getCenter());
    });
  }, [mapRef.current]);

  return (
    <>
      {activities.length === 0 && (
        <div className="loading">
          <span>{errorMessage ? errorMessage : 'Loading activities...'}</span>
        </div>
      )}
      <>
        <Widgets
          activityType={activityType}
          handleLineChange={handleLineChange}
          handleActivitySelect={(e) => setActivityType(e.target.value)}
          lineOptions={lineOptions}
          mapCenter={mapCenter}
          mapRef={mapRef}
          userLocation={userLocation}
        />
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          className="map"
          scrollWheelZoom={false}
          whenCreated={(map) => (mapRef.current = map)}
          zoom={11}
          zoomControl={false}
        >
          <TileLayer
            attribution='<div class="test"><a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a></div>'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          />
          {filteredActivities.map((activity) => (
            <Polyline
              key={activity.name}
              pathOptions={{
                color: activity.color,
                dashArray: Number(activity.dashArray),
                dashOffset: Number(activity.dashOffset),
                opacity: activity.opacity,
                weight: activity.weight,
              }}
              positions={activity.points}
              smoothFactor={1}
            />
          ))}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={divIcon({
                className: '',
                html: `
                  <svg viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      fill="white"
                      fill-opacity="0.9"
                      r="50"
                    />
                  </svg>
                `,
              })}
            />
          )}
        </MapContainer>
      </>
    </>
  );
};

ReactDOM.render(<Map />, document.getElementById('root'));
