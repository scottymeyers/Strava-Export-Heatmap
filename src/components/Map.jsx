import React, { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import create from 'zustand';
import shallow from 'zustand/shallow';
import debounce from 'lodash.debounce';

import Widgets from './Widgets';

const useMapStore = create((set) => ({
  activities: [],
  activityType: '1',
  center: {
    lat: 40.73061,
    lng: -73.935242,
  },
  errorMessage: null,
  lineOptions: {
    color: '#37ff37',
    dashArray: '0',
    dashOffset: '0',
    opacity: 0.5,
    weight: 1,
  },
  userLocation: null,
  setActivityType: (activityType) => set({ activityType }),
  setActivities: (activities) => set({ activities }),
  setCenter: (center) => set({ center }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setLineOptions: (lineOptions) => set({ lineOptions }),
  setUserLocation: (userLocation) => set({ userLocation }),
}));

const Map = () => {
  const mapRef = useRef(null);

  const store = useMapStore((state) => state);

  const filteredActivities = useMemo(
    () =>
      store.activities.map((activity) => {
        return {
          color: ['0', activity.type[0]].includes(store.activityType)
            ? store.lineOptions.color
            : 'transparent',
          opacity: store.lineOptions.opacity,
          dashArray: store.lineOptions.dashArray,
          dashOffset: store.lineOptions.dashOffset,
          weight: store.lineOptions.weight,
          ...activity,
        };
      }),
    [store.activities, store.activityType, store.lineOptions]
  );

  const handleLineChange = (event) => {
    const { id, value } = event.target;
    const delay = id === 'lineColor' ? 500 : 5;
    debounce(() => {
      switch (id) {
        case 'lineColor':
          store.setLineOptions({ ...store.lineOptions, color: value });
          break;
        case 'lineDashArray':
          store.setLineOptions({ ...store.lineOptions, dashArray: value });
          break;
        case 'lineDashOffset':
          store.setLineOptions({ ...store.lineOptions, dashOffset: value });
          break;
        case 'lineOpacity':
          store.setLineOptions({ ...store.lineOptions, opacity: value });
          break;
        case 'lineWeight':
          store.setLineOptions({ ...store.lineOptions, weight: value });
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
        store.setActivities(data);
      })
      .catch((error) => {
        store.setErrorMessage(error.message);
      });
  }, []);

  // ask for user geolocation permissions
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition((currentPosition) => {
        const { latitude, longitude } = currentPosition.coords;
        store.setUserLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  // keep track of map center coordinates
  useEffect(() => {
    mapRef?.current?.on('moveend', () => {
      store.setCenter(mapRef.current.getCenter());
    });
  }, [mapRef.current]);

  return (
    <>
      {store.activities.length === 0 && (
        <div className="loading">
          <span>
            {store.errorMessage ? store.errorMessage : 'Loading activities...'}
          </span>
        </div>
      )}
      <>
        <Widgets
          activityType={store.activityType}
          handleLineChange={handleLineChange}
          handleActivitySelect={(e) => setActivityType(e.target.value)}
          lineOptions={store.lineOptions}
          mapCenter={store.center}
          mapRef={mapRef}
          userLocation={store.userLocation}
        />
        <button
          className="button mobile-locate"
          disabled={!store.userLocation}
          onClick={() => mapRef.current.panTo(store.userLocation)}
          type="button"
        >
          &#10166;
        </button>
        <MapContainer
          center={[store.center.lat, store.center.lng]}
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
          {store.userLocation && (
            <Marker
              position={store.userLocation}
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
ReactDOM.render(<Map />, document.getElementById('root'));
