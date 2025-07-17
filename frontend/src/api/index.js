export const walletLogin = async (walletAddress) => {
  const res = await fetch("http://localhost:5000/auth/wallet-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return await res.json();
};

// (Optional: use this in CompleteProfile.jsx)
export const updateUserProfile = async ({ walletAddress, username, email }) => {
  const res = await fetch("http://localhost:5000/auth/update-profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, username, email }),
  });
  return await res.json();
};
