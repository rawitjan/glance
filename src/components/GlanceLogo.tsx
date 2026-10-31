import React from 'react';

interface GlanceLogoProps {
  size?: number;
  className?: string;
}

export const GlanceLogo: React.FC<GlanceLogoProps> = ({ size = 20, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-[28%] overflow-hidden flex-shrink-0 shadow-sm ${className}`}
    >
      {/* Background Squircle with dynamic accent & dark obsidian gradient */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="glance-logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1838" />
            <stop offset="100%" stopColor="#0c0a18" />
          </linearGradient>

          <linearGradient id="glance-logo-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--glance-accent, #5d3ee8)" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="var(--glance-accent, #c084fc)" />
          </linearGradient>

          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle base */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill="url(#glance-logo-bg)"
          stroke="url(#glance-logo-stroke)"
          strokeWidth="1.5"
        />

        {/* Ambient inner soft accent glow */}
        <circle cx="24" cy="24" r="14" fill="var(--glance-accent, #5d3ee8)" opacity="0.25" filter="url(#logo-glow)" />

        {/* Stylized 'G' + Eye aperture + Checkmark */}
        <path
          d="M32 17C29.8 14.8 26.8 13.5 23.5 13.5C17.7 13.5 13 18.2 13 24C13 29.8 17.7 34.5 23.5 34.5C28.5 34.5 32.7 31 33.7 26.3H24V21.8H38.5C38.8 22.8 39 23.9 39 25C39 33.3 32 40 23.5 40C14.7 40 7.5 32.8 7.5 24C7.5 15.2 14.7 8 23.5 8C28 8 32.1 9.8 35 12.8L32 17Z"
          fill="url(#glance-logo-stroke)"
        />

        {/* Eye pupil / focus center dot */}
        <circle cx="24" cy="24" r="3.2" fill="#ffffff" />
        <circle cx="24" cy="24" r="1.5" fill="var(--glance-accent, #5d3ee8)" />

        {/* Sharp checkmark focus accent at top-right */}
        <path
          d="M31 11L34.5 14.5L41.5 7.5"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
