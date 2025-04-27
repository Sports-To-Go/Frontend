import React from 'react';

interface ThemeButtonsProps {
    onThemeChange: (theme: string) => void;
}

const ThemeButtons: React.FC<ThemeButtonsProps> = ({ onThemeChange }) => {
    return (
        <div className="theme-buttons">
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,var(--background),var(--background))')}
            >
                Default
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(215, 84, 101),rgb(233, 125, 86))')}
            >
                Orange
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(113, 245, 205), #6dd5ed)')}
            >
                Blue
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(101, 48, 198),rgb(229, 97, 198))')}
            >
                Purple
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(32, 225, 126), rgb(119, 225, 32))')}
            >
                Mint
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(203, 70, 112),rgb(127, 221, 210))')}
            >
                Sakura
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(12, 1, 27),rgb(62, 2, 2))')}
            >
                Darkness
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('linear-gradient(to right,rgb(255, 216, 245),rgb(255, 191, 203))')}
            >
                Soft
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('url(https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png)')}
            >
                Windows 
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('url(https://images.steamusercontent.com/ugc/2058741034012526512/379E6434B473E7BE31C50525EB946D4212A8C8B3/)')}
            >
                Elden Ring
            </button>
            <button
                className="theme-button"
                onClick={() => onThemeChange('url(https://images.alphacoders.com/113/1138740.png)')}
            >
                Pixel Dream
            </button>
        </div>
    );
};

export default ThemeButtons;