# Task Manager App

## Description
The Task Manager App is a web application that allows users to securely register, log in, and manage their tasks. Users can create, edit, delete tasks, mark them as completed, and filter tasks based on their status or category. The application features a user-friendly interface built with React and a robust backend powered by Laravel.

## Features
- User registration and secure login
- Task management (create, edit, delete)
- Mark tasks as completed
- View tasks of the logged-in user and other users
- Filter tasks by status or category

## Tech Stack
### Frontend
- **React**: A JavaScript library for building user interfaces
- **React Router**: For navigation between different pages
- **Axios**: For making HTTP requests to the backend API
- **Bootstrap**: For styling the application

### Backend
- **Laravel**: A PHP framework for building web applications
- **Laravel Breeze/Sanctum**: For authentication and API management
- **Eloquent ORM**: For database interactions
- **MySQL**: For the database

## Project Structure
```
task-manager-app
├── backend
│   ├── app
│   ├── bootstrap
│   ├── config
│   ├── database
│   │   ├── migrations
│   │   └── seeders
│   ├── public
│   ├── resources
│   │   ├── views
│   └── routes
│       └── api.php
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   ├── Auth
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── Tasks
│   │   │   │   ├── TaskList.js
│   │   │   │   ├── TaskItem.js
│   │   │   │   └── TaskForm.js
│   │   │   └── Filters
│   │   │       └── TaskFilter.js
│   │   ├── context
│   │   │   └── AuthContext.js
│   │   ├── hooks
│   │   │   └── useAuth.js
│   │   ├── pages
│   │   │   ├── Home.js
│   │   │   ├── Tasks.js
│   │   │   └── Profile.js
│   │   ├── services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── routes.js
│   └── package.json
├── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-manager-app
   ```

2. Set up the backend:
   - Navigate to the `backend` directory.
   - Install dependencies using Composer:
     ```
     composer install
     ```
   - Set up your `.env` file for database configuration.
   - Run migrations:
     ```
     php artisan migrate
     ```
   - Seed the database (optional):
     ```
     php artisan db:seed
     ```
   - Start the Laravel server:
     ```
     php artisan serve
     ```

3. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install dependencies using npm:
     ```
     npm install
     ```
   - Start the React application:
     ```
     npm start
     ```

## Usage
- Access the application in your browser at `http://localhost:3000`.
- Users can register and log in to manage their tasks.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.