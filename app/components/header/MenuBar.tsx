import React from 'react';

const menuItems = [
  { label: 'Solve', onClick: () => (window.location.href = '/') },
  { label: 'Profile', onClick: () => (window.location.href = '/profile') },
];

export function MenuBar() {
  return (
    <nav className="w-full bg-[#23263a] border-b border-[#7c3aed] h-12 flex items-center px-4 z-50 shadow-sm">
      <ul className="flex gap-8 mx-auto justify-center w-full">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button
              className="text-sm font-medium px-5 py-1 rounded transition-colors duration-150 focus:outline-none focus:bg-bolt-elements-button-primary-backgroundHover bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover hover:text-bolt-elements-button-primary-text"
              onClick={item.onClick}
              type="button"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
