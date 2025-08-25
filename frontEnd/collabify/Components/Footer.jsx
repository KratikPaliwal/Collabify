import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-black px-4 py-3 shadow-md">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm">
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/help" className="hover:underline">Help Center</a>
          <a href="/privacy" className="hover:underline">Privacy & Terms</a>
          <a href="/report" className="hover:underline">Report Issue</a>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <p className="text-blue-600 font-semibold">Collabify</p>
          <p className="text-gray-600">© 2025</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
