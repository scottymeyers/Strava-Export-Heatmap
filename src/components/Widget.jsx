import React, { useState } from 'react';

const Widget = ({ children, subtitle, title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="tool">
      <label onClick={() => setIsOpen(!isOpen)}>
        {`${title} `}
        {subtitle && <span className="color-trans-white">{subtitle}</span>}
      </label>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Widget;
