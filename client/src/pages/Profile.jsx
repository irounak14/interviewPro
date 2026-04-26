import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Profile() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const [form, setForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    openToWork: user?.openToWork ?? true,
  })

  useEffect(() => {
    axios.get('https://interviewpro-api.onrender.com/api/interview/my-sessions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSessions(res.data)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await axios.put('https://interviewpro-api.onrender.com/api/auth/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }))
      setSuccessMsg('Profile updated successfully!')
      setEditing(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const totalAvg = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + s.avgScore, 0) / sessions.length)
    : 0

  const bestScore = sessions.length
    ? Math.max(...sessions.map(s => s.avgScore))
    : 0

  const uniqueSubjects = [...new Set(sessions.map(s => s.subject))]

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.05)' }} />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div onClick={() => navigate('/candidate/subjects')}
            className="text-xl font-bold tracking-tighter text-white uppercase cursor-pointer">
            InterviewPro
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/candidate/subjects')}
              className="px-4 py-2 rounded-lg text-sm border border-white/10 text-zinc-400 hover:text-white transition-all">
              Practice
            </button>
            <button onClick={() => navigate('/candidate/history')}
              className="px-4 py-2 rounded-lg text-sm border border-white/10 text-zinc-400 hover:text-white transition-all">
              My Results
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/') }}
              className="px-4 py-2 rounded-lg text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full relative z-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-violet-400 mb-2">Account</p>
          <h2 className="text-4xl font-bold text-white mb-2">My Profile</h2>
          <p className="text-zinc-400">Manage your profile and view your performance</p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm text-green-400"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            {successMsg}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-xl p-8 mb-6"
          style={{
            background: 'rgba(26,26,26,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                {getInitials(user?.name)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
                <p className="text-zinc-400 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                    Candidate
                  </span>
                  {form.openToWork && (
                    <span className="flex items-center gap-1 text-xs text-green-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Open to work
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center gap-2"
              style={editing ? {
                background: 'rgba(124,58,237,0.15)',
                borderColor: 'rgba(124,58,237,0.4)',
                color: '#a78bfa'
              } : {
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#71717a'
              }}>
              <span className="material-symbols-outlined text-sm"
                style={{ fontFamily: 'Material Symbols Outlined' }}>
                {editing ? 'close' : 'edit'}
              </span>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {editing ? (
            <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Full Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none"
                    style={{ background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">City</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Delhi"
                    className="rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none"
                    style={{ background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              {/* Open to Work Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <p className="text-white font-semibold text-sm">Open to Work</p>
                  <p className="text-zinc-500 text-xs">Let HR recruiters know you are available</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, openToWork: !form.openToWork })}
                  className="w-12 h-6 rounded-full transition-all relative"
                  style={{ background: form.openToWork ? '#7c3aed' : 'rgba(255,255,255,0.1)' }}>
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all"
                    style={{ left: form.openToWork ? '26px' : '2px' }} />
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="py-3 rounded-lg text-white font-semibold transition-all active:scale-95"
                style={{ background: '#7c3aed', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Location</p>
                <p className="text-white">{user?.location || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Subjects Practiced</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueSubjects.length > 0 ? uniqueSubjects.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full uppercase"
                      style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                      {s}
                    </span>
                  )) : <p className="text-zinc-600 text-sm">None yet</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Sessions', value: sessions.length, color: '#7c3aed', icon: 'history' },
            { label: 'Overall Average', value: `${totalAvg}`, color: getScoreColor(totalAvg), icon: 'analytics' },
            { label: 'Best Score', value: `${bestScore}`, color: '#4ade80', icon: 'emoji_events' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-6"
              style={{
                background: 'rgba(26,26,26,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-sm"
                  style={{ fontFamily: 'Material Symbols Outlined', color: stat.color }}>
                  {stat.icon}
                </span>
                <p className="text-xs uppercase tracking-wider text-zinc-500">{stat.label}</p>
              </div>
              <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="rounded-xl p-6"
          style={{
            background: 'rgba(26,26,26,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
          <h3 className="text-lg font-bold text-white mb-6">Recent Sessions</h3>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-zinc-500 mb-4">No sessions yet</p>
              <button onClick={() => navigate('/candidate/subjects')}
                className="px-6 py-3 rounded-xl text-white font-semibold"
                style={{ background: '#7c3aed' }}>
                Start Practicing
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.slice(0, 5).map(s => (
                <div key={s._id}
                  onClick={() => navigate(`/candidate/results/${s._id}`)}
                  className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:border-white/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-white font-semibold capitalize">{s.subject}</p>
                    <p className="text-zinc-500 text-xs">
                      {s.answers.length} questions · {new Date(s.completedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold" style={{ color: getScoreColor(s.avgScore) }}>
                      {s.avgScore}
                    </p>
                    <span className="material-symbols-outlined text-zinc-600 text-sm"
                      style={{ fontFamily: 'Material Symbols Outlined' }}>
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}
              {sessions.length > 5 && (
                <button onClick={() => navigate('/candidate/history')}
                  className="text-center text-violet-400 text-sm py-2 hover:text-violet-300 transition-colors">
                  View all {sessions.length} sessions
                </button>
              )}
            </div>
          )}
        </div>

      </main>

      <footer className="w-full py-6 border-t border-white/5 relative z-10" style={{ background: '#09090b' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xs font-bold text-white uppercase tracking-tighter">InterviewPro</div>
          <div className="text-xs text-zinc-600">2024 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}