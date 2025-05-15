import React from 'react';
import './LoadingData.css';

export function LoadingData({ content = "Loading..." }) {
    return (
        <div className="loading-indicator">
            <i className="fa-solid fa-spinner fa-spin loading-icon"></i>
            <span className="loading-text">{content}</span>
        </div>
    );
}
