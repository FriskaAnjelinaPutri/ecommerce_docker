from pymongo import MongoClient
import os
import time

MONGO_URI = os.getenv("MONGO_URI")

def connect_with_retry():
    retries = 5
    while retries:
        try:
            client = MongoClient(MONGO_URI)
            client.admin.command("ping")
            print("Connected to MongoDB")
            return client
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            retries -= 1
            time.sleep(5)
    raise Exception("Could not connect to MongoDB")

client = connect_with_retry()

db_name = os.getenv("MONGO_DB_NAME", "reviewdb")
print("Using DB:", db_name)

db = client[db_name]
reviews_collection = db["reviews"]
