import React, { useRef, useEffect, useState } from 'react';
import DraggableOverlay from './DraggableOverlay';

const VideoPlayer = ({ rtspUrl, overlays, isPlaying, setIsPlaying, onOverlayUpdate }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (videoRef.current && rtspUrl) {
      // For RTSP streams, we need to convert them to a format browsers can handle
      // In a real implementation, you'd use a media server like Node Media Server
      // For demo purposes, we'll show how to handle video URLs
      videoRef.current.src = rtspUrl;
    }
  }, [rtspUrl]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (!rtspUrl) {
        setError('Please enter an RTSP URL first');
        return;
      }
      
      setError('');
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Error playing video:', err);
          setError('Error playing video. RTSP streams require a media server for browser playback.');
        });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleOverlayPositionChange = (overlayId, newPosition) => {
    onOverlayUpdate(overlayId, { position: newPosition });
  };

  const handleOverlaySizeChange = (overlayId, newSize) => {
    onOverlayUpdate(overlayId, { size: newSize });
  };

  return (
    <div className="video-section">
      <div className="video-container" ref={containerRef}>
        {rtspUrl ? (
          <>
            <video
              ref={videoRef}
              className="video-player"
              controls={false}
              onError={() => setError('Error loading video stream')}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Render overlays */}
            {overlays.filter(overlay => overlay.visible).map((overlay) => (
              <DraggableOverlay
                key={overlay._id}
                overlay={overlay}
                containerRef={containerRef}
                onPositionChange={(newPosition) => 
                  handleOverlayPositionChange(overlay._id, newPosition)
                }
                onSizeChange={(newSize) => 
                  handleOverlaySizeChange(overlay._id, newSize)
                }
              />
            ))}
          </>
        ) : (
          <div style={{ color: 'white', textAlign: 'center' }}>
            <h3>No RTSP URL configured</h3>
            <p>Please enter an RTSP URL in the settings below</p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            right: '10px',
            background: 'rgba(231, 76, 60, 0.9)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}
      </div>

      <div className="controls">
        <h3>Video Controls</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-success" 
            onClick={handlePlay}
            disabled={!rtspUrl}
          >
            ▶️ Play
          </button>
          <button 
            className="btn" 
            onClick={handlePause}
            disabled={!rtspUrl}
          >
            ⏸️ Pause
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label>🔊 Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: '100px' }}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>Note:</strong> RTSP streams require a media server (like Node Media Server) to convert 
          the stream to a browser-compatible format (HLS/DASH). For testing, you can use MP4 URLs 
          or set up a media server.
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
