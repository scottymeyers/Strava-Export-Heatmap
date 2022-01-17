import React, { useState } from 'react';

const Widget = ({ children, lockedOpen = false, title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="widget">
      <button
        className="widget-toggle"
        style={{
          borderBottom: isOpen ? '1px solid rgba(255, 255, 255, 0.5)' : 'none',
          pointerEvents: lockedOpen ? 'none' : '',
        }}
        onClick={() => {
          if (!lockedOpen) setIsOpen(!isOpen);
        }}
      >
        {`${title} `} <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Widget;
