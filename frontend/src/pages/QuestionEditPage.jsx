import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function QuestionEditPage({ games, handleEdit }) {
  const { game_id, question_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaImage, setMediaImage] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [isMedia, setIsMedia] = useState(false);

  const game = games.find(g => g.id === parseInt(game_id));
  const existingQuestion = game.questions.find(
    q => q.id === parseInt(question_id)
  );
  
  useEffect(() => {
    if (!game) return;
    if (!existingQuestion) return;

    // Set state from existing data
    setType(existingQuestion.type);
    setQuestion(existingQuestion.question);
    setAnswer(existingQuestion.answer);
    setPoints(existingQuestion.points);
    setDuration(existingQuestion.duration);
    setOptions(
      existingQuestion.options?.length
        ? existingQuestion.options :
        [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
    );
    setMediaUrl(existingQuestion.mediaUrl);
    setMediaImage(existingQuestion.mediaImage);
    setMediaType(existingQuestion.mediaType);
    setIsMedia(existingQuestion.isMedia);
    setLoading(false);
  }, [game, question_id, location.key]);

  if (!game) return <p>Loading game data...</p>;
  if (!existingQuestion) return <p>Question not found.</p>;
  if (loading || !game) {
    return <p className="p-4 text-gray-600">Loading...</p>;
  }

  const handleOptionChange = (index, key, value) => {
    const updated = [...options];
    updated[index][key] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const updated = [...options];
      updated.splice(index, 1);
      setOptions(updated);
    }
  };

  const handleQuestionDelete = () => {
    const updatedQuestions = game.questions.filter(q => q.id !== parseInt(question_id));
    const updatedGame = { ...game, questions: [...updatedQuestions] };

    handleEdit(updatedGame);
    navigate(`/game/${game.id}`);
  }

  const handleMediaUrlChange = (value) => {
    setMediaUrl(value);
    setMediaImage(null); // only allow one
    setMediaType('video');
    setIsMedia(true);
  };
  
  
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaImage(reader.result);
      setMediaUrl('');
      setMediaType(file.name); // or just 'image'
      setIsMedia(true);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveMedia = () => {
    setMediaUrl('');
    setMediaImage(null);
    setMediaType('');
    setIsMedia(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedQuestion = {
      ...existingQuestion,
      id: parseInt(question_id),
      type,
      question,
      points,
      duration,
      answer: type === 'judgement'
        ? answer
        : type === 'single'
          ? options.find(opt => opt.isCorrect)?.text || ''
          : options.filter(opt => opt.isCorrect).map(opt => opt.text),
      options: type === 'judgement' ? [] : options,
      isMedia,
      mediaUrl,
      mediaImage,
      mediaType
    };

    const updatedQuestions = game.questions.map(q =>
      q.id === parseInt(question_id) ? {...updatedQuestion} : q
    );

    const updatedGame = { ...game, questions: [...updatedQuestions] };
  
    handleEdit(updatedGame);
    navigate(`/game/${game_id}`);
  };

  const inputClass = 'w-full border px-3 py-2 rounded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fdf2f8] px-6 py-10 font-[Poppins]">
      <button
        onClick={() => navigate(`/game/${game_id}`)}
        className="mb-6 text-blue-600 hover:underline font-medium"
      >
        ← Back to Game
      </button>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 transition-all">
          <h1 className="text-3xl font-bold text-gray-800">Edit Question</h1>
          <br />
          <div>
            <p className="block font-semibold mb-1">Select question type:</p>
            {['multiple', 'single', 'judgement'].map((t) => (
              <label 
                key={t}
                htmlFor={
                  t === 'single'
                    ? 'sc'
                    : t === 'multiple'
                      ? 'mc'
                      : 'jmt'
                }
                className="mr-4"
              >
                <input
                  type="radio"
                  id={
                    t === 'single'
                      ? 'sc'
                      : t === 'multiple'
                        ? 'mc'
                        : 'jmt'
                  }
                  value={t}
                  checked={type === t}
                  onChange={(e) => setType(e.target.value)}
                  className="mr-1"
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>

          <br />
          <div className="mb-4">
            <label className="block font-semibold">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {type === 'judgement' ? (
            <div className="mb-4">
              <label className="block font-semibold">Answer</label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block font-semibold">Answer Options</label>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center mb-2 gap-2">
                  {type === 'multiple' ? (
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) => handleOptionChange(i, 'isCorrect', e.target.checked)}
                    />
                  ) : (
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => {
                        setOptions(options.map((o, idx) => ({
                          ...o,
                          isCorrect: idx === i
                        })));
                      }}
                    />
                  )}
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(i, 'text', e.target.value)}
                    className={inputClass}
                    placeholder={`Option ${i + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <button type="button" onClick={() => handleRemoveOption(i)} className="text-red-500">✕</button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button type="button" onClick={handleAddOption} className="text-blue-600 text-sm font-medium mt-1">
                  + Add Option (Ensure to select the correct option)
                </button>
              )}
            </div>
          )}

          {/* this is where it goes */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Attach Media (Optional)</label>

            {/* Buttons only shown when nothing attached */}
            {!mediaUrl && !mediaImage && (
              <div className="flex gap-2">
                <button
                  type="button"
                  id="addYouTube"
                  onClick={() => handleMediaUrlChange(' ')}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add YouTube URL
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById(`mediaUpload`).click()}
                  className="text-purple-500 hover:text-purple-700 text-sm"
                >
                  + Upload Image
                </button>
              </div>
            )}

            {/* YouTube URL input */}
            {mediaUrl && (
              <div className="mt-2">
                <input
                  type="url"
                  id="UrlInput"
                  placeholder="https://youtube.com/..."
                  value={mediaUrl}
                  onChange={(e) => handleMediaUrlChange(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia()}
                  className="text-red-500 ml-2 text-sm"
                >
                  Remove URL
                </button>
              </div>
            )}

            {/* Hidden file input for uploading image */}
            <input
              type="file"
              accept="image/*"
              id={`mediaUpload`}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImageUpload(file);
              }}
            />

            {/* Image preview */}
            {mediaImage && (
              <div className="mt-2">
                <img src={mediaImage} alt="Preview" className="w-40 h-auto rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia()}
                  className="text-red-500 text-sm mt-1"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold">Points</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className={inputClass}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Duration</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={inputClass}
              required
            />
          </div>

          <button
            onClick={handleQuestionDelete}
            type="button"
            id="deleteQuestion"
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Delete Question
          </button>

        
        </div>

        <button
          type="submit"
          id="saveChanges"
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}