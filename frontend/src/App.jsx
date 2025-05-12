import React, { useState } from 'react';
import { ethers } from 'ethers';
import CarServiceHistoryABI from './CarServiceHistoryABI.json'; // Your contract ABI
import './styles.css';

const CONTRACT_ADDRESS = "0x..."; // Your deployed contract address

function App() {
  const [currentView, setCurrentView] = useState('register');
  const [formData, setFormData] = useState({
    vin: '',
    owner: '',
    purchaseDate: '',
    make: '',
    model: '',
    serialId: ''
  });
  const [verificationData, setVerificationData] = useState({
    serialId: '',
    newOwner: ''
  });
  const [carInfo, setCarInfo] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(accounts[0]); // ✅ DENGAN alamat


        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CarServiceHistoryABI,
          signer
        );

        setProvider(provider);
        setContract(contract);
        setAccount(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // async function connectWallet() {
  //   if (window.ethereum) {
  //     const provider = new BrowserProvider(window.ethereum);
  //     const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  //     const signer = await provider.getSigner(accounts[0]);

  //     console.log("Wallet connected:", accounts[0]);
  //     return { provider, signer, address: accounts[0] };
  //   } else {
  //     alert("Install MetaMask!");
  //   }
  // };

  // Register a new car
  const registerCar = async () => {
    if (!contract) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const tx = await contract.registerCar(
        formData.serialId,
        formData.make,
        formData.model,
        formData.purchaseDate
      );
      await tx.wait();
      alert("Car registered successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + error.message);
    }
  };

  // Verify car authenticity
  const verifyCar = async () => {
    if (!contract) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const [owner, make, model, year] = await contract.getCarInfo(verificationData.serialId);
      setCarInfo({
        owner,
        make,
        model,
        year: year.toString()
      });
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Car not found or verification failed");
    }
  };

  // Transfer ownership
  const transferOwnership = async () => {
    if (!contract) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const tx = await contract.transferOwnership(
        verificationData.serialId,
        verificationData.newOwner
      );
      await tx.wait();
      alert("Ownership transferred successfully!");
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed: " + error.message);
    }
  };

  // Count authentications (placeholder - would need corresponding contract function)
  const countAuthentications = async () => {
    alert("Functionality to be implemented");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerificationInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-container">
      <header>
        <h1>PITSTOP CHECK - Vehicle Authenticity</h1>
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
        )}
      </header>

      <nav>
        <button onClick={() => setCurrentView('register')}>Register Vehicle</button>
        <button onClick={() => setCurrentView('verify')}>Verify Authentication</button>
        <button onClick={() => setCurrentView('transfer')}>Change Owner</button>
        <button onClick={() => setCurrentView('count')}>Count Authentication</button>
      </nav>

      <main>
        {currentView === 'register' && (
          <div className="register-form">
            <h2>Vehicle Registration</h2>
            <div className="form-group">
              <label>Serial ID (VIN)</label>
              <input
                type="text"
                name="serialId"
                value={formData.serialId}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={registerCar}>Register</button>
          </div>
        )}

        {currentView === 'verify' && (
          <div className="verify-form">
            <h2>Verify Authentication</h2>
            <div className="form-group">
              <label>Item Serial ID</label>
              <input
                type="text"
                name="serialId"
                value={verificationData.serialId}
                onChange={handleVerificationInputChange}
              />
            </div>
            <button onClick={verifyCar}>Verify</button>

            {carInfo && (
              <div className="verification-result">
                <h3>Vehicle Information</h3>
                <p><strong>Owner:</strong> {carInfo.owner}</p>
                <p><strong>Make:</strong> {carInfo.make}</p>
                <p><strong>Model:</strong> {carInfo.model}</p>
                <p><strong>Year:</strong> {carInfo.year}</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'transfer' && (
          <div className="transfer-form">
            <h2>Change Owner</h2>
            <div className="form-group">
              <label>Serial ID</label>
              <input
                type="text"
                name="serialId"
                value={verificationData.serialId}
                onChange={handleVerificationInputChange}
              />
            </div>
            <div className="form-group">
              <label>New Owner Address</label>
              <input
                type="text"
                name="newOwner"
                value={verificationData.newOwner}
                onChange={handleVerificationInputChange}
              />
            </div>
            <button onClick={transferOwnership}>Change</button>
          </div>
        )}

        {currentView === 'count' && (
          <div className="count-form">
            <h2>Count Authentication</h2>
            <button onClick={countAuthentications}>Count</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;