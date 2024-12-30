# Okto React SDK Template App

## Overview
This repository provides an example setup for integrating the Okto React SDK. The app demonstrates authentication, token management, and other core functionalities.

## Prerequisites
1. **Node.js** and **npm** installed.
2. Configure [Google OAuth credentials](https://docs.okto.tech/docs/react-sdk/advanced-sdk-config/authenticate-users/google-oauth/google-console-setup) for login.
3. Obtain your [Okto API Key](https://docs.okto.tech/docs/developer-admin-dashboard/api-key#app-secret).

## Environment Variables

### Frontend
Create a `.env` file in the root directory of the frontend project with the following variables:
```env
REACT_APP_OKTO_CLIENT_API_KEY=your_okto_client_api_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend
Create a `.env` file in the root directory of the backend server project with the following variables:
```env
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
```

## Setup

### 1. Clone Repository.

```bash
git clone git@github.com:okto-hq/okto-sdk-react-template-app.git
cd okto-sdk-react-template-app
```

### 2. Backend Setup

The backend server handles Google OAuth token exchange and refresh using the google-auth-library package. The Backend server must be running for Google authentication in the Onboarding Modal to work.

1. Navigate to the backend directory.

2. Install dependencies:

```bash
npm install
```

3. Create backend `.env` file and add the required keys.

4. Start the server:

``` bash
node okto-gauth-server.js
```

The backend runs on `http://localhost:3001`.

### 2. Frontend Setup

1. Navigate to the frontend project directory.

2. Install dependencies:

```bash
npm install
```

3. Create the frontend `.env` file and add the required keys.

4. Start the development server:

``` bash
npm start
```

The backend runs on `http://localhost:3001`.

## Running the Application

1. Start both the frontend and backend servers.

2. Open the app in your browser at `http://localhost:3000`.

3. Use available authentication methods and features.

## Common Issues

- Ensure both backend and frontend servers are running simultaneously
- Verify all environment variables are correctly set
- Check Google OAuth credentials are properly configured
- Confirm Okto API key is valid