import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PlayerJoinPage({ registerPlayer }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { session_id } = useParams();

  const handleRegister = () => {
    if (!name.trim()) {
      alert("Please enter a valid name!");
      return;
    }

    registerPlayer(name, session_id);
    navigate(`/lobby/${session_id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fef9f9] via-[#e0f2fe] to-[#fafdf2] font-[Poppins] px-4 py-6">
      <div className="max-w-sm w-full bg-white shadow-2xl rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Join Session</h1>
        <p className="text-gray-600 mb-6">
          Enter your name to join the current session (<span className="font-semibold">{session_id}</span>).
        </p>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          placeholder="e.g. Jane"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-2 rounded shadow-md transition duration-300"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}
