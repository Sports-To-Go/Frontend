import React from 'react';

interface ThemeButtonsProps {
  onThemeChange: (themeKey: string) => void;
}

const themeKeys = [
  'DEFAULT',
  'ORANGE',
  'BLUE',
  'PURPLE',
  'MINT',
  'SAKURA',
  'DARKNESS',
  'SOFT',
  'WINDOWS',
  'ELDEN RING',
  'PIXEL DREAM',
];

const ThemeButtons: React.FC<ThemeButtonsProps> = ({ onThemeChange }) => {
  return (
    <div className="theme-buttons">
      {themeKeys.map((key) => (
        <button
          key={key}
          className="theme-button"
          onClick={() => onThemeChange(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
};

export default ThemeButtons;