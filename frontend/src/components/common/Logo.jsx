import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function Logo() {
  const { darkMode } = useTheme();

  return (
    <svg viewBox="0 0 400 400" className="w-64 h-64 mx-auto">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#grad1)" opacity="0.2"/>
      <circle cx="200" cy="200" r="140" fill="url(#grad1)" opacity="0.3"/>
      <circle cx="200" cy="200" r="100" fill="url(#grad1)" opacity="0.4"/>
      
      <g className="animate-pulse">
        <path d="M200 120 L240 160 L200 200 L160 160 Z" fill="#8b5cf6"/>
        <path d="M200 200 L240 240 L200 280 L160 240 Z" fill="#3b82f6"/>
        <circle cx="200" cy="160" r="8" fill="white"/>
        <circle cx="240" cy="200" r="8" fill="white"/>
        <circle cx="200" cy="240" r="8" fill="white"/>
        <circle cx="160" cy="200" r="8" fill="white"/>
      </g>
      
      <text x="200" y="340" textAnchor="middle" fill={darkMode ? 'white' : '#1f2937'} fontSize="32" fontWeight="bold">Smart Talk</text>
      <text x="200" y="365" textAnchor="middle" fill={darkMode ? '#a78bfa' : '#8b5cf6'} fontSize="14">AI Intelligence Platform</text>
    </svg>
  );
}