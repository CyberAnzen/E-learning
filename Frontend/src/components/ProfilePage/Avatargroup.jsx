import React from "react";
import PropTypes from "prop-types";

const Avatargroup = ({
  certifications = [
    "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
    "https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
    "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
  ],
}) => {
  return (
    <div className="avatar-group -space-x-6">
      {certifications.slice(0, 3).map((cert, index) => (
        <div className="avatar" key={index}>
          <div className="w-12">
            <img src={cert} alt={`Avatar ${index + 1}`} />
          </div>
        </div>
      ))}
      {certifications.length > 3 && (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-12">
            <span>+{certifications.length - 3}</span>
          </div>
        </div>
      )}
    </div>
  );
};

Avatargroup.propTypes = {
  certifications: PropTypes.arrayOf(PropTypes.string),
};

export default Avatargroup;