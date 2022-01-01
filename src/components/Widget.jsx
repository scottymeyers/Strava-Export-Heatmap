import React, { useState } from 'react';

const Widget = ({ children, lockedOpen = false, subtitle, title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="tool">
      <label
        style={lockedOpen ? { pointerEvents: 'none' } : {}}
        onClick={() => {
          if (!lockedOpen) setIsOpen(!isOpen);
        }}
      >
        {`${title} `}
        {subtitle && <span className="color-trans-white">{subtitle}</span>}
      </label>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Widget;
