import React, { useState } from "react";
import { connectWallet } from "../utils/wallet";
import { walletLogin } from "../api";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    setLoading(true);
    const address = await connectWallet();
    setLoading(false);
    if (!address) return;
    setWalletAddress(address);
    try {
      const res = await walletLogin(address);
      localStorage.setItem("walletAddress", address);
      if (res.isNewUser) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        navigate("/complete-profile");
      } else {
        navigate("/map");
      }
    } catch (error) {
      console.error("Wallet login error:", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to CleanChain</h1>
      <p className="mb-8 text-gray-400 max-w-xl text-center">
        CleanChain is a platform that rewards you for cleaning up your community. Connect your wallet to get started!
      </p>
      {!walletAddress && (
        <button
          onClick={handleConnectWallet}
          className="w-80 py-3 px-6 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {walletAddress && (
        <p className="mt-6 text-green-400">
          0 Wallet Connected: <strong>{walletAddress}</strong>
        </p>
      )}
    </div>
  );
};

export default Welcome;