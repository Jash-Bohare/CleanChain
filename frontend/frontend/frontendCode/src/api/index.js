// /src/api/index.js

// Wallet login endpoint
export const walletLogin = async (walletAddress) => {
  const res = await fetch("http://localhost:5000/auth/wallet-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return await res.json();
};

// NEW: Save user profile (username + email + wallet)
export const saveUserProfile = async ({ walletAddress, username, email }) => {
  const res = await fetch("http://localhost:5000/auth/update-profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, username, email }),
  });
  return await res.json();
};
