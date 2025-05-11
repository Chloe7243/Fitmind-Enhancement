System Architecture
===================

Overview
--------

This section outlines the internal structure of the FITMIND application, including its key components and how they interact. The architecture is designed to be modular, scalable, and easy to maintain, while supporting all core features such as logging, authentication, reminders, and personalized recommendations.

The system follows a standard **client-server architecture**, where the frontend (client) interacts with the backend (server) through API calls. All data is stored in a structured relational database.

Main Components
---------------

FITMIND is divided into the following core layers:

1. **Frontend (Client Side)**

   - Built with HTML, CSS, and JavaScript.
   - Provides the user interface for stress logging, exercise tracking, breathing exercises, note-taking, and reminders.
   - Handles dynamic content updates (e.g., charts, pop-ups) based on user actions.
   - Sends requests to the backend for data storage and retrieval.

2. **Backend (Server Side)**

   - Built using **Python Flask**.
   - Handles all business logic, authentication, routing, and session management.
   - Validates user input, manages secure login, and processes user data.
   - Connects to the database to store and retrieve information.

3. **Database Layer**

   - Uses **SQLite** for lightweight, file-based data storage.
   - Stores user credentials, stress logs, exercise entries, notes, and reminder configurations.
   - Tables are related by user ID to ensure data privacy and retrieval accuracy.

4. **Authentication & Access Control**

   - Authenticates users through a secure login system.
   - Restricts access to private pages (Stress, Exercise, Notes, Reminders).
   - Allows public access only to the Breathe Flow tool.
   - Ensures data is only accessible during an active session.

5. **Reminder System**

   - Implements a time-based alert mechanism using JavaScript and custom logic.
   - Reminders display as pop-ups with sound at the scheduled time.
   - Operates across all pages and continues working while the user navigates the app.

6. **Recommendation Engine**

   - Lightweight logic triggered on form submission.
   - Suggests actions (e.g., “Try Breathe Flow”) based on the user’s current stress level or recent logs.
   - Processes in real time without the need for external services or delay.

Component Interaction Flow
--------------------------

1. The user logs in or registers via the authentication system.
2. Upon logging stress or exercise, the frontend sends the data to the backend.
3. The backend stores the data in the SQLite database and returns a response.
4. The frontend dynamically updates the UI (e.g., charts, confirmations).
5. If stress level is high, the system offers a real-time breathing prompt.
6. Reminder logic monitors the time and shows pop-ups when scheduled.
7. The user logs out, and the session is cleared securely.

Pages and Navigation
--------------------

- All pages are accessible from a main navigation bar.
- Only the **Landing Page**, **Register/Login**, and **Breathe Flow** are accessible without authentication.
- All other pages are protected and load only when a user is signed in.
- Navigation and access control are enforced via both the frontend and backend.

Scalability and Maintenance
---------------------------

- The use of Flask and SQLite ensures a simple setup that can be scaled with upgrades (e.g., switch to PostgreSQL if needed).
- Components are organized for modularity, allowing individual features (like Notes or Reminders) to be extended or replaced.
- The separation between frontend logic and backend logic allows for easier testing and future integration with mobile or desktop versions.


This architecture ensures that FITMIND is lightweight, responsive, and secure — making it ideal for students who need reliable tools without unnecessary complexity.
