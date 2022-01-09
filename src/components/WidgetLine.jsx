import React from 'react';

const InputRange = ({ id, max, min, onChange, step, value }) => (
  <input
    onChange={onChange}
    type="range"
    id={id}
    min={min}
    step={step}
    max={max}
    style={{
      backgroundSize: `${(100 * value) / max}% 100%`,
    }}
    value={value}
  />
);

const LineOption = ({ children, label, value }) => {
  return (
    <>
      <div className="flex justify-space-between">
        <label
          htmlFor="lineOpacity"
          style={{ display: 'block', marginBottom: '2.5px' }}
        >
          {label}:
        </label>
        <span className="color-trans-white">{value}</span>
      </div>
      <div style={{ marginBottom: '10px' }}>{children}</div>
    </>
  );
};

const WidgetLine = ({ onChange, values }) => {
  const { lineColor, lineOpacity, lineWeight } = values;
  return (
    <>
      <LineOption label="Color" value={lineColor}>
        <div className="flex justify-space-between">
          <div className="color-picker" style={{ background: lineColor }}>
            <input
              id="lineColor"
              onChange={onChange}
              type="color"
              value={lineColor}
            />
          </div>
        </div>
      </LineOption>

      <LineOption label="Opacity" value={lineOpacity}>
        <InputRange
          id="lineOpacity"
          max={1}
          min={0}
          onChange={onChange}
          step={0.1}
          value={lineOpacity}
        />
      </LineOption>

      <LineOption label="Weight" value={lineWeight}>
        <InputRange
          id="lineWeight"
          max={10}
          min={0}
          onChange={onChange}
          step={1}
          value={lineWeight}
        />
      </LineOption>
    </>
  );
};

export default WidgetLine;
