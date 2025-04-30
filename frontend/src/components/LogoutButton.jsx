const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-5 right-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-pink-500 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
    >
      Log out
    </button>
  )
}
  
export default LogoutButton