# Livestream App User Guide

## Overview
The Livestream App allows you to view RTSP video streams with custom overlays. You can add text and logo overlays, position them anywhere on the video, and manage them through an intuitive interface.

## Features
- 🎥 RTSP video streaming support
- 📝 Text overlays with customizable styling
- 🖼️ Logo/image overlays
- 🎯 Drag and drop positioning
- 📏 Resizable overlays
- 💾 Persistent overlay settings
- 🎮 Video playback controls

---

## Getting Started

### Prerequisites
- **Backend**: Python 3.7+, MongoDB
- **Frontend**: Node.js 14+, npm or yarn
- **Browser**: Modern browser with HTML5 video support

### Installation

#### 1. Clone or Download the Project
```bash
git clone <repository-url>
cd livestream-app
```

#### 2. Set Up Backend (Flask)
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Make sure MongoDB is running
# Default connection: mongodb://localhost:27017/

# Start the Flask server
python app.py
```
The backend will run on `http://localhost:5000`

#### 3. Set Up Frontend (React)
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```
The frontend will run on `http://localhost:3000`

#### 4. Access the Application
Open your browser and go to `http://localhost:3000`

---

## Using the Application

### 1. Setting Up Video Stream

#### Configure RTSP URL
1. In the **Stream Settings** section, enter your RTSP URL
2. Click **Save URL** to store the configuration
3. Use the sample URLs provided for testing

#### Sample URLs for Testing
The app provides several sample URLs:
- **MP4 samples**: Direct video files for immediate testing
- **RTSP samples**: Example RTSP streams (may require conversion)

#### RTSP Stream Requirements
⚠️ **Important**: Most browsers cannot play RTSP streams directly. You need to:

1. **Convert RTSP to browser-compatible format** using:
   - FFmpeg
   - Node Media Server
   - OBS Studio
   - VLC Media Server

2. **Example conversion with FFmpeg**:
   ```bash
   ffmpeg -i rtsp://your-stream-url -f hls -hls_time 10 -hls_list_size 6 output.m3u8
   ```

3. **Use the converted stream URL** (e.g., `.m3u8` file) in the app

### 2. Video Playback Controls

#### Basic Controls
- **▶️ Play**: Start video playback
- **⏸️ Pause**: Pause video playback
- **🔊 Volume**: Adjust audio volume (0-100%)

#### Status Indicators
- Green indicator: URL configured and ready
- Red indicator: No URL configured
- Error messages: Display when stream fails to load

### 3. Managing Overlays

#### Creating Overlays

1. **Click "➕ Add Overlay"** in the Overlay Manager
2. **Fill in the form**:
   - **Name**: Descriptive name for your overlay
   - **Type**: Choose "Text" or "Logo/Image"
   - **Content**: 
     - For text: Enter your text content
     - For logo: Enter image URL
   - **Position**: Set X and Y coordinates
   - **Size**: Set width and height

3. **For Text Overlays**, customize:
   - Text color
   - Font size (8-72px)
   - Text alignment (left, center, right)
   - Background color (automatically set)

4. **Click "➕ Create"** to add the overlay

#### Editing Overlays

1. **Click "✏️ Edit"** on any existing overlay
2. **Modify the settings** in the form
3. **Click "💾 Update"** to save changes

#### Positioning Overlays

**Method 1: Drag and Drop**
- Click and drag any overlay on the video to reposition it
- The new position is automatically saved

**Method 2: Manual Input**
- Use the X and Y position fields in the overlay form
- Enter specific pixel coordinates

#### Resizing Overlays

**Method 1: Resize Handle**
- Click and drag the blue square in the bottom-right corner of any overlay
- The new size is automatically saved

**Method 2: Manual Input**
- Use the Width and Height fields in the overlay form
- Enter specific pixel dimensions

#### Overlay Visibility

- **👁️ Hide**: Make overlay invisible without deleting it
- **👁️ Show**: Make hidden overlay visible again
- Hidden overlays remain in your saved list

#### Deleting Overlays

1. **Click "🗑️ Delete"** on the overlay you want to remove
2. **Confirm deletion** in the popup dialog
3. The overlay is permanently removed

