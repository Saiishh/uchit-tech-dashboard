**UchitTech AI - Advanced Surveillance Management System**
A comprehensive, feature-rich surveillance management system built with React. This application provides a professional-grade interface for real-time monitoring, intelligent analytics, and automated alert systems.
Table of Contents
Features
Project Structure
Getting Started
Prerequisites
Installation
Running the Application
Usage
Login
Dashboard
Live View
Alerts
Analytics
Reports
Network Management
Settings
Dependencies
Contributing
Features
Real-time Dashboard: Get a comprehensive overview of your security system with key metrics and interactive charts.
Live Camera View: Monitor multiple camera feeds simultaneously with customizable grid layouts (2x2, 3x3, 4x4, 5x5).
Intelligent Alerts: Receive and manage security alerts for motion detection, unauthorized access, and more.
In-depth Analytics: Analyze security trends, camera performance, and system health with detailed charts and statistics.
Comprehensive Reporting: Generate and export security reports in both CSV and PDF formats.
Network Management: Manually add cameras or use the auto-scan feature to discover devices on your network.
System Information: View detailed information about the client system for diagnostics and troubleshooting.
Customizable Settings: Personalize your experience with light/dark themes, default grid views, and alert preferences.
Broadcast Notifications: Send custom alert messages through various channels like WhatsApp, Telegram, Email, and SMS.
User Manual: A complete guide to using the UchitTech AI system.
Responsive Design: The application is designed to be usable on a variety of screen sizes.
Project Structure
The project follows a standard React application structure:

/
|-- public/
|   |-- index.html
|   |-- logo.png
|   |-- new-notification-09-352705.mp3
|-- src/
|   |-- App.css
|   |-- App.jsx
|   |-- LoginPage.jsx
|   |-- main.jsx
|   |-- mockData.js
|   |-- utils/
|       |-- notificationService.js
|       |-- webcamService.js
|-- .gitignore
|-- package.json
|-- README.md

public/: Contains the main HTML file and static assets.

src/: Contains the core application logic and components.

App.css: Global styles and theme variables for the application.

App.jsx: The main application component that handles routing and layout.

LoginPage.jsx: The component for the user login page.

main.jsx: The entry point of the React application.

mockData.js: Contains mock data for development and demonstration purposes.

utils/: Utility functions for services like notifications and webcam handling.

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You will need to have Node.js and npm (or yarn) installed on your machine.

Node.js

npm or yarn

Installation
Clone the repository to your local machine:

git clone [https://github.com/your-username/uchittech-ai.git](https://github.com/your-username/uchittech-ai.git)

Navigate to the project directory:

cd uchittech-ai

Install the required dependencies:

npm install

or

yarn install

Running the Application
Once the dependencies are installed, you can run the application in development mode:

npm start

or

yarn start

This will start the development server and open the application in your default web browser at http://localhost:3000.

Usage
Login
The application starts with a secure login page.

For demonstration purposes, use the following credentials:

Email: admin@uchittechnology.com

Password: admin123

Dashboard
The dashboard is the main landing page after logging in. It provides a high-level overview of the surveillance system's status.

Live View
The Live View page allows you to monitor camera feeds in real-time. You can customize the grid layout to view multiple cameras at once.

Alerts
This section displays a log of all security alerts. You can filter alerts by severity and view details for each event.

Analytics
The Analytics page provides tools to analyze historical data, identify trends, and gain insights into your security operations.

Reports
Generate and download detailed reports in CSV or PDF format for documentation and compliance purposes.

Network Management
Add new cameras to the system manually or use the auto-scan feature to find devices on your network.

Settings
Customize the application's appearance and behavior to suit your preferences.

Dependencies
This project relies on several open-source libraries:

React: A JavaScript library for building user interfaces.

React Router: For declarative routing in React.

Recharts: A composable charting library built on React components.

jsPDF: A library to generate PDFs in JavaScript.

html2canvas: A library to take "screenshots" of webpages or parts of it, directly on the users browser.

Contributing
Contributions are welcome! If you have suggestions for improving the application, please feel free to create an issue or submit a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
