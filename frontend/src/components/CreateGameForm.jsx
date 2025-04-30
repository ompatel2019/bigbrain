import { useState } from 'react';

export default function CreateGameForm({ onClose, games, handleGameAdd }) {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbName, setThumbName] = useState('');
  const [questions, setQuestions] = useState(
    [{ 
      id: Math.floor(Math.random() * 10000000), 
      type: 'judgement', 
      question: '',
      answer: '', 
      points: '', 
      duration: '', 
      options: [],
      isMedia: false,
      mediaUrl: '',
      mediaImage: null,
      mediaType: ''
    }]
  );

  const handleAddQuestion = () => {
    if (questions.length < 10) {
      setQuestions(
        [
          ...questions, 
          {
            id: Math.floor(Math.random() * 10000000), 
            type: 'judgement', 
            question: '', 
            answer: '', 
            points: '', 
            duration: '', 
            options: [],
            isMedia: false,
            mediaUrl: '',
            mediaImage: null,
            mediaType: ''
          }]
      );
    }
  };

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
  
    // Auto-fill 2 empty options when changing to a choice type
    if (key === 'type' && (value === 'single' || value === 'multiple')) {
      updated[index].options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
      updated[index].answer = ''; // Clear free-form answer
    }
  
    // Clear out options for judgement
    if (key === 'type' && value === 'judgement') {
      updated[index].options = [];
    }
  
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, key, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex][key] = value;
    setQuestions(updated);
  };

  const handleMediaUrlChange = (index, value) => {
    const updated = [...questions];
    updated[index].mediaUrl = value;
    updated[index].mediaImage = null; // only one type allowed
    updated[index].mediaType = 'video';
    updated[index].isMedia = true;
    setQuestions(updated);
  };
  
  const handleImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...questions];
      updated[index].mediaImage = reader.result;
      updated[index].mediaUrl = ''; // only one type allowed
      updated[index].mediaType = file.name;
      updated[index].isMedia = true;
      setQuestions(updated);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveMedia = (index) => {
    const updated = [...questions];
    updated[index].mediaUrl = '';
    updated[index].mediaImage = null;
    updated[index].mediaType = '';
    updated[index].isMedia = false;
    setQuestions(updated);
  };
  
  
  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length < 6) {
      updated[qIndex].options.push({ text: '', isCorrect: false });
      setQuestions(updated);
    }
  };
  
  const handleRemoveOption = (qIndex, optIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(optIndex, 1);
      setQuestions(updated);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const base64Thumb = thumbnail || '';
    const totalDuration = questions.reduce((sum, q) => sum + (Number(q.duration) || 0), 0);

    const newGame = {
      name: title,
      owner: localStorage.getItem('email'),
      thumbnail: base64Thumb,
      createdAt: new Date().toISOString(),
      duration: totalDuration,
      active: null,
      questions
    };

    const allGames = { games: [newGame, ...games] };
    await handleGameAdd(allGames);
    onClose();
  };

  const inputClass = 'w-full border px-3 py-2 rounded';

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h2 className="text-2xl font-bold mb-4">Create New Game</h2>

      <div className="mb-4">
        <label htmlFor="gameTitle" className="block font-semibold">Title</label>
        <input
          id="gameTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Game Thumbnail</label>
        <label className="cursor-pointer inline-block bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded shadow-md transition duration-300">
          Choose File
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = () => {
                setThumbnail(reader.result);
                setThumbName(file.name);
              };
            }}
            className="hidden"
          />
        </label>
        {thumbName && <p className="mt-2 text-sm text-gray-600">{thumbName}</p>}
      </div>

      {questions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <div>
            <p className="block font-semibold mb-1">Select question type:</p>
            <label htmlFor={`mc${idx}`} className="mr-4">
              <input
                type="radio"
                id={`mc${idx}`}
                name={`question-type-${idx}`}
                value="multiple"
                checked={q.type === 'multiple'}
                onChange={(e) => handleQuestionChange(idx, 'type', e.target.value)}
                className="mr-1"
              />
              Multiple Choice
            </label>
            <label htmlFor={`sc${idx}`} className="mr-4">
              <input
                type="radio"
                id={`sc${idx}`}
                name={`question-type-${idx}`}
                value="single"
                checked={q.type === 'single'}
                onChange={(e) => handleQuestionChange(idx, 'type', e.target.value)}
                className="mr-1"
              />
              Single Choice
            </label>
            <label htmlFor={`jmt${idx}`}>
              <input
                type="radio"
                id={`jmt${idx}`}
                name={`question-type-${idx}`}
                value="judgement"
                checked={q.type === 'judgement'}
                onChange={(e) => handleQuestionChange(idx, 'type', e.target.value)}
                className="mr-1"
              />
              Judgement
            </label>
          </div>
          <br></br>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`question${idx+1}`} className="block font-semibold mb-1 text-center">
                Question {idx + 1}
              </label>
              <textarea
                id={`question${idx+1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                className={`${inputClass} h-28`}
                required
              />
            </div>
            {q.type === 'judgement' ? (
              <div className="flex-1">
                <label htmlFor={`answer${idx+1}`} className="block font-semibold mb-1 text-center">Answer</label>
                <textarea
                  id={`answer${idx+1}`}
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                  className={`${inputClass} h-28`}
                  required
                />
              </div>
            ) : (
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-center">Answer Options</label>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center mb-2 gap-2">
                    {q.type === 'multiple' ? (
                      <input
                        type="checkbox"
                        checked={opt.isCorrect}
                        onChange={(e) => handleOptionChange(idx, optIdx, 'isCorrect', e.target.checked)}
                      />
                    ) : (
                      <input
                        type="radio"
                        name={`correct-option-${idx}`}
                        checked={opt.isCorrect}
                        onChange={() => {}} // prevents React warning
                        onClick={() => {
                          const updated = [...questions];
                          if (opt.isCorrect) {
                            updated[idx].options[optIdx].isCorrect = false;
                          } else {
                            updated[idx].options = updated[idx].options.map((o, i) => ({
                              ...o,
                              isCorrect: i === optIdx
                            }));
                          }
                          setQuestions(updated);
                        }}
                      />
                    )}
                    <input
                      type="text"
                      value={opt.text}
                      id={`Option-q${idx+1}-${optIdx+1}`}
                      onChange={(e) => handleOptionChange(idx, optIdx, 'text', e.target.value)}
                      className={`${inputClass}`}
                      placeholder={`Option ${optIdx + 1}`}
                      required
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx, optIdx)}
                        className="text-red-500 font-semibold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {q.options.length < 6 && (
                  <button
                    type="button"
                    id={`addOptions${idx+1}`}
                    onClick={() => handleAddOption(idx)}
                    className="text-blue-600 text-sm font-medium mt-1"
                  >
                    + Add Option (ensure to select the correct option)
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Attach Media (Optional)</label>

            {/* Buttons only shown when nothing attached */}
            {!q.mediaUrl && !q.mediaImage && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMediaUrlChange(idx, ' ')}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add YouTube URL
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById(`mediaUpload-${idx}`).click()}
                  className="text-purple-500 hover:text-purple-700 text-sm"
                >
                  + Upload Image
                </button>
              </div>
            )}

            {/* YouTube URL input */}
            {q.mediaUrl && (
              <div className="mt-2">
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={q.mediaUrl}
                  onChange={(e) => handleMediaUrlChange(idx, e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(idx)}
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
              id={`mediaUpload-${idx}`}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImageUpload(idx, file);
              }}
            />

            {/* Image preview */}
            {q.mediaImage && (
              <div className="mt-2">
                <img src={q.mediaImage} alt="Preview" className="w-40 h-auto rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(idx)}
                  className="text-red-500 text-sm mt-1"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor={`duration${idx+1}`} className="block font-semibold">Duration (in seconds)</label>
            <input
              id={`duration${idx+1}`}
              type="number"
              value={q.duration}
              onChange={(e) => handleQuestionChange(idx, 'duration', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="mb-4">
            <label htmlFor={`points${idx+1}`} className="block font-semibold">Number of Points</label>
            <input
              id={`points${idx+1}`}
              type="number"
              value={q.points}
              onChange={(e) => handleQuestionChange(idx, 'points', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-4 mt-6 mb-4">
        {questions.length < 10 && (
          <button
            type="button"
            id="addQuestion"
            onClick={handleAddQuestion}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
          >
            Add Question
          </button>
        )}
        {questions.length > 1 && (
          <button
            type="button"
            onClick={() => setQuestions(questions.slice(0, -1))}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-orange-400 hover:to-yellow-500 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
          >
            Remove Last Question
          </button>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gradient-to-r from-slate-500 to-gray-700 hover:from-gray-700 hover:to-slate-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="submitGameForm"
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
