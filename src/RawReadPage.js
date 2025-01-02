import React, { useState } from "react";
import { useOkto } from "okto-sdk-react";
import { useNavigate } from "react-router-dom";
import ReadData from './ReadData';

const RawReadPage = ({ authToken, handleLogout }) => {
  console.log("RawReadPage component rendered: ", authToken);
  const navigate = useNavigate();
  const { readContractData } = useOkto();
  const [readResponse, setReadResponse] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [readDataInput, setReadDataInput] = useState({
    network_name: "",
    contract_address: "",
    abi: "",
    args: "",
  });

  const handleReadData = async (e) => {
    e.preventDefault();
    try {
      const { network_name, contract_address, abi, args } = readDataInput;

      const data = {
        contractAddress: contract_address,
        abi: JSON.parse(abi),
        args: JSON.parse(args || "{}"),
      };

      const response = await readContractData(network_name, data);
      setReadResponse(response);
      setActiveSection("readResponse");
      setError(null);
    } catch (err) {
      setError(`Failed to read data: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    setReadDataInput({ ...readDataInput, [e.target.name]: e.target.value });
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  };
  const buttonStyle = {
    margin: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  };
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
  };
  const inputStyle = {
    margin: "5px",
    padding: "10px",
    width: "100%",
    fontSize: "16px",
  };

  const navHome = async () => {
    try {
      console.log("going to home page");
      navigate("/home");
    } catch (error) {
      setError(`Failed to navigate: ${error.message}`);
    }
  };

  const navRawTxn = async () => {
    try {
      console.log("going to raw txn page");
      navigate("/raw");
    } catch (error) {
      setError(`Failed to navigate: ${error.message}`);
    }
  };

  const navWidget = async () => {
    try {
      console.log("going to widget page");
      navigate("/widget");
    } catch (error) {
      setError(`Failed to navigate: ${error.message}`);
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Read Contract Data</h1>
      
      {/* Rendering ReadData component and passing handleLogout */}
      <ReadData handleLogout={handleLogout} authToken={authToken}/>
      
      <h2>Perform Raw Read</h2>
      <form style={formStyle} onSubmit={handleReadData}>
        <input
          style={inputStyle}
          type="text"
          name="network_name"
          placeholder="Network Name"
          value={readDataInput.network_name}
          onChange={handleInputChange}
          required
        />
        <input
          style={inputStyle}
          type="text"
          name="contract_address"
          placeholder="Contract Address"
          value={readDataInput.contract_address}
          onChange={handleInputChange}
          required
        />
        <textarea
          style={inputStyle}
          name="abi"
          placeholder="ABI as JSON"
          value={readDataInput.abi}
          onChange={handleInputChange}
          required
        />
        <textarea
          style={inputStyle}
          name="args"
          placeholder='Arguments as JSON (e.g., {"_tokenId": 1})'
          value={readDataInput.args}
          onChange={handleInputChange}
        />
        <button style={buttonStyle} type="submit">
          Read Data
        </button>
      </form>
      {activeSection === "readResponse" && readResponse && (
        <div>
          <h2>Read Response:</h2>
          <pre>{JSON.stringify(readResponse, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
      <div>
        <br />
        <br />
        <button style={buttonStyle} onClick={navHome}>
          Go to Home
        </button>
        <button style={buttonStyle} onClick={navWidget}>
          Try Widgets
        </button>
        <button style={buttonStyle} onClick={navRawTxn}>
          Try RawTxn
        </button>
      </div>
    </div>
  );
};

export default RawReadPage;
