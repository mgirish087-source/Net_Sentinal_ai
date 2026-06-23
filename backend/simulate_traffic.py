import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime, timezone
import random

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.predict import predict_attack, load_model
from config import Config
from pymongo import MongoClient

def simulate():
    print("Connecting to DB...")
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    
    print("Loading model...")
    if not load_model():
        print("Model failed to load.")
        return
        
    print("Loading dataset...")
    # Read a chunk to sample from
    df = pd.read_csv("dataset/processed/cleaned_dataset.csv", nrows=5000)
    
    # We'll pick 100 random rows
    sample = df.sample(n=100, random_state=42).reset_index(drop=True)
    
    print("Simulating traffic...")
    
    for i, row in sample.iterrows():
        try:
            # Get only numeric columns
            numeric_row = row.to_frame().T.select_dtypes(include=[np.number])
            features = numeric_row.values.tolist()[0]
            
            # Ensure it's exactly 78 if it's longer
            if len(features) > 78:
                features = features[:78]
            elif len(features) < 78:
                features = features + [0] * (78 - len(features))
                
            result = predict_attack(features)
            
            src_ip = f"192.168.1.{random.randint(2, 254)}"
            dst_ip = f"10.0.0.{random.randint(2, 254)}"
            
            # Insert prediction
            db["predictions"].insert_one({
                "source_ip": src_ip,
                "destination_ip": dst_ip,
                "attack_type": result["attack_label"],
                "confidence": result["confidence"],
                "timestamp": datetime.now(timezone.utc),
                "packet_summary": "Simulated from dataset",
                "is_attack": result["is_attack"],
                "protocol": random.choice(["TCP", "UDP", "ICMP"]),
                "requested_by": "system_simulator",
            })
            
            # Insert into logs so the Logs table shows it
            db["logs"].insert_one({
                "event_type": "TRAFFIC",
                "message": f"Traffic: {src_ip} -> {dst_ip}",
                "timestamp": datetime.now(timezone.utc), # Use string for frontend maybe? Frontend expects timestamp or created_at
                "created_at": datetime.now(timezone.utc),
                "src_ip": src_ip,
                "dst_ip": dst_ip,
                "protocol": random.choice(["TCP", "UDP", "ICMP"]),
                "attack": result["attack_label"]
            })
            
            if result["is_attack"]:
                severity = "CRITICAL" if result["confidence"] >= 0.9 else "HIGH" if result["confidence"] >= 0.75 else "MEDIUM"
                db["alerts"].insert_one({
                    "severity": severity,
                    "message": f"{result['attack_label']} detected from {src_ip} (confidence: {result['confidence']*100:.1f}%)",
                    "status": "open",
                    "timestamp": datetime.now(timezone.utc),
                })
        except Exception as e:
            print(f"Row {i} error: {e}")
            continue
            
    print("Done simulating 100 traffic logs. Check your dashboard!")

if __name__ == "__main__":
    simulate()
