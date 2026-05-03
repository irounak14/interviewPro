import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const subjects = [
  { id: 'dsa', name: 'DSA', icon: '🌲', questions: 45, color: '#00ff88', tag: 'ALGORITHMS' },
  { id: 'os', name: 'Operating Systems', icon: '⚙️', questions: 38, color: '#00d4ff', tag: 'SYSTEMS' },
  { id: 'dbms', name: 'DBMS', icon: '🗄️', questions: 42, color: '#ff6b35', tag: 'DATA' },
  { id: 'cn', name: 'Computer Networks', icon: '🌐', questions: 35, color: '#a855f7', tag: 'NETWORKS' },
  { id: 'oop', name: 'OOP Concepts', icon: '📦', questions: 40, color: '#f59e0b', tag: 'DESIGN' },
  { id: 'systemdesign', name: 'System Design', icon: '🏗️', questions: 28, color: '#ec4899', tag: 'ARCHITECTURE' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖', questions: 32, color: '#10b981', tag: 'AI/ML' },
  { id: 'sql', name: 'SQL & Databases', icon: '📊', questions: 36, color: '#3b82f6', tag: 'QUERY' },
  { id: 'java', name: 'Java', icon: '☕', questions: 44, color: '#ef4444', tag: 'LANGUAGE' },
  { id: 'python', name: 'Python', icon: '🐍', questions: 38, color: '#eab308', tag: 'LANGUAGE' },
  { id: 'hr', name: 'HR & Behavioral', icon: '🤝', questions: 30, color: '#14b8a6', tag: 'SOFT SKILLS' },
  { id: 'webdev', name: 'Web Dev', icon: '🌍', questions: 33, color: '#f97316', tag: 'FRONTEND' },
]

export default function SubjectSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const user = JSON.parse(localStorage.getItem('user'))

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const gridRef = useRef(null)
  const btnRef = useRef(null)
  const navRef = useRef(null)
  const scanlineRef = useRef(null)
  const cardRefs = useRef([])
  const cursorRef = useRef(null)
  const cursorTrailRef = useRef(null)
  const counterRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)

  // Particle system on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const count = 80

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        color: ['#00ff88', '#00d4ff', '#a855f7', '#ff6b35'][Math.floor(Math.random() * 4)]
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw connections
        particles.forEach((p2, j) => {
          if (i === j) return
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = p.color
            ctx.globalAlpha = (1 - dist / 100) * 0.08
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Custom cursor
  useEffect(() => {
    const moveCursor = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      gsap.to(cursorRef.current, {
        x: e.clientX, y: e.clientY,
        duration: 0.1, ease: 'none'
      })
      gsap.to(cursorTrailRef.current, {
        x: e.clientX, y: e.clientY,
        duration: 0.4, ease: 'power2.out'
      })
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  // Main animations
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Scanline animation
      gsap.to(scanlineRef.current, {
        y: '100vh', duration: 3, repeat: -1, ease: 'none', delay: 1
      })

      // Nav
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
      )

      // Title SplitText
      const titleSplit = new SplitText(titleRef.current, { type: 'chars' })
      gsap.fromTo(titleSplit.chars,
        { y: 80, opacity: 0, rotateX: -90, filter: 'blur(10px)' },
        {
          y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
          duration: 0.7, stagger: 0.025,
          ease: 'back.out(1.7)', delay: 0.4
        }
      )

      // Subtitle
      gsap.fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1 }
      )

      // Cards stagger with 3D
      gsap.fromTo(cardRefs.current,
        { y: 100, opacity: 0, rotateX: -20, scale: 0.8 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1,
          duration: 0.7,
          stagger: { amount: 0.8, from: 'start' },
          ease: 'power3.out',
          delay: 0.8
        }
      )

      // Counter
      gsap.fromTo(counterRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.5 }
      )

      // Button
      gsap.fromTo(btnRef.current,
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)', delay: 1.6 }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleCardClick = (id, index) => {
    setSelected(id)

    // Glitch effect on selected card
    const card = cardRefs.current[index]
    const tl = gsap.timeline()
    tl.to(card, { x: -3, duration: 0.05 })
      .to(card, { x: 3, duration: 0.05 })
      .to(card, { x: -2, duration: 0.05 })
      .to(card, { x: 0, scale: 1.02, duration: 0.1, ease: 'back.out(1.7)' })
      .to(card, { scale: 1, duration: 0.2 })

    // Ripple effect — dim others
    cardRefs.current.forEach((c, i) => {
      if (i !== index) {
        gsap.to(c, { opacity: 0.35, scale: 0.97, duration: 0.3 })
      } else {
        gsap.to(c, { opacity: 1, scale: 1, duration: 0.3 })
      }
    })
  }

  const handleCardHover = (index, entering) => {
    setHoveredIndex(entering ? index : null)
    const card = cardRefs.current[index]
    if (entering) {
      gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' })
      gsap.to(cursorRef.current, { scale: 3, duration: 0.3 })
    } else {
      gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' })
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 })
    }
  }

  const handleCardMouseMove = (e, index) => {
    const card = cardRefs.current[index]
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(card, {
      rotateY: x / 15, rotateX: -y / 15,
      transformPerspective: 800,
      duration: 0.3, ease: 'power2.out'
    })
  }

  const handleCardMouseLeave = (index) => {
    const card = cardRefs.current[index]
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
    handleCardHover(index, false)
  }

  const handleStart = () => {
    if (!selected) {
      gsap.to(btnRef.current, {
        x: -6, duration: 0.08, repeat: 6, yoyo: true,
        ease: 'power2.inOut'
      })
      return
    }

    // Epic exit animation
    const tl = gsap.timeline({
      onComplete: () => navigate(`/candidate/interview/${selected}`)
    })

    tl.to(cardRefs.current, {
      scale: 0, opacity: 0, stagger: 0.03, duration: 0.3, ease: 'power3.in'
    })
    .to(containerRef.current, {
      filter: 'brightness(0)', duration: 0.3
    }, '-=0.1')
  }

  const selectedSubject = subjects.find(s => s.id === selected)

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white overflow-hidden relative"
      style={{
        background: '#020408',
        fontFamily: "'Space Grotesk', 'DM Mono', monospace",
        cursor: 'none'
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: '8px', height: '8px',
          background: '#00ff88',
          transform: 'translate(-50%, -50%)',
          top: 0, left: 0,
          mixBlendMode: 'difference'
        }}
      />
      <div
        ref={cursorTrailRef}
        className="fixed pointer-events-none z-[9998] rounded-full border"
        style={{
          width: '32px', height: '32px',
          borderColor: 'rgba(0,255,136,0.4)',
          transform: 'translate(-50%, -50%)',
          top: 0, left: 0
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Scanline */}
      <div
        ref={scanlineRef}
        className="fixed left-0 right-0 pointer-events-none z-50"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)',
          top: '-2px',
          filter: 'blur(1px)'
        }}
      />

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Corner decorations */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div key={i} className={`fixed ${pos} w-16 h-16 pointer-events-none z-10`}>
          <div className="w-full h-full relative">
            <div className="absolute top-2 left-2 right-2 h-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
            <div className="absolute top-2 left-2 bottom-2 w-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
          </div>
        </div>
      ))}

      {/* Navbar */}
      <header
        ref={navRef}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-8 h-14"
        style={{
          background: 'rgba(2,4,8,0.9)',
          borderBottom: '1px solid rgba(0,255,136,0.1)',
          backdropFilter: 'blur(20px)',
          opacity: 0
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="text-sm font-bold uppercase tracking-[0.3em]"
            style={{ fontFamily: 'Bebas Neue', fontSize: '20px', color: '#00ff88', letterSpacing: '0.3em' }}
          >
            INTERVIEWPRO
          </div>
          <div className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)', fontFamily: 'DM Mono' }}>
            v2.0
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ fontFamily: 'DM Mono', color: '#4a5568' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>SYS_ONLINE</span>
          <span style={{ color: 'rgba(0,255,136,0.5)' }}>|</span>
          <span>{user?.name?.toUpperCase().replace(' ', '_') || 'USER'}</span>
        </div>

        <div className="flex items-center gap-2">
          {['PROFILE', 'RESULTS', 'EXIT'].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                if (label === 'EXIT') { localStorage.clear(); navigate('/') }
                else if (label === 'PROFILE') navigate('/candidate/profile')
                else if (label === 'RESULTS') navigate('/candidate/history')
              }}
              className="px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                fontFamily: 'DM Mono',
                color: label === 'EXIT' ? '#ff4444' : '#4a5568',
                border: `1px solid ${label === 'EXIT' ? 'rgba(255,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '4px',
                letterSpacing: '0.1em'
              }}
              onMouseEnter={e => {
                gsap.to(e.currentTarget, {
                  color: label === 'EXIT' ? '#ff4444' : '#00ff88',
                  borderColor: label === 'EXIT' ? 'rgba(255,68,68,0.5)' : 'rgba(0,255,136,0.4)',
                  duration: 0.2
                })
              }}
              onMouseLeave={e => {
                gsap.to(e.currentTarget, {
                  color: label === 'EXIT' ? '#ff4444' : '#4a5568',
                  borderColor: label === 'EXIT' ? 'rgba(255,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                  duration: 0.2
                })
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-16 px-8 max-w-7xl mx-auto">

        {/* Header section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.5), transparent)' }} />
            <span className="text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: 'DM Mono', color: 'rgba(0,255,136,0.6)' }}>
              MISSION_SELECT // STEP_01
            </span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.5))' }} />
          </div>

          <h1
            ref={titleRef}
            className="font-black uppercase leading-none mb-4"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(60px, 10vw, 120px)',
              letterSpacing: '0.05em',
              color: 'white',
              perspective: '1000px'
            }}
          >
            CHOOSE<span style={{ color: '#00ff88', WebkitTextStroke: '0px', textShadow: '0 0 40px rgba(0,255,136,0.5)' }}> SUBJECT</span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-sm max-w-lg"
            style={{ fontFamily: 'DM Mono', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, opacity: 0 }}
          >
            &gt; SELECT_MODULE :: AI_EVALUATION_MODE_ACTIVE<br />
            &gt; GROQ_LLAMA3.3 :: READY FOR ANALYSIS<br />
            &gt; AWAITING_INPUT...
          </p>
        </div>

        {/* Subject grid */}
        <div
          ref={gridRef}
          className="grid gap-3 mb-10"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            perspective: '1200px'
          }}
        >
          {subjects.map((s, i) => (
            <div
              key={s.id}
              ref={el => cardRefs.current[i] = el}
              onClick={() => handleCardClick(s.id, i)}
              onMouseEnter={() => handleCardHover(i, true)}
              onMouseLeave={() => handleCardMouseLeave(i)}
              onMouseMove={(e) => handleCardMouseMove(e, i)}
              className="relative overflow-hidden group"
              style={{
                background: selected === s.id
                  ? `rgba(${hexToRgb(s.color)},0.08)`
                  : 'rgba(255,255,255,0.02)',
                border: selected === s.id
                  ? `1px solid ${s.color}`
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
                padding: '20px',
                cursor: 'none',
                transformStyle: 'preserve-3d',
                opacity: 0,
                transition: 'background 0.3s, border 0.3s',
                boxShadow: selected === s.id
                  ? `0 0 30px ${s.color}20, inset 0 0 30px ${s.color}05`
                  : 'none'
              }}
            >
              {/* Glitch line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />

              {/* Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-[0.2em]"
                  style={{ fontFamily: 'DM Mono', color: s.color, opacity: 0.7 }}>
                  {s.tag}
                </span>
                {selected === s.id && (
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.color }} />
                )}
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                {s.icon}
              </div>

              {/* Name */}
              <p className="font-bold text-sm mb-1 text-white leading-tight"
                style={{ fontFamily: 'Space Grotesk' }}>
                {s.name}
              </p>

              {/* Questions */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: `rgba(${hexToRgb(s.color)},0.2)` }} />
                <span className="text-xs" style={{ fontFamily: 'DM Mono', color: 'rgba(255,255,255,0.25)' }}>
                  {s.questions}Q
                </span>
              </div>

              {/* Bottom scan effect */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)`, transition: 'opacity 0.3s' }}
              />

              {/* Selected indicator */}
              {selected === s.id && (
                <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: `${s.color}20`,
                    color: s.color,
                    border: `1px solid ${s.color}40`,
                    fontFamily: 'DM Mono',
                    fontSize: '9px',
                    letterSpacing: '0.1em'
                  }}>
                  SELECTED
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between">

          {/* Stats counter */}
          <div ref={counterRef} className="flex items-center gap-6" style={{ opacity: 0 }}>
            <div>
              <p className="text-xs mb-1" style={{ fontFamily: 'DM Mono', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em' }}>
                MODULES
              </p>
              <p className="text-3xl font-black" style={{ fontFamily: 'Bebas Neue', color: '#00ff88', letterSpacing: '0.1em' }}>
                {subjects.length.toString().padStart(2, '0')}
              </p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(0,255,136,0.2)' }} />
            <div>
              <p className="text-xs mb-1" style={{ fontFamily: 'DM Mono', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em' }}>
                SELECTED
              </p>
              <p className="text-3xl font-black" style={{ fontFamily: 'Bebas Neue', color: selected ? '#00ff88' : 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                {selected ? selectedSubject?.name.substring(0, 6).toUpperCase() : '__NONE'}
              </p>
            </div>
            {selected && (
              <>
                <div className="w-px h-10" style={{ background: 'rgba(0,255,136,0.2)' }} />
                <div>
                  <p className="text-xs mb-1" style={{ fontFamily: 'DM Mono', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em' }}>
                    QUESTIONS
                  </p>
                  <p className="text-3xl font-black" style={{ fontFamily: 'Bebas Neue', color: '#00ff88', letterSpacing: '0.1em' }}>
                    {selectedSubject?.questions.toString().padStart(2, '0')}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Start button */}
          <div ref={btnRef} style={{ opacity: 0 }}>
            <button
              onClick={handleStart}
              className="relative overflow-hidden group px-10 py-4 font-black uppercase tracking-widest transition-all"
              style={{
                fontFamily: 'Bebas Neue',
                fontSize: '18px',
                letterSpacing: '0.3em',
                background: selected
                  ? `linear-gradient(135deg, ${selectedSubject?.color}, ${selectedSubject?.color}aa)`
                  : 'transparent',
                border: selected
                  ? `1px solid ${selectedSubject?.color}`
                  : '1px solid rgba(255,255,255,0.1)',
                color: selected ? '#000' : 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                cursor: selected ? 'none' : 'none',
                boxShadow: selected ? `0 0 40px ${selectedSubject?.color}40` : 'none'
              }}
              onMouseEnter={e => selected && gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              {/* Scan line on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />

              <span className="relative z-10 flex items-center gap-3">
                {selected ? (
                  <>
                    <span>INITIATE_INTERVIEW</span>
                    <span className="text-lg">▶</span>
                  </>
                ) : (
                  'SELECT_MODULE_FIRST'
                )}
              </span>
            </button>

            {selected && (
              <p className="text-center mt-2 text-xs" style={{ fontFamily: 'DM Mono', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                EST. 15 MIN // AI EVALUATION ACTIVE
              </p>
            )}
          </div>
        </div>
      </main>

      <style>{`
        * { cursor: none !important; }
        @keyframes glitch {
          0% { clip-path: inset(0 0 98% 0); transform: translateX(-2px); }
          10% { clip-path: inset(30% 0 50% 0); transform: translateX(2px); }
          20% { clip-path: inset(70% 0 10% 0); transform: translateX(-1px); }
          30% { clip-path: inset(10% 0 80% 0); transform: translateX(1px); }
          40% { clip-path: inset(50% 0 30% 0); transform: translateX(-2px); }
          100% { clip-path: inset(0 0 98% 0); transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

// Helper
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : '255,255,255'
}
