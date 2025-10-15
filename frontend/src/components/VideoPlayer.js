import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import DraggableOverlay from './DraggableOverlay';
import '../styles/VideoPlayer.css';

const VideoPlayer = ({ rtspUrl, overlays, isPlaying, setIsPlaying, onOverlayUpdate }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!rtspUrl) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    // Request stream URL from backend
    fetch('/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: rtspUrl }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          console.error('Stream error:', data.error);
          return;
        }

        const videoElement = videoRef.current;

        if (data.type === 'hls') {
          // Handle RTSP streams converted to HLS
          if (Hls.isSupported()) {
            const hls = new Hls({
              debug: false,
              enableWorker: true,
              lowLatencyMode: true,
            });

            hls.loadSource(data.stream_url);
            hls.attachMedia(videoElement);
            hlsRef.current = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoElement.play().catch((e) => console.log('Playback failed:', e));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
              console.error('HLS error:', data);
            });
          } else {
            console.error('HLS is not supported in this browser');
          }
        } else {
          // Handle direct MP4 playback
          videoElement.src = data.stream_url;
          videoElement.play().catch((e) => console.log('Playback failed:', e));
        }
      })
      .catch((error) => {
        console.error('Failed to fetch stream URL:', error);
      });

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
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
          <div className="video-placeholder">
            <i className="fas fa-video"></i>
            <h3>No RTSP URL configured</h3>
            <p>Please enter an RTSP URL in the settings below</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="controls-panel">
        <h3>Video Controls</h3>
        <div className="controls-container">
          <div className="playback-controls">
            <button 
              className={`control-btn play-btn ${!rtspUrl ? 'disabled' : ''}`}
              onClick={handlePlay}
              disabled={!rtspUrl}
            >
              <i className="fas fa-play"></i>
              <span>Play</span>
            </button>
            <button 
              className={`control-btn pause-btn ${!rtspUrl ? 'disabled' : ''}`}
              onClick={handlePause}
              disabled={!rtspUrl}
            >
              <i className="fas fa-pause"></i>
              <span>Pause</span>
            </button>
          </div>
          
          <div className="volume-control">
            <i className="fas fa-volume-up"></i>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>
        </div>
        
        <div className="info-note">
          <i className="fas fa-info-circle"></i>
          <span>
            RTSP streams require a media server (like Node Media Server) to convert 
            the stream to a browser-compatible format (HLS/DASH).
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
