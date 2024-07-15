import { useState } from "react";
import "./Accordion.css";

const Accordion = ({ title, children }: { title: string; children: any }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`accordion-item ${isActive ? "active" : ""}`}>
      <div className="accordion-title p-4" onClick={handleToggle}>
        {title}
      </div>
      {isActive && <div className="accordion-content p-4 pb-6">{children}</div>}
    </div>
  );
};

export default Accordion;
