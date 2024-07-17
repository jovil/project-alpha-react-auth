import { useState } from "react";
import "../../components/Accordion.css";

const Accordion = ({
  title,
  children,
  isDetailsSaved,
}: {
  title: string;
  children: any;
  isDetailsSaved: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`accordion-item ${isActive ? "active" : ""}`}>
      <div
        className="accordion-title p-4 flex justify-between items-center gap-4"
        onClick={handleToggle}
      >
        {title}
        {isDetailsSaved && (
          <p className="bg-green/20 text-sm font-medium text-green rounded px-4 py-1.5">
            Saved
          </p>
        )}
      </div>
      {isActive && <div className="accordion-content p-4 pb-6">{children}</div>}
    </div>
  );
};

export default Accordion;
