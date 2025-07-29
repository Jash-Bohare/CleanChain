import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo"; // assuming you have a Logo component

const Welcome = () => {
  const navigate = useNavigate();

  // Random info for the card
  const randomInfo = [
    "CleanChain is a platform that rewards users for making their communities cleaner.",
    "By participating, you can earn rewards and contribute to a greener world!",
    "Join a community of eco-conscious individuals who care about the planet.",
    "Start your journey today and make a difference with every step."
  ];

  const randomMessage = randomInfo[Math.floor(Math.random() * randomInfo.length)];

  const handleGetStarted = () => {
    navigate("/welcomestep1");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2b2d25] text-[#2b2d25]">
      {/* Logo at the top */}
      <div className="mb-6">
        <Logo />
      </div>

      <div className="max-w-sm w-full bg-[#f8f2ed] p-8 rounded-xl shadow-md border border-[#c6c6b6]">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#6b705c]">
          Welcome to CleanChain
        </h2>

        {/* Short description before Get Started */}
        <p className="text-[#5f3a26] text-center mb-4">
          Together, we can make our communities cleaner and greener.
        </p>

        <p className="text-[#75755c] text-center mb-6 italic">
          {randomMessage}
        </p>

        <button
          onClick={handleGetStarted}
          className="w-full py-3 px-6 bg-[#cb997e] text-[#2b2d25] font-semibold rounded-lg hover:bg-[#b08968] transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
