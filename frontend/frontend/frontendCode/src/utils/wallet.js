export async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      console.error("User rejected request", err);
      return null;
    }
  } else {
    alert("MetaMask not found. Please install MetaMask!");
    return null;
  }
}
