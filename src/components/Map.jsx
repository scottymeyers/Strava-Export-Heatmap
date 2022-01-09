import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import debounce from 'lodash.debounce';

import ActivityTypeSelector from './ActivityTypeSelector';
import Attribution from './Attribution';
import Center from './Center';
import WidgetLine from './WidgetLine';
import Widget from './Widget';
import Zoom from './Zoom';

const Map = () => {
  const mapRef = useRef(null);

  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('1');
  const [userLocation, setUserLocation] = useState(null);

  const [lineOptions, setLineOptions] = useState({
    color: '#ff69bf',
    dashArray: '0',
    dashOffset: '0',
    opacity: 0.5,
    weight: 1,
  });

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

  useEffect(() => {
    fetch('/activities')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      });
  }, []);

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

  return (
    <>
      {activities.length === 0 && (
        <div className="loading">
          <span>Loading activities...</span>
        </div>
      )}
      <>
        <div className="widgets">
          <Widget title="Activity type">
            <ActivityTypeSelector
              desiredOptions={[
                'All',
                'Ride',
                'Hike',
                'Walk',
                'Canoe',
                'Kayaking',
                'Rowing',
              ]}
              handleSelect={(e) => setActivityType(e.target.value)}
              selected={activityType}
            />
          </Widget>
          <Widget title="Line">
            <WidgetLine onChange={handleLineChange} options={lineOptions} />
          </Widget>
          {mapRef.current && (
            <>
              <Widget title="Zoom">
                <Zoom map={mapRef.current} />
              </Widget>
              <Widget title="Center">
                <Center map={mapRef.current} userLocation={userLocation} />
              </Widget>
            </>
          )}
          <Widget lockedOpen title="Attribution">
            <Attribution />
          </Widget>
        </div>
        <MapContainer
          center={[40.73061, -73.935242]}
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
        </MapContainer>
      </>
    </>
  );
};

ReactDOM.render(<Map />, document.getElementById('root'));
