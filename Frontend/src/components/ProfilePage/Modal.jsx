import React from "react";

const Modal = ({ id, children, className="bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 backdrop-blur-xl rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922]"  }) => {
  const handleOverlayClick = (e) => {
    const dialog = document.getElementById(id);
    if (e.target === dialog) {
      dialog.close(); // Close the modal when clicking the overlay
    }
  };

  return (
    <dialog id={id} className="modal" onClick={handleOverlayClick}>
      <div
        className={`modal-box px-0 ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the box
      >
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;

{/* const Modal = ({ id, children, className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"  }) => { */}
