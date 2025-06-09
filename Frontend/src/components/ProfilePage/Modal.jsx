// Modal.jsx
import React from "react";

const Modal = ({ id, children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 ">
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