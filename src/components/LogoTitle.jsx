import React from 'react';
import '../styles/logo-title.css';

export default function LogoTitle() {
  return React.createElement(
    'a',
    {
      href: '#',
      className: 'logo',
      'aria-label': 'South Eastern Arabic College Home'
    },
    'South Eastern Arabic College'
  );
}