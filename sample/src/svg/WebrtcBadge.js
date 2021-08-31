import React from 'react';

export default function WebrtcBadge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="74" height="32" viewBox="0 0 74 32">
      <defs>
        <filter id="8g66e2gwha" width="125.8%" height="180%" x="-12.9%" y="-40%" filterUnits="objectBoundingBox">
          <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/>
          <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          <g filter="url(#8g66e2gwha)" transform="translate(-773 -164) translate(779 170)">
            <path fill="#000" fillOpacity=".8" stroke="#000" strokeOpacity=".8" d="M58 .5c.966 0 1.841.392 2.475 1.025C61.108 2.16 61.5 3.034 61.5 4h0v12c0 .966-.392 1.841-1.025 2.475-.634.633-1.509 1.025-2.475 1.025h0H4c-.966 0-1.841-.392-2.475-1.025C.892 17.84.5 16.966.5 16h0V4c0-.966.392-1.841 1.025-2.475C2.16.892 3.034.5 4 .5h0z"/>
            <text fill="#FFF" fontFamily="Roboto-Bold, Roboto" fontSize="10" fontWeight="bold">
              <tspan x="10" y="14">Web RTC</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  )
}