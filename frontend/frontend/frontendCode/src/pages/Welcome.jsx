import React, { useState } from "react";
import { connectWallet } from "../utils/wallet";
import { walletLogin } from "../api";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (!address) return;

    setWalletAddress(address);

    try {
      const res = await walletLogin(address);

      // Save to localStorage for later
      localStorage.setItem("walletAddress", address);

      if (res.isNewUser) {
        // Save temp info and go to profile setup
        localStorage.setItem("userEmail", email);
        localStorage.setItem("username", username);
        navigate("/complete-profile");
      } else {
        alert("Welcome back! Redirecting to dashboard...");
        // navigate("/dashboard"); // if implemented
      }
    } catch (error) {
      console.error("Wallet login error:", error);
      alert("Error connecting wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to CleanChain</h1>

      <div className="mb-4 w-80">
        <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
        />
      </div>

      <div className="mb-4 w-80">
        <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
        />
      </div>

      <button
        onClick={handleConnectWallet}
        className="w-80 py-3 px-6 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
      >
        Connect Wallet
      </button>

      {walletAddress && (
        <p className="mt-6 text-green-400">
          ✅ Wallet Connected: <strong>{walletAddress}</strong>
        </p>
      )}
    </div>
  );
};

export default Welcome;
