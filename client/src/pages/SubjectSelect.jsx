import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const subjects = [
  { id: 'dsa', name: 'DSA', icon: '🌲', questions: 45, color: '#7c3aed' },
  { id: 'os', name: 'Operating Systems', icon: '⚙️', questions: 38, color: '#0d9488' },
  { id: 'dbms', name: 'DBMS', icon: '🗄️', questions: 42, color: '#f59e0b' },
  { id: 'cn', name: 'Computer Networks', icon: '🌐', questions: 35, color: '#3b82f6' },
  { id: 'oop', name: 'OOP Concepts', icon: '📦', questions: 40, color: '#ec4899' },
  { id: 'systemdesign', name: 'System Design', icon: '🏗️', questions: 28, color: '#f97316' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖', questions: 32, color: '#8b5cf6' },
  { id: 'sql', name: 'SQL & Databases', icon: '📊', questions: 36, color: '#06b6d4' },
  { id: 'java', name: 'Java', icon: '☕', questions: 44, color: '#ef4444' },
  { id: 'python', name: 'Python', icon: '🐍', questions: 38, color: '#22c55e' },
  { id: 'hr', name: 'HR & Behavioral', icon: '🤝', questions: 30, color: '#f59e0b' },
  { id: 'webdev', name: 'Web Dev', icon: '🌍', questions: 33, color: '#0d9488' },
]

export default function SubjectSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'))

  const containerRef = useRef(null)
  const navRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const btnRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const cardRefs = useRef([])

  const handleLogout = () => {
    gsap.to(containerRef.current, {
      opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        localStorage.clear()
        navigate('/')
      }
    })
  }

  const handleStart = () => {
    if (!selected) {
      gsap.to(btnRef.current, { x: -8, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' })
      return
    }
    gsap.to(containerRef.current, {
      opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
      onComplete: () => navigate(`/candidate/interview/${selected}`)
    })
  }

  const handleCardClick = (id, index) => {
    setSelected(id)

    // Pulse animation on selected card
    gsap.fromTo(cardRefs.current[index],
      { scale: 0.95 },
      { scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
    )

    // Dim all other cards
    cardRefs.current.forEach((card, i) => {
      if (i !== index) {
        gsap.to(card, { opacity: 0.5, duration: 0.3 })
      } else {
        gsap.to(card, { opacity: 1, duration: 0.3 })
      }
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Floating orbs
      gsap.to(orb1Ref.current, {
        y: -50, x: 30, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut'
      })
      gsap.to(orb2Ref.current, {
        y: 40, x: -25, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5
      })

      // Nav slide down
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      // Header animate in
      gsap.fromTo(headerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      )

      // Cards stagger wave from center
      gsap.fromTo(cardRefs.current,
        { scale: 0.7, opacity: 0, y: 40, rotateY: -15 },
        {
          scale: 1, opacity: 1, y: 0, rotateY: 0,
          duration: 0.6,
          stagger: {
            amount: 0.8,
            from: 'start',
            ease: 'power2.out'
          },
          ease: 'back.out(1.4)',
          delay: 0.5
        }
      )

      // Button fade in
      gsap.fromTo(btnRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 1.2 }
      )

      // Card hover effects
      cardRefs.current.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
          if (selected !== subjects[i].id) {
            gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' })
          }
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' })
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Animate button when selection changes
  useEffect(() => {
    if (selected && btnRef.current) {
      gsap.fromTo(btnRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
      )
      gsap.to(btnRef.current, {
        boxShadow: `0 0 30px ${subjects.find(s => s.id === selected)?.color}60`,
        duration: 0.4
      })
    }
  }, [selected])

  const selectedSubject = subjects.find(s => s.id === selected)

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div ref={orb1Ref}
          className="absolute -top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[130px] opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div ref={orb2Ref}
          className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />
      </div>

      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      {/* Navbar */}
      <header ref={navRef}
        className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(20px)', opacity: 0 }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-16">
          <div className="text-lg font-black tracking-tighter text-white uppercase">
            Interview<span style={{ color: '#7c3aed' }}>Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-sm hidden md:block">
              Hi, {user?.name?.split(' ')[0]}
            </span>
            <button
              onClick={() => navigate('/candidate/profile')}
              className="px-4 py-2 rounded-xl text-sm border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              My Profile
            </button>
            <button
              onClick={() => navigate('/candidate/history')}
              className="px-4 py-2 rounded-xl text-sm border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              My Results
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full relative z-10">

        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: '#7c3aed', opacity: 0 }}>
            Step 1 of 2
          </p>
          <h2 className="text-5xl font-black text-white tracking-tight mb-2" style={{ opacity: 0 }}>
            Choose a Subject
          </h2>
          <p className="text-zinc-500" style={{ opacity: 0 }}>
            Select a topic and start your AI-powered mock interview
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10"
          style={{ perspective: '1000px' }}>
          {subjects.map((s, i) => (
            <div
              key={s.id}
              ref={el => cardRefs.current[i] = el}
              onClick={() => handleCardClick(s.id, i)}
              className="cursor-pointer rounded-2xl p-6 flex flex-col relative overflow-hidden group"
              style={{
                background: selected === s.id ? `${s.color}12` : 'rgba(15,15,15,0.8)',
                backdropFilter: 'blur(20px)',
                border: selected === s.id ? `1px solid ${s.color}50` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: selected === s.id ? `0 0 25px ${s.color}20` : 'none',
                opacity: 0
              }}>

              {/* Top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />

              {/* Selected indicator */}
              {selected === s.id && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                  style={{ background: s.color }} />
              )}

              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${s.color}15` }}>
                {s.icon}
              </div>

              <p className="text-white font-bold text-sm mb-1">{s.name}</p>
              <p className="text-zinc-600 text-xs">{s.questions} questions</p>

              {selected === s.id && (
                <p className="text-xs font-bold mt-2" style={{ color: s.color }}>
                  Selected
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div ref={btnRef} className="flex items-center gap-4" style={{ opacity: 0 }}>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white transition-all active:scale-95"
            style={selected ? {
              background: `linear-gradient(135deg, ${selectedSubject?.color}, ${selectedSubject?.color}cc)`,
              boxShadow: `0 4px 20px ${selectedSubject?.color}40`
            } : {
              background: 'rgba(255,255,255,0.05)',
              color: '#52525b',
              cursor: 'not-allowed',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
            onMouseEnter={e => selected && gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
            <span className="material-symbols-outlined"
              style={{ fontFamily: 'Material Symbols Outlined' }}>mic</span>
            {selected ? `Start ${selectedSubject?.name} Interview` : 'Select a Subject First'}
            {selected && (
              <span className="material-symbols-outlined text-sm"
                style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
            )}
          </button>

          {selected && (
            <p className="text-zinc-600 text-sm">
              {selectedSubject?.questions} questions · ~15 mins
            </p>
          )}
        </div>

      </main>

      <footer className="w-full py-6 border-t border-white/5 relative z-10" style={{ background: '#050505' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xs font-black text-white uppercase tracking-tighter">
            Interview<span style={{ color: '#7c3aed' }}>Pro</span>
          </div>
          <div className="text-xs text-zinc-700 uppercase tracking-widest">2026 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}