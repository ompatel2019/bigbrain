import LoginForm from '../components/LoginForm'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#e0f2fe] font-[Poppins]">
      <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-3xl shadow-2xl py-8 sm:py-10 max-w-md w-[90%] text-center px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          Welcome Back! 🫡
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Good to have you back, let’s get you logged in.
        </p>
        <div className="px-8 md:px-6 sm:px-4">
          <LoginForm />
        </div>

        {/* Register Link */}
        <div className="mt-6">
          <Link
            to="/register"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Don’t have an account?
          </Link>
        </div>
        {/* Register Link */}
        <div className="mt-2">
          <Link
            to="/play/join"
            className="text-sm text-amber-600 hover:text-amber-800 font-medium transition duration-200"
          >
            Here to play?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage