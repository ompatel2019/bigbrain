import RegisterForm from '../components/RegisterForm'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dbeafe] via-[#fce7f3] to-[#fff7ed] font-[Poppins]">
        <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-3xl shadow-2xl py-8 sm:py-10 max-w-md w-[90%] text-center px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            Welcome 🙋🏾
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Happy to have you here, let&apos;s get you registered.
          </p>
          <div className="px-8 md:px-6 sm:px-4">
            <RegisterForm />
          </div>

          {/* Link to login */}
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
