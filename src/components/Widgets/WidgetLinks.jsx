import React from 'react';
import Widget from './Widget';

const WidgetLinks = () => (
  <Widget lockedOpen title="Links">
    <ul>
      <li>
        <a href="https://leafletjs.com/" target="_blank" rel="noreferrer">
          Leaflet
        </a>
      </li>
      <li>
        <a
          href="http://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>
      </li>
      <li>
        <a
          href="http://cartodb.com/attributions"
          target="_blank"
          rel="noreferrer"
        >
          CartoDB
        </a>
      </li>
      <li>
        <a
          href="https://github.com/scottymeyers/Strava-Export-Heatmap"
          target="_blank"
          rel="noreferrer"
        >
          Github Repository
        </a>
      </li>
    </ul>
  </Widget>
);

export default WidgetLinks;
