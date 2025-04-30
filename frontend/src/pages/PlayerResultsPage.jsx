import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../utils/api";

const PlayerResultsPage = () => {
  const { player_id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API.PLAYER_GET}/${player_id}/results`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          toast.error("Couldn't get results");
          return;
        }

        const data = await res.json();
        setResults(data);
        console.log("Results:", data);
      } catch (error) {
        toast.error(error.message || "Network error");
      }
    };

    fetchResults();
  }, [player_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 font-[Poppins] px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Quiz Results
        </h1>

        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            results.map((res, idx) => {
              const timeTaken =
                res.answeredAt && res.questionStartedAt
                  ? `${Math.round(
                    (new Date(res.answeredAt) -
                        new Date(res.questionStartedAt)) /
                        1000
                  )}s`
                  : "-";

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="w-full sm:w-1/3 text-gray-700 font-medium mb-2 sm:mb-0">
                    Question {idx + 1}
                  </div>

                  <div className="w-full sm:w-1/3 flex justify-center sm:justify-end space-x-2 text-sm font-semibold">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                      Time: {timeTaken}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">
                      Points: {res.correct ? 10 : 0}
                    </span>
                  </div>

                  <div className="w-full sm:w-1/3 flex justify-end">
                    {res.answeredAt === null ? (
                      <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Not Answered
                      </span>
                    ) : res.correct ? (
                      <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Correct
                      </span>
                    ) : (
                      <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Incorrect
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerResultsPage;
