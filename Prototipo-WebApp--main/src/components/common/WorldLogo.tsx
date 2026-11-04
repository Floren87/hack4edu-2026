import React from 'react';

interface WorldLogoProps {
  className?: string;
  size?: number;
}

export const WorldLogo: React.FC<WorldLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Mundo Talento sin Fronteras"
    >
      <defs>
        {/* Planet sphere gradient */}
        <linearGradient id="globeOceanGrad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Continents gradient - warm land and flourishing life */}
        <linearGradient id="landGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Colorful connecting orbit/bridge - representing borders without barriers */}
        <linearGradient id="orbitBridgeGrad" x1="4" y1="36" x2="44" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Atmosphere rim glow */}
        <radialGradient id="atmoGlow" cx="24" cy="24" r="20" gradientUnits="userSpaceOnUse">
          <stop offset="70%" stopColor="#60a5fa" stopOpacity="0" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Atmospheric outer aura */}
      <circle cx="24" cy="24" r="21" fill="url(#atmoGlow)" />

      {/* Planet Sphere */}
      <circle cx="24" cy="24" r="18" fill="url(#globeOceanGrad)" />

      {/* Latitudinal & Longitudinal subtle grid lines */}
      <ellipse cx="24" cy="24" rx="18" ry="8" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
      <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
      <line x1="6" y1="24" x2="42" y2="24" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />

      {/* Stylized organic continents */}
      <g fill="url(#landGrad)">
        {/* Eurasia & Africa continent shape */}
        <path d="M19 12C21 11 25 10 27 12C29 14 28 17 25 18C23 18.5 22 21 24 23C26 25 28 26 26 29C24 32 21 34 20 31C19 28 20 25 18 24C16 23 14 19 16 16C17 14 18 13 19 12Z" />
        {/* Americas continent shape */}
        <path d="M10 17C12 15 15 16 14 19C13 22 11 24 12 27C13 30 16 33 15 35C14 36 12 34 11 32C9 28 8 21 10 17Z" />
        {/* Oceania / Island arcs */}
        <ellipse cx="34" cy="27" rx="3" ry="2" />
        <circle cx="37" cy="22" r="1.5" />
      </g>

      {/* Connecting Bridge / Orbit of Solidarity (No borders, human connection) */}
      <path
        d="M5 32C10 39 30 42 42 20"
        stroke="url(#orbitBridgeGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 0"
      />
      {/* Front orbit segment */}
      <path
        d="M7 30C13 36 33 37 43 18"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Small friendly satellite / traveler node */}
      <circle cx="41" cy="19" r="2.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
};
