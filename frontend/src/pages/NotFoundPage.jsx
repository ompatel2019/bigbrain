import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf2f8] via-[#e0e7ff] to-[#dbeafe] font-[Poppins]">
      <div className="text-center px-6 py-12 space-y-4">
        <AlertTriangle size={72} className="mx-auto text-pink-600 mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Oops! Page not found.
        </h1>
        <p className="text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-md shadow-md transition-all duration-200"
        >
          Go back
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
