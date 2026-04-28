import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const containerRef = useRef(null)
  const navRef = useRef(null)
  const scoreCardRef = useRef(null)
  const statsRef = useRef(null)
  const breakdownRef = useRef(null)
  const ctaRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const scoreNumberRef = useRef(null)
  const circleRef = useRef(null)
  const answerRefs = useRef([])

  useEffect(() => {
    axios.get(`https://interviewpro-api.onrender.com/api/interview/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSession(res.data)
      setLoading(false)
    }).catch(() => navigate('/candidate/subjects'))
  }, [])

  useEffect(() => {
    if (!session) return

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

      // Score card
      gsap.fromTo(scoreCardRef.current,
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)', delay: 0.3 }
      )

      // Counter animation for score
      const avgScore = session.avgScore
      gsap.fromTo({ val: 0 }, { val: 0 }, {
        val: avgScore,
        duration: 2,
        delay: 0.8,
        ease: 'power2.out',
        onUpdate: function () {
          if (scoreNumberRef.current) {
            scoreNumberRef.current.textContent = Math.round(this.targets()[0].val)
          }
        }
      })

      // Circle animation
      if (circleRef.current) {
        const circumference = 2 * Math.PI * 54
        gsap.fromTo(circleRef.current,
          { strokeDashoffset: circumference },
          {
            strokeDashoffset: circumference * (1 - avgScore / 100),
            duration: 2, delay: 0.8, ease: 'power2.out'
          }
        )
      }

      // Stats row
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children,
          { y: 30, opacity: 0, scale: 0.8 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.6
          }
        )
      }

      // Answer cards scroll triggered
      answerRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' }
          }
        )
      }

    }, containerRef)

    return () => ctx.revert()
  }, [session])

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Loading your results...</p>
      </div>
    </div>
  )

  const { answers, avgScore, subject } = session

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const getGrade = (score) => {
    if (score >= 85) return { label: 'Excellent', color: '#4ade80' }
    if (score >= 70) return { label: 'Good', color: '#4ade80' }
    if (score >= 50) return { label: 'Average', color: '#facc15' }
    return { label: 'Needs Work', color: '#f87171' }
  }

  const grade = getGrade(avgScore)
  const goodAnswers = answers.filter(a => a.score >= 70).length
  const needsWork = answers.filter(a => a.score < 40).length
  const circumference = 2 * Math.PI * 54

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
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: `radial-gradient(circle, ${getScoreColor(avgScore)}, transparent)` }} />
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
          <div className="text-lg font-black tracking-tighter text-white uppercase">
            Interview<span style={{ color: '#7c3aed' }}>Pro</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/candidate/history')}
              className="px-4 py-2 rounded-xl text-sm border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              My Results
            </button>
            <button
              onClick={() => navigate('/candidate/subjects')}
              className="px-4 py-2 rounded-xl text-sm text-white font-bold transition-all hover:scale-105"
              style={{ background: '#7c3aed' }}>
              Practice Again
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10 w-full">

        {/* Score Card */}
        <div ref={scoreCardRef}
          className="rounded-2xl p-10 mb-8 relative overflow-hidden"
          style={{
            background: 'rgba(15,15,15,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            opacity: 0
          }}>

          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }} />

          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2 font-bold">Interview Complete</p>
              <h2 className="text-4xl font-black text-white capitalize mb-1">{subject}</h2>
              <p className="text-zinc-500">{answers.length} questions answered</p>
            </div>

            {/* Circle Score */}
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none"
                  stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle ref={circleRef} cx="60" cy="60" r="54" fill="none"
                  stroke={getScoreColor(avgScore)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                />
              </svg>
              <div className="absolute text-center">
                <p ref={scoreNumberRef}
                  className="text-4xl font-black"
                  style={{ color: getScoreColor(avgScore) }}>
                  0
                </p>
                <p className="text-zinc-600 text-xs">/ 100</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-lg font-black" style={{ color: grade.color }}>{grade.label}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-zinc-500 text-sm capitalize">{subject} Interview</span>
          </div>

          {/* Stats */}
          <div ref={statsRef}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {[
              { label: 'Questions', value: answers.length, color: '#7c3aed' },
              { label: 'Good Answers', value: goodAnswers, color: '#4ade80' },
              { label: 'Need Work', value: needsWork, color: '#f87171' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-zinc-600 text-xs uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <h3 className="text-lg font-black uppercase tracking-wider text-zinc-500 mb-5">
          Question Breakdown
        </h3>

        <div ref={breakdownRef} className="flex flex-col gap-4 mb-8">
          {answers.map((a, i) => (
            <div key={i}
              ref={el => answerRefs.current[i] = el}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'rgba(15,15,15,0.8)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${getScoreColor(a.score)}20`
              }}>

              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${getScoreColor(a.score)}40, transparent)` }} />

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-zinc-600 font-bold">Q{i + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{
                        background: `${getScoreColor(a.score)}15`,
                        color: getScoreColor(a.score)
                      }}>
                      {a.score >= 70 ? 'Good' : a.score >= 40 ? 'Average' : 'Needs Work'}
                    </span>
                  </div>
                  <p className="text-white font-bold leading-relaxed">{a.question}</p>
                </div>
                <div className="ml-6 text-right flex-shrink-0">
                  <p className="text-4xl font-black" style={{ color: getScoreColor(a.score) }}>
                    {a.score}
                  </p>
                  <p className="text-zinc-700 text-xs">/ 100</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/5 rounded-full h-1 mb-4">
                <div className="h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${a.score}%`, background: getScoreColor(a.score) }} />
              </div>

              {a.answer && (
                <div className="rounded-xl p-4 mb-3"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-xs uppercase tracking-wider text-zinc-700 mb-2 font-bold">Your Answer</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{a.answer}</p>
                </div>
              )}

              <div className="rounded-xl p-4"
                style={{
                  background: `${getScoreColor(a.score)}06`,
                  border: `1px solid ${getScoreColor(a.score)}15`
                }}>
                <p className="text-xs uppercase tracking-wider text-zinc-700 mb-2 font-bold">AI Feedback</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{a.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate(`/candidate/interview/${subject}`)}
            className="py-4 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
            <span className="material-symbols-outlined text-sm"
              style={{ fontFamily: 'Material Symbols Outlined' }}>replay</span>
            Retry Subject
          </button>
          <button
            onClick={() => navigate('/candidate/subjects')}
            className="py-4 text-white font-black rounded-2xl transition-all active:scale-95 border border-white/10 hover:border-white/20"
            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
            New Subject
          </button>
        </div>

      </main>
    </div>
  )
}