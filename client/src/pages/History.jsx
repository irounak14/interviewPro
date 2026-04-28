import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function History() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const containerRef = useRef(null)
  const navRef = useRef(null)
  const headerRef = useRef(null)
  const statsRowRef = useRef(null)
  const sessionRefs = useRef([])
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const counterRefs = useRef([])

  useEffect(() => {
    axios.get('https://interviewpro-api.onrender.com/api/interview/my-sessions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSessions(res.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Floating orbs
      gsap.to(orb1Ref.current, {
        y: -50, x: 30, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut'
      })
      gsap.to(orb2Ref.current, {
        y: 40, x: -20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2
      })

      // Nav
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      // Header
      gsap.fromTo(headerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (loading || sessions.length === 0) return

    const ctx = gsap.context(() => {

      // Animate stat counters
      const totalAvg = Math.round(sessions.reduce((sum, s) => sum + s.avgScore, 0) / sessions.length)
      const bestScore = Math.max(...sessions.map(s => s.avgScore))

      const counters = [
        { ref: counterRefs.current[0], end: sessions.length, suffix: '' },
        { ref: counterRefs.current[1], end: totalAvg, suffix: '' },
        { ref: counterRefs.current[2], end: bestScore, suffix: '' },
      ]

      counters.forEach(({ ref, end, suffix }) => {
        if (!ref) return
        gsap.fromTo({ val: 0 }, { val: 0 }, {
          val: end, duration: 1.5, ease: 'power2.out', delay: 0.5,
          onUpdate: function () {
            ref.textContent = Math.round(this.targets()[0].val) + suffix
          }
        })
      })

      // Stats row
      if (statsRowRef.current) {
        gsap.fromTo(statsRowRef.current.children,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.4
          }
        )
      }

      // Session cards scroll triggered
      sessionRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            },
            delay: i < 3 ? i * 0.1 : 0
          }
        )

        // Hover
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' }))
        card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' }))
      })

    }, containerRef)

    return () => ctx.revert()
  }, [sessions, loading])

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const getGrade = (score) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Average'
    return 'Needs Work'
  }

  const getSubjectIcon = (subject) => {
    const icons = { dsa: '🌲', python: '🐍', java: '☕', ml: '🤖', webdev: '🌍', os: '⚙️', dbms: '🗄️', cn: '🌐', oop: '📦', systemdesign: '🏗️', sql: '📊', hr: '🤝' }
    return icons[subject] || '📚'
  }

  const totalAvg = sessions.length ? Math.round(sessions.reduce((sum, s) => sum + s.avgScore, 0) / sessions.length) : 0
  const bestScore = sessions.length ? Math.max(...sessions.map(s => s.avgScore)) : 0

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div ref={orb1Ref}
          className="absolute -top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[130px] opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div ref={orb2Ref}
          className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />
      </div>

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
          <div onClick={() => navigate('/candidate/subjects')}
            className="text-lg font-black tracking-tighter text-white uppercase cursor-pointer">
            Interview<span style={{ color: '#7c3aed' }}>Pro</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/candidate/subjects')}
              className="px-4 py-2 rounded-xl text-sm font-black text-white transition-all hover:scale-105"
              style={{ background: '#7c3aed' }}>
              Practice
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/') }}
              className="px-4 py-2 rounded-xl text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full relative z-10">

        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: '#7c3aed', opacity: 0 }}>
            Dashboard
          </p>
          <h2 className="text-5xl font-black text-white tracking-tight mb-2" style={{ opacity: 0 }}>
            My Results
          </h2>
          <p className="text-zinc-500" style={{ opacity: 0 }}>
            Track your interview performance over time
          </p>
        </div>

        {/* Stats */}
        {sessions.length > 0 && (
          <div ref={statsRowRef} className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Sessions', color: '#7c3aed', icon: 'history', index: 0 },
              { label: 'Overall Average', color: getScoreColor(totalAvg), icon: 'analytics', index: 1 },
              { label: 'Best Score', color: '#4ade80', icon: 'emoji_events', index: 2 },
            ].map((stat, i) => (
              <div key={i}
                className="rounded-2xl p-6 relative overflow-hidden group"
                style={{
                  background: 'rgba(15,15,15,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color}10, transparent 70%)` }} />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <span className="material-symbols-outlined text-sm"
                    style={{ fontFamily: 'Material Symbols Outlined', color: stat.color }}>
                    {stat.icon}
                  </span>
                  <p className="text-xs uppercase tracking-wider text-zinc-600 font-bold">{stat.label}</p>
                </div>
                <p className="text-4xl font-black relative z-10" style={{ color: stat.color }}
                  ref={el => counterRefs.current[stat.index] = el}>
                  0
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && sessions.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🎯</p>
            <p className="text-zinc-400 text-lg font-bold mb-2">No sessions yet</p>
            <p className="text-zinc-600 text-sm mb-8">Start your first mock interview to see results here</p>
            <button onClick={() => navigate('/candidate/subjects')}
              className="px-8 py-4 rounded-2xl text-white font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
              Start First Interview
            </button>
          </div>
        )}

        {/* Sessions */}
        <div className="flex flex-col gap-4">
          {sessions.map((s, i) => (
            <div key={s._id}
              ref={el => sessionRefs.current[i] = el}
              onClick={() => navigate(`/candidate/results/${s._id}`)}
              className="cursor-pointer rounded-2xl p-6 relative overflow-hidden group"
              style={{
                background: 'rgba(15,15,15,0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: 0
              }}>

              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }} />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(124,58,237,0.15)' }}>
                    {getSubjectIcon(s.subject)}
                  </div>
                  <div>
                    <p className="font-black text-white capitalize text-lg">{s.subject}</p>
                    <p className="text-zinc-600 text-sm">
                      {s.answers.length} questions · {new Date(s.completedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-3xl font-black" style={{ color: getScoreColor(s.avgScore) }}>
                      {s.avgScore}
                    </p>
                    <p className="text-zinc-700 text-xs">{getGrade(s.avgScore)}</p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all"
                    style={{ fontFamily: 'Material Symbols Outlined' }}>chevron_right</span>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/5 rounded-full h-1">
                <div className="h-1 rounded-full"
                  style={{
                    width: `${s.avgScore}%`,
                    background: `linear-gradient(90deg, #7c3aed, ${getScoreColor(s.avgScore)})`
                  }} />
              </div>
            </div>
          ))}
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