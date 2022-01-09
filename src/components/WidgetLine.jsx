import React from 'react';
import Widget from './Widget';

const InputRange = ({
  color = 'white',
  id,
  max,
  min,
  onChange,
  step,
  value,
}) => (
  <input
    id={id}
    max={max}
    min={min}
    onChange={onChange}
    step={step}
    style={{
      backgroundSize: `${(100 * value) / max}% 100%`,
      color,
    }}
    type="range"
    value={value}
  />
);

const LineOption = ({ children, htmlFor, label, value }) => {
  return (
    <>
      <div className="flex justify-space-between">
        <label
          htmlFor={htmlFor}
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

const WidgetLine = ({ onChange, options }) => {
  const { color, dashArray, dashOffset, opacity, weight } = options;
  return (
    <Widget title="Line">
      <LineOption htmlFor="lineColor" label="Color" value={color}>
        <div className="flex justify-space-between">
          <div className="color-picker" style={{ background: color }}>
            <input
              id="lineColor"
              onChange={onChange}
              type="color"
              value={color}
            />
          </div>
        </div>
      </LineOption>
      <LineOption htmlFor="lineDashArray" label="Dash Array" value={dashArray}>
        <InputRange
          color={color}
          id="lineDashArray"
          max={10}
          min={0}
          onChange={onChange}
          step={1}
          value={dashArray}
        />
      </LineOption>
      <LineOption
        htmlFor="lineDashOffset"
        label="Dash Offset"
        value={dashOffset}
      >
        <InputRange
          color={color}
          id="lineDashOffset"
          max={10}
          min={0}
          onChange={onChange}
          step={1}
          value={dashOffset}
        />
      </LineOption>
      <LineOption htmlFor="lineOpacity" label="Opacity" value={opacity}>
        <InputRange
          color={color}
          id="lineOpacity"
          max={1}
          min={0}
          onChange={onChange}
          step={0.1}
          value={opacity}
        />
      </LineOption>
      <LineOption htmlFor="lineWeight" label="Weight" value={weight}>
        <InputRange
          color={color}
          id="lineWeight"
          max={10}
          min={0}
          onChange={onChange}
          step={1}
          value={weight}
        />
      </LineOption>
    </Widget>
  );
};

export default WidgetLine;
