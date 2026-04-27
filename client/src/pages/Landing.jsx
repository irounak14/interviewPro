import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Observer } from 'gsap/Observer'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, SplitText, Observer, ScrambleTextPlugin, TextPlugin)

export default function Landing() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroSubRef = useRef(null)
  const navRef = useRef(null)
  const badgeRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const statsRef = useRef(null)
  const featuresRef = useRef(null)
  const subjectsRef = useRef(null)
  const ctaRef = useRef(null)
  const scrambleRef = useRef(null)
  const counterRefs = useRef([])
  const noiseRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ============ CUSTOM CURSOR ============
      const cursor = cursorRef.current
      const dot = cursorDotRef.current

      window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power3.out' })
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 })
      })

      document.querySelectorAll('button, a, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(cursor, { scale: 2.5, opacity: 0.5, duration: 0.3 })
        })
        el.addEventListener('mouseleave', () => {
          gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 })
        })
      })

      // ============ NOISE OVERLAY ANIMATION ============
      gsap.to(noiseRef.current, {
        backgroundPosition: '100% 100%',
        duration: 8,
        repeat: -1,
        ease: 'none',
        yoyo: true
      })

      // ============ NAV ANIMATION ============
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
      )

      // ============ HERO TITLE SPLIT TEXT ============
      const heroSplit = new SplitText(heroTitleRef.current, { type: 'chars,words' })
      gsap.fromTo(heroSplit.chars,
        { y: 120, opacity: 0, rotateX: -90, transformOrigin: '0% 50% -50' },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.8, stagger: 0.02,
          ease: 'back.out(1.7)', delay: 0.5
        }
      )

      // ============ SCRAMBLE TEXT on subtitle ============
      gsap.fromTo(scrambleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 1.2 }
      )
      gsap.to(scrambleRef.current, {
        delay: 1.5,
        duration: 2,
        scrambleText: {
          text: 'AI-powered mock interviews with real-time voice evaluation. Practice, improve, and get noticed by top recruiters.',
          chars: 'lowerCase',
          speed: 0.4,
          revealDelay: 0.3,
        }
      })

      // ============ BADGE ANIMATION ============
      gsap.fromTo(badgeRef.current,
        { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.4 }
      )

      // Pulse badge continuously
      gsap.to(badgeRef.current, {
        boxShadow: '0 0 30px rgba(124,58,237,0.6)',
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 2
      })

      // ============ CARDS 3D FLIP IN ============
      gsap.fromTo(card1Ref.current,
        { x: -150, opacity: 0, rotateY: -30 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'power4.out', delay: 1.4 }
      )
      gsap.fromTo(card2Ref.current,
        { x: 150, opacity: 0, rotateY: 30 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'power4.out', delay: 1.6 }
      )

      // Card hover magnetic effect
      ;[card1Ref.current, card2Ref.current].forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          gsap.to(card, {
            rotateX: -y / 20,
            rotateY: x / 20,
            transformPerspective: 800,
            ease: 'power2.out',
            duration: 0.4
          })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
        })
      })

      // ============ COUNTER ANIMATION for stats ============
      const targets = [
        { ref: counterRefs.current[0], end: 12, suffix: '' },
        { ref: counterRefs.current[1], end: 100, suffix: '%' },
        { ref: counterRefs.current[2], end: 65, suffix: '+' },
      ]

      targets.forEach(({ ref, end, suffix }) => {
        if (!ref) return
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo({ val: 0 },
              { val: 0 },
              {
                val: end,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function () {
                  ref.textContent = Math.round(this.targets()[0].val) + suffix
                }
              }
            )
          },
          once: true
        })
      })

      // Stats section slide in
      gsap.fromTo(statsRef.current.children,
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
        }
      )

      // ============ FEATURES SCROLL ANIMATION ============
      const featureCards = featuresRef.current.querySelectorAll('[data-feature]')
      featureCards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.1
          }
        )

        // Hover glow effect
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' })
        })
      })

      // ============ SUBJECTS WAVE STAGGER ============
      const subjectPills = subjectsRef.current.querySelectorAll('[data-pill]')
      gsap.fromTo(subjectPills,
        { scale: 0, opacity: 0, rotation: gsap.utils.wrap([-10, 10]) },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 0.5, stagger: {
            amount: 1.2,
            from: 'center',
            ease: 'power2.inOut'
          },
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: subjectsRef.current, start: 'top 80%' }
        }
      )

      // ============ CTA SECTION ============
      const ctaSplit = new SplitText(ctaRef.current.querySelector('h2'), { type: 'words' })
      gsap.fromTo(ctaSplit.words,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
        }
      )

      gsap.fromTo(ctaRef.current.querySelector('button'),
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
          delay: 0.4
        }
      )

      // CTA button pulse
      gsap.to(ctaRef.current.querySelector('button'), {
        boxShadow: '0 0 40px rgba(124,58,237,0.8)',
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 3
      })

      // ============ HORIZONTAL SCROLL TICKER ============
      const ticker = document.querySelector('[data-ticker]')
      if (ticker) {
        gsap.to(ticker, {
          xPercent: -50,
          duration: 20,
          repeat: -1,
          ease: 'none'
        })
      }

      // ============ FLOATING PARTICLES ============
      document.querySelectorAll('[data-particle]').forEach((p, i) => {
        gsap.to(p, {
          y: gsap.utils.random(-30, 30),
          x: gsap.utils.random(-20, 20),
          rotation: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3
        })
      })

      // ============ OBSERVER for sections ============
      let sections = gsap.utils.toArray('[data-section]')
      sections.forEach(section => {
        Observer.create({
          target: section,
          type: 'wheel,touch',
          onUp: () => gsap.to(section, { borderColor: 'rgba(124,58,237,0.3)', duration: 0.3 }),
          onDown: () => gsap.to(section, { borderColor: 'rgba(255,255,255,0.08)', duration: 0.3 }),
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white flex flex-col overflow-x-hidden"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Custom Cursor */}
      <div ref={cursorRef}
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          background: 'white',
          transform: 'translate(-50%, -50%)',
          top: 0, left: 0
        }} />
      <div ref={cursorDotRef}
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] bg-white"
        style={{ transform: 'translate(-50%, -50%)', top: 0, left: 0 }} />

      {/* Noise texture overlay */}
      <div ref={noiseRef} className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />

      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div data-particle
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div data-particle
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[130px] opacity-15"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />
        <div data-particle
          className="absolute top-3/4 left-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
      </div>

      {/* Grid lines background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />

      {/* Navbar */}
      <header ref={navRef}
        className="fixed top-0 w-full z-50"
        style={{ opacity: 0 }}>
        <div className="mx-4 mt-4 rounded-2xl border border-white/10 px-8 h-16 flex items-center justify-between"
          style={{ background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(20px)' }}>
          <div className="text-lg font-black tracking-tighter text-white uppercase">
            Interview<span style={{ color: '#7c3aed' }}>Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Features', 'Subjects', 'Stats'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-zinc-500 hover:text-white transition-colors duration-300 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button data-hover onClick={() => navigate('/candidate/login')}
              className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300">
              Sign In
            </button>
            <button data-hover onClick={() => navigate('/candidate/login')}
              className="px-5 py-2 rounded-xl text-sm text-white font-bold transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 flex flex-col items-center justify-center text-center px-6 pt-40 pb-20 min-h-screen">

        {/* Badge */}
        <div ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-10 cursor-pointer"
          style={{
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#a78bfa',
            opacity: 0
          }}>
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-violet-500" />
          </span>
          Powered by Groq AI — Real-time Evaluation
        </div>

        {/* Main Title */}
        <h1 ref={heroTitleRef}
          className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none"
          style={{ perspective: '1000px' }}>
          Ace Your Interview{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Interview
          </span>
        </h1>

        {/* Scramble Subtitle */}
        <p ref={scrambleRef}
          className="text-zinc-400 text-xl max-w-2xl mb-16 leading-relaxed"
          style={{ opacity: 0, minHeight: '80px' }}>
          AI-powered mock interviews with real-time voice evaluation. Practice, improve, and get noticed by top recruiters.
        </p>

        {/* Role Cards */}
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl mb-20"
          style={{ perspective: '1000px' }}>

          <div ref={card1Ref} data-hover
            onClick={() => navigate('/candidate/login')}
            className="flex-1 cursor-pointer rounded-2xl p-7 text-left group relative overflow-hidden"
            style={{
              background: 'rgba(20,20,20,0.8)',
              border: '1px solid rgba(124,58,237,0.25)',
              opacity: 0,
              transformStyle: 'preserve-3d'
            }}>
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.15), transparent 70%)' }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-3xl"
                style={{ background: 'rgba(124,58,237,0.15)' }}>
                🎓
              </div>
              <h3 className="text-white font-black text-xl mb-3 group-hover:text-violet-300 transition-colors duration-300">
                I'm a Candidate
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-5">
                Practice mock interviews, get AI feedback, track your progress across 12 subjects
              </p>
              <div className="flex items-center gap-2 text-violet-400 text-sm font-bold">
                Start Practicing
                <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform duration-300"
                  style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
              </div>
            </div>
          </div>

          <div ref={card2Ref} data-hover
            onClick={() => navigate('/hr/login')}
            className="flex-1 cursor-pointer rounded-2xl p-7 text-left group relative overflow-hidden"
            style={{
              background: 'rgba(20,20,20,0.8)',
              border: '1px solid rgba(13,148,136,0.25)',
              opacity: 0,
              transformStyle: 'preserve-3d'
            }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(13,148,136,0.15), transparent 70%)' }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-3xl"
                style={{ background: 'rgba(13,148,136,0.15)' }}>
                🔍
              </div>
              <h3 className="text-white font-black text-xl mb-3 group-hover:text-teal-300 transition-colors duration-300">
                I'm an HR / Recruiter
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-5">
                Discover pre-screened candidates, view interview scores, and connect with top talent
              </p>
              <div className="flex items-center gap-2 text-teal-400 text-sm font-bold">
                Discover Talent
                <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform duration-300"
                  style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <p className="text-zinc-600 text-xs uppercase tracking-widest">Scroll to explore</p>
          <span className="material-symbols-outlined text-zinc-600"
            style={{ fontFamily: 'Material Symbols Outlined' }}>keyboard_arrow_down</span>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative z-20 overflow-hidden py-6 border-y border-white/5"
        style={{ background: 'rgba(124,58,237,0.05)' }}>
        <div data-ticker className="flex gap-16 whitespace-nowrap"
          style={{ width: '200%' }}>
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex gap-16 items-center">
              {['DSA', 'Machine Learning', 'System Design', 'Python', 'Java', 'DBMS', 'Computer Networks', 'OOP', 'SQL', 'Web Dev', 'HR & Behavioral', 'Operating Systems'].map((s, i) => (
                <span key={i} className="flex items-center gap-3 text-zinc-500 text-sm font-semibold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  {s}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section id="stats" className="relative z-20 py-24 px-8">
        <div ref={statsRef} className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {[
            { label: 'Interview Subjects', color: '#7c3aed', index: 0, suffix: '' },
            { label: 'AI Accuracy', color: '#0d9488', index: 1, suffix: '%' },
            { label: 'Questions Available', color: '#f59e0b', index: 2, suffix: '+' },
          ].map((stat, i) => (
            <div key={i} data-section
              className="rounded-2xl p-8 text-center relative overflow-hidden group"
              style={{
                background: 'rgba(15,15,15,0.8)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color}10, transparent 70%)` }} />
              <p className="text-6xl font-black mb-2 relative z-10"
                style={{ color: stat.color }}
                ref={el => counterRefs.current[i] = el}>
                0{stat.suffix}
              </p>
              <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold relative z-10">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-20 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold mb-4"
            style={{ color: '#7c3aed' }}>Why InterviewPro</p>
          <h2 className="text-5xl font-black text-white tracking-tight">
            Everything you need
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>to succeed</span>
          </h2>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: 'mic', title: 'Voice-Powered', desc: 'Speak naturally — our AI transcribes and evaluates your answers in real time just like a real interview.', color: '#7c3aed' },
            { icon: 'psychology', title: 'Instant AI Feedback', desc: 'Get scored 0-100 with detailed feedback on every answer from our Llama 3.3 powered evaluation engine.', color: '#0d9488' },
            { icon: 'leaderboard', title: 'HR Discovery', desc: 'Top performers get discovered by real recruiters. Build your profile and get noticed by top companies.', color: '#f59e0b' },
          ].map((f, i) => (
            <div key={i} data-feature
              className="rounded-2xl p-8 relative overflow-hidden group cursor-pointer"
              style={{
                background: 'rgba(15,15,15,0.8)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}15, transparent 60%)` }} />
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                  <span className="material-symbols-outlined text-2xl"
                    style={{ fontFamily: 'Material Symbols Outlined', color: f.color }}>
                    {f.icon}
                  </span>
                </div>
                <h3 className="text-white font-black text-xl mb-3">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="relative z-20 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#7c3aed' }}>12 Subjects</p>
          <h2 className="text-5xl font-black text-white tracking-tight">Practice any CS topic</h2>
        </div>

        <div ref={subjectsRef} className="flex flex-wrap gap-3 justify-center">
          {[
            { name: 'DSA', icon: '🌲', color: '#7c3aed' },
            { name: 'Operating Systems', icon: '⚙️', color: '#0d9488' },
            { name: 'DBMS', icon: '🗄️', color: '#f59e0b' },
            { name: 'Computer Networks', icon: '🌐', color: '#3b82f6' },
            { name: 'OOP Concepts', icon: '📦', color: '#ec4899' },
            { name: 'System Design', icon: '🏗️', color: '#f97316' },
            { name: 'Machine Learning', icon: '🤖', color: '#8b5cf6' },
            { name: 'SQL', icon: '📊', color: '#06b6d4' },
            { name: 'Java', icon: '☕', color: '#ef4444' },
            { name: 'Python', icon: '🐍', color: '#22c55e' },
            { name: 'HR & Behavioral', icon: '🤝', color: '#f59e0b' },
            { name: 'Web Dev', icon: '🌍', color: '#0d9488' },
          ].map((s, i) => (
            <div key={i} data-pill data-hover
              onClick={() => navigate('/candidate/login')}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(15,15,15,0.8)',
                border: `1px solid ${s.color}30`,
                color: '#71717a'
              }}
              onMouseEnter={e => {
                gsap.to(e.currentTarget, { color: '#fff', borderColor: s.color, duration: 0.2 })
              }}
              onMouseLeave={e => {
                gsap.to(e.currentTarget, { color: '#71717a', borderColor: `${s.color}30`, duration: 0.3 })
              }}>
              <span>{s.icon}</span>
              {s.name}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 max-w-5xl mx-auto px-8 py-24 text-center">
        <div ref={ctaRef}
          className="rounded-3xl p-16 relative overflow-hidden"
          style={{
            background: 'rgba(15,15,15,0.9)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}>
          {/* Animated gradient bg */}
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15), transparent 70%)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)' }} />

          <div className="relative z-10">
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
              Ready to ace your interview?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of candidates practicing with AI-powered mock interviews.
            </p>
            <button data-hover
              onClick={() => navigate('/candidate/login')}
              className="px-10 py-5 rounded-2xl text-white font-black text-lg transition-all duration-300 hover:scale-105 relative group"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                boxShadow: '0 8px 32px rgba(124,58,237,0.4)'
              }}>
              <span className="relative z-10">Start for Free</span>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 border-t border-white/5 relative z-20"
        style={{ background: '#050505' }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-4">
          <div className="text-sm font-black text-white uppercase tracking-tighter">
            Interview<span style={{ color: '#7c3aed' }}>Pro</span>
          </div>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Support', 'Careers'].map(item => (
              <a key={item} href="#"
                className="text-xs uppercase font-bold text-zinc-600 hover:text-violet-400 transition-colors tracking-widest">
                {item}
              </a>
            ))}
          </div>
          <div className="text-xs text-zinc-700 uppercase tracking-widest font-semibold">
            2024 InterviewPro
          </div>
        </div>
      </footer>
    </div>
  )
}