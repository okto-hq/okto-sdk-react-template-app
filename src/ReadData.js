import React, { useState } from "react";
import { useOkto } from "okto-sdk-react";
import { useNavigate } from "react-router-dom";

const ReadData = ({ authToken, handleLogout }) => {
  console.log("readdata component rendered: ", authToken);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [authDetails, setAuthDetails] = useState(null);
  
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const { getUserDetails, getPortfolio, createWallet, logOut, getAuthDetails } = useOkto();
  
  const fetchUserDetails = async () => {
    try {
      const details = await getUserDetails();
      setUserDetails(details);
      setActiveSection('userDetails');
    } catch (error) {
      setError(`Failed to fetch user details: ${error.message}`);
    }
  };
  const fetchPortfolio = async () => {
    try {
      const portfolio = await getPortfolio();
      setPortfolioData(portfolio);
      setActiveSection('portfolio');
    } catch (error) {
      setError(`Failed to fetch portfolio: ${error.message}`);
    }
  };
  const fetchWallets = async () => {
    try {
      const walletsData = await createWallet();
      console.log(walletsData)
      setWallets(walletsData);
      setActiveSection('wallets');
    } catch (error) {
      setError(`Failed to fetch wallets: ${error.message}`);
    }
  };
  const fetchAuthDetails = () => {
    try {
      const details = getAuthDetails();
      setAuthDetails(details);
      setActiveSection('authDetails');
    } catch (error) {
      setError(`Failed to fetch authentication details: ${error.message}`);
    }
  };
  const logout = async () => {
    try {
      logOut();
      handleLogout();
      navigate('/');
    } catch (error) {
      setError(`Failed to log out: ${error.message}`);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  };
  const buttonStyle = {
    margin: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  };
  const textStyle = {
    maxWidth: '600px',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '10px 0',
  };
  // const formStyle = {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   width: '100%',
  //   maxWidth: '400px',
  // };
  // const inputStyle = {
  //   margin: '5px',
  //   padding: '10px',
  //   width: '100%',
  //   fontSize: '16px',
  // };


  return (
    <div style={containerStyle}>
      
      <div>
        <button style={buttonStyle} onClick={fetchUserDetails}>View User Details</button>
        <button style={buttonStyle} onClick={fetchPortfolio}>View Portfolio</button>
        <button style={buttonStyle} onClick={fetchWallets}>View Wallets</button>
        <button style={buttonStyle} onClick={fetchAuthDetails}>View Auth Details</button>
        <button style={buttonStyle} onClick={logout}>Log Out</button>
      </div>
      {activeSection === 'userDetails' && userDetails && (
        <div>
          <h2>User Details:</h2>
          <pre>{JSON.stringify(userDetails, null, 2)}</pre>
        </div>
      )}
      {activeSection === 'portfolio' && portfolioData && (
        <div>
          <h2>Portfolio Data:</h2>
          <pre>{JSON.stringify(portfolioData, null, 2)}</pre>
        </div>
      )}
      {activeSection === 'wallets' && wallets && (
        <div>
          <h2>Wallets:</h2>
          <pre>{JSON.stringify(wallets, null, 2)}</pre>
        </div>
      )}
      {activeSection === 'authDetails' && authDetails && (
        <div>
          <h2>Auth Details:</h2>
          <div style={textStyle}>
            {Object.entries(authDetails).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong>
                <span style={{ display: 'block', wordBreak: 'break-all', marginLeft: '10px' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
export default ReadData;