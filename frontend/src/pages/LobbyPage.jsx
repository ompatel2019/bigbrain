import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../utils/api";
import { toast } from "react-toastify";

export default function LobbyPage({ player }) {
  const navigate = useNavigate();
  const { session_id } = useParams();

  const handleGoBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API.PLAYER_GET}/${player.playerId}/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          toast.error("Could not get game status");
          return;
        }

        const data = await res.json();
        console.log("Polling status:", data);

        if (data.started === true) {
          toast.success("Game has started!");
          clearInterval(interval);
          navigate(`/play/game/${session_id}/${player.playerId}`);
        }
      } catch (error) {
        toast.error(error.message || "Network Error");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player.playerId, navigate, session_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fdf2f8] font-[Poppins] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Waiting Lobby
        </h1>
        <p className="text-gray-600 text-center mb-6">
          You have joined session{" "}
          <span className="font-semibold">{session_id}</span>!
        </p>
        <p className="text-gray-600 text-center">
          Once the admin starts the game, you’ll automatically move to the game
          screen.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-medium py-2 rounded shadow-md transition duration-300"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
