import React from 'react';

function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white text-black px-4 py-2 z-10 shadow-md">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <div>About Us</div>
          <div>Help Center</div>
          <div>Privacy & Terms</div>
          <div>Report Issue</div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <p className="text-blue-600 font-semibold">Collabify</p>
          <p className="text-black">2025</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
