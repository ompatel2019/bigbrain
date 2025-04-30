import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SessionResultsPage = () => {
  const sessionDetails = JSON.parse(localStorage.getItem("latestSession"));
  const nav = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleReturn = () => {
    localStorage.removeItem("latestSession");
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fdf2f8] font-[Poppins] px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Session Results
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          For session:{" "}
          <span className="font-semibold text-gray-800">
            {sessionDetails?.sessionId}
          </span>
        </p>

        {/* Top 5 Users Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            🏆 Top 5 Players
          </h2>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-t hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-medium">{i}</td>
                    <td className="px-4 py-3">Player {i}</td>
                    <td className="px-4 py-3">
                      {Math.floor(Math.random() * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              📊 % Correct Per Question
            </h3>
            <div className="h-64 bg-white border rounded flex items-center justify-center text-gray-400">
              [Bar Chart Placeholder]
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              ⏱ Avg. Response Time
            </h3>
            <div className="h-64 bg-white border rounded flex items-center justify-center text-gray-400">
              [Line Chart Placeholder]
            </div>
          </div>
        </div>

        {/* Bonus Section */}
        <h2 className="text-2xl font-bold text-gray-800 mt-16 mb-6 border-b-2 border-gray-200 pb-2">
          🏆 Awards
        </h2>
        {/* AWARD 1: Fastest Correct Answer */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-yellow-700 mb-2">
            ⚡ Fastest Correct Answer
          </h3>
          <p className="text-gray-600">
            Player <span className="font-semibold text-gray-800">#2</span>{" "}
            correctly answered question{" "}
            <span className="font-semibold text-blue-600">#3</span> in just{" "}
            <span className="font-semibold text-green-600">1.1 seconds</span>!
            Blink and you’d miss it 👀
          </p>
        </div>

        {/* AWARD 2: Longest Correct Streak */}
        <div className="mb-6 bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            🔥 Longest Correct Streak
          </h3>
          <p className="text-gray-600">
            Player <span className="font-semibold text-gray-800">#4</span> got{" "}
            <span className="font-semibold text-indigo-600">
              4 answers in a row
            </span>{" "}
            correct without breaking a sweat. Legendary focus 🎯
          </p>
        </div>

        {/* AWARD 3: Most Accurate Player */}
        <div className="mb-6 bg-green-50 border border-green-200 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            ✅ Most Accurate Player
          </h3>
          <p className="text-gray-600">
            Player <span className="font-semibold text-gray-800">#1</span>{" "}
            finished with a{" "}
            <span className="font-semibold text-green-600">
              100% accuracy rate
            </span>
            . Not a single miss! 🧠
          </p>
        </div>

        {/* AWARD 4: Comeback Kid */}
        <div className="mb-6 bg-pink-50 border border-pink-200 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-pink-700 mb-2">
            📈 Comeback Kid
          </h3>
          <p className="text-gray-600">
            Player <span className="font-semibold text-gray-800">#5</span> had a
            rocky start but{" "}
            <span className="font-semibold text-pink-600">
              nailed the last 3 questions
            </span>
            . That’s the spirit 💪
          </p>
        </div>

        {/* AWARD 5: Speed Demon (Avg Time < 2s) */}
        <div className="mb-6 bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-purple-700 mb-2">
            🚀 Speed Demon
          </h3>
          <p className="text-gray-600">
            Player <span className="font-semibold text-gray-800">#3</span> had
            an average response time of{" "}
            <span className="font-semibold text-purple-600">1.7 seconds</span>{" "}
            per question. Quick draw champion! 🏃💨
          </p>
        </div>

        {/* Return Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Are you sure you want to return?
            </h2>
            <p className="text-gray-600 mb-6">
              This will clear all data associated with this session result.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReturn}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md shadow transition"
              >
                Yes, Return
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md shadow transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionResultsPage;