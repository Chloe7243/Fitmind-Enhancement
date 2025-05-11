# FITMIND: Exercise & Stress Tracker

**FITMIND** is a web-based wellness app designed for university students to help manage stress, track physical activity, and form healthy habits. It offers a unified platform for stress logging, guided breathing, reminders, journaling, and exercise tracking.

---

## 1. Key Features

- Log stress using a 1–5 scale with mood emojis and optional notes  
- Track exercise activities and view real-time progress charts  
- Practice guided breathing without needing to log in  
- Write and search timestamped notes  
- Set reminders with sound and pop-up notifications  
- Secure login with session-based data access

---

## 2. Project Structure

```text
FITMIND-APP-MAIN-PROJECT/
├── main.py                 # Entry point
├── model.py                # Database models
├── templates/              # Jinja2 HTML templates
├── static/                 # CSS and JS
├── tests/                  # Pytest-based unit tests
├── instance/               # Runtime config or DB
├── migrations/             # Flask-Migrate files
├── FitMind/                # (Optional) app modules
├── docs/                   # Sphinx documentation
├── venv/                   # Virtual environment
├── README.md
├── README.rst
├── pyproject.toml
└── readthedocs.yaml
```

---

## 3. Requirements

- Python 3.10 or higher  
- Git  
- Virtual environment tool (`venv`)  
- Flask and supporting libraries  

---

## 4. Getting Started

### 4.1 Clone the Repository

```bash
git clone https://github.com/yourusername/FITMIND-APP-MAIN-PROJECT.git
cd FITMIND-APP-MAIN-PROJECT
```

---

### 4.2 Create and Activate Virtual Environment

#### On Windows

```bash
py -m venv venv
.\venv\Scripts\activate
```

#### On macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 4.3 Install Dependencies

```bash
pip install flask
pip install flask-login
pip install flask-migrate
pip install flask-wtf
pip install flask-mail
pip install itsdangerous
pip install sqlalchemy
pip install password-strength
```

---

## 5. Running the Application

```bash
python main.py
```

Then open your browser and go to:

```text
http://127.0.0.1:5000/
```

---

## 6. Running Tests

### 6.1 Install Testing Tools

```bash
pip install pytest
pip install Flask-Testing
```

### 6.2 Run the Test Suite

```bash
pytest tests
```

Make sure all test files are placed in the `tests/` directory.

---

## 7. Building the Documentation

The documentation is written using **Sphinx** and hosted on **Read the Docs**.

### 7.1 Build Documentation Locally

```bash
cd docs
pip install -r requirements.txt
make html
```

### 7.2 Open the Documentation

```text
docs/build/html/index.html
```

---

## 8. Future Features (Planned)

- Progress dashboard to analyze long-term trends  
- Editable and recurring reminders  
- Mobile Progressive Web App (PWA) support  
- Dark mode and customizable themes  
- Multi-language support (e.g., Twi, French, Spanish)  
- User feedback submission form  
- PostgreSQL support for scalable deployment  

---

## 9. Contributing

We welcome contributions to improve FITMIND.

### 9.1 Contribution Steps

```bash
# Fork the repo
git clone https://github.com/yourusername/FITMIND-APP-MAIN-PROJECT.git

# Create a new branch
git checkout -b feature-name

# After making changes
git commit -m "Add feature or fix"

# Push your changes
git push origin feature-name
```

Then open a **pull request** with a clear explanation of your changes.

---

## 10. License

This project is licensed under the MIT License.  
See the `LICENSE` file for full license text.
