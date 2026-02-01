# AURA | Personal Operating System

AURA is a premium productivity suite designed to help you manage your focus, habits, and tasks in one beautiful, ambient interface. It functions as a Personal Operating System to organize your daily life.

## Features

AURA combines several productivity tools into a single, cohesive dashboard:

*   **Dashboard**: A central hub providing a quick overview of your day, active timers, and key metrics.
*   **Focus Timer**: A Pomodoro-style timer with "Focus", "Short Break", and "Long Break" modes to manage your attention span. It tracks your total focus time.
*   **Insights (Stats)**: Visual analytics to track your consistency, completion rates, best streaks, and weekly activity.
*   **Weekly Matrix**: A time-blocking tool to schedule tasks across the week.
*   **Habits**: A habit tracker to build and monitor daily routines with streak tracking.
*   **Planner (Todo)**: A smart to-do list with priority levels (High, Medium, Low) and categorization.
*   **Notes**: A built-in note-taking app to capture ideas and journal thoughts.

## Technologies Used

*   **HTML5**: Semantic markup for structure.
*   **Tailwind CSS**: For utility-first styling and the premium glassmorphism design.
*   **Alpine.js**: For reactive state management and UI interactions.
*   **PWA (Progressive Web App)**: Service Worker implementation for offline support and installability.
*   **LocalStorage**: Data is persisted locally in your browser.

## Getting Started

Since AURA is a static web application, you can run it easily:

### Option 1: Open directly
Simply open the `index.html` file in your modern web browser.

### Option 2: Run a local server (Recommended)
To fully experience PWA features and avoid CORS issues with some browsers:

1.  If you have Python installed:
    ```bash
    python3 -m http.server
    ```
    Then open `http://localhost:8000` in your browser.

2.  Or using any other static file server (e.g., `serve`, `http-server`).

## Installation (PWA)

AURA is a Progressive Web App. You can install it on your device for a native-like experience:

1.  Open the app in your browser (Chrome, Edge, Safari, etc.).
2.  Look for the "Install" icon in the address bar or select "Add to Home Screen" from the browser menu.
3.  Launch AURA from your desktop or home screen.

## Data Privacy

All data is stored locally in your browser's `localStorage`. No data is sent to external servers. You can export your data as a JSON file for backup purposes via the header menu.
