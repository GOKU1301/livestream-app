import React, { useState } from 'react';

const SettingsPanel = ({ rtspUrl, onRtspUrlChange, isPlaying, setIsPlaying }) => {
  const [tempUrl, setTempUrl] = useState(rtspUrl);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    onRtspUrlChange(tempUrl);
  };

  const sampleUrls = [
    {
      name: 'Sample MP4 (Big Buck Bunny)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      name: 'Sample MP4 (Elephant Dream)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      name: 'RTSP Test Stream (Example)',
      url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov'
    }
  ];

  return (
    <div className="settings-section">
      <h3>Stream Settings</h3>
      
      <form onSubmit={handleUrlSubmit}>
        <div className="form-group">
          <label>RTSP/Video URL</label>
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Enter RTSP URL (e.g., rtsp://example.com/stream) or MP4 URL for testing"
            style={{ marginBottom: '10px' }}
          />
          <button type="submit" className="btn btn-success">
            💾 Save URL
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h4>Sample URLs for Testing</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          Click to use these sample URLs for testing:
        </p>
        {sampleUrls.map((sample, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <button
              className="btn"
              onClick={() => {
                setTempUrl(sample.url);
                onRtspUrlChange(sample.url);
              }}
              style={{ 
                width: '100%', 
                textAlign: 'left',
                fontSize: '12px',
                padding: '8px'
              }}
            >
              {sample.name}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
        <h4 style={{ marginTop: 0 }}>📋 RTSP Setup Instructions</h4>
        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <p><strong>For Real RTSP Streams:</strong></p>
          <ol>
            <li>RTSP streams need conversion for browser playback</li>
            <li>Use tools like <strong>FFmpeg</strong> or <strong>Node Media Server</strong></li>
            <li>Convert RTSP to HLS (.m3u8) or DASH format</li>
            <li>Example: <code style={{ background: '#e9ecef', padding: '2px 4px' }}>
              ffmpeg -i rtsp://your-stream -f hls output.m3u8
            </code></li>
          </ol>
          
          <p><strong>For Testing:</strong></p>
          <ul>
            <li>Use the sample MP4 URLs provided above</li>
            <li>Or use public RTSP test streams</li>
            <li>Try: <code style={{ background: '#e9ecef', padding: '2px 4px' }}>
              rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov
            </code></li>
          </ul>

          <p><strong>Current Status:</strong></p>
          <div style={{ 
            padding: '8px', 
            background: rtspUrl ? '#d4edda' : '#f8d7da', 
            color: rtspUrl ? '#155724' : '#721c24',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            {rtspUrl ? `✅ URL configured: ${rtspUrl.substring(0, 50)}${rtspUrl.length > 50 ? '...' : ''}` : '❌ No URL configured'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
