import React from "react";

const ArrowButtons = ({
  index,
  section,
  formData,
  moveSectionUp,
  moveSectionDown,
}) => {
  const sectionData = formData[section];

  return (
    <div className="section-actions">
      <button
        className="arrow-button"
        onClick={() => moveSectionUp(index, section)}
        disabled={index === 0}
      >
        ↑
      </button>
      <button
        className="arrow-button"
        onClick={() => moveSectionDown(index, section)}
        disabled={index === sectionData.length - 1}
      >
        ↓
      </button>
    </div>
  );
};

export default ArrowButtons;
