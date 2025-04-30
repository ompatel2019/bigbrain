import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { API } from '../utils/api'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loader, setLoader] = useState(false)
  const naviage = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoader(true)

    const user = { email, password }

    try {
      const res = await fetch(`${API.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.')
      } else {
        toast.success('Successfully Logged In!')
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', email)
        setEmail('')
        setPassword('')
        naviage('/dashboard')
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
      aria-label="Login Form"
      onSubmit={handleSubmit}
    >
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
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className={`w-full text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-300 ${
          loader
            ? 'bg-gradient-to-r from-purple-600 to-pink-500'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-pink-500'
        }`}
      >
        {loader ? 'Loading...' : 'Log in'}
      </button>
    </form>
  )
}

export default LoginForm
