import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = ({ setAuthToken, authToken, handleLogout }) => {

  console.log("LoginPage component rendered: ", authToken);
  const navigate = useNavigate();
  const {
    authenticate,
    isLoggedIn,
    sendEmailOTP,
    verifyEmailOTP,
    sendPhoneOTP,
    verifyPhoneOTP,
  } = useOkto();

  // Separate states for email and phone OTPs
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [countryShortName, setCountryShortName] = useState("IN");
  
  // Separate tokens for each method
  const [emailToken, setEmailToken] = useState("");
  const [phoneToken, setPhoneToken] = useState("");
  
  const [authMethod, setAuthMethod] = useState("");
  const [error, setError] = useState("");
  
  // Loading states
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isPhoneSending, setIsPhoneSending] = useState(false);
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  // Clear error when changing auth method
  useEffect(() => {
    setError("");
  }, [authMethod]);

  // Input validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    return phone.length >= 10 && /^\d+$/.test(phone);
  };

  const validateCountryCode = (code) => {
    return code.length === 2 && /^[A-Z]+$/.test(code);
  };


  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      authenticate(idToken, (authResponse, error) => {
        if (authResponse?.auth_token) {
          setAuthToken(authResponse.auth_token);
          navigate("/home");
        }
        if (error) {
          setError("Authentication failed: " + error.message);
        }
      });
    } catch (err) {
      setError("Google login failed: " + err.message);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsEmailSending(true);
    setError("");
    
    try {
      const response = await sendEmailOTP(email);
      if (response?.token) {
        setEmailToken(response.token);
        setAuthMethod("email");
        setError("");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError("Failed to send Email OTP: " + err.message);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp || emailOtp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setIsEmailVerifying(true);
    setError("");

    try {
      const response = await verifyEmailOTP(email, emailOtp, emailToken);
      if (response?.auth_token) {
        setAuthToken(response.auth_token);
        setError("");
        navigate('/home');
      } else {
        setError("Invalid OTP verification response");
      }
    } catch (err) {
      setError("Failed to verify Email OTP: " + err.message);
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!validateCountryCode(countryShortName)) {
      setError("Please enter a valid country code (e.g., IN)");
      return;
    }

    setIsPhoneSending(true);
    setError("");

    try {
      const response = await sendPhoneOTP(phone, countryShortName);
      if (response?.token) {
        setPhoneToken(response.token);
        setAuthMethod("phone");
        setError("");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError("Failed to send Phone OTP: " + err.message);
    } finally {
      setIsPhoneSending(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp || phoneOtp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setIsPhoneVerifying(true);
    setError("");

    try {
      const response = await verifyPhoneOTP(phone, countryShortName, phoneOtp, phoneToken);
      if (response?.auth_token) {
        setAuthToken(response.auth_token);
        setError("");
        navigate('/home');
      } else {
        setError("Invalid OTP verification response");
      }
    } catch (err) {
      setError("Failed to verify Phone OTP: " + err.message);
    } finally {
      setIsPhoneVerifying(false);
    }
  };

  const onLogoutClick = () => {
    handleLogout();
    setAuthMethod("");
    setEmailToken("");
    setPhoneToken("");
    setEmailOtp("");
    setPhoneOtp("");
    setError("");
    navigate('/');
  };


  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  };

  const formSectionStyle = {
    width: "100%",
    marginBottom: "20px",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const inputStyle = {
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    margin: "10px 0",
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    width: "100%",
    fontSize: "16px",
  };

  const errorStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Login</h1>

      {/* Google Login */}
      <div style={formSectionStyle}>
        <h2>Google Authentication</h2>
        <p>Single-click authentication with Google.</p>
        {!authToken ? (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => setError("Login Failed: " + error.message)}
            useOneTap={false}
          />
        ) : (
          <button style={buttonStyle} onClick={onLogoutClick}>
            Logout
          </button>
        )}
      </div>

      {/* Email Authentication */}
      <div style={formSectionStyle}>
        <h2>Email Authentication</h2>
        <p>Secure authentication using email OTP.</p>
        <div style={{ marginBottom: '10px' }}>
          <input
            style={inputStyle}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailSending}
          />
          <button 
            style={{
              ...buttonStyle,
              opacity: isEmailSending ? 0.7 : 1,
              cursor: isEmailSending ? 'not-allowed' : 'pointer'
            }} 
            onClick={handleSendEmailOTP}
            disabled={isEmailSending || !email}
          >
            {isEmailSending ? 'Sending...' : 'Send Email OTP'}
          </button>
        </div>

        {authMethod === "email" && (
          <div style={{ marginTop: '10px' }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Enter OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              disabled={isEmailVerifying}
            />
            <button 
              style={{
                ...buttonStyle,
                opacity: isEmailVerifying ? 0.7 : 1,
                cursor: isEmailVerifying ? 'not-allowed' : 'pointer'
              }}
              onClick={handleVerifyEmailOTP}
              disabled={isEmailVerifying || !emailOtp}
            >
              {isEmailVerifying ? 'Verifying...' : 'Verify Email OTP'}
            </button>
          </div>
        )}
      </div>

      {/* Phone Authentication */}
      <div style={formSectionStyle}>
        <h2>Phone Authentication</h2>
        <p>Secure authentication using phone OTP.</p>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={{ ...inputStyle, width: "30%" }}
              type="text"
              placeholder="IN"
              value={countryShortName}
              onChange={(e) => setCountryShortName(e.target.value.toUpperCase())}
              disabled={isPhoneSending}
              maxLength={2}
            />
            <input
              style={{ ...inputStyle, width: "70%" }}
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPhoneSending}
            />
          </div>
          <button 
            style={{
              ...buttonStyle,
              opacity: isPhoneSending ? 0.7 : 1,
              cursor: isPhoneSending ? 'not-allowed' : 'pointer'
            }}
            onClick={handleSendPhoneOTP}
            disabled={isPhoneSending || !phone || !countryShortName}
          >
            {isPhoneSending ? 'Sending...' : 'Send Phone OTP'}
          </button>
        </div>

        {authMethod === "phone" && (
          <div style={{ marginTop: '10px' }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Enter OTP"
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value)}
              disabled={isPhoneVerifying}
            />
            <button 
              style={{
                ...buttonStyle,
                opacity: isPhoneVerifying ? 0.7 : 1,
                cursor: isPhoneVerifying ? 'not-allowed' : 'pointer'
              }}
              onClick={handleVerifyPhoneOTP}
              disabled={isPhoneVerifying || !phoneOtp}
            >
              {isPhoneVerifying ? 'Verifying...' : 'Verify Phone OTP'}
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          ...errorStyle,
          padding: '10px',
          backgroundColor: '#fff3f3',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
export default LoginPage;
