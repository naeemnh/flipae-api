# Employee-Supervisor API

## Description

API to Manipulate Employee-Supervisor Relations.
Used by [naeemnh/flipae-client]('https://github.com/naeemnh/flipae-client.git').

## Local Setup

1. Clone the repository: `git clone https://github.com/naeemnh/flipae-api.git`
2. Install dependencies: `npm install`
3. Build the app: `npm run build`
4. Start the server: `npm start`

## Production

API URL = `https://api-esr-484054d901eb.herokuapp.com`
CLIENT URL = `https://flipint-b12f6679542c.herokuapp.com`

## Endpoints

### /auth

- `GET` Returns Authorized User

- `DELETE` Logout User

### /auth/login

- `POST` Login User

### /auth/register

- `POST` Register User

### /employees

- `GET` Returns an Employee Tree

- `POST` Create a New Employee

### /employees/{employeeName}

- `PUT` Updates Employee with new supervisor

- `DELETE` Deletes Employee

### /employees/upload

- `POST` Mass upload Employees

### /employees/list

- `GET` Returns list of employees
