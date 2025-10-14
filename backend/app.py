from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId
import os
import sys
from dotenv import load_dotenv
from datetime import datetime
from flask.json.provider import DefaultJSONProvider

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

def initialize_db():
    """Initialize MongoDB connection with error handling"""
    try:
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            raise ValueError("MongoDB URI not found in environment variables")
        
        # Updated connection settings - removed directConnection
        client = MongoClient(
            mongodb_uri,
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            retryWrites=True,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        return client[os.getenv('DATABASE_NAME')]
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB Atlas: {str(e)}")
        sys.exit(1)

# Initialize database connection
db = initialize_db()
overlays_collection = db.overlays

# Custom JSON Provider
class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# Set the custom JSON provider
app.json = CustomJSONProvider(app)

@app.route('/')
def home():
    return jsonify({"message": "Livestream App API", "status": "running"})

# CRUD Operations for Overlays

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    """Get all overlay settings"""
    try:
        overlays = list(overlays_collection.find())
        return jsonify({"success": True, "data": overlays}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay setting"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'type', 'content', 'position', 'size']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        # Create overlay document
        overlay = {
            "name": data['name'],
            "type": data['type'],  # 'text' or 'logo'
            "content": data['content'],  # text content or image URL
            "position": {
                "x": data['position']['x'],
                "y": data['position']['y']
            },
            "size": {
                "width": data['size']['width'],
                "height": data['size']['height']
            },
            "style": data.get('style', {}),  # Additional styling options
            "visible": data.get('visible', True),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = overlays_collection.insert_one(overlay)
        overlay['_id'] = result.inserted_id
        
        return jsonify({"success": True, "data": overlay}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """Get a specific overlay by ID"""
    try:
        overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
        if not overlay:
            return jsonify({"success": False, "error": "Overlay not found"}), 404
        
        return jsonify({"success": True, "data": overlay}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update an existing overlay"""
    try:
        data = request.get_json()
        
        # Prepare update data
        update_data = {}
        allowed_fields = ['name', 'type', 'content', 'position', 'size', 'style', 'visible']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        update_data['updated_at'] = datetime.utcnow()
        
        result = overlays_collection.update_one(
            {"_id": ObjectId(overlay_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"success": False, "error": "Overlay not found"}), 404
        
        updated_overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
        return jsonify({"success": True, "data": updated_overlay}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete an overlay"""
    try:
        result = overlays_collection.delete_one({"_id": ObjectId(overlay_id)})
        
        if result.deleted_count == 0:
            return jsonify({"success": False, "error": "Overlay not found"}), 404
        
        return jsonify({"success": True, "message": "Overlay deleted successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Settings endpoint for RTSP URL
@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get application settings"""
    try:
        settings = db.settings.find_one() or {}
        return jsonify({"success": True, "data": settings}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Update application settings"""
    try:
        data = request.get_json()
        
        settings = {
            "rtsp_url": data.get('rtsp_url', ''),
            "updated_at": datetime.utcnow()
        }
        
        db.settings.replace_one({}, settings, upsert=True)
        
        return jsonify({"success": True, "data": settings}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
