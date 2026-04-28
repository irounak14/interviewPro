import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const subjects = ['all', 'dsa', 'ml', 'python', 'systemdesign', 'java', 'webdev', 'os', 'dbms', 'cn', 'oop', 'sql', 'hr']

export default function HRPortal() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [filter, setFilter] = useState('all')
  const [savedIds, setSavedIds] = useState([])
  const [savedCount, setSavedCount] = useState(0)
  const [showSaved, setShowSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inviteSent, setInviteSent] = useState({})
  const [inviteLoading, setInviteLoading] = useState({})
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const containerRef = useRef(null)
  const navRef = useRef(null)
  const headerRef = useRef(null)
  const filterRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const candidateRefs = useRef([])

  useEffect(() => {
    if (!user || user.role !== 'hr') { navigate('/'); return }
    fetchCandidates()
  }, [filter])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`https://interviewpro-api.onrender.com/api/hr/candidates?subject=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCandidates(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const toggleSave = async (candidateId) => {
    try {
      const res = await axios.post(`https://interviewpro-api.onrender.com/api/hr/save/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.saved) setSavedIds(prev => [...prev, candidateId])
      else setSavedIds(prev => prev.filter(id => id !== candidateId))
      setSavedCount(res.data.total)
    } catch (err) { console.error(err) }
  }

  const sendInvite = async (candidateId) => {
    setInviteLoading(prev => ({ ...prev, [candidateId]: true }))
    try {
      await axios.post(`https://interviewpro-api.onrender.com/api/hr/invite/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInviteSent(prev => ({ ...prev, [candidateId]: true }))
      // Success animation
      gsap.fromTo(`#invite-${candidateId}`,
        { scale: 0.95 },
        { scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
      )
    } catch (err) {
      console.error(err)
      alert('Failed to send invite. Please try again.')
    }
    setInviteLoading(prev => ({ ...prev, [candidateId]: false }))
  }

  // Initial animations
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

      // Filter pills
      gsap.fromTo(filterRef.current.children,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.4,
          stagger: { amount: 0.6, from: 'start' },
          ease: 'back.out(1.5)',
          delay: 0.5
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Animate candidates when they load
  useEffect(() => {
    if (loading || candidates.length === 0) return

    candidateRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.5, ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Hover effect
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' })
      })
    })
  }, [candidates, loading])

  // Filter change animation
  const handleFilterChange = (s) => {
    gsap.to('.candidates-list', {
      opacity: 0, y: 10, duration: 0.2,
      onComplete: () => {
        setFilter(s)
        gsap.to('.candidates-list', { opacity: 1, y: 0, duration: 0.3 })
      }
    })
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const avatarColors = ['#7c3aed', '#0d9488', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899']

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div ref={orb1Ref}
          className="absolute -top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[130px] opacity-15"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />
        <div ref={orb2Ref}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
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
            Interview<span style={{ color: '#0d9488' }}>Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowSaved(false) }}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border"
              style={!showSaved ? {
                background: 'rgba(13,148,136,0.15)',
                borderColor: 'rgba(13,148,136,0.4)',
                color: '#6bd8cb'
              } : {
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#71717a'
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
              Discover Talent
            </button>
            <button onClick={() => setShowSaved(true)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-2"
              style={showSaved ? {
                background: 'rgba(13,148,136,0.15)',
                borderColor: 'rgba(13,148,136,0.4)',
                color: '#6bd8cb'
              } : {
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#71717a'
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
              Saved
              {savedCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-black"
                  style={{ background: '#0d9488' }}>
                  {savedCount}
                </span>
              )}
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/') }}
              className="px-4 py-2 rounded-xl text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all"
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full relative z-10">

        {!showSaved ? (
          <>
            {/* Header */}
            <div ref={headerRef} className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: '#0d9488', opacity: 0 }}>
                HR Portal
              </p>
              <h2 className="text-5xl font-black text-white tracking-tight mb-2" style={{ opacity: 0 }}>
                Talent Discovery
              </h2>
              <p className="text-zinc-500" style={{ opacity: 0 }}>
                Pre-screened candidates ranked by AI interview performance
              </p>
            </div>

            {/* Filter Pills */}
            <div ref={filterRef} className="flex gap-2 flex-wrap mb-8">
              {subjects.map(s => (
                <button key={s}
                  onClick={() => handleFilterChange(s)}
                  className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all"
                  style={filter === s ? {
                    background: 'rgba(13,148,136,0.15)',
                    borderColor: 'rgba(13,148,136,0.5)',
                    color: '#6bd8cb'
                  } : {
                    background: 'rgba(15,15,15,0.8)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#71717a'
                  }}
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
                  {s === 'all' ? 'All Candidates' : s}
                </button>
              ))}
            </div>

            {/* Candidates */}
            <div className="candidates-list flex flex-col gap-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 text-sm">Loading candidates...</p>
                  </div>
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="text-zinc-500">No candidates found for this subject yet.</p>
                </div>
              ) : (
                candidates.map((c, i) => (
                  <div key={c._id}
                    ref={el => candidateRefs.current[i] = el}
                    className="rounded-2xl p-6 relative overflow-hidden group"
                    style={{
                      background: 'rgba(15,15,15,0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      opacity: 0
                    }}>

                    {/* Top line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.5), transparent)' }} />

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0"
                          style={{
                            background: `${avatarColors[i % avatarColors.length]}20`,
                            border: `1px solid ${avatarColors[i % avatarColors.length]}30`,
                            color: avatarColors[i % avatarColors.length]
                          }}>
                          {getInitials(c.name)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-black text-white text-lg">{c.name}</p>
                            {c.avgScore >= 75 && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                                style={{
                                  background: 'rgba(245,158,11,0.15)',
                                  color: '#fbbf24',
                                  border: '1px solid rgba(245,158,11,0.3)'
                                }}>
                                Top Performer
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {c.skills.map(skill => (
                              <span key={skill}
                                className="text-xs px-2 py-0.5 rounded-full uppercase font-bold"
                                style={{
                                  background: 'rgba(255,255,255,0.04)',
                                  color: '#52525b',
                                  border: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                {skill}
                              </span>
                            ))}
                            {c.location && (
                              <span className="text-xs text-zinc-600">{c.location}</span>
                            )}
                            <span className="text-xs text-zinc-700">{c.totalSessions} sessions</span>
                          </div>

                          {c.openToWork && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              <span className="text-xs text-green-400 font-bold">Open to work</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-4xl font-black" style={{ color: getScoreColor(c.avgScore) }}>
                          {c.avgScore}
                        </p>
                        <p className="text-zinc-700 text-xs">avg score</p>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mt-4 mb-4">
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div className="h-1 rounded-full"
                          style={{
                            width: `${c.avgScore}%`,
                            background: `linear-gradient(90deg, #0d9488, ${getScoreColor(c.avgScore)})`
                          }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <button
                        onClick={() => toggleSave(c._id)}
                        className="px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2"
                        style={savedIds.includes(c._id) ? {
                          background: 'rgba(13,148,136,0.15)',
                          borderColor: 'rgba(13,148,136,0.4)',
                          color: '#6bd8cb'
                        } : {
                          borderColor: 'rgba(255,255,255,0.08)',
                          color: '#71717a'
                        }}
                        onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 })}
                        onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
                        <span className="material-symbols-outlined text-sm"
                          style={{ fontFamily: 'Material Symbols Outlined' }}>
                          {savedIds.includes(c._id) ? 'bookmark_added' : 'bookmark'}
                        </span>
                        {savedIds.includes(c._id) ? 'Saved' : 'Save'}
                      </button>

                      <button
                        id={`invite-${c._id}`}
                        onClick={() => sendInvite(c._id)}
                        disabled={inviteSent[c._id] || inviteLoading[c._id]}
                        className="flex-1 py-2 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2"
                        style={inviteSent[c._id] ? {
                          borderColor: 'rgba(74,222,128,0.4)',
                          color: '#4ade80',
                          background: 'rgba(74,222,128,0.08)'
                        } : inviteLoading[c._id] ? {
                          borderColor: 'rgba(255,255,255,0.06)',
                          color: '#52525b',
                          cursor: 'not-allowed'
                        } : {
                          borderColor: 'rgba(255,255,255,0.08)',
                          color: '#ffffff'
                        }}
                        onMouseEnter={e => !inviteSent[c._id] && !inviteLoading[c._id] && gsap.to(e.currentTarget, { scale: 1.02, borderColor: 'rgba(13,148,136,0.4)', duration: 0.2 })}
                        onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, borderColor: 'rgba(255,255,255,0.08)', duration: 0.2 })}>
                        {inviteLoading[c._id] ? (
                          <>
                            <div className="w-3 h-3 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : inviteSent[c._id] ? (
                          <>
                            <span className="material-symbols-outlined text-sm"
                              style={{ fontFamily: 'Material Symbols Outlined' }}>check_circle</span>
                            Invite Sent!
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm"
                              style={{ fontFamily: 'Material Symbols Outlined' }}>mail</span>
                            Send Interview Invite
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: '#0d9488' }}>HR Portal</p>
              <h2 className="text-5xl font-black text-white tracking-tight mb-2">Saved Candidates</h2>
              <p className="text-zinc-500">Candidates you have bookmarked for later</p>
            </div>
            {savedIds.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🔖</p>
                <p className="text-zinc-500 mb-6">No saved candidates yet.</p>
                <button onClick={() => setShowSaved(false)}
                  className="px-6 py-3 rounded-2xl text-white font-black transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
                  Discover Talent
                </button>
              </div>
            ) : (
              <p className="text-zinc-500">Your saved candidates appear here.</p>
            )}
          </>
        )}
      </main>

      <footer className="w-full py-6 border-t border-white/5 relative z-10" style={{ background: '#050505' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xs font-black text-white uppercase tracking-tighter">
            Interview<span style={{ color: '#0d9488' }}>Pro</span>
          </div>
          <div className="text-xs text-zinc-700 uppercase tracking-widest">2026 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}