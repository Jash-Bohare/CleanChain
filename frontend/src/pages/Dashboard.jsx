// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { getDashboardData, uploadProofImage } from "../api/index";

const Dashboard = () => {
  const [userId, setUserId] = useState("test-user-id"); // Replace with real user logic
  const [claimedLocations, setClaimedLocations] = useState([]);
  const [cleanedLocations, setCleanedLocations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData(userId);
        const claimed = data.filter(loc => loc.status === "claimed");
        const cleaned = data.filter(loc => loc.status !== "claimed");
        setClaimedLocations(claimed);
        setCleanedLocations(cleaned);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, [userId]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async (locationId) => {
    if (!selectedImage) return alert("Select an image first.");
    const formData = new FormData();
    formData.append("locationId", locationId);
    formData.append("image", selectedImage);

    setUploadingId(locationId);
    try {
      await uploadProofImage(formData);
      alert("Image uploaded successfully!");
      window.location.reload(); // Quick hack: refresh dashboard
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>

      {/* Claimed Locations */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Claimed Locations</h2>
        {claimedLocations.length === 0 ? (
          <p>No claimed locations.</p>
        ) : (
          claimedLocations.map((loc) => (
            <div key={loc._id} className="border p-4 mb-3 rounded-md bg-gray-800">
              <p><strong>Spot ID:</strong> {loc._id}</p>
              <p><strong>Status:</strong> Waiting for proof</p>
              <input type="file" onChange={handleImageChange} className="my-2" />
              <button
                className="bg-blue-600 px-4 py-1 rounded"
                onClick={() => handleUpload(loc._id)}
                disabled={uploadingId === loc._id}
              >
                {uploadingId === loc._id ? "Uploading..." : "Upload Proof"}
              </button>
            </div>
          ))
        )}
      </section>

      {/* Cleaned Locations */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Verified/Cleaned Locations</h2>
        {cleanedLocations.length === 0 ? (
          <p>No cleaned locations yet.</p>
        ) : (
          cleanedLocations.map((loc) => (
            <div key={loc._id} className="border p-4 mb-3 rounded-md bg-gray-800">
              <p><strong>Spot ID:</strong> {loc._id}</p>
              <p><strong>Status:</strong> {loc.status}</p>
              {loc.afterImageURL && (
                <img
                  src={loc.afterImageURL}
                  alt="Proof"
                  className="mt-2 w-48 h-auto border rounded"
                />
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;