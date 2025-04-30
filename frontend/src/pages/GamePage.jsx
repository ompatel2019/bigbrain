import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GamePage({ games, handleDelete, handleEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbName, setThumbName] = useState('');

  const game = games.find(g => g.id === Number(id));

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Game not found</p>
        <Link
          to="/dashboard"
          className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-md shadow-md transition-all duration-200"
        >
          Go back
        </Link>
      </div>
    );
  }

  const totalDuration = game.questions?.reduce((sum, q) => sum + (q.duration || 0), 0) || 0;

  const onDelete = () => {
    handleDelete(game.id);
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const base64Thumb = thumbnail || '';
    const updatedGame = {
      ...game,
      name: title || game.name,
      thumbnail: base64Thumb || game.thumbnail,
    };

    handleEdit(updatedGame);
    setEdit(false);
  };

  const inputClass = 'w-full border px-3 py-2 rounded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fdf2f8] px-6 py-10 font-[Poppins]">
      <button
        id="toDashboard"
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-blue-600 hover:underline font-medium"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 transition-all">
        {game.thumbnail && (
          <img
            src={game.thumbnail}
            alt="Game Thumbnail"
            className="w-full h-60 object-cover rounded-md mb-6"
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {edit ? 'Update Game Meta Data' : game.name}
          </h2>
        </div>

        {/* Slide-down edit form */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            edit ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <form onSubmit={handleSubmit} className="mb-6">

            <div className="mb-4">
              <label className="block font-semibold">New Title</label>
              <input
                type="text"
                id="newTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder={game.name}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">New Thumbnail</label>
              <label className="cursor-pointer inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded shadow transition duration-300">
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

            <button
              type="submit"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-500 mb-2">ID: {game.id}</p>
        <p className="text-md text-gray-700 mb-2">
          Created: {new Date(game.createdAt).toLocaleDateString()}
        </p>
        <p className="text-md text-gray-700 mb-2">
          Total Questions: {game.questions?.length || 0}
        </p>
        <p className="text-md text-gray-700 mb-2">
          Total Duration: {totalDuration} seconds
        </p>
        <p className={`text-md ${game.active ? 'text-green-600' : 'text-gray-400'}`}>
          Status: {game.active ? 'Active' : 'Inactive'}
        </p>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Questions</h3>
        <ul className="space-y-4">
          {game.questions?.map((q, i) => (
            <li
              key={i}
              className="bg-gray-100 p-4 rounded-md border-l-4 border-blue-500 shadow-sm"
            >
              <p className="font-semibold">Q{i + 1}: {q.question}</p>
              <p className="text-gray-600">Answer: {q.answer}</p>
              <p className="text-gray-500 text-sm">Duration: {q.duration} seconds</p>
              <p className="hover:underline cursor-pointer" id={`edit${i+1}`} onClick={() => navigate(`question/${q.id}`)}>Edit</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-4 justify-start">
          <button
            onClick={onDelete}
            type="button"
            id="deleteQuiz"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Delete Quiz
          </button>
          <button
            onClick={() => setEdit(prev => !prev)}
            type="button"
            id="editGame"
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            {edit ? 'Cancel' : 'Edit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
