export const walletLogin = async (walletAddress) => {
  const res = await fetch("http://localhost:5000/auth/wallet-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return await res.json();
};

export const updateUserProfile = async ({ walletAddress, username, email }) => {
  const res = await fetch("http://localhost:5000/auth/update-profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, username, email }),
  });
  return await res.json();
};

export const fetchLocations = async () => {
  const res = await fetch("http://localhost:5000/api/locations");
  if (!res.ok) throw new Error("Failed to fetch locations");
  return await res.json();
};

export const fetchLocationDetails = async (locationId) => {
  const res = await fetch(`http://localhost:5000/api/locations/${locationId}`);
  if (!res.ok) throw new Error("Failed to fetch location details");
  return await res.json();
};

export const claimLocation = async ({ walletAddress, locationId, userLat, userLng }) => {
  const res = await fetch("http://localhost:5000/api/claim-location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, locationId, userLat, userLng }),
  });
  return await res.json();
};

export const testDistance = async ({ lat1, lng1, lat2, lng2 }) => {
  const params = new URLSearchParams({ lat1, lng1, lat2, lng2 });
  const res = await fetch(`http://localhost:5000/api/test-distance?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to test distance");
  return await res.json();
};

// Get user's claimed and cleaned locations
export const getUserLocations = async (walletAddress) => {
  const res = await fetch(`http://localhost:5000/api/user/${walletAddress}/locations`);
  if (!res.ok) throw new Error("Failed to fetch user locations");
  return await res.json();
};

// Get user profile data
export const getUserProfile = async (walletAddress) => {
  const res = await fetch(`http://localhost:5000/auth/wallet-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return await res.json();
};

// Get user's wallet balance from blockchain
export const getWalletBalance = async (walletAddress) => {
  const res = await fetch(`http://localhost:5000/api/user/${walletAddress}/balance`);
  if (!res.ok) throw new Error("Failed to fetch wallet balance");
  return await res.json();
};

// Get user's ECO token balance only
export const getTokenBalance = async (walletAddress) => {
  const res = await fetch(`http://localhost:5000/api/user/${walletAddress}/balance`);
  if (!res.ok) throw new Error("Failed to fetch token balance");
  const data = await res.json();
  return { balance: data.tokenBalance };
};

// Upload after-cleaning image
export const uploadAfterImage = async (locationId, imageFile) => {
  const formData = new FormData();
  formData.append('afterImage', imageFile);

  const res = await fetch(`http://localhost:5000/api/upload/${locationId}`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) throw new Error("Failed to upload image");
  return await res.json();
};
