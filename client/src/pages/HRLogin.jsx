import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function HRLogin() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const endpoint = isRegister ? 'register' : 'login'
      const payload = isRegister
        ? { ...form, role: 'hr' }
        : { email: form.email, password: form.password }

      const res = await axios.post(`https://interviewpro-api.onrender.com/api/auth/${endpoint}`, payload)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/hr/portal')

    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4">

      <div className="absolute top-0 left-0 w-full px-8 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-white">Interview</span>
          <span className="text-teal-500">Pro</span>
        </h1>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1">
          {isRegister ? 'HR Registration' : 'HR Login'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">Access the Talent Discovery Portal</p>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              name="name" placeholder="Full Name"
              value={form.name} onChange={handleChange}
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
              required
            />
          )}
          <input
            name="email" type="email" placeholder="Work Email"
            value={form.email} onChange={handleChange}
            className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            required
          />
          <input
            name="password" type="password" placeholder="Password"
            value={form.password} onChange={handleChange}
            className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            required
          />

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {isRegister ? 'Create HR Account' : 'Login'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          {isRegister ? 'Already registered?' : "New HR account?"}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-teal-400 cursor-pointer ml-1 hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  )
}