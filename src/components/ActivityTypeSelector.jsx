import React from 'react';

const options = [
  { label: 'All', value: '0' },
  { label: 'Ride', value: '1' },
  { label: 'Hike', value: '4' },
  { label: 'Run', value: '9' },
  { label: 'Walk', value: '10' },
  { label: 'Canoe', value: '21' },
  { label: 'Kayaking', value: '22' },
  { label: 'Rowing', value: '23' },
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
