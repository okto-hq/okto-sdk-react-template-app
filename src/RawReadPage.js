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

  const [isSampleVisible, setSampleVisible] = useState(false);
  const [isAbiVisible, setAbiVisible] = useState(false);

  const toggleSampleVisibility = () => {
    setSampleVisible((prev) => !prev);
  };

  const toggleAbiVisibility = () => {
    setAbiVisible((prev) => !prev);
  };

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
  const exampleStyle = {
    fontSize: "14px",
    color: "#666",
    marginTop: "8px",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
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
      <p style={{ fontSize: "14px", color: "#333", marginBottom: "20px" }}>
        <strong>Note:</strong> This is designed for <strong>EVM</strong> networks only. For a guide to implement the same for <strong>Aptos</strong> network, check out the documentation <a href="https://docs.okto.tech/docs/react-sdk/advanced-sdk-config/okto-embedded-wallet/use-user-embedded-wallet/read-contract-data#parameters" target="_blank" rel="noopener noreferrer">here</a>.
      </p>
      <form style={formStyle} onSubmit={handleReadData}>
        <input
          style={inputStyle}
          type="text"
          name="network_name"
          placeholder="Network Name (e.g., POLYGON)"
          value={readDataInput.network_name}
          onChange={handleInputChange}
          required
        />
        <input
          style={inputStyle}
          type="text"
          name="contract_address"
          placeholder="Contract Address (e.g., 0x35d1fe98bEC913B72aF84bA20daD9b5AF723D1A)"
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
      
      {/* Toggle ABI Example */}
      <button
        style={{
          ...buttonStyle,
          marginTop: "20px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
        }}
        onClick={toggleAbiVisibility}
      >
        {isAbiVisible ? "Hide Sample ABI Format" : "Show Sample ABI Format"}
      </button>

      {isAbiVisible && (
        <div style={exampleStyle}>
          <strong>Sample ABI format</strong>:
          {"\n\n"}
          {`{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
        }
    ],
    "name": "tokenURI",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}`}
        </div>
      )}

      {/* Toggle Transaction Format */}
      <button
        style={{
          ...buttonStyle,
          marginTop: "20px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
        }}
        onClick={toggleSampleVisibility}
      >
        {isSampleVisible ? "Hide Sample Transaction Format" : "Show Sample Transaction Format"}
      </button>

      {isSampleVisible && (
        <div style={exampleStyle}>
          {`{
  "network_name": "POLYGON",
  "contractAddress": "0x35d1fe98bEC913B72aF84bA20daD9b5AF723Dd1A",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "args": {
    "_tokenId": 1
  }
}`}
        </div>
      )}

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
