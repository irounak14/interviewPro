import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import gsap from 'gsap'

export default function HRLogin() {
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const glow1 = useRef(null)
  const glow2 = useRef(null)
  const recaptchaRef = useRef(null)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // 🚀 GSAP Animations
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1
    })

    gsap.from(cardRef.current, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    })

    // floating glows
    gsap.to(glow1.current, {
      x: 40,
      y: 30,
      duration: 6,
      repeat: -1,
      yoyo: true
    })

    gsap.to(glow2.current, {
      x: -30,
      y: -20,
      duration: 7,
      repeat: -1,
      yoyo: true
    })
  }, [])

  // 🧲 Magnetic effect
  const handleMagnet = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(e.currentTarget, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3
    })
  }

  const resetMagnet = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.3 })
  }

  // 🧊 3D Tilt
  const handleTilt = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const rotateX = -(y / rect.height - 0.5) * 10
    const rotateY = (x / rect.width - 0.5) * 10

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      transformOrigin: "center",
      duration: 0.3
    })
  }

  const resetTilt = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0 })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!captchaVerified) return setError('Verify captcha')

    try {
      const endpoint = isRegister ? 'register' : 'login'
      const payload = isRegister
        ? { ...form, role: 'hr' }
        : { email: form.email, password: form.password }

      const res = await axios.post(
        `https://interviewpro-api.onrender.com/api/auth/${endpoint}`,
        payload
      )

      localStorage.setItem('token', res.data.token)
      navigate('/hr/portal')
    } catch (err) {
      setError('Error')
    }
  }

  const handleGoogle = () => {
    window.location.href =
      "https://interviewpro-api.onrender.com/auth/google?role=hr"
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden"
    >

      {/* 🌌 Parallax Glow */}
      <div ref={glow1}
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{ background: 'rgba(0,255,200,0.1)', top: '-10%', right: '-10%' }}
      />
      <div ref={glow2}
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: 'rgba(124,58,237,0.1)', bottom: '-10%', left: '-10%' }}
      />

      {/* 🧊 Glass Card */}
      <div
        ref={cardRef}
        className="w-[420px] p-8 rounded-2xl backdrop-blur-xl border border-white/10"
        style={{
          background: "rgba(255,255,255,0.05)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          {isRegister ? "Create HR Account" : "Welcome Back"}
        </h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 rounded bg-black/40 border border-white/10 focus:border-teal-400 outline-none transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 rounded bg-black/40 border border-white/10 focus:border-teal-400 outline-none transition"
          />

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            theme="dark"
            onChange={(token) => setCaptchaVerified(!!token)}
          />

          {/* 🔥 Submit Button */}
          <button
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
            className="p-3 rounded bg-teal-600 font-bold hover:bg-teal-500 transition"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          {/* 🔥 Google Button */}
          <button
            type="button"
            onClick={handleGoogle}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
            className="p-3 rounded flex items-center justify-center gap-2 bg-white text-black font-semibold hover:scale-105 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" />
            Continue with Google
          </button>

        </form>

        <p
          className="text-center mt-6 cursor-pointer text-teal-400"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already have account?" : "Create account"}
        </p>
      </div>
    </div>
  )
}