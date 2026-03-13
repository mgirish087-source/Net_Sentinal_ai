# Net_Sentinal_ai
# [DAY 1]
### AI-Based Network Intrusion Detection System

## 📌 Project Overview

**Net_Sentinal_ai** is an AI-powered Network Intrusion Detection System (IDS) designed to monitor network traffic and detect potential cyber attacks in real time. The system analyzes network packets using machine learning models to identify malicious activities such as DoS attacks, brute-force attempts, and suspicious network behavior.

This project aims to demonstrate how Artificial Intelligence can enhance cybersecurity by automatically detecting threats in large volumes of network data.

---

## 🎯 Objectives

* Detect malicious network traffic using machine learning.
* Classify network activities as **normal** or **attack**.
* Provide a dashboard for monitoring network activity.
* Assist security analysts in identifying potential threats quickly.

---

## 🧠 Dataset

The model is trained using the **CICIDS2017 dataset**, a widely used dataset for network intrusion detection research.

Dataset source:
CICIDS2017 (Canadian Institute for Cybersecurity)

Due to large file sizes, datasets are not included in this repository.

---

## 🛠 Technologies Used

### Backend

* Python
* Flask / FastAPI
* Scikit-learn
* Pandas
* NumPy

### Machine Learning

* Random Forest
* Decision Tree
* Data Preprocessing
* Feature Engineering

### Frontend

* HTML
* CSS
* JavaScript
* Dashboard visualization

### Tools

* Git
* GitHub
* Visual Studio Code

---

## 📂 Project Structure

```
Net_Sentinal_ai
│
├── backend
│   ├── app.py
│   ├── model_training.py
│   ├── detection_engine.py
│   ├── requirements.txt
│
├── frontend
│   ├── dashboard
│   ├── static
│   └── templates
│
├── dataset/        (ignored in GitHub)
├── models/         (ignored in GitHub)
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the Repository

```
git clone https://github.com/yourusername/Net_Sentinal_ai.git
```

### 2. Navigate to Project Folder

```
cd Net_Sentinal_ai
```

### 3. Create Virtual Environment

```
python -m venv venv
```

Activate environment:

Windows

```
venv\Scripts\activate
```

Linux / Mac

```
source venv/bin/activate
```

---

### 4. Install Dependencies

```
pip install -r backend/requirements.txt
```

---

## ▶️ Running the Project

Start the backend server:

```
python backend/app.py
```

Open browser:

```
http://localhost:5000
```

---

## 📊 Features

* Network traffic analysis
* Machine learning-based attack detection
* Real-time monitoring dashboard
* Data preprocessing pipeline
* Attack classification

---

## 🔐 Example Attacks Detected

* DoS (Denial of Service)
* Port Scanning
* Brute Force Attacks
* Botnet Activity
* Unknown network anomalies

---

## 🚀 Future Improvements

* Real-time packet capture using Scapy
* Deep learning-based detection models
* Advanced visualization dashboard
* Alert notification system
* Integration with SIEM tools

---

## 👨‍💻 Author

Girish M & Stonshia 

---

## 📜 License

This project is for educational and research purposes.
