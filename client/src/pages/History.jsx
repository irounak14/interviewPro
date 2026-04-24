import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function History() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get('http://localhost:5000/api/interview/my-sessions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSessions(res.data)
      setLoading(false)
    })
  }, [])

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Navbar */}
      <div className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/candidate/subjects')}>
          <span className="text-white">Interview</span>
          <span className="text-purple-500">Pro</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/candidate/subjects')}
            className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-purple-500 transition-all"
          >
            Practice
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="px-4 py-2 border border-red-800 text-red-400 rounded-lg text-sm"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">My Results</h2>
            <p className="text-gray-400 text-sm">All your past interview sessions</p>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-6 py-3 text-center">
            <p className="text-purple-400 text-2xl font-bold">{sessions.length}</p>
            <p className="text-gray-500 text-xs">Total Sessions</p>
          </div>
        </div>

        {loading && (
          <p className="text-gray-400 text-center py-10">Loading...</p>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-gray-400 mb-4">No sessions yet. Start practicing!</p>
            <button
              onClick={() => navigate('/candidate/subjects')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
            >
              Start Interview
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/candidate/results/${s._id}`)}
              className="cursor-pointer bg-[#1a1a1a] border border-gray-700 hover:border-purple-500 rounded-xl p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold capitalize text-lg">{s.subject}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {s.answers.length} questions · {new Date(s.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getScoreColor(s.avgScore)}`}>
                    {s.avgScore}
                  </p>
                  <p className="text-gray-500 text-xs">avg score</p>
                </div>
              </div>

              {/* Mini bar */}
              <div className="mt-4 bg-gray-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${s.avgScore >= 70 ? 'bg-green-500' : s.avgScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${s.avgScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}