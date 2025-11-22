import React, { useState, useEffect } from "react";

function SuccessCheckmark() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger animation on initial render
    if (isVisible) {
      const checkIcon = document.querySelector(".check-icon");
      checkIcon?.classList.add("animate");
    }
  }, [isVisible]);

  return (
    <div className="success-checkmark">
      <div className="check-icon animate">
        <span className="icon-line line-tip" />
        <span className="icon-line line-long" />
        <div className="icon-circle" />
        <div className="icon-fix" />
      </div>
    </div>
  );
}

export default SuccessCheckmark;
