import React, { useState } from 'react';

const Widget = ({ children, lockedOpen = false, title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="tool">
      <label
        style={lockedOpen ? { pointerEvents: 'none' } : {}}
        onClick={() => {
          if (!lockedOpen) setIsOpen(!isOpen);
        }}
      >
        {`${title} `} <span>{isOpen ? '-' : '+'}</span>
      </label>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Widget;
