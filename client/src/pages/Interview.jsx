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
  const [phase, setPhase] = useState('question') // question | listening | evaluated | done
  const [timeLeft, setTimeLeft] = useState(90)

  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const token = localStorage.getItem('token')

  // Fetch questions
  useEffect(() => {
    axios.get(`http://localhost:5000/api/interview/questions/${subject}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setQuestions(res.data))
      .catch(() => navigate('/candidate/subjects'))
  }, [])

  // Timer
  useEffect(() => {
    if (isListening) {
      setTimeLeft(90)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopListening()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isListening])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Use Chrome.')
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
      const res = await axios.post('http://localhost:5000/api/interview/evaluate', {
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
      // Save session
      try {
        const res = await axios.post('http://localhost:5000/api/interview/session', {
          subject, answers
        }, { headers: { Authorization: `Bearer ${token}` } })
        navigate(`/candidate/results/${res.data.sessionId}`)
      } catch (err) {
        console.error(err)
      }
    } else {
      setCurrent(prev => prev + 1)
      setPhase('question')
      setTranscript('')
      setFeedback(null)
      setScore(null)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-gray-400">Loading questions...</p>
      </div>
    )
  }

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Navbar */}
      <div className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Interview</span>
          <span className="text-purple-500">Pro</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm capitalize">{subject}</span>
          <span className="text-gray-400 text-sm">
            Q {current + 1} / {questions.length}
          </span>
          <button
            onClick={() => navigate('/candidate/subjects')}
            className="px-4 py-2 border border-red-800 text-red-400 rounded-lg text-sm"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-1">
        <div
          className="bg-purple-500 h-1 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Question */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-purple-900/40 text-purple-400 px-3 py-1 rounded-full capitalize">
              {q.difficulty}
            </span>
            <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full capitalize">
              {subject}
            </span>
          </div>
          <p className="text-xl font-semibold leading-relaxed">{q.question}</p>
        </div>

        {/* Timer */}
        {isListening && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-sm">Recording...</span>
            </div>
            <span className={`text-sm font-mono ${timeLeft < 20 ? 'text-red-400' : 'text-gray-400'}`}>
              {timeLeft}s remaining
            </span>
          </div>
        )}

        {/* Transcript */}
        {(isListening || phase === 'evaluated') && (
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 mb-6 min-h-24">
            <p className="text-xs text-gray-500 mb-2">Your Answer</p>
            <p className="text-gray-300 leading-relaxed">
              {transcript || <span className="text-gray-600 italic">Start speaking...</span>}
            </p>
          </div>
        )}

        {/* Evaluating */}
        {isEvaluating && (
          <div className="flex items-center gap-3 text-purple-400 mb-6">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Claude is evaluating your answer...</span>
          </div>
        )}

        {/* Feedback Card */}
        {feedback && !isEvaluating && (
          <div className={`border rounded-xl p-6 mb-6 ${
            score >= 70 ? 'border-green-700 bg-green-900/10'
            : score >= 40 ? 'border-yellow-700 bg-yellow-900/10'
            : 'border-red-700 bg-red-900/10'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-lg">Score</p>
              <span className={`text-3xl font-bold ${
                score >= 70 ? 'text-green-400'
                : score >= 40 ? 'text-yellow-400'
                : 'text-red-400'
              }`}>{score}/100</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          {phase === 'question' && (
            <button
              onClick={startListening}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              🎙️ Start Answering
            </button>
          )}

          {phase === 'listening' && (
            <button
              onClick={stopListening}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ⏹ Stop & Evaluate
            </button>
          )}

          {phase === 'evaluated' && !isEvaluating && (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {current + 1 >= questions.length ? '🏁 Finish Interview' : 'Next Question →'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}