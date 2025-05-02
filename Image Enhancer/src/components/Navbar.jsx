import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#fad02c] px-6 py-4 flex items-center justify-between h-24">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="h-23 w-auto">
          <img 
            src="/navlogo.jpg" 
            alt="Company Logo" 
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation Placeholder - Empty for now */}
      <div className="flex-grow flex justify-center">
        {/* Navigation items would go here */}
      </div>

      {/* Right Section Placeholder */}
      <div className="flex items-center space-x-4">
        {/* Additional buttons or elements would go here */}
      </div>
    </nav>
  );
};

export default Navbar;