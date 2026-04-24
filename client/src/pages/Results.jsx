import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get(`http://localhost:5000/api/interview/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSession(res.data)
      setLoading(false)
    }).catch(() => navigate('/candidate/subjects'))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <p className="text-gray-400">Loading results...</p>
    </div>
  )

  const { answers, avgScore, subject } = session

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBorder = (score) => {
    if (score >= 70) return 'border-green-700 bg-green-900/10'
    if (score >= 40) return 'border-yellow-700 bg-yellow-900/10'
    return 'border-red-700 bg-red-900/10'
  }

  const getGrade = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-green-400' }
    if (score >= 70) return { label: 'Good', color: 'text-green-400' }
    if (score >= 50) return { label: 'Average', color: 'text-yellow-400' }
    return { label: 'Needs Work', color: 'text-red-400' }
  }

  const grade = getGrade(avgScore)

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Navbar */}
      <div className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Interview</span>
          <span className="text-purple-500">Pro</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/candidate/subjects')}
            className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-purple-500 transition-all"
          >
            Practice Again
          </button>
          <button
            onClick={() => navigate('/candidate/history')}
            className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-purple-500 transition-all"
          >
            My Results
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Score Card */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-8 mb-8 text-center">
          <p className="text-gray-400 text-sm capitalize mb-1">{subject} Interview</p>
          <h2 className="text-2xl font-bold mb-6">Interview Complete!</h2>

          <div className={`text-7xl font-bold mb-2 ${getScoreColor(avgScore)}`}>
            {avgScore}
          </div>
          <p className="text-gray-500 text-sm mb-2">Average Score / 100</p>
          <span className={`text-lg font-semibold ${grade.color}`}>{grade.label}</span>

          {/* Stats Row */}
          <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-gray-700">
            <div>
              <p className="text-2xl font-bold text-purple-400">{answers.length}</p>
              <p className="text-gray-500 text-sm">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {answers.filter(a => a.score >= 70).length}
              </p>
              <p className="text-gray-500 text-sm">Good Answers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {answers.filter(a => a.score < 40).length}
              </p>
              <p className="text-gray-500 text-sm">Need Improvement</p>
            </div>
          </div>
        </div>

        {/* Per Question Breakdown */}
        <h3 className="text-lg font-semibold mb-4">Question Breakdown</h3>
        <div className="flex flex-col gap-4">
          {answers.map((a, i) => (
            <div
              key={i}
              className={`border rounded-xl p-6 ${getScoreBorder(a.score)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Question {i + 1}</p>
                  <p className="text-white font-medium">{a.question}</p>
                </div>
                <span className={`text-2xl font-bold ml-4 ${getScoreColor(a.score)}`}>
                  {a.score}
                </span>
              </div>

              {a.answer && (
                <div className="bg-black/20 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1">Your Answer</p>
                  <p className="text-gray-300 text-sm">{a.answer}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-1">AI Feedback</p>
                <p className="text-gray-300 text-sm">{a.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/candidate/interview/${subject}`)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-all"
          >
            Retry Same Subject
          </button>
          <button
            onClick={() => navigate('/candidate/subjects')}
            className="flex-1 border border-gray-700 hover:border-purple-500 py-3 rounded-lg font-semibold transition-all"
          >
            Choose New Subject
          </button>
        </div>

      </div>
    </div>
  )
}