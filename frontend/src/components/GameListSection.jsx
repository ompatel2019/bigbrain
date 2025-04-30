import GameListing from "./GameListing";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GameListSection({
  onCreate,
  games,
  handleDelete,
  alterGameSession,
  session,
  resultsPopup,
  setResultsPopup,
  advance,
  getSessionDetails,
}) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  let sessionId;
  if (localStorage.getItem("latestSession")) {
    sessionId = JSON.parse(localStorage.getItem("latestSession")).sessionId;
  }

  useEffect(() => {
    setPopupVisible(session.status === "started");
  }, [session]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/play/join/${sessionId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleViewResults = () => {
    setResultsPopup(false);
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    }
  };

  const handleDismissResults = () => {
    setResultsPopup(false);
    localStorage.removeItem("latestSession");
  };

  return (
    <>
      <hr className="my-8 border-gray-300 w-full" />
      <h3 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">
        Your Games
      </h3>

      {popupVisible && (
        <div className="fixed inset-0 flex justify-center items-start pt-24 z-[51] bg-white/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl p-6 rounded-xl border w-[90%] max-w-xl transform transition-all duration-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Game Session Started
            </h2>
            <p className="text-sm mb-2 text-gray-600">Session Join Link:</p>
            <div className="bg-gray-100 rounded p-3 mb-4 text-sm text-gray-800 break-all">
              http://localhost:3000/play/join/{sessionId}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCopy}
                className={`transition-all duration-300 px-4 py-2 rounded shadow-md font-medium text-white ${
                  copied ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={() => setPopupVisible(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-md font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {resultsPopup && (
        <div className="fixed inset-0 flex justify-center items-start pt-24 z-[51] bg-white/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl p-6 rounded-xl border w-[90%] max-w-xl transform transition-all duration-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Game Ended
            </h2>
            <p className="text-sm mb-4 text-gray-600">
              Would you like to view the results?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleViewResults}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={handleDismissResults}
                className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {games.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mb-12">
          You have no games — let’s get started with one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {games.map((game, idx) => (
            <GameListing
              key={idx}
              index={idx}
              game={game}
              handleDelete={handleDelete}
              alterGameSession={alterGameSession}
              session={session}
              alterPopup={setPopupVisible}
              advance={advance}
              getSessionDetails={getSessionDetails}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onCreate}
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          + Create New Game
        </button>
      </div>
    </>
  );
}
