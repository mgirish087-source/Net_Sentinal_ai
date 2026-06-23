import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]

result = db.users.update_one(
    {"username": "admin"},
    {"$set": {"password_hash": generate_password_hash("admin123"), "role": "admin"}},
    upsert=True
)

print(f"Matched {result.matched_count} documents and modified {result.modified_count} documents.")
if result.upserted_id:
    print(f"Upserted new admin user with id {result.upserted_id}")
print("Admin password reset to 'admin123'.")
