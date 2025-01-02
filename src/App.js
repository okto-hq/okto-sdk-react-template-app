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

  const brandData = {
    title: "Test APP",
    subtitle: "Your gateway to the blockchain",
    iconUrl: "https://www.okto.com/favicon.ico"
  }

 return (
   <Router>
     <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX} primaryAuth={AuthType.EMAIL} brandData={brandData} environment={"sandbox"}>
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