import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';

const AppDownload = () => {
  const handlePlayStoreClick = () => {
    window.location.href = 'http://localhost:5175';
  };

  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br />Tomato App</p>
      <div className="app-download-platforms">
        <img
          src={assets.play_store}
          alt="Play Store"
          onClick={handlePlayStoreClick}
          style={{ cursor: 'pointer' }}
        />
        <img
          src={assets.app_store}
          alt="App Store"
        />
      </div>
    </div>
  );
};

export default AppDownload;
