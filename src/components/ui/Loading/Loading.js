import React from 'react';
import './Loading.css';

export default function Loading() {
    const text = 'StudeeFlow...';

    return (
        <div className="wave-container">
            {text.split('').map((char, index) => (
                <span key={index} className="wave-letter" style={{ animationDelay: `${index * 0.1}s` }}>
                    {char}
                </span>
            ))}
        </div>
    );
}
