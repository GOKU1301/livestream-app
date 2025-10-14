from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

def test_mongodb_connection():
    try:
        uri = os.getenv('MONGODB_URI')
        client = MongoClient(uri)
        db = client.get_database()
        client.admin.command('ping')
        print("✅ Database connection successful!")
        print(f"Connected to database: {db.name}")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_mongodb_connection()