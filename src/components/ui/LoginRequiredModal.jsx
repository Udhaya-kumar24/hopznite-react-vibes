import React from 'react';

const LoginRequiredModal = ({ open, onLogin, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm">

      <div className="bg-background rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Login Required</h2>
        <p className="mb-6">You need to log in to access this page.</p>
        <div className="flex gap-4 justify-center">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-primary hover:bg-primary/90"
            onClick={onLogin}
          >
            Go to Login
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-muted-foreground h-10 px-4 py-2 bg-muted hover:bg-muted/90"
            onClick={onClose}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal; 