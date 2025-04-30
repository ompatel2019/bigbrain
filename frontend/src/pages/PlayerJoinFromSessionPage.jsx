import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerJoinFromSessionPage() {
  const navigate = useNavigate();
  const [sessionIdInput, setSessionIdInput] = useState("");

  const handleRegister = () => {
    if (!sessionIdInput.trim()) {
      alert("Please enter a session ID.");
      return;
    }
    
    navigate(`${sessionIdInput}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff9f8] via-[#e0f2fe] to-[#f5f2fd] font-[Poppins] px-4 py-6">
      <div className="max-w-sm w-full bg-white shadow-2xl rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Enter Session ID</h1>
        <p className="text-gray-600 mb-6">
          If you know the session ID from the admin, enter it below to join.
        </p>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Session ID
        </label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          placeholder="e.g. 123456"
          value={sessionIdInput}
          onChange={(e) => setSessionIdInput(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded shadow-md transition duration-300"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}
