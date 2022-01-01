import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import debounce from 'lodash.debounce';

import ActivityTypeSelector from './components/ActivityTypeSelector';
import Attribution from './components/Attribution';
import PolylineColorPicker from './components/PolylineColorPicker';
import Widget from './components/Widget';
import Zoom from './components/Zoom';

const Map = () => {
  const mapRef = useRef(null);

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
          <span>Loading activities...</span>
        </div>
      )}
      <>
        <div className="widgets">
          <Widget title="Activity type">
            <ActivityTypeSelector
              handleSelect={(e) => setActivityType(e.target.value)}
              selected={activityType}
            />
          </Widget>
          <Widget title="Line color">
            <PolylineColorPicker
              handleChange={(e) => handleColorChange(e.target.value)}
              value={polylineColor}
            />
          </Widget>
          {mapRef.current && (
            <Widget title="Zoom">
              <Zoom map={mapRef.current} />
            </Widget>
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
