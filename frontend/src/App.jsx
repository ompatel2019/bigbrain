import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { API } from "./utils/api";
import Fallback from "./tools/Fallback";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SessionResultsPage = lazy(() => import("./pages/SessionResultsPage"));
const PlayerJoinPage = lazy(() => import("./pages/PlayerJoinPage"));
const LobbyPage = lazy(() => import("./pages/LobbyPage"));
const PlayerJoinFromSessionPage = lazy(() =>
  import("./pages/PlayerJoinFromSessionPage")
);
const PlayerResultsPage = lazy(() =>
  import("./pages/PlayerResultsPage")
);
const QuestionEditPage = lazy(() => import("./pages/QuestionEditPage"));
const PlayerGamePage = lazy(() => import("./pages/PlayerGamePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const [games, setGames] = useState([]);
  const [resultsPopup, setResultsPopup] = useState(false);
  const [session, setSession] = useState({});
  const [advance, setAdvance] = useState({});
  // const [sessionResults, setSessionResults] = useState({});
  const [player, setPlayer] = useState({});

  // Restore player from localStorage
  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");
    if (storedPlayer) {
      setPlayer(JSON.parse(storedPlayer));
    }
  }, []);

  // Fetch all games on mount
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const fetchGames = async () => {
        try {
          const res = await fetch(API.GET_GAMES, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!res.ok) {
            toast.error("Error loading games");
            return;
          }
          const data = await res.json();
          setGames(data.games);
        } catch (err) {
          toast.error("Network error while fetching games", err);
        }
      };
      fetchGames();
    }
  }, []);

  const getSessionDetails = async (session_id) => {
    try {
      const res = await fetch(`${API.GET_SESSION}/${session_id}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        toast.error("Error getting session status");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      toast.error("Network error while fetching game status", error);
    }
  };

  const handleGameAdd = async (newGamesObj) => {
    try {
      const res = await fetch(API.PUT_GAMES, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newGamesObj),
      });

      if (!res.ok) {
        toast.error("Error adding game");
      } else {
        toast.success("Game Added Successfully");
        const fetchUpdated = await fetch(API.GET_GAMES, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const updated = await fetchUpdated.json();
        setGames(updated.games);
      }
    } catch (error) {
      toast.error(error.message || "Network Error");
    }
  };

  const handleGameLoad = async() => {
    try {
      const fetchUpdated = await fetch(API.GET_GAMES, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!fetchUpdated.ok) {
        toast.error("Error loading games");
      } else {
        const updated = await fetchUpdated.json();
        setGames(updated.games);
      }
    } catch (error) {
      toast.error(error.message || "Network Error");
    }
  }; 

  const handleDelete = async (gameId) => {
    const updatedGames = games.filter((g) => g.id !== gameId);
    const newGamesObj = { games: updatedGames };

    try {
      const res = await fetch(API.PUT_GAMES, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newGamesObj),
      });

      if (!res.ok) {
        toast.error("Error deleting game");
      } else {
        toast.success("Game Deleted Successfully");
        setGames(updatedGames);
      }
    } catch (error) {
      toast.error(error.message || "Network Error");
    }
  };

  const handleEdit = async (updatedGame) => {
    const updatedGames = games.map((g) =>
      g.id === updatedGame.id ? updatedGame : g
    );

    const newGamesObj = { games: updatedGames };

    try {
      const res = await fetch(API.PUT_GAMES, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newGamesObj),
      });

      if (!res.ok) {
        toast.error("Error updating game");
      } else {
        toast.success("Game Updated Successfully");
        setGames(updatedGames);
      }
    } catch (error) {
      toast.error(error.message || "Network Error");
    }
  };

  const alterGameSession = async (gameId, mutationType) => {
    if (session.sessionId && mutationType === "START") {
      toast.error("Can only have ONE session active at one time");
      return;
    }

    try {
      const res = await fetch(`${API.MUTATE_GAME}/${gameId}/mutate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mutationType }),
      });

      if (!res.ok) {
        toast.error("Error mutating game session");
        return;
      }

      const data = await res.json();
      const sessionData = data.data;

      if (mutationType === "END") {
        setResultsPopup(true);
        toast.success("Game Ended Successfully");
        setSession({});
      } else if (mutationType === "START") {
        toast.success("Game Started Successfully");
        setSession(sessionData);
        localStorage.setItem("latestSession", JSON.stringify(sessionData));
      } else if (mutationType === "ADVANCE") {
        console.log("here");
        console.log(sessionData);
        setAdvance(sessionData);
        return;
      }

      const updatedGames = games.map((g) =>
        g.id === gameId ? { ...g, active: sessionData.sessionId } : g
      );

      setGames(updatedGames);
    } catch (error) {
      toast.error(error.message || "Network Error");
    }
  };

  // const getSessionResults = async () => {
  //   try {
  //     const res = await fetch(
  //       `${API.GET_SESSION}/${session.sessionId}/results`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     if (!res.ok) {
  //       toast.error("Error getting session results");
  //       return;
  //     }

  //     const data = await res.json();
  //     setSessionResults(data.data);
  //   } catch (error) {
  //     toast.error(error.message || "Network Error");
  //   }
  // };

  const registerPlayer = async (name, session_id) => {
    try {
      const res = await fetch(`${API.PLAYER}/${session_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        toast.error("Unable to join game");
        return;
      }

      const data = await res.json();
      const newPlayer = {
        name,
        playerId: data.playerId,
        sessionId: session_id,
      };
      setPlayer(newPlayer);
      localStorage.setItem("player", JSON.stringify(newPlayer));
    } catch (error) {
      toast.error(error.message || "Network Error");
    }
  };

  return (
    <Suspense fallback={<Fallback />}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="dashboard"
              element={
                <DashboardPage
                  games={games}
                  handleGameLoad={handleGameLoad}
                  handleDelete={handleDelete}
                  handleGameAdd={handleGameAdd}
                  alterGameSession={alterGameSession}
                  resultsPopup={resultsPopup}
                  setResultsPopup={setResultsPopup}
                  session={session}
                  advance={advance}
                  getSessionDetails={getSessionDetails}
                />
              }
            />
            <Route
              path="game/:id"
              element={
                <GamePage
                  games={games}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              }
            />
            <Route
              path="game/:game_id/question/:question_id"
              element={
                <QuestionEditPage games={games} handleEdit={handleEdit} />
              }
            />
            <Route
              path="session/:session_id"
              element={<SessionResultsPage />}
            />
            <Route
              path="play/join/:session_id"
              element={<PlayerJoinPage registerPlayer={registerPlayer} />}
            />
            <Route path="play/join" element={<PlayerJoinFromSessionPage />} />
            <Route
              path="lobby/:session_id"
              element={<LobbyPage player={player} />}
            />
            <Route
              path="lobby/:session_id"
              element={<LobbyPage player={player} />}
            />
            <Route
              path="play/game/:session_id/:player_id"
              element={<PlayerGamePage player={player}/>}
            />
            <Route
              path="play/game/results/:session_id/:player_id"
              element={<PlayerResultsPage player={player}/>}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-left" autoClose={1000} pauseOnHover />
    </Suspense>
  );
}
