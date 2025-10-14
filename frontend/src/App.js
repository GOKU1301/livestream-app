import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayManager from './components/OverlayManager';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [rtspUrl, setRtspUrl] = useState('');
  const [overlays, setOverlays] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load settings on component mount
    loadSettings();
    loadOverlays();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success && data.data.rtsp_url) {
        setRtspUrl(data.data.rtsp_url);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadOverlays = async () => {
    try {
      const response = await fetch('/api/overlays');
      const data = await response.json();
      if (data.success) {
        setOverlays(data.data);
      }
    } catch (error) {
      console.error('Error loading overlays:', error);
    }
  };

  const handleRtspUrlChange = async (url) => {
    setRtspUrl(url);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rtsp_url: url }),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleOverlayCreate = async (overlayData) => {
    try {
      const response = await fetch('/api/overlays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(overlayData),
      });
      const data = await response.json();
      if (data.success) {
        setOverlays([...overlays, data.data]);
      }
    } catch (error) {
      console.error('Error creating overlay:', error);
    }
  };

  const handleOverlayUpdate = async (overlayId, updateData) => {
    try {
      const response = await fetch(`/api/overlays/${overlayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (data.success) {
        setOverlays(overlays.map(overlay => 
          overlay._id === overlayId ? data.data : overlay
        ));
      }
    } catch (error) {
      console.error('Error updating overlay:', error);
    }
  };

  const handleOverlayDelete = async (overlayId) => {
    try {
      const response = await fetch(`/api/overlays/${overlayId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setOverlays(overlays.filter(overlay => overlay._id !== overlayId));
      }
    } catch (error) {
      console.error('Error deleting overlay:', error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🎥 Livestream App</h1>
          <p>RTSP Video Streaming with Custom Overlays</p>
        </div>

        <div className="grid">
          <div className="main-content">
            <VideoPlayer 
              rtspUrl={rtspUrl}
              overlays={overlays}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onOverlayUpdate={handleOverlayUpdate}
            />
            
            <SettingsPanel 
              rtspUrl={rtspUrl}
              onRtspUrlChange={handleRtspUrlChange}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>

          <div className="sidebar">
            <OverlayManager 
              overlays={overlays}
              onOverlayCreate={handleOverlayCreate}
              onOverlayUpdate={handleOverlayUpdate}
              onOverlayDelete={handleOverlayDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
