import pandas as pd
import os

base_dir = os.path.dirname(__file__)

raw_path = os.path.join(base_dir, "..", "dataset", "raw")
processed_path = os.path.join(base_dir, "..", "dataset", "processed")

files = os.listdir(raw_path)

dataframes = []

for file in files:
    if file.endswith(".csv"):
        file_path = os.path.join(raw_path, file)
        df = pd.read_csv(file_path)
        dataframes.append(df)

dataset = pd.concat(dataframes)

output_file = os.path.join(processed_path, "combined_dataset.csv")
dataset.to_csv(output_file, index=False)

print("Dataset merged successfully")