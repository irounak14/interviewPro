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
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const navRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const googleBtnRef = useRef(null)
  const dividerRef = useRef(null)
  const formRef = useRef(null)
  const toggleRef = useRef(null)
  const recaptchaRef = useRef(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGoogleLogin = () => {
    window.location.href = 'https://interviewpro-api.onrender.com/api/auth/google'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!captchaVerified) {
      setError('Please verify you are not a robot.')
      gsap.to(cardRef.current, { x: -10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' })
      return
    }
    try {
      const endpoint = isRegister ? 'register' : 'login'
      const payload = isRegister
        ? { ...form, role: 'hr' }
        : { email: form.email, password: form.password }

      const res = await axios.post(`https://interviewpro-api.onrender.com/api/auth/${endpoint}`, payload)

      // ✅ Save BOTH token AND user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // Check role before redirecting
      if (res.data.user.role !== 'hr') {
        setError('This account is not an HR account. Please use Candidate login.')
        localStorage.clear()
        return
      }

      gsap.to(cardRef.current, {
        scale: 0.95, opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
        onComplete: () => navigate('/hr/portal')
      })
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
      gsap.to(cardRef.current, { x: -10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' })
      recaptchaRef.current?.reset()
      setCaptchaVerified(false)
    }
  }

  const handleToggle = () => {
    gsap.to(formRef.current, {
      opacity: 0, y: -10, duration: 0.2,
      onComplete: () => {
        setIsRegister(!isRegister)
        setError('')
        setCaptchaVerified(false)
        recaptchaRef.current?.reset()
        gsap.to(formRef.current, { opacity: 1, y: 0, duration: 0.3, delay: 0.05 })
      }
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Floating orbs
      gsap.to(orb1Ref.current, {
        y: -40, x: 20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
      })
      gsap.to(orb2Ref.current, {
        y: 30, x: -20, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
      })

      // Nav
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      // Main timeline
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(cardRef.current,
        { y: 60, opacity: 0, scale: 0.9, rotateX: 10 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4'
      )
      .fromTo(subtitleRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3'
      )
      .fromTo(googleBtnRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2'
      )
      .fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1'
      )
      .fromTo(formRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.1'
      )
      .fromTo(toggleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }, '-=0.1'
      )

      // 3D Card tilt
      cardRef.current.addEventListener('mousemove', (e) => {
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsap.to(cardRef.current, {
          rotateY: x / 40, rotateX: -y / 40,
          transformPerspective: 1000, duration: 0.4, ease: 'power2.out'
        })
      })
      cardRef.current.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div ref={orb1Ref}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.12)' }} />
        <div ref={orb2Ref}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'rgba(124,58,237,0.08)' }} />
      </div>

      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      {/* Navbar */}
      <header ref={navRef}
        className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(20px)', opacity: 0 }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-16">
          <div onClick={() => navigate('/')}
            className="text-lg font-black tracking-tighter text-white uppercase cursor-pointer hover:text-teal-400 transition-colors">
            Interview<span style={{ color: '#0d9488' }}>Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">Need help?</span>
            <button className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition-all border border-white/10 hover:border-white/20">
              Support
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md" style={{ perspective: '1000px' }}>
          <div ref={cardRef}
            className="rounded-2xl p-8 flex flex-col gap-5 relative"
            style={{
              background: 'rgba(15,15,15,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              transformStyle: 'preserve-3d',
              opacity: 0
            }}>

            {/* Top glow line */}
            <div className="absolute top-0 left-8 right-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.6), transparent)' }} />

            {/* HR Badge */}
            <div className="flex justify-center">
              <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest"
                style={{ background: 'rgba(13,148,136,0.15)', color: '#6bd8cb', border: '1px solid rgba(13,148,136,0.3)' }}>
                HR Portal
              </span>
            </div>

            {/* Header */}
            <div className="text-center space-y-1.5">
              <h1 ref={titleRef} className="text-3xl font-black tracking-tight text-white" style={{ opacity: 0 }}>
                {isRegister ? 'Create HR Account' : 'Welcome back'}
              </h1>
              <p ref={subtitleRef} className="text-zinc-500 text-sm" style={{ opacity: 0 }}>
                {isRegister ? 'Access the talent discovery portal' : 'Discover and connect with top talent.'}
              </p>
            </div>

            {/* Google Button */}
            <button ref={googleBtnRef}
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                opacity: 0
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { borderColor: 'rgba(13,148,136,0.5)', duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 })}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div ref={dividerRef} className="flex items-center gap-3" style={{ opacity: 0 }}>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-600 text-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,100,100,0.2)' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">

              {isRegister && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-lg"
                      style={{ fontFamily: 'Material Symbols Outlined' }}>person</span>
                    <input name="name" placeholder="John Doe"
                      value={form.name} onChange={handleChange}
                      className="w-full rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => gsap.to(e.currentTarget, { borderColor: 'rgba(13,148,136,0.6)', duration: 0.2 })}
                      onBlur={e => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.08)', duration: 0.3 })}
                      required />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Work Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-lg"
                    style={{ fontFamily: 'Material Symbols Outlined' }}>mail</span>
                  <input name="email" type="email" placeholder="hr@company.com"
                    value={form.email} onChange={handleChange}
                    className="w-full rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => gsap.to(e.currentTarget, { borderColor: 'rgba(13,148,136,0.6)', duration: 0.2 })}
                    onBlur={e => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.08)', duration: 0.3 })}
                    required />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-lg"
                    style={{ fontFamily: 'Material Symbols Outlined' }}>lock</span>
                  <input name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                    className="w-full rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-zinc-700 focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => gsap.to(e.currentTarget, { borderColor: 'rgba(13,148,136,0.6)', duration: 0.2 })}
                    onBlur={e => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.08)', duration: 0.3 })}
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-lg"
                      style={{ fontFamily: 'Material Symbols Outlined' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

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
                className="w-full py-4 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                style={captchaVerified ? {
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  boxShadow: '0 4px 20px rgba(13,148,136,0.4)'
                } : {
                  background: 'rgba(13,148,136,0.15)',
                  cursor: 'not-allowed',
                  color: 'rgba(255,255,255,0.3)'
                }}
                onMouseEnter={e => captchaVerified && gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
                {isRegister ? 'Create Account' : 'Login'}
                <span className="material-symbols-outlined text-sm"
                  style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
              </button>
            </form>

            {/* Toggle */}
            <p ref={toggleRef} className="text-center text-zinc-600 text-sm" style={{ opacity: 0 }}>
              {isRegister ? 'Already have an account?' : 'New HR account?'}
              <span onClick={handleToggle}
                className="font-bold ml-1 cursor-pointer transition-colors hover:opacity-80"
                style={{ color: '#6bd8cb' }}>
                {isRegister ? 'Sign in' : 'Register for free'}
              </span>
            </p>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/5 relative z-10" style={{ background: '#050505' }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-4">
          <div className="text-sm font-black text-white uppercase tracking-tighter">
            Interview<span style={{ color: '#0d9488' }}>Pro</span>
          </div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map(item => (
              <a key={item} href="#"
                className="text-xs uppercase font-bold text-zinc-600 hover:text-teal-400 transition-colors tracking-widest">
                {item}
              </a>
            ))}
          </div>
          <div className="text-xs text-zinc-700 uppercase tracking-widest">2026 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}