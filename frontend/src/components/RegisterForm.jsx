import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../utils/api'

const RegisterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoader(true)
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!')
      setLoader(false)
      return
    }
  
    const user = { name, email, password }
  
    try {
      const res = await fetch(`${API.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.')
      } else {
        toast.success('Successfully Registered!')
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', email)
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Network error.')
    } finally {
      setLoader(false)
    }
  }
  
  const inputClass = 'w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm'

  return (
    <form
      className="font-[Poppins] space-y-6"
      aria-label="Register Form"
      onSubmit={handleSubmit}
    >
      {/* Name input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-left text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className={inputClass}
        />
      </div>

      {/* Email input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-left text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      {/* Password input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-left text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {/* Confirm Password input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-left text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          aria-label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className={`w-full text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-300 ${
          loader
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
            : 'bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-600'
        }`}
      >
        {loader ? 'Loading...' : 'Register'}
      </button>
    </form>
  )
}

export default RegisterForm
