# 🎥 Livestream App with RTSP Support and Overlay Management

A full-stack web application for streaming RTSP video with customizable overlays. Built with Flask (Python) backend, React frontend, and MongoDB for data persistence.

## ✨ Features

- 🎬 **RTSP Video Streaming**: Play livestream videos from RTSP URLs
- 📝 **Text Overlays**: Add custom text with styling options
- 🖼️ **Logo Overlays**: Display images and logos over video
- 🎯 **Drag & Drop**: Intuitive positioning of overlays
- 📏 **Resizable Overlays**: Adjust overlay dimensions easily
- 💾 **Persistent Storage**: Save overlay settings in MongoDB
- 🎮 **Video Controls**: Play, pause, and volume adjustment
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

```
livestream-app/
├── backend/          # Flask API server
│   ├── app.py       # Main Flask application
│   ├── requirements.txt
│   └── .env         # Environment configuration
├── frontend/         # React web application
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.js
│   │   │   ├── OverlayManager.js
│   │   │   ├── DraggableOverlay.js
│   │   │   └── SettingsPanel.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docs/            # Documentation
│   ├── API_Documentation.md
│   └── User_Guide.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Node.js 14+
- MongoDB

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 2. Set Up Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`

### 3. Set Up Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### 4. Open Application
Visit `http://localhost:3000` in your browser

## 📖 Documentation

- **[API Documentation](docs/API_Documentation.md)** - Complete API reference
- **[User Guide](docs/User_Guide.md)** - Detailed usage instructions

## 🎯 Usage

### Basic Setup
1. Enter an RTSP URL or use sample URLs for testing
2. Click Play to start the video stream
3. Add overlays using the Overlay Manager
4. Drag and resize overlays as needed

### RTSP Streaming Note
⚠️ **Important**: Browsers cannot play RTSP streams directly. For production use:
- Convert RTSP to HLS/DASH using FFmpeg or Node Media Server
- Use the converted stream URL in the application
- For testing, use the provided MP4 sample URLs

## 🔧 API Endpoints

### Overlays
- `GET /api/overlays` - Get all overlays
- `POST /api/overlays` - Create new overlay
- `PUT /api/overlays/{id}` - Update overlay
- `DELETE /api/overlays/{id}` - Delete overlay

### Settings
- `GET /api/settings` - Get app settings
- `POST /api/settings` - Update settings

## 🛠️ Tech Stack

### Backend
- **Flask** - Web framework
- **MongoDB** - Database
- **PyMongo** - MongoDB driver
- **Flask-CORS** - Cross-origin requests

### Frontend
- **React** - UI framework
- **HTML5 Video** - Video playback
- **CSS3** - Styling and animations
- **Fetch API** - HTTP requests

## 📝 Sample Data

### Text Overlay Example
```json
{
  "name": "Welcome Message",
  "type": "text",
  "content": "Welcome to our stream!",
  "position": {"x": 50, "y": 50},
  "size": {"width": 300, "height": 60},
  "style": {
    "color": "#ffffff",
    "fontSize": "20px",
    "backgroundColor": "rgba(0, 0, 0, 0.8)"
  }
}
```

### Logo Overlay Example
```json
{
  "name": "Company Logo",
  "type": "logo",
  "content": "https://example.com/logo.png",
  "position": {"x": 20, "y": 20},
  "size": {"width": 150, "height": 75}
}
```

## 🔍 Testing

### Sample RTSP URLs
```
rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov
```

### Sample MP4 URLs (for immediate testing)
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
```

## 🐛 Troubleshooting

### Common Issues

**Video won't play**
- Check if RTSP URL is accessible
- Try MP4 URLs for testing
- Ensure proper RTSP to browser format conversion

**Overlays not saving**
- Verify MongoDB is running
- Check backend console for errors
- Ensure proper network connectivity

**Backend connection failed**
- Confirm Flask server is running on port 5000
- Check MongoDB connection string
- Verify no firewall blocking connections

## 🔮 Future Enhancements

- [ ] Real-time RTSP to HLS conversion
- [ ] User authentication and authorization
- [ ] Overlay animation effects
- [ ] Multiple video stream support
- [ ] Cloud deployment configuration
- [ ] WebRTC integration
- [ ] Mobile app version

## 📄 License

This project is created for educational purposes. Feel free to use and modify as needed for your college project.

## 🤝 Contributing

This is a college project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the [User Guide](docs/User_Guide.md)
2. Review the [API Documentation](docs/API_Documentation.md)
3. Look at browser console for error messages
4. Ensure all services are running properly

---

**Happy Streaming! 🎉**
