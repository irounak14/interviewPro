import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const user = params.get('user')

    if (token && user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', user)
      const parsedUser = JSON.parse(user)
      if (parsedUser.role === 'hr') {
        navigate('/hr/portal')
      } else {
        navigate('/candidate/subjects')
      }
    } else {
      navigate('/')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}