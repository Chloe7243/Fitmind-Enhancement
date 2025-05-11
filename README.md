# FITMIND: Exercise & Stress Tracker

**FITMIND** is a web-based wellness application designed to help university students monitor their stress levels, stay physically active, and build healthier daily habits. It integrates multiple wellness features—like stress logging, exercise tracking, breathing exercises, note-taking, and reminders—into a single, easy-to-use platform.

---

## Key Features

- **Stress Tracking** – Log stress using a 1–5 scale, mood emojis, and custom notes.
- **Exercise Logging** – Track physical activities and view your progress through live bar charts.
- **Breathe Flow** – Use a guided breathing tool to reduce stress in real time (accessible without login).
- **Notes Page** – Jot down personal reflections and search previous entries.
- **Reminders** – Set custom reminders with sound and pop-up notifications.
- **Authentication** – Secure login system to protect user-specific data.

---

## Project Structure

FITMIND-APP-MAIN-PROJECT/
├── main.py # Entry point to run the Flask app
├── model.py # Database models
├── static/ # CSS, JS, and assets
├── templates/ # HTML templates (Jinja2)
├── instance/ # Configuration or runtime DB
├── migrations/ # Flask-Migrate history
├── tests/ # Unit tests
├── docs/ # Sphinx documentation
├── FitMind/ # App modules (if modularized)
├── venv/ # Virtual environment (excluded from Git)
├── README.md
├── README.rst
├── pyproject.toml
└── readthedocs.yaml



---

## Requirements

- Python 3.10 or higher
- Git
- Virtual environment tool (e.g., `venv`)
- Flask and related extensions (see below)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/FITMIND-APP-MAIN-PROJECT.git
cd FITMIND-APP-MAIN-PROJECT

