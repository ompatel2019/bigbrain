import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { API } from "../utils/api";
import CreateGameForm from "../components/CreateGameForm";
import Spinner from "../tools/Spinner";
import LogoutButton from "../components/LogoutButton";
import WelcomeHeader from "../components/WelcomeHeader";
import GameListSection from "../components/GameListSection";

export default function DashboardPage({
  games,
  handleGameLoad,
  handleDelete,
  handleGameAdd,
  alterGameSession,
  session,
  resultsPopup,
  setResultsPopup,
  advance,
  getSessionDetails
}) {
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    setLoader(true);
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    handleGameLoad();
    setLoader(false);
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API.LOGOUT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
      } else {
        toast.success("Successfully Logged Out!");
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Network error.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fdf2f8] font-[Poppins] px-6 py-6">
      <LogoutButton onClick={handleLogout} />
      <WelcomeHeader />

      {loader ? (
        <Spinner loading={loader} />
      ) : (
        <>
          <GameListSection
            games={games}
            onCreate={() => setShowModal(true)}
            handleDelete={handleDelete}
            alterGameSession={alterGameSession}
            session={session}
            resultsPopup={resultsPopup}
            setResultsPopup={setResultsPopup}
            advance={advance}
            getSessionDetails={getSessionDetails}
          />

          {showModal && (
            <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-xl overflow-y-auto max-h-[90vh] shadow-2xl">
                <CreateGameForm
                  onClose={() => setShowModal(false)}
                  games={games}
                  handleGameAdd={handleGameAdd}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
