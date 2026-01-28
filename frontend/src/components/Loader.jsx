import React from 'react';

const Loader = ({ fullScreen = true }) => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        backgroundColor: 'transparent',
        // backdropFilter removed to avoid graying, relying on content blur
        position: fullScreen ? 'fixed' : 'absolute', // Absolute makes more sense for component-level loading
        top: 0,
        left: 0,
        zIndex: 9999,
    };

    const videoStyle = {
        maxWidth: '300px', // Reasonable default size, adjustable
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        borderRadius: '20px'
    };

    return (
        <div style={containerStyle}>
            <video
                src="/loading.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={videoStyle}
            />
        </div>
    );
};

export default Loader;
