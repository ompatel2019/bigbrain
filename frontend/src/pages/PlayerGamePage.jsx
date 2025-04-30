import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../utils/api";

export default function PlayerGamePage({ player }) {
  const { session_id, player_id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState({});
  const questionIdRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [questionEnded, setQuestionEnded] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // On mount, load the current question (if any)
  useEffect(() => {
    loadQuestion();
    return () => clearInterval(timerRef.current);
  }, []);

  // When we set a new question, restart the timer
  useEffect(() => {
    if (!question?.id) return;

    // Clear any old timer
    clearInterval(timerRef.current);
    // Reset local states
    setTimeLeft(question.duration || 0);
    setCorrectAnswer(null);
    setQuestionEnded(false);
    setSelectedOptions([]);
    setTypedAnswer("");

    // Start a fresh timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // As soon as the question loads, fetch any stored answer on the server
    fetchCurrentAnswer();

    return () => {
      clearInterval(timerRef.current);
    };
  }, [question.id]);

  // Poll every .5s to see if the admin advanced the question or if the game ended
  useEffect(() => {
    const pollInterval = setInterval(() => {
      pollQuestionStatus();
    }, 500);

    return () => clearInterval(pollInterval);
  }, []);

  // Poll the question endpoint:
  const pollQuestionStatus = async () => {
    try {
      const res = await fetch(`${API.PLAYER_GET}/${player.playerId}/question`);
      if (!res.ok) {
        // Usually means no question => game ended => go to results
        toast.info("No current question => the session likely ended.");
        navigate(`/play/game/results/${session_id}/${player_id}`);
        return;
      }

      const data = await res.json();
      const polledQ = data.question;
      if (!polledQ?.id) {
        toast.info("No question => navigate to results.");
        navigate(`/play/game/results/${session_id}/${player_id}`);
        return;
      }

      if (polledQ.id !== questionIdRef.current) {
        setQuestion(polledQ);
        questionIdRef.current = polledQ.id;
      }
    } catch (err) {
      console.error("Poll error:", err);
      navigate(`/play/game/results/${session_id}/${player_id}`);
    }
  };

  const loadQuestion = async () => {
    try {
      const res = await fetch(`${API.PLAYER_GET}/${player.playerId}/question`);
      if (!res.ok) {
        toast.info("Game Ended");
        navigate(`/play/game/results/${session_id}/${player_id}`);
        return;
      }
      const data = await res.json();
      setQuestion(data.question);
      questionIdRef.current = data.question?.id || null;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Network error");
    }
  };

  // Fetch the current answer from the server (as soon as a question loads)
  const fetchCurrentAnswer = async () => {
    try {
      const res = await fetch(`${API.PLAYER_GET}/${player.playerId}/answer`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();

      if (Array.isArray(data.answer)) {
        setSelectedOptions(data.answer);
      } else if (typeof data.answer === "string") {
        setTypedAnswer(data.answer);
      }
    } catch (err) {
      console.error("Error fetching current answer:", err);
    }
  };

  const handleTimeEnd = async () => {
    setQuestionEnded(true);
    await fetchCorrectAnswer();
  };

  // Immediately send answer to the server
  const sendAnswerToServer = async (answersArr) => {
    try {
      const body = { answers: answersArr };
      console.log("Sending answer to server =>", body);
      const res = await fetch(`${API.PLAYER_PUT}/${player.playerId}/answer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("PUT /answer error =>", text);
        toast.error("Failed to submit answer");
      }
    } catch (err) {
      console.error("sendAnswerToServer Error =>", err);
      toast.error(err.message || "Network error");
    }
  };

  const handleSelect = (value) => {
    if (questionEnded) return;
    const isMulti = question.type === "multiple";

    setSelectedOptions((prev) => {
      let updated = [];
      if (isMulti) {
        updated = prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      } else {
        updated = [value];
      }
      sendAnswerToServer(updated);
      return updated;
    });
  };

  const handleTypedAnswerChange = (e) => {
    if (questionEnded) return;
    const newVal = e.target.value;
    setTypedAnswer(newVal);
    sendAnswerToServer([newVal]);
  };

  const fetchCorrectAnswer = async () => {
    try {
      const res = await fetch(`${API.PLAYER_GET}/${player.playerId}/answer`);
      if (!res.ok) {
        // Possibly quiz ended
        toast.error("No correct answer found => session ended?");
        navigate(`/play/game/results/${session_id}/${player_id}`);
        return;
      }
      const data = await res.json();
      setCorrectAnswer(data.answer);

      // Just local check => show a toast
      showCorrectnessToast(data.answer);
    } catch (err) {
      console.error("fetchCorrectAnswer error:", err);
      toast.error(err.message || "Network error");
    }
  };

  // If your server automatically scores them, that’s official. This is just UX.
  const showCorrectnessToast = (serverAnswer) => {
    if (!serverAnswer) return;
    console.log(serverAnswer);
    const qType = question.type;
    const userAnswer =
      qType === "judgement" ? [typedAnswer.trim()] : selectedOptions;

    if (qType === "single") {
      if (userAnswer[0] === serverAnswer) {
        toast.success("Correct!");
      } else {
        toast.error(`Wrong. Correct: ${serverAnswer}`);
      }
      return;
    }
    if (qType === "multiple") {
      const userSet = new Set(userAnswer);
      const ansSet = new Set(serverAnswer);
      if (
        userSet.size === ansSet.size &&
        [...userSet].every((v) => ansSet.has(v))
      ) {
        toast.success("All correct answers selected!");
      } else {
        toast.error(`Not quite. Correct answers: ${serverAnswer.join(", ")}`);
      }
      return;
    }
    if (qType === "judgement") {
      const typed = (typedAnswer || "").trim().toLowerCase();
      const correct = (serverAnswer || "").trim().toLowerCase();
      if (typed === correct && typed !== "") {
        toast.success("Your typed answer was correct!");
      } else {
        toast.error(`Incorrect. Correct answer: ${serverAnswer}`);
      }
    }
  };

  // Helpers
  const isSelected = (val) => selectedOptions.includes(val);

  if (!question?.id) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <h2 className="text-2xl font-semibold">Please wait...</h2>
      </div>
    );
  }

  function convertYouTubeUrlToEmbed(url) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }  

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-green-50 via-blue-50 to-pink-50 p-6 font-[Poppins]">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-6">
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold text-blue-600">
            {timeLeft > 0 ? timeLeft : 0}s
          </h2>
          <p className="text-sm text-gray-500">Remaining Time</p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {question.question || "Waiting for question..."}
        </h3>

        {question.isMedia && (
          <div className="mb-6 flex justify-center">
            {question.mediaType === "video" ? (
              <iframe
                src={convertYouTubeUrlToEmbed(question.mediaUrl)}
                title="YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full max-w-xl aspect-video rounded"
              />
            ) : (
              <img
                src={question.mediaImage}
                alt="Question Media"
                className="max-h-64"
              />
            )}
          </div>
        )}

        {question.type === "judgement" ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={typedAnswer}
              onChange={handleTypedAnswerChange}
              disabled={questionEnded}
              placeholder="Type your answer..."
              className="border p-3 rounded-lg w-full max-w-sm text-center"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.text)}
                disabled={questionEnded}
                className={`py-3 px-4 rounded-lg transition-all shadow-md ${
                  isSelected(opt.text)
                    ? "bg-purple-600 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {correctAnswer && (
          <p className="mt-6 text-center font-semibold text-lg">
            Correct Answer:{" "}
            {Array.isArray(correctAnswer)
              ? correctAnswer.join(", ")
              : correctAnswer}
          </p>
        )}
      </div>
    </div>
  );
}
