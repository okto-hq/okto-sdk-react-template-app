import React, { useState } from 'react';
import { OktoProvider, useOkto, BuildType, AuthType } from 'okto-sdk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import RawTxnPage from './RawTxnPage';
import WidgetPage from './WidgetPage';
import RawReadPage from "./RawReadPage";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const OKTO_CLIENT_API_KEY = process.env.REACT_APP_OKTO_CLIENT_API_KEY;
function App() {

  const [authPromise, setAuthPromise] = useState(null);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        const { data: tokens } = await axios.post("http://localhost:3001/auth/google", {
          code,
        });
        if (authPromise) {
          authPromise.resolve(tokens.id_token);
        }
      } catch (error) {
        console.error("Error during token exchange:", error);
        if (authPromise) {
          authPromise.reject(error);
        }
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      if (authPromise) {
        authPromise.reject(error);
      }
    },
  });

  const handleGAuthCb = async () => {
    console.log("Triggering Google Login...");
    
    // Create a new promise
    let promiseResolve, promiseReject;
    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    
    // Store the promise handlers
    setAuthPromise({ resolve: promiseResolve, reject: promiseReject });
    
    // Trigger Google login
    googleLogin();
    
    // Return the ID token when it's available
    return promise;
  };

  const brandData = {
    title: "Test APP",
    subtitle: "Your gateway to the blockchain",
    iconUrl: "https://www.okto.com/favicon.ico"
  }

 return (
   <Router>
     <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX} gAuthCb={handleGAuthCb} primaryAuth={AuthType.EMAIL} brandData={brandData} environment={"sandbox"}>
      <AppRoutes />
     </OktoProvider>
   </Router>
 );
}

// Separate component to use hooks
function AppRoutes() {
  const { isLoggedIn } = useOkto();
  const [authToken, setAuthToken] = useState(null);

  const handleLogout = () => {
    console.log("setting auth token to null")
    setAuthToken(null); // Clear the authToken
  };

  return (
    <Routes>
      <Route path="/" element={!isLoggedIn ? <LoginPage setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} /> : <Navigate to="/home" />} />
      <Route path="/home" element={isLoggedIn ? <HomePage authToken={authToken} handleLogout={handleLogout}/> : <Navigate to="/" />} />
      <Route path="/raw" element={isLoggedIn ? <RawTxnPage authToken={authToken} handleLogout={handleLogout}/> : <Navigate to="/" />} />
      <Route path="/widget" element={isLoggedIn ? <WidgetPage authToken={authToken} handleLogout={handleLogout}/> : <Navigate to="/" />} />
      <Route path="/read" element={isLoggedIn ? <RawReadPage authToken={authToken} handleLogout={handleLogout} /> : <Navigate to="/" />} />  
    </Routes>
  );
}

export default App;