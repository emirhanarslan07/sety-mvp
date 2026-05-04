import React from 'react';

/**
 * High-fidelity Zapier Logo (Official Asterisk Icon on Branded Orange)
 */
export const ZapierLogoSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <rect width="24" height="24" rx="5" fill="#FF4A00" />
    <path 
      d="M14.7 1.7L9.3 5.3l5.4 3.6l5.4-3.6zM9.3 18.7l5.4 3.6l5.4-3.6l-5.4-3.6zM1.7 14.7l3.6-5.4l3.6 5.4l-3.6 5.4zM22.3 9.3l-3.6 5.4l3.6 5.4l3.6-5.4zM12 9.3l-2.7 2.7l2.7 2.7l2.7-2.7z" 
      fill="white"
      transform="scale(0.7) translate(5, 5)"
    />
  </svg>
);

/**
 * High-fidelity Zoom Logo (Official Camera Icon on Branded Blue Gradient)
 * Replaces the wordmark version which was unreadable in small containers.
 */
export const ZoomLogoSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <defs>
      <linearGradient id="zoomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2D8CFF" />
        <stop offset="100%" stopColor="#0B5CFF" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5" fill="url(#zoomGradient)" />
    <path 
      d="M15 8H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM21 8.5l-4 3v1l4 3v-7z" 
      fill="white" 
      transform="scale(0.8) translate(3, 3)"
    />
  </svg>
);

/**
 * Simplified Instagram/Calendar placeholders for local build robustness
 */
export const InstagramLogoSVG = (props: React.SVGProps<SVGSVGElement>) => null;
export const GoogleCalendarLogoSVG = (props: React.SVGProps<SVGSVGElement>) => null;