### 4. Overlay Types

#### Text Overlays
- **Purpose**: Display text information over video
- **Styling Options**:
  - Custom text color
  - Adjustable font size
  - Text alignment options
  - Semi-transparent background
- **Use Cases**: 
  - Stream titles
  - Announcements
  - Timestamps
  - Social media handles

#### Logo/Image Overlays
- **Purpose**: Display images or logos over video
- **Requirements**: 
  - Must be accessible via URL
  - Supports common formats (PNG, JPG, GIF)
  - Automatically scales to fit overlay size
- **Use Cases**:
  - Company logos
  - Sponsor images
  - Social media icons
  - Watermarks

---

## Tips and Best Practices

### Video Streaming
1. **Test with MP4 URLs first** to ensure the app works
2. **For RTSP streams**, set up a media server for conversion
3. **Check network connectivity** if streams fail to load
4. **Use stable internet connection** for smooth playback

### Overlay Management
1. **Use descriptive names** for easy identification
2. **Position overlays carefully** to avoid blocking important content
3. **Test overlay visibility** on different video content
4. **Keep overlay sizes reasonable** for better performance
5. **Use contrasting colors** for text overlays to ensure readability

### Performance
1. **Limit the number of overlays** (recommended: 5-10 maximum)
2. **Optimize image sizes** for logo overlays
3. **Use efficient image formats** (PNG for transparency, JPG for photos)
4. **Close unused browser tabs** for better video performance

---

## Troubleshooting

### Common Issues

#### "Error playing video" Message
**Cause**: RTSP stream not compatible with browser
**Solution**: 
- Convert RTSP to HLS/DASH format
- Use MP4 URLs for testing
- Check if stream URL is accessible

#### Overlays Not Appearing
**Cause**: Overlay might be hidden or positioned outside video area
**Solution**:
- Check if overlay is marked as visible
- Verify position coordinates are within video bounds
- Refresh the page and try again

#### Backend Connection Error
**Cause**: Flask server not running or wrong port
**Solution**:
- Ensure Flask server is running on port 5000
- Check MongoDB connection
- Verify no firewall blocking connections

#### Image Overlays Not Loading
**Cause**: Image URL not accessible or CORS issues
**Solution**:
- Verify image URL is publicly accessible
- Use HTTPS URLs when possible
- Check browser console for error messages

### Getting Help

1. **Check browser console** for error messages
2. **Verify all services are running**:
   - MongoDB (port 27017)
   - Flask backend (port 5000)
   - React frontend (port 3000)
3. **Test with sample URLs** provided in the app
4. **Check network connectivity** and firewall settings

---

## Technical Requirements

### System Requirements
- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB, recommended 8GB+
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Network Requirements
- **Bandwidth**: Depends on video stream quality
- **Latency**: Low latency recommended for live streams
- **Firewall**: Allow connections to ports 3000, 5000, 27017

### Supported Formats
- **Video**: MP4, WebM, HLS (.m3u8), DASH
- **Images**: PNG, JPG, JPEG, GIF, SVG
- **Protocols**: HTTP, HTTPS, RTSP (with conversion)

---

## Advanced Configuration

### Custom Styling
Text overlays support CSS-style properties:
- `color`: Text color (hex, rgb, named colors)
- `fontSize`: Size in pixels (e.g., "16px")
- `backgroundColor`: Background with transparency
- `textAlign`: left, center, right

### MongoDB Configuration
Default connection: `mongodb://localhost:27017/livestream_app`

To use a different MongoDB instance:
1. Edit `backend/.env` file
2. Update `MONGODB_URI` variable
3. Restart the Flask server

### Port Configuration
To change default ports:
1. **Backend**: Edit `PORT` in `backend/.env`
2. **Frontend**: Edit `package.json` proxy setting
3. Restart both services

---

## Keyboard Shortcuts

- **Space**: Play/Pause video (when video is focused)
- **↑/↓**: Volume up/down (when video is focused)
- **Esc**: Cancel overlay creation/editing
- **Enter**: Submit overlay form

---

This user guide covers all the essential features and functionality of the Livestream App. For technical support or feature requests, please refer to the project documentation or contact the development team.
