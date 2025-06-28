import React from 'react';

const Modal = ({ open, onClose, title, children, actions, maxWidth = 'max-w-md', center = true }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-background rounded-lg shadow-lg p-8 w-full ${maxWidth} ${center ? 'text-center' : ''}`}>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div className="mb-6">{children}</div>
        {actions && (
          <div className="flex gap-4 justify-center">
            {actions}
          </div>
        )}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold bg-transparent border-none cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal; 