import React from 'react';

const typeOptions = [
  {
    value: '0',
    label: 'All',
  },

  {
    value: '1',
    label: 'Ride',
  },

  {
    value: '4',
    label: 'Hike',
  },

  {
    value: '9',
    label: 'Run',
  },

  {
    value: '10',
    label: 'Walk',
  },

  {
    value: '21',
    label: 'Canoe',
  },

  {
    value: '22',
    label: 'Kayaking',
  },

  {
    value: '23',
    label: 'Rowing',
  },
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
        {typeOptions.map((option) => {
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
