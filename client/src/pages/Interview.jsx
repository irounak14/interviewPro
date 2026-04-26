import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Interview() {
  const { subject } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [phase, setPhase] = useState('question')
  const [timeLeft, setTimeLeft] = useState(90)

  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`https://interviewpro-api.onrender.com/api/interview/questions/${subject}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setQuestions(res.data))
      .catch(() => navigate('/candidate/subjects'))
  }, [])

  useEffect(() => {
    if (isListening) {
      setTimeLeft(90)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { stopListening(); return 0 }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isListening])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Use Chrome for speech recognition.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }
    recognition.onerror = (e) => console.error('Speech error:', e)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setPhase('listening')
    setTranscript('')
    setFeedback(null)
    setScore(null)
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    clearInterval(timerRef.current)
    setIsListening(false)
    evaluateAnswer()
  }

  const evaluateAnswer = async () => {
    setIsEvaluating(true)
    setPhase('evaluated')
    const q = questions[current]
    try {
      const res = await axios.post('https://interviewpro-api.onrender.com/api/interview/evaluate', {
        question: q.question,
        answer: transcript || '',
        subject,
        keywords: q.expectedKeywords
      }, { headers: { Authorization: `Bearer ${token}` } })
      setScore(res.data.score)
      setFeedback(res.data.feedback)
      setAnswers(prev => [...prev, {
        question: q.question,
        answer: transcript || '',
        score: res.data.score,
        feedback: res.data.feedback,
        subject
      }])
    } catch (err) {
      setScore(0)
      setFeedback('Evaluation failed. Please try again.')
    }
    setIsEvaluating(false)
  }

  const nextQuestion = async () => {
    if (current + 1 >= questions.length) {
      try {
        const res = await axios.post('https://interviewpro-api.onrender.com/api/interview/session', {
          subject, answers
        }, { headers: { Authorization: `Bearer ${token}` } })
        navigate(`/candidate/results/${res.data.sessionId}`)
      } catch (err) { console.error(err) }
    } else {
      setCurrent(prev => prev + 1)
      setPhase('question')
      setTranscript('')
      setFeedback(null)
      setScore(null)
    }
  }

  if (questions.length === 0) return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Loading questions...</p>
      </div>
    </div>
  )

  const q = questions[current]
  const progress = (current / questions.length) * 100
  const getScoreColor = (s) => s >= 70 ? '#4ade80' : s >= 40 ? '#facc15' : '#f87171'
  const timerPercent = (timeLeft / 90) * 100
  const timerColor = timeLeft > 30 ? '#7c3aed' : timeLeft > 10 ? '#f59e0b' : '#ef4444'

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.05)' }} />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-xl font-bold tracking-tighter text-white uppercase">
            InterviewPro
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-zinc-400 text-xs uppercase tracking-wider capitalize">{subject}</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-zinc-400 text-xs">Q {current + 1} / {questions.length}</span>
            </div>
            <button
              onClick={() => navigate('/candidate/subjects')}
              className="px-4 py-2 rounded-lg text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all">
              Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/5 h-0.5">
          <div className="h-0.5 transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa)'
            }} />
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto px-6 py-12 w-full relative z-10">

        {/* Question Card */}
        <div className="rounded-xl p-8 mb-6"
          style={{
            background: 'rgba(26,26,26,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider"
              style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              {q.difficulty}
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider capitalize"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#71717a' }}>
              {subject}
            </span>
          </div>
          <p className="text-2xl font-bold text-white leading-relaxed">{q.question}</p>
        </div>

        {/* Timer — only when listening */}
        {isListening && (
          <div className="rounded-xl p-5 mb-6 flex items-center justify-between"
            style={{
              background: 'rgba(26,26,26,0.6)',
              border: `1px solid ${timerColor}40`
            }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: timerColor }} />
              <span className="text-sm font-semibold" style={{ color: timerColor }}>
                Recording...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-white/10 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: `${timerPercent}%`, background: timerColor }} />
              </div>
              <span className="text-sm font-mono font-bold" style={{ color: timerColor }}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}

        {/* Transcript */}
        {(isListening || phase === 'evaluated') && (
          <div className="rounded-xl p-6 mb-6"
            style={{
              background: 'rgba(26,26,26,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm text-zinc-500"
                style={{ fontFamily: 'Material Symbols Outlined' }}>
                record_voice_over
              </span>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Your Answer</p>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              {transcript || (
                <span className="text-zinc-600 italic">Start speaking — your words will appear here...</span>
              )}
            </p>
          </div>
        )}

        {/* Evaluating spinner */}
        {isEvaluating && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-violet-300 text-sm">AI is evaluating your answer...</span>
          </div>
        )}

        {/* Feedback Card */}
        {feedback && !isEvaluating && (
          <div className="rounded-xl p-6 mb-6"
            style={{
              background: `${getScoreColor(score)}08`,
              border: `1px solid ${getScoreColor(score)}30`,
              backdropFilter: 'blur(20px)'
            }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">AI Score</p>
                <p className="text-5xl font-bold" style={{ color: getScoreColor(score) }}>
                  {score}
                  <span className="text-xl text-zinc-600">/100</span>
                </p>
              </div>
              <div className="w-20 h-20 relative flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none"
                    stroke={getScoreColor(score)}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - score / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <span className="absolute text-xs font-bold" style={{ color: getScoreColor(score) }}>
                  {score >= 70 ? '👍' : score >= 40 ? '👌' : '💪'}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Feedback</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{feedback}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {phase === 'question' && (
            <button onClick={startListening}
              className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95"
              style={{ background: '#7c3aed', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
              <span className="material-symbols-outlined"
                style={{ fontFamily: 'Material Symbols Outlined' }}>mic</span>
              Start Answering
            </button>
          )}

          {phase === 'listening' && (
            <button onClick={stopListening}
              className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95"
              style={{ background: '#ef4444', boxShadow: '0 4px 20px rgba(239,68,68,0.3)' }}>
              <span className="material-symbols-outlined"
                style={{ fontFamily: 'Material Symbols Outlined' }}>stop</span>
              Stop & Evaluate
            </button>
          )}

          {phase === 'evaluated' && !isEvaluating && (
            <>
              <button onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95"
                style={{ background: '#7c3aed', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
                <span className="material-symbols-outlined"
                  style={{ fontFamily: 'Material Symbols Outlined' }}>
                  {current + 1 >= questions.length ? 'flag' : 'arrow_forward'}
                </span>
                {current + 1 >= questions.length ? 'Finish Interview' : 'Next Question'}
              </button>
              <button onClick={() => {
                setPhase('question')
                setTranscript('')
                setFeedback(null)
                setScore(null)
              }}
                className="px-4 py-4 rounded-xl text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all text-sm">
                Redo Answer
              </button>
            </>
          )}
        </div>

      </main>
    </div>
  )
}