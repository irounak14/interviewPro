import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'

export default function CandidateLogin() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })
  const recaptchaRef = useRef(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!captchaVerified) {
      setError('Please verify you are not a robot.')
      return
    }
    try {
      const endpoint = isRegister ? 'register' : 'login'
      const payload = isRegister
        ? { ...form, role: 'candidate' }
        : { email: form.email, password: form.password }

      const res = await axios.post(`https://interviewpro-api.onrender.com/api/auth/${endpoint}`, payload)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/candidate/subjects')
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
      recaptchaRef.current?.reset()
      setCaptchaVerified(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'https://interviewpro-api.onrender.com/api/auth/google'
  }

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.06)' }} />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'rgba(41,161,149,0.05)' }} />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div onClick={() => navigate('/')}
            className="text-xl font-bold tracking-tighter text-white uppercase cursor-pointer">
            InterviewPro
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">Need help?</span>
            <button className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              Support
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-xl p-8 flex flex-col gap-6"
            style={{
              background: 'rgba(26,26,26,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>

            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {isRegister ? 'Create Account' : 'Welcome back'}
              </h1>
              <p className="text-zinc-400 text-sm">
                {isRegister
                  ? 'Start your interview journey today'
                  : 'Elevate your performance. Sign in to continue.'}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-lg font-semibold text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-600 text-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-lg text-sm text-red-400"
                style={{ background: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,180,171,0.2)' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {isRegister && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-300 ml-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl"
                      style={{ fontFamily: 'Material Symbols Outlined' }}>person</span>
                    <input name="name" placeholder="John Doe"
                      value={form.name} onChange={handleChange}
                      className="w-full rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none transition-all"
                      style={{ background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                      required />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-300 ml-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl"
                    style={{ fontFamily: 'Material Symbols Outlined' }}>mail</span>
                  <input name="email" type="email" placeholder="name@company.com"
                    value={form.email} onChange={handleChange}
                    className="w-full rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none transition-all"
                    style={{ background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                    required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-300 ml-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl"
                    style={{ fontFamily: 'Material Symbols Outlined' }}>lock</span>
                  <input name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                    className="w-full rounded-lg py-3.5 pl-12 pr-12 text-white placeholder-zinc-600 focus:outline-none transition-all"
                    style={{ background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl"
                      style={{ fontFamily: 'Material Symbols Outlined' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-300 ml-1 uppercase tracking-wider">
                    City
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl"
                      style={{ fontFamily: 'Material Symbols Outlined' }}>location_on</span>
                    <input name="location" placeholder="e.g. Delhi"
                      value={form.location} onChange={handleChange}
                      className="w-full rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none transition-all"
                      style={{ background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
              )}

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  theme="dark"
                  onChange={(token) => setCaptchaVerified(!!token)}
                  onExpired={() => setCaptchaVerified(false)}
                />
              </div>

              <button type="submit"
                disabled={!captchaVerified}
                className="w-full py-4 text-white font-semibold uppercase tracking-widest rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                style={captchaVerified ? {
                  background: '#7c3aed',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.4)'
                } : {
                  background: 'rgba(124,58,237,0.3)',
                  cursor: 'not-allowed'
                }}>
                {isRegister ? 'Create Account' : 'Login'}
                <span className="material-symbols-outlined text-sm"
                  style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center text-zinc-500 text-sm">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
              <span
                onClick={() => { setIsRegister(!isRegister); setError(''); setCaptchaVerified(false); recaptchaRef.current?.reset() }}
                className="text-violet-400 hover:text-violet-300 font-semibold ml-1 cursor-pointer transition-colors">
                {isRegister ? 'Sign in' : 'Register for free'}
              </span>
            </p>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5" style={{ background: '#09090b' }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-4">
          <div className="text-sm font-bold text-white uppercase tracking-tighter">InterviewPro</div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map(item => (
              <a key={item} href="#"
                className="text-xs uppercase font-semibold text-zinc-500 hover:text-violet-400 transition-colors tracking-wide">
                {item}
              </a>
            ))}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide">2026 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}