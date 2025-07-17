import React from "react";
import { connectWallet } from "../utils/wallet";

export default function ConnectWallet() {
  const handleConnect = async () => {
    const wallet = await connectWallet();
    console.log("Connected wallet:", wallet);
  };

  return (
    <div>
      <h1>Connect Wallet</h1>
      <button onClick={handleConnect}>Connect Wallet</button>
    </div>
  );
}