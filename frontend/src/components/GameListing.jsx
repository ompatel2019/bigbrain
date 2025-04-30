import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GameListing({
  index,
  game,
  alterGameSession,
  alterPopup,
  getSessionDetails,
}) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [hasGameBegun, setHasGameBegun] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({});
  const [questionDuration, setQuestionDuration] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  // const [isLastTimeUp, setIsLastTimeUp] = useState(false);

  // If game.active > 0 => session is "started" server-side
  useEffect(() => {
    setIsActive(game.active > 0);
  }, [game.active]);

  // Start Game => let players join, but no question is begun yet
  const handleStart = () => {
    alterGameSession(game.id, "START");
    setHasGameBegun(false);
    setQuestionIndex(0);
  };

  // The timer logic only runs if: isActive + hasGameBegun + questionIndex < total
  useEffect(() => {
    if (!isActive || !hasGameBegun || questionIndex >= game.questions.length)
      return;

    let timeLeft = game.questions[questionIndex].duration;
    setQuestionDuration(timeLeft);

    const interval = setInterval(() => {
      timeLeft--;
      setQuestionDuration(timeLeft);
      if (timeLeft === 0) {
        clearInterval(interval);
        if (questionIndex >= game.questions.length - 1) {
          // setIsLastTimeUp(true);
          setShowTimeUpPopup(true);
        } else {
          setShowTimeUpPopup(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [questionIndex, isActive, hasGameBegun, game.questions]);

  // End the entire session
  const handleEnd = () => alterGameSession(game.id, "END");

  // Called when admin manually clicks "Advance"
  const handleAdvance = async () => {
    // If first time => actually begin question #1
    if (!hasGameBegun) {
      await alterGameSession(game.id, "ADVANCE"); // ✅ fire advance on first click
      const session = await getSessionDetails(
        JSON.parse(localStorage.getItem("latestSession")).sessionId
      );
      setSessionInfo(session);
      setHasGameBegun(true);
      return;
    }

    // If already begun => normal advance
    if (questionIndex >= game.questions.length - 1) {
      setShowConfirmPopup(true);
    } else {
      await alterGameSession(game.id, "ADVANCE");
      setQuestionIndex((prev) => prev + 1);
    }

    const session = await getSessionDetails(
      JSON.parse(localStorage.getItem("latestSession")).sessionId
    );
    setSessionInfo(session);
    console.log(session);
  };

  const handleInfo = () => navigate(`/game/${game.id}`);

  // Confirm advanced end
  const confirmAdvanceEnd = () => {
    setShowConfirmPopup(false);
    alterGameSession(game.id, "END");
  };
  const cancelAdvance = () => setShowConfirmPopup(false);

  // Time Up => If last Q => end, else advance
  // const proceedAfterTimeUp = () => {
  //   setShowTimeUpPopup(false);
  //   if (isLastTimeUp || questionIndex >= game.questions.length - 1) {
  //     setIsLastTimeUp(false);
  //     alterGameSession(game.id, "END");
  //   } else {
  //     alterGameSession(game.id, "ADVANCE");
  //     setQuestionIndex((prev) => prev + 1);
  //   }
  // };
  const cancelTimeUp = () => {
    setShowTimeUpPopup(false);
    // setIsLastTimeUp(false);
  };

  const questionsLeft = Math.max(game.questions.length - questionIndex, 0);
  const totalDuration =
    game.questions?.reduce((acc, q) => acc + (q.duration || 0), 0) || 0;

  // Show question info only if we’re active & begun & not done
  const isShowingQuestionInfo =
    isActive && hasGameBegun && questionIndex < game.questions.length;

  return (
    <div
      className={`p-4 shadow-lg rounded-xl border transition duration-300 ease-in-out flex flex-col relative ${
        isActive
          ? "bg-green-50 border-green-400 hover:shadow-2xl"
          : "bg-white hover:shadow-xl"
      }`}
    >
      {/* Session Active Badge */}
      {isActive && (
        <span className="z-50 absolute top-7 right-7 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Session Active
        </span>
      )}

      {/* Thumbnail */}
      {game.thumbnail && (
        <img
          src={game.thumbnail}
          alt={`${game.name} thumbnail`}
          className={`w-full h-40 object-cover rounded-lg mb-4 transition-opacity ${
            isActive ? "opacity-90" : "opacity-100"
          }`}
        />
      )}

      {/* Basic Info */}
      <div className="flex-1">
        <h4 className="text-2xl font-semibold text-gray-800 mb-2 truncate">
          {game.name}
        </h4>
        <p className="text-sm text-gray-500">ID: {game.id}</p>
        <p className="text-sm text-gray-600 mt-1">
          Created: {new Date(game.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Questions: {game.questions?.length || 0}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Total Quiz Duration: {totalDuration} seconds
        </p>

        {/* Show question info only once question #1 has begun */}
        {isShowingQuestionInfo && (
          <div className="p-2 mt-2 border border-gray-300 rounded-md space-y-1 bg-white/50">
            <p className="text-sm text-gray-700">
              Current Question:{" "}
              {Math.min(questionIndex + 1, game.questions.length)} /{" "}
              {game.questions.length}
            </p>
            <p className="text-sm text-gray-700">
              Questions Left: {questionsLeft > 0 ? questionsLeft : 0}
            </p>
            <p className="text-sm text-gray-700">
              Players Joined: {sessionInfo.results?.players?.length ?? 0}
            </p>
            <p className="text-sm">
              Question Duration Left:{" "}
              <span
                className={
                  questionDuration < 4 ? "text-red-400" : "text-gray-700"
                }
              >
                {questionDuration} seconds
              </span>
            </p>
          </div>
        )}

        <p
          className={`mt-1 text-sm ${
            isActive ? "text-green-600 font-semibold" : "text-gray-400"
          }`}
        >
          Status: {isActive ? "Active" : "Inactive"}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-2 mt-4">
        {isActive ? (
          <>
            <div className="flex space-x-2">
              <button
                onClick={handleAdvance}
                className="w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Advance
              </button>
              <button
                onClick={handleEnd}
                className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                End Game
              </button>
            </div>
            <button
              onClick={() => alterPopup(true)}
              className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Session Details
            </button>
          </>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleStart}
              className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Start Game
            </button>
            <button
              onClick={handleInfo}
              id={`details${index+1}`}
              className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Game Details
            </button>
          </div>
        )}
      </div>

      {/* Manual Advance - Last Question Confirm Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 flex justify-center items-start pt-24 z-50 bg-white/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl p-6 rounded-xl border w-[90%] max-w-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Last Question
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This is the last question. Advancing will end the game. Do you
              want to continue?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={confirmAdvanceEnd}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={cancelAdvance}
                className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time-up Popup */}
      {showTimeUpPopup && (
        <div className="fixed inset-0 flex justify-center items-start pt-24 z-50 bg-white/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl p-6 rounded-xl border w-[90%] max-w-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question Duration Finished
            </h2>

            {/* If it's the last question? */}
            {questionIndex >= game.questions.length - 1 ? (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Time is up for the last question! The session will now end.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowTimeUpPopup(false);
                      alterGameSession(game.id, "END");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-300"
                  >
                    Ok
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Time is up for this question! Proceed to the next one?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowTimeUpPopup(false);
                      handleAdvance();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-300"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelTimeUp}
                    className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 transition duration-300"
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
