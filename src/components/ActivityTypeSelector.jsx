import React from 'react';

const options = [
  { label: 'All', value: '0' },
  { label: 'Ride', value: '1' },
  // { label: 'Alpine Ski', value: 2 },
  // { label: 'Backcountry Ski', value: 3 },
  { label: 'Hike', value: '4' },
  // { label: 'Ice Skate', value: 5 },
  // { label: 'Inline Skate', value: 6 },
  // { label: 'Nordic Ski', value: 7 },
  // { label: 'Roller Ski', value: 8 },
  { label: 'Run', value: '9' },
  { label: 'Walk', value: '10' },
  // { label: 'Workout', value: '11' },
  // { label: 'Snowboard', value: '12' },
  // { label: 'Snowshoe', value: '13' },
  // { label: 'Kitesurf', value: '14' },
  // { label: 'Windsurf', value: '15' },
  // { label: 'Swim', value: '16' },
  // { label: 'Virtual Ride', value: '17' },
  // { label: 'E-Bike Ride', value: '18' },
  // { label: 'Velomobile', value: '19' },
  { label: 'Canoe', value: '21' },
  { label: 'Kayaking', value: '22' },
  { label: 'Rowing', value: '23' },
  // { label: 'Stand Up Paddling', value: '24' },
  // { label: 'Surfing', value: '25' },
  // { label: 'Crossfit', value: '26' },
  // { label: 'Elliptical', value: '27' },
  // { label: 'Rock Climb', value: '28' },
  // { label: 'Stair-Stepper', value: '29' },
  // { label: 'Weight Training', value: '30' },
  // { label: 'Yoga', value: '31' },
  // { label: 'Handcycle', value: '51' },
  // { label: 'Wheelchair', value: '52' },
  // { label: 'Virtual Run', value: '53' },
];

const ActivityTypeSelector = ({ handleSelect, selected }) => {
  return (
    <div
      style={{
        background: 'black',
        position: 'fixed',
        right: '12px',
        top: '12px',
        zIndex: '2',
      }}
    >
      <select onChange={handleSelect}>
        {options.map((option) => {
          const { label, value } = option;
          return (
            <option key={value} selected={selected === value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ActivityTypeSelector;
